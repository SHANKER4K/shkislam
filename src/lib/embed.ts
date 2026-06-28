import { pipeline } from "@xenova/transformers";

// ponytail: singleton pipeline — loaded once per process, cached by transformers.js
let pipelineInstance: Promise<any> | null = null;

async function getPipeline() {
  if (!pipelineInstance) {
    pipelineInstance = pipeline("feature-extraction", "Xenova/multilingual-e5-small")
      .catch((e: Error) => {
        console.error("Pipeline init failed:", e);
        pipelineInstance = null; // allow retry
        return null;
      });
  }
  return pipelineInstance;
}

/**
 * Embed Arabic text into a 384-dimensional normalized vector.
 * Returns null if the pipeline can't be loaded (caller falls back to trigram/FTS).
 */
export async function embedText(
  text: string,
  prefix: "query" | "passage" = "query",
): Promise<Float32Array | null> {
  try {
    const extractor = await getPipeline();
    if (!extractor) return null;
    const input = prefix === "query" ? `query: ${text}` : `passage: ${text}`;
    const result = await extractor(input, { pooling: "mean", normalize: true });
    return Float32Array.from(result.tolist()[0]);
  } catch (e) {
    console.error("Embedding failed:", e);
    return null;
  }
}

/**
 * Compute cosine similarity between two Float32Arrays.
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
}

/**
 * Given a query embedding and a list of {id, embedding} pairs,
 * return the top k items sorted by cosine similarity.
 */
export function rankBySimilarity(
  queryVec: Float32Array,
  items: { id: number; embedding: string }[],
  topK = 20,
): { id: number; score: number }[] {
  const parsed = items.map((item) => ({
    id: item.id,
    vec: JSON.parse(item.embedding) as number[],
  }));
  const scored = parsed.map((item) => ({
    id: item.id,
    score: cosineSimilarity(queryVec, Float32Array.from(item.vec)),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
