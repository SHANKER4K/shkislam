import { db } from "@/src/db";
import { surahs, ayahs } from "@/src/db/schema";
import { eq, asc, sql, desc } from "drizzle-orm";
import { searchQuranAyahs as engineSearch } from "@/src/lib/quran-search-engine";

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
      surahId: surahs.id,
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
  return engineSearch(query);
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

export async function getAdjacentAyahs(surahId: number, currentNumber: number) {
  const [prev] = await db
    .select({ numberInSurah: ayahs.numberInSurah })
    .from(ayahs)
    .where(
      sql`${ayahs.surahId} = ${surahId} AND ${ayahs.numberInSurah} < ${currentNumber}`,
    )
    .orderBy(desc(ayahs.numberInSurah))
    .limit(1);

  const [next] = await db
    .select({ numberInSurah: ayahs.numberInSurah })
    .from(ayahs)
    .where(
      sql`${ayahs.surahId} = ${surahId} AND ${ayahs.numberInSurah} > ${currentNumber}`,
    )
    .orderBy(asc(ayahs.numberInSurah))
    .limit(1);

  return {
    prev: prev?.numberInSurah ?? null,
    next: next?.numberInSurah ?? null,
  };
}
