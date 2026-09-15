import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

// ponytail: singleton pipeline — loaded once per process, cached by transformers.js
let pipelineInstance: Promise<FeatureExtractionPipeline | null> | null = null;

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
