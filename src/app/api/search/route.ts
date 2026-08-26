import { NextRequest, NextResponse } from "next/server";
import { buildSearchUrl } from "@/lib/vector-data";

export const maxDuration = 20;

const METHODS = ["dense", "sparse", "hybrid"] as const;
type Method = (typeof METHODS)[number];
const COLLECTIONS = ["quran", "hadith", "tafsir", "books", "sunnah"] as const;
type Collection = (typeof COLLECTIONS)[number];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const { method, collection, query_text, top_k, pool, filters } = (body ??
    {}) as Record<string, unknown>;

  if (!METHODS.includes(method as Method)) {
    return NextResponse.json(
      { error: "method must be dense|sparse|hybrid" },
      { status: 400 },
    );
  }
  if (!COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json(
      { error: `collection must be one of ${COLLECTIONS.join(", ")}` },
      { status: 400 },
    );
  }
  if (typeof query_text !== "string" || !query_text.trim()) {
    return NextResponse.json(
      { error: "query_text is required" },
      { status: 400 },
    );
  }

  const topK = Math.min(100, Math.max(1, Number(top_k) || 10));
  const pool_ = Math.min(500, Math.max(1, Number(pool) || 50));
  const filters_ =
    filters && typeof filters === "object" && !Array.isArray(filters)
      ? filters
      : {};

  const url = buildSearchUrl(method as Method, {
    collection: collection as Collection,
    query_text: query_text.trim(),
    top_k: topK,
    pool: pool_,
    filters: filters_ as Record<string, unknown>,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters_),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `FastAPI ${res.status}: ${text.slice(0, 500)}` },
        { status: 502 },
      );
    }
    const data = await res.json();
    return NextResponse.json({
      results: data,
      method,
      collection,
      top_k: topK,
      pool: pool_,
      filters: filters_,
    });
  } catch (err) {
    const backend_url = process.env.NEXT_PUBLIC_API_URL;
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `cannot reach ${backend_url}: ${msg}` },
      { status: 502 },
    );
  }
}
