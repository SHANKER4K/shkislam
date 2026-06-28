import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrateEmbeddings() {
  console.log("🚀 Starting embedding migration...\n");

  // 1. Add embedding columns
  console.log("📝 Adding embedding column to ayahs...");
  await db.execute(sql`
    ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS embedding text
  `);
  console.log("✅ ayahs.embedding added\n");

  console.log("📝 Adding embedding column to hadiths...");
  await db.execute(sql`
    ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS embedding text
  `);
  console.log("✅ hadiths.embedding added\n");

  console.log("🎉 Embedding migration complete!");
  console.log("   Next step: run `bun run db:seed-embeddings`");
}

migrateEmbeddings()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  });
