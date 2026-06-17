import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql, eq } from "drizzle-orm";
import * as schema from "./schema";

const QURAN_API = "https://api.quran.com/api/v4";
const HADITH_CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const SAHEEH_INTL_ID = 20;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

function stripFootnotes(html: string): string {
  return html.replace(/<sup[^>]*>.*?<\/sup>/g, "").trim();
}

async function backfillAyahs() {
  console.log("📖 Backfilling ayah English translations...");

  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.ayahs)
    .where(sql`${schema.ayahs.textEn} IS NOT NULL`);

  if (existing[0].count >= 6000) {
    console.log("⏭️  Ayahs already have English translations, skipping");
    return;
  }

  const surahs = await db.select().from(schema.surahs).orderBy(schema.surahs.number);
  let totalUpdated = 0;

  for (const surah of surahs) {
    try {
      const data = await fetchJSON<{ translations: any[] }>(
        `${QURAN_API}/quran/translations/${SAHEEH_INTL_ID}?chapter_number=${surah.number}`
      );

      for (let i = 0; i < data.translations.length; i++) {
        const verseNum = i + 1;
        const textEn = stripFootnotes(data.translations[i].text);
        if (textEn) {
          await db
            .update(schema.ayahs)
            .set({ textEn })
            .where(
              sql`${schema.ayahs.surahId} = ${surah.id} AND ${schema.ayahs.numberInSurah} = ${verseNum}`
            );
          totalUpdated++;
        }
      }

      process.stdout.write(`\r  Updated ${totalUpdated} ayahs (surah ${surah.number}/114)...`);
    } catch (e) {
      console.error(`\n  ⚠️ Failed surah ${surah.number}: ${e}`);
    }
  }

  console.log(`\n✅ Backfilled ${totalUpdated} ayah English translations`);
}

async function backfillHadiths() {
  console.log("📚 Backfilling hadith English translations...");

  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.hadiths)
    .where(sql`${schema.hadiths.textEn} IS NOT NULL`);

  if (existing[0].count >= 7000) {
    console.log("⏭️  Hadiths already have English translations, skipping");
    return;
  }

  const books = [
    { slug: "sahih-al-bukhari", engSlug: "eng-bukhari" },
    { slug: "sahih-muslim", engSlug: "eng-muslim" },
  ];

  for (const book of books) {
    const bookRecord = await db
      .select()
      .from(schema.hadithBooks)
      .where(eq(schema.hadithBooks.slug, book.slug))
      .limit(1);

    if (bookRecord.length === 0) continue;

    console.log(`  Fetching ${book.engSlug}...`);
    const engData = await fetchJSON<any>(`${HADITH_CDN}/${book.engSlug}.json`);

    const engMap = new Map<number, string>();
    for (const h of engData.hadiths || []) {
      engMap.set(h.hadithnumber, h.text);
    }

    const hadiths = await db
      .select({ id: schema.hadiths.id, number: schema.hadiths.number })
      .from(schema.hadiths)
      .where(eq(schema.hadiths.bookId, bookRecord[0].id));

    let updated = 0;
    const BATCH = 500;

    for (let i = 0; i < hadiths.length; i += BATCH) {
      const batch = hadiths.slice(i, i + BATCH);
      for (const h of batch) {
        const engText = engMap.get(h.number);
        if (engText) {
          await db
            .update(schema.hadiths)
            .set({ textEn: engText })
            .where(eq(schema.hadiths.id, h.id));
          updated++;
        }
      }
      process.stdout.write(`\r  Updated ${updated}/${hadiths.length} hadiths for ${book.slug}...`);
    }

    console.log(`\n✅ Updated ${updated} hadiths for ${book.slug}`);
  }
}

async function main() {
  console.log("🌍 Starting translation backfill...\n");

  try {
    await backfillAyahs();
    await backfillHadiths();
    console.log("\n🎉 Translation backfill complete!");
  } catch (error) {
    console.error("❌ Backfill failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
