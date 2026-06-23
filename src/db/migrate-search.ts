import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);

  console.log("🔧 Running search migration...\n");

  // 1. Enable pg_trgm
  console.log("📦 Enabling pg_trgm extension...");
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
  console.log("✅ pg_trgm enabled\n");

  // 2. Add text_simple to hadiths (mirrors ayahs.text_simple)
  console.log("📝 Adding text_simple to hadiths...");
  await db.execute(sql`
    ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS text_simple text
  `);
  // Populate where null (idempotent)
  await db.execute(sql`
    UPDATE hadiths SET text_simple = regexp_replace(
      text,
      '[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]',
      '',
      'g'
    ) WHERE text_simple IS NULL
  `);
  console.log("✅ Hadiths text_simple populated\n");

  // 3. GIN indexes on search_vector (critical for FTS performance)
  console.log("🔍 Creating GIN indexes on search_vector...");
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS ayahs_search_vector_gin_idx
    ON ayahs USING gin (search_vector)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS hadiths_search_vector_gin_idx
    ON hadiths USING gin (search_vector)
  `);
  console.log("✅ GIN indexes created\n");

  // 4. Trigram indexes on text_simple (speeds up similarity() fallback)
  console.log("🔤 Creating trigram indexes on text_simple...");
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS ayahs_text_simple_trgm_idx
    ON ayahs USING gin (text_simple gin_trgm_ops)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS hadiths_text_simple_trgm_idx
    ON hadiths USING gin (text_simple gin_trgm_ops)
  `);
  console.log("✅ Trigram indexes created\n");

  // 5. Trigram index on themes.name_ar (for thematic search matching)
  console.log("🏷️ Creating trigram index on themes.name_ar...");
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS themes_name_ar_trgm_idx
    ON themes USING gin (name_ar gin_trgm_ops)
  `);
  console.log("✅ Themes trigram index created\n");

  // 6. Update seed FTS to populate hadiths.text_simple going forward
  console.log("🔄 Updating seed FTS — hadiths search_vector now uses text_simple...");
  await db.execute(sql`
    UPDATE hadiths SET search_vector = to_tsvector('arabic', text_simple)
  `);
  console.log("✅ Hadiths search_vector rebuilt from text_simple\n");

  // 7. Matn columns: first 50 words of each hadith (skip sanad noise)
  console.log("📝 Adding matn_text and matn_search_vector to hadiths...");
  await db.execute(sql`
    ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS matn_text text
  `);
  await db.execute(sql`
    ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS matn_search_vector tsvector
  `);
  await db.execute(sql`
    UPDATE hadiths SET
      matn_text = array_to_string((string_to_array(text, ' '))[1:50], ' '),
      matn_search_vector = to_tsvector('arabic', array_to_string((string_to_array(text, ' '))[1:50], ' '))
    WHERE matn_text IS NULL
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS hadiths_matn_search_vector_gin_idx
    ON hadiths USING gin (matn_search_vector)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS hadiths_matn_text_trgm_idx
    ON hadiths USING gin (matn_text gin_trgm_ops)
  `);
  console.log("✅ Matn columns + indexes created\n");

  console.log("🎉 Search migration complete!");
  console.log("   Run `bun run db:migrate-search` after re-seeding too.\n");

  await pool.end();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
