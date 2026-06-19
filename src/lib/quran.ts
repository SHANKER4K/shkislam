import { db } from "@/src/db";
import { surahs, ayahs } from "@/src/db/schema";
import { eq, asc, sql, desc } from "drizzle-orm";
import { ArabicServices } from "arabic-services";

export async function getAllSurahs() {
  return db.select().from(surahs).orderBy(asc(surahs.number));
}

export async function getSurahByNumber(number: number) {
  return db.select().from(surahs).where(eq(surahs.number, number)).limit(1);
}

export async function getAyahsBySurahNumber(surahNumber: number) {
  return db
    .selectDistinctOn([ayahs.numberInSurah], {
      id: ayahs.id,
      numberInSurah: ayahs.numberInSurah,
      textUthmani: ayahs.textUthmani,
      tafsirText: ayahs.tafsirText,
      surahNameAr: surahs.nameAr,
      surahNumber: surahs.number,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(eq(surahs.number, surahNumber))
    .orderBy(asc(ayahs.numberInSurah));
}

export async function getAyahBySurahAndVerse(surahNumber: number, verseNumber: number) {
  return db
    .select({
      id: ayahs.id,
      numberInSurah: ayahs.numberInSurah,
      textUthmani: ayahs.textUthmani,
      textEn: ayahs.textEn,
      tafsirText: ayahs.tafsirText,
      surahNameAr: surahs.nameAr,
      surahNumber: surahs.number,
      nameTranslation: surahs.nameTranslation,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(sql`${surahs.number} = ${surahNumber} AND ${ayahs.numberInSurah} = ${verseNumber}`)
    .limit(1);
}

export async function searchAyahs(query: string) {
  if (!query.trim()) return [];

  const trimmed = query.trim();
  const stripped = ArabicServices.removeTashkeel(trimmed);

  // Tier 1: FTS full query
  const ftsResults = await db
    .select({
      id: ayahs.id,
      textUthmani: ayahs.textUthmani,
      numberInSurah: ayahs.numberInSurah,
      surahNameAr: surahs.nameAr,
      surahNumber: surahs.number,
      rank: sql<number>`ts_rank_cd(${sql.raw("ayahs.search_vector")}, plainto_tsquery('arabic', ${trimmed}))::float`,
      snippet: sql<string>`ts_headline('arabic', ${ayahs.textUthmani}, plainto_tsquery('arabic', ${trimmed}), 'StartSel=<b>, StopSel=</b>, MaxWords=60, MinWords=20')`,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(sql`${sql.raw("ayahs.search_vector")} @@ plainto_tsquery('arabic', ${trimmed})`)
    .orderBy(desc(sql`ts_rank_cd(${sql.raw("ayahs.search_vector")}, plainto_tsquery('arabic', ${trimmed}))`))
    .limit(50);

  if (ftsResults.length > 0) return ftsResults;

  // Tier 2: FTS per-word (try each meaningful word separately, combine)
  // ponytail: single-char Arabic letters (ب, ل, ك, و...) match everything, skip them
  const words = stripped.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length > 0) {
    const seen = new Set<number>();
    const perWordResults: typeof ftsResults = [];
    for (const word of words) {
      const rows = await db
        .select({
          id: ayahs.id,
          textUthmani: ayahs.textUthmani,
          numberInSurah: ayahs.numberInSurah,
          surahNameAr: surahs.nameAr,
          surahNumber: surahs.number,
          rank: sql<number>`ts_rank_cd(${sql.raw("ayahs.search_vector")}, plainto_tsquery('arabic', ${word}))::float`,
          snippet: sql<string>`ts_headline('arabic', ${ayahs.textUthmani}, plainto_tsquery('arabic', ${word}), 'StartSel=<b>, StopSel=</b>, MaxWords=60, MinWords=20')`,
        })
        .from(ayahs)
        .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
        .where(sql`${sql.raw("ayahs.search_vector")} @@ plainto_tsquery('arabic', ${word})`)
        .orderBy(desc(sql`ts_rank_cd(${sql.raw("ayahs.search_vector")}, plainto_tsquery('arabic', ${word}))`))
        .limit(20);
      for (const row of rows) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          perWordResults.push(row);
        }
      }
    }
    if (perWordResults.length > 0) {
      perWordResults.sort((a, b) => b.rank - a.rank);
      return perWordResults.slice(0, 50);
    }
  }

  // Tier 3: Trigram (cleaned query — meaningful words only)
  const cleaned = words.join(" ");
  if (!cleaned) return [];

  const likePattern = `%${cleaned}%`;
  const trigramResults = await db
    .select({
      id: ayahs.id,
      textUthmani: ayahs.textUthmani,
      numberInSurah: ayahs.numberInSurah,
      surahNameAr: surahs.nameAr,
      surahNumber: surahs.number,
      rank: sql<number>`similarity(${ayahs.textSimple}, ${cleaned})::float`,
      snippet: sql<string>`NULL`,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(sql`similarity(${ayahs.textSimple}, ${cleaned}) > 0.15`)
    .orderBy(desc(sql`similarity(${ayahs.textSimple}, ${cleaned})`))
    .limit(50);

  if (trigramResults.length > 0) return trigramResults;

  // Tier 4: LIKE fallback
  return db
    .select({
      id: ayahs.id,
      textUthmani: ayahs.textUthmani,
      numberInSurah: ayahs.numberInSurah,
      surahNameAr: surahs.nameAr,
      surahNumber: surahs.number,
      rank: sql<number>`0.1::float`,
      snippet: sql<string>`NULL`,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(sql`${ayahs.textSimple} ILIKE ${likePattern}`)
    .limit(50);
}

export async function getAllAyahsForSitemap() {
  return db
    .select({
      surahNumber: surahs.number,
      numberInSurah: ayahs.numberInSurah,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .orderBy(asc(surahs.number), asc(ayahs.numberInSurah));
}

export type Surah = typeof surahs.$inferSelect;
export type Ayah = typeof ayahs.$inferSelect;
