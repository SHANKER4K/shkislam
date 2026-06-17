import { db } from "./index";
import { themes, themeAyahs, themeHadiths, ayahs, hadiths, surahs, hadithBooks } from "./schema";
import { eq, and } from "drizzle-orm";
import themesData from "./themes-data.json";

interface ThemeAyah {
  surahNumber: number;
  ayahNumber: number;
}

interface ThemeHadith {
  bookSlug: string;
  hadithNumber: number;
}

interface ThemeData {
  slug: string;
  nameAr: string;
  nameEn: string;
  description: string;
  ayahs: ThemeAyah[];
  hadiths: ThemeHadith[];
}

async function seedThemes() {
  console.log("Starting themes seeding...");

  const allThemesData = themesData as ThemeData[];

  for (const themeData of allThemesData) {
    console.log(`Seeding theme: ${themeData.nameAr} (${themeData.nameEn})`);

    // Check if theme already exists
    const [existingTheme] = await db
      .select()
      .from(themes)
      .where(eq(themes.slug, themeData.slug))
      .limit(1);

    if (existingTheme) {
      console.log(`  Theme already exists, skipping...`);
      continue;
    }

    // Insert theme
    const [theme] = await db
      .insert(themes)
      .values({
        slug: themeData.slug,
        nameAr: themeData.nameAr,
        nameEn: themeData.nameEn,
        description: themeData.description,
        status: "published",
      })
      .returning();

    console.log(`  Inserted theme with id: ${theme.id}`);

    // Insert ayahs
    for (const ayahRef of themeData.ayahs) {
      // Get surah ID
      const [surah] = await db
        .select()
        .from(surahs)
        .where(eq(surahs.number, ayahRef.surahNumber))
        .limit(1);

      if (!surah) {
        console.log(`  Warning: Surah ${ayahRef.surahNumber} not found`);
        continue;
      }

      // Get ayah ID
      const [ayah] = await db
        .select()
        .from(ayahs)
        .where(
          and(eq(ayahs.surahId, surah.id), eq(ayahs.numberInSurah, ayahRef.ayahNumber))
        )
        .limit(1);

      if (!ayah) {
        console.log(
          `  Warning: Ayah ${ayahRef.surahNumber}:${ayahRef.ayahNumber} not found`
        );
        continue;
      }

      // Insert theme-ayah relation
      await db.insert(themeAyahs).values({
        themeId: theme.id,
        ayahId: ayah.id,
        reviewedBy: "admin",
        reviewedAt: new Date(),
      });

      console.log(
        `  Linked ayah ${ayahRef.surahNumber}:${ayahRef.ayahNumber}`
      );
    }

    // Insert hadiths
    for (const hadithRef of themeData.hadiths) {
      // Get book ID
      const [book] = await db
        .select()
        .from(hadithBooks)
        .where(eq(hadithBooks.slug, hadithRef.bookSlug))
        .limit(1);

      if (!book) {
        console.log(`  Warning: Book ${hadithRef.bookSlug} not found`);
        continue;
      }

      // Get hadith ID
      const [hadith] = await db
        .select()
        .from(hadiths)
        .where(
          and(
            eq(hadiths.bookId, book.id),
            eq(hadiths.number, hadithRef.hadithNumber)
          )
        )
        .limit(1);

      if (!hadith) {
        console.log(
          `  Warning: Hadith ${hadithRef.bookSlug}#${hadithRef.hadithNumber} not found`
        );
        continue;
      }

      // Insert theme-hadith relation
      await db.insert(themeHadiths).values({
        themeId: theme.id,
        hadithId: hadith.id,
        reviewedBy: "admin",
        reviewedAt: new Date(),
      });

      console.log(
        `  Linked hadith ${hadithRef.bookSlug}#${hadithRef.hadithNumber}`
      );
    }
  }

  console.log("Themes seeding completed!");
}

seedThemes().catch((error) => {
  console.error("Themes seeding failed:", error);
  process.exit(1);
});
