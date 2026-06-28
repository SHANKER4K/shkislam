/**
 * Migration: Align BERT sanad/matn split to original tashkeel-preserving text.
 *
 * Unlike the old JS heuristic (regex on first 50 words), this uses the BERT
 * model's sanad/matn boundary but maps it back to the original text to preserve
 * tashkeel (diacritics).
 *
 * Run: bun run src/db/migrate-tashkeel-sanad.ts
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const BATCH = 500;
const TASHKEEL_RE = /[\u064B-\u0652\u0670]/g;
const CLEAN_RE = /[\u0640\u064B-\u0652\u0670]/g; // tashkeel + tatweel

/**
 * Strip only diacritics (keep tatweel, commas, spaces — everything else).
 */
function stripDiacritics(s: string): string {
  return s.replace(TASHKEEL_RE, "");
}

/**
 * Map BERT sanad boundary back to original (tashkeel-preserving) text.
 *
 * Strategy: strip tashkeel from original, then find the BERT sanad as a
 * substring. Use the position to extract sanad/matn from the original.
 *
 * Since BERT normalizes spacing around commas (` ، ` vs `، `), we handle
 * that via a fuzzy match: strip diacritics, find sanad in that, then map
 * the split position back through the original.
 */
function alignSplit(
  original: string | null,
  bertSanad: string | null,
  bertMatn: string | null,
): { sanad: string; matn: string } | null {
  if (!original || !bertSanad) return null;

  // Strip tashkeel from original for comparison. Keep tatweel, commas, etc.
  const stripped = stripDiacritics(original);
  const sanadClean = stripDiacritics(bertSanad);

  if (sanadClean.length > stripped.length) return null;

  // Find sanad in stripped text — but BERT normalizes comma spacing
  // (`حدثنا عبدان ، أخبرنا` vs `حدثنا عبدان، أخبرنا`).
  // Try direct match first, then fuzzy.
  let idx = stripped.indexOf(sanadClean);

  if (idx < 0) {
    // Try with normalized comma spacing: ` ، ` → `، `
    const normSanad = sanadClean.replace(/ , /g, "، ");
    idx = stripped.indexOf(normSanad);
  }

  if (idx < 0) {
    // Try stripping all punctuation
    const strippedPunct = stripped.replace(/[،,.;:!?\-–—()""''/]/g, "");
    const sanadPunct = sanadClean.replace(/[،,.;:!?\-–—()""''/]/g, "");
    // But we also need to handle the space that BERT adds around commas
    // `عبدان ، أخبرنا` → removing punctuation → `عبدان  أخبرنا` (double space)
    // `عبدان، أخبرنا` → removing punctuation → `عبدان أخبرنا` (single space)
    // Collapse spaces for comparison
    const strippedNorm = strippedPunct.replace(/\s+/g, " ");
    const sanadNorm = sanadPunct.replace(/\s+/g, " ");
    idx = strippedNorm.indexOf(sanadNorm);

    if (idx >= 0) {
      // We found it in the "heavy normalized" version. Now map this
      // position back to the stripped (tashkeel-only-stripped) version.
      // Count chars in strippedNorm to find the equivalent position in `stripped`
      // ponytail: this is a best-effort mapping. The sanad can be found in the
      // heavy-normalized string; we then need to find the corresponding split
      // position in the actual (only-diacritics-stripped) text. We do this by
      // walking `stripped` character by character, tracking how many characters
      // would appear in `strippedNorm` (i.e., non-punctuation chars).
      const endNorm = idx + sanadNorm.length;
      let strippedCount = 0;
      let strippedPos = 0;
      for (let i = 0; i < stripped.length && strippedCount < endNorm; i++) {
        if (!/[،,.;:!?\-–—()""''/]/.test(stripped[i])) {
          strippedCount++;
        }
        strippedPos = i + 1;
      }

      // Now map `strippedPos` back to `original` (with diacritics)
      return mapToOriginal(original, strippedPos);
    }
  }

  if (idx < 0) {
    return null; // give up
  }

  // Found in stripped (maybe with comma normalization). Map position back.
  const endIdx = idx + sanadClean.length;
  return mapToOriginal(original, endIdx);
}

/**
 * Map a position in the diacritics-stripped text back to the original text.
 */
function mapToOriginal(original: string, strippedPos: number): { sanad: string; matn: string } {
  let count = 0;
  let splitPos = original.length;
  for (let i = 0; i < original.length; i++) {
    if (count >= strippedPos) {
      splitPos = i;
      break;
    }
    if (!TASHKEEL_RE.test(original[i])) {
      count++;
    }
  }
  return { sanad: original.substring(0, splitPos), matn: original.substring(splitPos) };
}

async function main() {
  const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM hadiths_with_sanad_matn`);
  const total = parseInt((countResult.rows?.[0] as any)?.count ?? "0", 10);
  console.log(`Total hadiths: ${total}`);

  const pgClient = await pool.connect();

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (let offset = 0; offset < total; offset += BATCH) {
    const result = await db.execute(sql`
      SELECT h.id, h.text, sm.sanad, sm.matn
      FROM hadiths h
      INNER JOIN hadiths_with_sanad_matn sm ON h.id = sm.id
      ORDER BY h.id
      LIMIT ${BATCH} OFFSET ${offset}
    `);
    const rows = result.rows as { id: number; text: string; sanad: string; matn: string | null }[];

    const updates: string[] = [];
    for (const row of rows) {
      if (/[\u064B-\u0652]/.test(row.sanad)) { skipped++; continue; }
      const split = alignSplit(row.text, row.sanad, row.matn);
      if (!split) { failed++; continue; }
      const escSanad = split.sanad.replace(/'/g, "''");
      const escMatn = split.matn.replace(/'/g, "''");
      updates.push(
        `UPDATE hadiths_with_sanad_matn SET sanad = '${escSanad}', matn = '${escMatn}' WHERE id = ${row.id};`,
      );
      updated++;
    }

    if (updates.length > 0) {
      await pgClient.query(updates.join("\n"));
    }

    console.log(
      `  ${Math.min(offset + BATCH, total)}/${total} (${updated} updated, ${failed} failed, ${skipped} skipped)`,
    );
  }

  pgClient.release();
  console.log(`\nDone: ${updated} updated, ${failed} failed, ${skipped} skipped out of ${total}`);
  await pool.end();
}

main().catch((e) => {
  console.error("Migration failed:", e);
  pool.end().catch(() => {});
  process.exit(1);
});
