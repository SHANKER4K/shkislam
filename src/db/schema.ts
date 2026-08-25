import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  serial,
  index,
  pgEnum,
  uniqueIndex,
  timestamp,
  uuid,
  jsonb,
  boolean,
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

export const surahs = pgTable("surahs", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameTranslation: text("name_translation").notNull(),
  versesCount: integer("verses_count").notNull(),
  revelationType: revelationTypeEnum("revelation_type").notNull(),
});

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
  (table) => [
    index("ayahs_surah_id_number_idx").on(table.surahId, table.numberInSurah),
  ],
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

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Telegram-specific identifier. Nullable so other clients (web, etc.)
    // can create users without a Telegram identity.
    telegramId: text("telegram_id"),

    username: text("username"),
    displayName: text("display_name"),
    email: text("email"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_telegram_id_idx").on(table.telegramId),
    uniqueIndex("users_email_idx").on(table.email),
  ],
);

// ====================
// API Keys
// ====================
// Belongs to the USER, not the session. One key per (user, provider).

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    provider: text("provider").notNull(),

    // Isolated behind this single column so real encryption (e.g. AES-GCM
    // with a KMS-managed key) can be dropped in later without touching
    // callers. Until then this holds the raw key value - never log it,
    // never return it in API responses.
    encryptedKey: text("encrypted_key").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("api_keys_user_provider_idx").on(table.userId, table.provider),
    index("api_keys_user_id_idx").on(table.userId),
  ],
);

// ====================
// Sessions
// ====================
// Provider/model/variant live here because they describe the configuration
// of a conversation, not a permanent user setting.

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // "telegram", "web", etc.
    source: text("source").notNull(),

    modelProvider: text("model_provider"),
    modelName: text("model_name"),
    modelVariant: text("model_variant"),

    // Complete PydanticAI message/event representation for this session.
    pydanticMessage: jsonb("pydantic_message").default([]).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    // Enforces "only one active session per user" at the DB level.
    // Partial unique index: only rows where is_active = true participate.
    uniqueIndex("sessions_one_active_per_user_idx")
      .on(table.userId)
      .where(sql`is_active = true`),
  ],
);

// ====================
// Messages
// ====================

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),

    // user / assistant / system / tool
    role: text("role").notNull(),
    content: text("content"),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("messages_session_id_idx").on(table.sessionId)],
);
