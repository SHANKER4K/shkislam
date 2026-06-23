import {
  pgTable,
  text,
  integer,
  serial,
  index,
  pgEnum,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";

export const revelationTypeEnum = pgEnum("revelation_type", [
  "Meccan",
  "Medinan",
]);
export const hadithGradeEnum = pgEnum("hadith_grade", [
  "Sahih",
  "Hasan",
  "Dhaeef",
]);
export const themeStatusEnum = pgEnum("theme_status", ["draft", "published"]);

export const surahs = pgTable(
  "surahs",
  {
    id: serial("id").primaryKey(),
    number: integer("number").notNull().unique(),
    nameAr: text("name_ar").notNull(),
    nameTranslation: text("name_translation").notNull(),
    versesCount: integer("verses_count").notNull(),
    revelationType: revelationTypeEnum("revelation_type").notNull(),
  },
  (table) => [index("surahs_number_idx").on(table.number)],
);

export const ayahs = pgTable(
  "ayahs",
  {
    id: serial("id").primaryKey(),
    surahId: integer("surah_id")
      .notNull()
      .references(() => surahs.id),
    numberInSurah: integer("number_in_surah").notNull(),
    textUthmani: text("text_uthmani").notNull(),
    textSimple: text("text_simple").notNull(),
    textEn: text("text_en"),
    tafsirText: text("tafsir_text"),
    asbabNuzul: text("asbab_nuzul"),
  },
  (table) => [index("ayahs_surah_id_idx").on(table.surahId)],
);

export const hadithBooks = pgTable(
  "hadith_books",
  {
    id: serial("id").primaryKey(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en").notNull(),
    slug: text("slug").notNull().unique(),
  },
  (table) => [uniqueIndex("hadith_books_slug_idx").on(table.slug)],
);

export const hadithChapters = pgTable(
  "hadith_chapters",
  {
    id: serial("id").primaryKey(),
    bookId: integer("book_id")
      .notNull()
      .references(() => hadithBooks.id),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en"),
    order: integer("order").notNull(),
  },
  (table) => [
    index("hadith_chapters_book_id_idx").on(table.bookId),
    uniqueIndex("hadith_chapters_book_order_idx").on(table.bookId, table.order),
  ],
);

export const hadiths = pgTable(
  "hadiths",
  {
    id: serial("id").primaryKey(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => hadithChapters.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => hadithBooks.id),
    number: integer("number").notNull(),
    narrator: text("narrator"),
    text: text("text").notNull(),
    textEn: text("text_en"),
    grade: hadithGradeEnum("grade").notNull().default("Sahih"),
    sharh: text("sharh"),
  },
  (table) => [
    index("hadiths_chapter_id_idx").on(table.chapterId),
    index("hadiths_book_id_idx").on(table.bookId),
  ],
);

/**
 * Mirror of hadiths + sanad/matn columns populated by a BERT model.
 * Created outside Drizzle (raw SQL). Read-only reference.
 */
export const hadithsWithSanadMatn = pgTable("hadiths_with_sanad_matn", {
  id: integer("id"),
  chapterId: integer("chapter_id"),
  bookId: integer("book_id"),
  number: integer("number"),
  narrator: text("narrator"),
  text: text("text"),
  textEn: text("text_en"),
  grade: text("grade"),
  sharh: text("sharh"),
  sanad: text("sanad"),
  matn: text("matn"),
});

export const themes = pgTable(
  "themes",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en").notNull(),
    description: text("description"),
    status: themeStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("themes_slug_idx").on(table.slug)],
);

export const themeAyahs = pgTable(
  "theme_ayahs",
  {
    id: serial("id").primaryKey(),
    themeId: integer("theme_id")
      .notNull()
      .references(() => themes.id, { onDelete: "cascade" }),
    ayahId: integer("ayah_id")
      .notNull()
      .references(() => ayahs.id, { onDelete: "cascade" }),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at"),
    note: text("note"),
  },
  (table) => [
    index("theme_ayahs_theme_id_idx").on(table.themeId),
    index("theme_ayahs_ayah_id_idx").on(table.ayahId),
    uniqueIndex("theme_ayahs_unique_idx").on(table.themeId, table.ayahId),
  ],
);

export const themeHadiths = pgTable(
  "theme_hadiths",
  {
    id: serial("id").primaryKey(),
    themeId: integer("theme_id")
      .notNull()
      .references(() => themes.id, { onDelete: "cascade" }),
    hadithId: integer("hadith_id")
      .notNull()
      .references(() => hadiths.id, { onDelete: "cascade" }),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at"),
    note: text("note"),
  },
  (table) => [
    index("theme_hadiths_theme_id_idx").on(table.themeId),
    index("theme_hadiths_hadith_id_idx").on(table.hadithId),
    uniqueIndex("theme_hadiths_unique_idx").on(table.themeId, table.hadithId),
  ],
);
