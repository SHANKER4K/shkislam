import { db } from "@/db";
import { surahs, ayahs } from "@/db/schema";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getAllSurahs = unstable_cache(
  () => db.select().from(surahs).orderBy(asc(surahs.number)),
  ["quran-surahs"],
  { revalidate: 3600 },
);

export async function getSurahByNumber(number: number) {
  return db.select().from(surahs).where(eq(surahs.number, number)).limit(1);
}

export async function getAyahsBySurahNumber(surahNumber: number) {
  return db
    .select({
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

export async function getAyahBySurahAndVerse(
  surahNumber: number,
  verseNumber: number,
) {
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
    .where(
      and(eq(surahs.number, surahNumber), eq(ayahs.numberInSurah, verseNumber)),
    )
    .limit(1);
}

export async function getAdjacentAyahs(surahId: number, currentNumber: number) {
  const [prev] = await db
    .select({
      numberInSurah: ayahs.numberInSurah,
    })
    .from(ayahs)
    .where(
      and(eq(ayahs.surahId, surahId), lt(ayahs.numberInSurah, currentNumber)),
    )
    .orderBy(desc(ayahs.numberInSurah))
    .limit(1);

  const [next] = await db
    .select({
      numberInSurah: ayahs.numberInSurah,
    })
    .from(ayahs)
    .where(
      and(eq(ayahs.surahId, surahId), gt(ayahs.numberInSurah, currentNumber)),
    )
    .orderBy(asc(ayahs.numberInSurah))
    .limit(1);

  return {
    prev: prev?.numberInSurah ?? null,
    next: next?.numberInSurah ?? null,
  };
}
