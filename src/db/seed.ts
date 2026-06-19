import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { ArabicServices } from "arabic-services";

const QURAN_API = "https://api.quran.com/api/v4";
const HADITH_CDN =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const TAFSIR_ID = 16; // Tafsir Muyassar (Al-Maysar)
const BATCH_SIZE = 50;

const SAHEEH_INTL_ID = 20;
function stripFootnotes(html: string): string {
  return html.replace(/<sup[^>]*>.*?<\/sup>/g, "").trim();
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

async function seedSurahs() {
  console.log("📖 Seeding surahs...");
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.surahs);
  if (existing[0].count >= 114) {
    console.log("⏭️  Surahs already seeded, skipping");
    return;
  }
  const data = await fetchJSON<{ chapters: any[] }>(
    `${QURAN_API}/chapters?language=ar`,
  );

  const values = data.chapters.map((ch) => ({
    number: ch.id,
    nameAr: ch.name_arabic,
    nameTranslation: ch.translated_name?.name || ch.name_simple,
    versesCount: ch.verses_count,
    revelationType:
      ch.revelation_place === "makkah"
        ? ("Meccan" as const)
        : ("Medinan" as const),
  }));

  for (let i = 0; i < values.length; i += 100) {
    await db
      .insert(schema.surahs)
      .values(values.slice(i, i + 100))
      .onConflictDoNothing();
  }

  console.log(`✅ Seeded ${values.length} surahs`);
}

async function seedAyahs() {
  console.log("📖 Seeding ayahs...");
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.ayahs);
  if (existing[0].count >= 6000) {
    console.log("⏭️  Ayahs already seeded, skipping");
    return;
  }
  const surahs = await db
    .select()
    .from(schema.surahs)
    .orderBy(schema.surahs.number);
  let totalInserted = 0;

  for (const surah of surahs) {
    // Fetch English translation once per surah
    let transMap = new Map<number, string>();
    try {
      const transData = await fetchJSON<{ translations: any[] }>(
        `${QURAN_API}/quran/translations/${SAHEEH_INTL_ID}?chapter_number=${surah.number}`,
      );
      for (let i = 0; i < transData.translations.length; i++) {
        const textEn = stripFootnotes(transData.translations[i].text);
        if (textEn) transMap.set(i + 1, textEn);
      }
    } catch (e) {
      process.stdout.write(
        `\r  ⚠️ Translation failed for surah ${surah.number}`,
      );
    }

    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await fetchJSON<{ verses: any[]; pagination: any }>(
        `${QURAN_API}/verses/by_chapter/${surah.number}?language=ar&words=false&per_page=${BATCH_SIZE}&fields=text_uthmani&page=${page}`,
      );

      if (data.verses.length === 0) {
        hasMore = false;
        break;
      }

      const tafsirData = await fetchJSON<{ tafsirs: any[] }>(
        `${QURAN_API}/tafsirs/${TAFSIR_ID}/by_chapter/${surah.number}?language=ar&per_page=${BATCH_SIZE}&page=${page}`,
      );

      const tafsirMap = new Map(
        tafsirData.tafsirs.map((t) => [t.verse_key, t.text]),
      );

      const values = data.verses.map((v) => ({
        surahId: surah.id,
        numberInSurah: v.verse_number,
        textUthmani: v.text_uthmani,
        textSimple: ArabicServices.removeTashkeel(v.text_uthmani),
        textEn: transMap.get(v.verse_number) || null,
        tafsirText: tafsirMap.get(v.verse_key) || null,
        asbabNuzul: null as string | null,
      }));

      await db.insert(schema.ayahs).values(values).onConflictDoNothing();
      totalInserted += values.length;

      hasMore = data.pagination.next_page !== null;
      page++;
    }

    process.stdout.write(
      `\r  Seeded ${totalInserted} ayahs (surah ${surah.number}/114)...`,
    );
  }

  console.log(`\n✅ Seeded ${totalInserted} ayahs`);
}

async function seedHadithBooks() {
  console.log("📚 Seeding hadith books...");

  const books = [
    {
      nameAr: "صحيح البخاري",
      nameEn: "Sahih al-Bukhari",
      slug: "sahih-al-bukhari",
    },
    { nameAr: "صحيح مسلم", nameEn: "Sahih Muslim", slug: "sahih-muslim" },
  ];

  for (const book of books) {
    await db.insert(schema.hadithBooks).values(book).onConflictDoNothing();
  }

  console.log("✅ Seeded hadith books");
}

async function seedHadiths() {
  console.log("📚 Seeding hadiths...");

  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.hadiths);
  if (existing[0].count >= 7000) {
    console.log("⏭️  Hadiths already seeded, skipping");
    return;
  }

  const books = [
    {
      slug: "sahih-al-bukhari",
      araSlug: "ara-bukhari",
      engSlug: "eng-bukhari",
    },
    { slug: "sahih-muslim", araSlug: "ara-muslim", engSlug: "eng-muslim" },
  ];

  for (const book of books) {
    const bookRecord = await db
      .select()
      .from(schema.hadithBooks)
      .where(sql`${schema.hadithBooks.slug} = ${book.slug}`)
      .limit(1);

    if (bookRecord.length === 0) continue;
    const bookId = bookRecord[0].id;

    // Fetch the entire Arabic edition to get section names and hadith data
    console.log(`  Fetching ${book.araSlug}...`);
    const araData = await fetchJSON<any>(`${HADITH_CDN}/${book.araSlug}.json`);

    const sectionNames: Record<string, string> =
      araData.metadata?.sections || {};
    const sectionDetail: Record<string, any> =
      araData.metadata?.section_details || {};

    // Fetch English edition for section names, narrator, and english text
    console.log(`  Fetching ${book.engSlug}...`);
    const engData = await fetchJSON<any>(`${HADITH_CDN}/${book.engSlug}.json`);
    const engSections: Record<string, string> =
      engData.metadata?.sections || {};
    const engMap = new Map<number, string>();
    for (const h of engData.hadiths || []) {
      engMap.set(h.hadithnumber, h.text);
    }

    // Create chapters from sections
    const chapterIds = new Map<number, number>();

    for (const [sectionNum, sectionName] of Object.entries(sectionNames)) {
      if (parseInt(sectionNum) === 0) continue; // Skip table of contents
      const [result] = await db
        .insert(schema.hadithChapters)
        .values({
          bookId,
          nameAr: sectionName,
          nameEn: engSections[sectionNum] || null,
          order: parseInt(sectionNum),
        })
        .onConflictDoNothing()
        .returning({ id: schema.hadithChapters.id });

      if (result) {
        chapterIds.set(parseInt(sectionNum), result.id);
      } else {
        // ponytail: conflict = already exists, fetch id
        const [existing] = await db
          .select({ id: schema.hadithChapters.id })
          .from(schema.hadithChapters)
          .where(
            sql`${schema.hadithChapters.bookId} = ${bookId} AND ${schema.hadithChapters.order} = ${parseInt(sectionNum)}`
          )
          .limit(1);
        if (existing) chapterIds.set(parseInt(sectionNum), existing.id);
      }
    }

    // Determine which section each hadith belongs to
    function getChapterForHadith(hadithNum: number): number | null {
      for (const [sectionNum, detail] of Object.entries(sectionDetail)) {
        const d = detail as any;
        const first = Math.floor(d.hadithnumber_first);
        const last = Math.floor(d.hadithnumber_last);
        if (hadithNum >= first && hadithNum <= last) {
          return parseInt(sectionNum);
        }
      }
      return null;
    }

    // Insert hadiths from the Arabic data
    const hadiths = araData.hadiths || [];
    let totalInserted = 0;
    const BATCH = 500;

    for (let i = 0; i < hadiths.length; i += BATCH) {
      const batch = hadiths.slice(i, i + BATCH);
      const values = [];

      for (const hadith of batch) {
        const sectionNum = getChapterForHadith(hadith.hadithnumber);
        if (!sectionNum) continue;

        const chapterId = chapterIds.get(sectionNum);
        if (!chapterId) continue;

        // Extract narrator and english text
        let narrator = null;
        const engText = engMap.get(hadith.hadithnumber) || "";
        const narrMatch = engText.match(/^Narrated\s+([^:]+):/i);
        if (narrMatch) narrator = narrMatch[1].trim();

        values.push({
          chapterId,
          bookId,
          number: Math.floor(hadith.hadithnumber),
          narrator,
          text: hadith.text,
          textEn: engText || null,
          grade: "Sahih" as const,
          sharh: null as string | null,
        });
      }

      if (values.length > 0) {
        await db.insert(schema.hadiths).values(values).onConflictDoNothing();
        totalInserted += values.length;
      }

      process.stdout.write(
        `\r  Seeded ${totalInserted} hadiths for ${book.slug}...`,
      );
    }

    console.log(`\n✅ Seeded ${totalInserted} hadiths for ${book.slug}`);
  }
}

async function seedFTS() {
  console.log("🔍 Populating full-text search vectors...");

  await db.execute(sql`
    ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS search_vector tsvector;
  `);
  await db.execute(sql`
    ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS search_vector tsvector;
  `);
  // ponytail: rebuild all, not just NULL — re-seed needs fresh vectors
  await db.execute(sql`
    UPDATE ayahs SET search_vector = to_tsvector('arabic', text_simple)
  `);

  // ponytail: hadiths have no text_simple column, strip diacritics in SQL
  await db.execute(sql`
    UPDATE hadiths SET search_vector = to_tsvector('arabic',
      regexp_replace(text, '[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]', '', 'g')
    )
  `);

  console.log("✅ FTS vectors populated");
}

async function main() {
  console.log("🚀 Starting database seed...\n");

  try {
    await seedSurahs();
    await seedAyahs();
    await seedHadithBooks();
    await seedHadiths();
    await seedFTS();

    console.log("\n🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
