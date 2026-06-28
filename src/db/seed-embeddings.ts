import { db } from "./index";
import { sql } from "drizzle-orm";
import { embedText } from "../lib/embed.js";

const BATCH_SIZE = 20;

async function embedDocuments() {
  console.log("🚀 Seeding embeddings...\n");

  // --- Embed ayahs ---
  console.log("📖 Embedding ayahs...");
  const ayahResult = await db.execute(sql`
    SELECT id, text_simple AS text FROM ayahs WHERE embedding IS NULL ORDER BY id DESC
  `);
  const allAyahs = (ayahResult.rows ?? ayahResult) as {
    id: number;
    text: string;
  }[];

  console.log(`   Found ${allAyahs.length} ayahs to embed`);

  for (let i = 0; i < allAyahs.length; i += BATCH_SIZE) {
    const batch = allAyahs.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (ayah) => {
        const vec = await embedText(ayah.text, "passage");
        if (!vec) {
          console.error(`   Failed to embed ayah ${ayah.id}`);
          return;
        }
        const json = JSON.stringify(Array.from(vec));
        await db.execute(
          sql`UPDATE ayahs SET embedding = ${json}::text WHERE id = ${ayah.id}`,
        );
      }),
    );
    console.log(
      `   Progress: ${Math.min(i + BATCH_SIZE, allAyahs.length)}/${allAyahs.length}`,
    );
  }
  console.log("✅ Ayahs embedded\n");

  // --- Embed hadiths ---
  console.log("📖 Embedding hadiths...");
  const hadithResult = await db.execute(sql`
    SELECT id, text FROM hadiths WHERE embedding IS NULL ORDER BY id DESC
  `);
  const allHadiths = (hadithResult.rows ?? hadithResult) as {
    id: number;
    text: string;
  }[];

  console.log(`   Found ${allHadiths.length} hadiths to embed`);

  for (let i = 0; i < allHadiths.length; i += BATCH_SIZE) {
    const batch = allHadiths.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (hadith) => {
        const vec = await embedText(hadith.text, "passage");
        if (!vec) {
          console.error(`   Failed to embed hadith ${hadith.id}`);
          return;
        }
        const json = JSON.stringify(Array.from(vec));
        await db.execute(
          sql`UPDATE hadiths SET embedding = ${json}::text WHERE id = ${hadith.id}`,
        );
      }),
    );
    console.log(
      `   Progress: ${Math.min(i + BATCH_SIZE, allHadiths.length)}/${allHadiths.length}`,
    );
  }
  console.log("✅ Hadiths embedded\n");

  console.log("🎉 Embedding seed complete!");
}

embedDocuments()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
