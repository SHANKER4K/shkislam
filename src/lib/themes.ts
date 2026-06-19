import { db } from "@/src/db";
import { themes, themeAyahs, themeHadiths, ayahs, hadiths, surahs, hadithBooks } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface Theme {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  status: "draft" | "published";
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ThemeWithContent extends Theme {
  ayahs: ThemeAyah[];
  hadiths: ThemeHadith[];
}

export interface ThemeAyah {
  id: number;
  ayahId: number;
  surahNumber: number;
  surahName: string;
  numberInSurah: number;
  textUthmani: string;
  note: string | null;
}

export interface ThemeHadith {
  id: number;
  hadithId: number;
  bookNameAr: string;
  bookSlug: string;
  hadithNumber: number;
  narrator: string | null;
  text: string;
  grade: string;
  note: string | null;
}

export async function getAllThemes(): Promise<Theme[]> {
  return db
    .select()
    .from(themes)
    .where(eq(themes.status, "published"))
    .orderBy(themes.nameAr);
}

export async function getAllThemesForSitemap(): Promise<Theme[]> {
  return getAllThemes();
}

export async function getThemeBySlug(slug: string): Promise<ThemeWithContent | null> {
  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.slug, slug))
    .limit(1);

  if (!theme) return null;

  // Get ayahs for this theme
  const themeAyahResults = await db
    .select({
      id: themeAyahs.id,
      ayahId: themeAyahs.ayahId,
      surahNumber: surahs.number,
      surahName: surahs.nameAr,
      numberInSurah: ayahs.numberInSurah,
      textUthmani: ayahs.textUthmani,
      note: themeAyahs.note,
    })
    .from(themeAyahs)
    .innerJoin(ayahs, eq(themeAyahs.ayahId, ayahs.id))
    .innerJoin(surahs, eq(ayahs.surahId, surahs.id))
    .where(eq(themeAyahs.themeId, theme.id))
    .orderBy(surahs.number, ayahs.numberInSurah);

  // Get hadiths for this theme
  const themeHadithResults = await db
    .select({
      id: themeHadiths.id,
      hadithId: themeHadiths.hadithId,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      hadithNumber: hadiths.number,
      narrator: hadiths.narrator,
      text: hadiths.text,
      grade: hadiths.grade,
      note: themeHadiths.note,
    })
    .from(themeHadiths)
    .innerJoin(hadiths, eq(themeHadiths.hadithId, hadiths.id))
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .where(eq(themeHadiths.themeId, theme.id))
    .orderBy(hadiths.number);

  return {
    ...theme,
    ayahs: themeAyahResults,
    hadiths: themeHadithResults,
  };
}
