import { relations, sql } from "drizzle-orm";
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
  varchar,
} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const revelationTypeEnum = pgEnum("revelation_type", [
  "Meccan",
  "Medinan",
]);
export const hadithGradeEnum = pgEnum("hadith_grade", [
  "Sahih",
  "Hasan",
  "Dhaeef",
]);
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);
export const themeStatusEnum = pgEnum("theme_status", ["draft", "published"]);

export const providerApiStyleEnum = pgEnum("provider_api_style", [
  "openai_compatible",
  "anthropic_compatible",
]);

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

export const hadithBooks = pgTable("hadith_books", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
});

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
    textSimple: text("text_simple"),
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

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  status: themeStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Telegram-specific identifier. Nullable so other clients (web, etc.)
  // can create users without a Telegram identity.
  telegramId: text("telegram_id").unique(),

  username: text("username"),
  displayName: text("display_name"),
  image: text("image"),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: boolean("email_verified").notNull().default(false),

  // better-auth admin plugin
  role: text("role").notNull().default("user"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: t.text("id").primaryKey(),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: t.varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: t
      .timestamp("expires_at", { precision: 6, withTimezone: true })
      .notNull(),
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    impersonatedBy: t.text("impersonated_by"), // better-auth admin plugin
    createdAt: t
      .timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull(),
  },
  (table) => [t.index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: t.text("id").primaryKey(),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // ponytail: nullable — Better Auth >=1.7.3 never writes issuer; kept to avoid data loss
    issuer: t.text("issuer"),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    accessTokenExpiresAt: t.timestamp("access_token_expires_at", {
      precision: 6,
      withTimezone: true,
    }),
    refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at", {
      precision: 6,
      withTimezone: true,
    }),
    scope: t.text("scope"),
    idToken: t.text("id_token"),
    password: t.text("password"),
    createdAt: t
      .timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull(),
  },
  (table) => [t.index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: t.text("id").primaryKey(),
    identifier: t.text("identifier").notNull(),
    value: t.text("value").notNull(),
    expiresAt: t
      .timestamp("expires_at", { precision: 6, withTimezone: true })
      .notNull(),
    createdAt: t
      .timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull(),
    updatedAt: t
      .timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull(),
  },
  (table) => [t.index("verification_identifier_idx").on(table.identifier)],
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

    // Which connection this session ran on. Deliberately `set null` rather
    // than `cascade`: deleting a connection must not delete history, and the
    // three snapshot columns above still resolve the old model.
    userProviderId: uuid("user_provider_id").references(
      () => userProviders.id,
      { onDelete: "set null" },
    ),

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
    role: messageRoleEnum("role").notNull(),
    content: text("content"),
    sequence: integer("sequence"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("messages_session_id_idx").on(table.sessionId)],
);

// ====================
// Providers
// ====================
// Static catalog shipped with the app (OpenAI, Anthropic, Groq,
// OpenRouter, ...). Seeded via migration, not user-writable.

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // "openai", "anthropic", "groq", ...
  name: text("name").notNull(),
  apiStyle: providerApiStyleEnum("api_style").notNull(),
  defaultBaseUrl: text("default_base_url").notNull(),
  logoUrl: text("logo_url"),

  // Reasoning-effort levels every model of this provider accepts unless a
  // per-connection row overrides them. Seeds provider_models.variants.
  defaultVariants: text("default_variants")
    .array()
    .default(sql`ARRAY['low']::text[]`)
    .notNull(),

  // False for endpoints that need no credential (the local omniroute
  // gateway); a connection to one of those stores a NULL key.
  requiresKey: boolean("requires_key").notNull().default(true),

  // Where to send a user who asks "how do I get a key for this?".
  docsUrl: text("docs_url"),

  // The catalog's model map, `{model_id: {variants: [...]}}`. Lives on the
  // provider rather than in provider_models (which is per-connection) so a
  // provider nobody has connected to still advertises its models.
  models: jsonb("models").default({}).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ====================
// User Providers
// ====================
// One row per connection a user makes — either to a catalog entry
// (providerId set) or a fully custom endpoint (providerId null).
// Replaces the old single-purpose `api_keys` table.

export const userProviders = pgTable(
  "user_providers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Null when this is a fully custom provider with no catalog entry.
    providerId: integer("provider_id").references(() => providers.id, {
      onDelete: "set null",
    }),

    isCustom: boolean("is_custom").notNull().default(false),

    // Required when isCustom = true; ignored otherwise.
    customName: text("custom_name"),

    // Required for custom providers; optional override for built-in ones
    // (Azure OpenAI deployments, self-hosted proxies, regional endpoints).
    baseUrl: text("base_url").notNull(),

    // Copied from providers.apiStyle at connect time (or set directly for
    // custom providers) so this row survives a catalog entry being removed.
    apiStyle: providerApiStyleEnum("api_style").notNull(),

    // Isolated behind this single column so real encryption (e.g. AES-GCM
    // with a KMS-managed key) can be dropped in later without touching
    // callers. Never log it, never return it in API responses. NULL only
    // for providers with `requires_key = false`.
    encryptedKey: text("encrypted_key"),

    // Non-standard auth needs: extra org headers, proxy tokens, etc.
    extraHeaders: jsonb("extra_headers").default({}).notNull(),

    lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("user_providers_user_id_idx").on(table.userId),
    index("user_providers_provider_id_idx").on(table.providerId),
    // One connection per (user, catalog provider). Custom connections have a
    // NULL provider_id and NULLs never collide, so they stay unlimited.
    uniqueIndex("user_providers_user_provider_idx").on(
      table.userId,
      table.providerId,
    ),
  ],
);

// ====================
// Provider Models
// ====================
// Cache of what each connection has available — populated by the sync
// flow (GET /v1/models) or added manually for providers that don't
// implement discovery.

export const providerModels = pgTable(
  "provider_models",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userProviderId: uuid("user_provider_id")
      .notNull()
      .references(() => userProviders.id, { onDelete: "cascade" }),

    // Raw model identifier as sent to the provider's API, e.g. "gpt-4o".
    modelId: text("model_id").notNull(),
    displayName: text("display_name"),

    // Reasoning-effort levels this model accepts. Discovery cannot learn
    // these, so a synced model gets the provider's `default_variants`.
    variants: text("variants")
      .array()
      .default(sql`ARRAY['low']::text[]`)
      .notNull(),

    contextWindow: integer("context_window"),
    supportsTools: boolean("supports_tools"),
    supportsVision: boolean("supports_vision"),

    // true when added via "add model by ID" rather than discovered
    // through the provider's /v1/models endpoint.
    isCustom: boolean("is_custom").notNull().default(false),

    // Disabled models are hidden from pickers but not deleted, so past
    // sessions referencing them still resolve.
    enabled: boolean("enabled").notNull().default(true),

    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("provider_models_user_provider_id_idx").on(table.userProviderId),
    uniqueIndex("provider_models_unique_idx").on(
      table.userProviderId,
      table.modelId,
    ),
  ],
);

// ====================
// Relations (enables db.query.userProviders.findMany({ with: { models } }))
// ====================

export const userProvidersRelations = relations(
  userProviders,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userProviders.userId],
      references: [users.id],
    }),
    provider: one(providers, {
      fields: [userProviders.providerId],
      references: [providers.id],
    }),
    models: many(providerModels),
  }),
);

export const providerModelsRelations = relations(providerModels, ({ one }) => ({
  userProvider: one(userProviders, {
    fields: [providerModels.userProviderId],
    references: [userProviders.id],
  }),
}));
