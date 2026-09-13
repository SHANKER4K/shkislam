import { NextRequest, NextResponse } from "next/server";

const METHODS = ["dense", "sparse", "hybrid"] as const;
type Method = (typeof METHODS)[number];

const COLLECTIONS = ["quran", "hadith", "tafsir", "books", "sunnah"] as const;

type Collection = (typeof COLLECTIONS)[number];

type FilterValue =
  | string
  | number
  | string[]
  | number[]
  | {
      eq?: number;
      lt?: number;
      gt?: number;
      lte?: number;
      gte?: number;
    };

type Filters = Record<string, FilterValue>;

type SearchBody = {
  method: Method;
  collection: Collection;
  query_text: string;
  top_k?: unknown;
  rerank_pool?: unknown;
  pool?: unknown;
  filters?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePositiveInteger(
  value: unknown,
  fallback: number,
  maximum: number,
): number {
  if (typeof value === "number" && Number.isInteger(value)) {
    return Math.min(maximum, Math.max(1, value));
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Math.min(maximum, Math.max(1, Number(value)));
  }

  return fallback;
}

function normalizeFilters(value: unknown): Filters {
  if (!isRecord(value)) {
    return {};
  }

  return value as Filters;
}

export async function POST(request: NextRequest) {
  let body: SearchBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { method, collection, query_text, filters } = body;

  if (!METHODS.includes(method)) {
    return NextResponse.json(
      { error: "method must be dense, sparse, or hybrid" },
      { status: 400 },
    );
  }

  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      {
        error: `collection must be one of ${COLLECTIONS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  if (typeof query_text !== "string" || !query_text.trim()) {
    return NextResponse.json(
      { error: "query_text is required" },
      { status: 400 },
    );
  }

  const topK = parsePositiveInteger(body.top_k, 10, 100);

  // Accept both names temporarily, but send only rerank_pool to FastAPI.
  const rerankPool = parsePositiveInteger(
    body.rerank_pool ?? body.pool,
    50,
    500,
  );

  if (rerankPool < topK) {
    return NextResponse.json(
      {
        error: "rerank_pool must be greater than or equal to top_k",
      },
      { status: 400 },
    );
  }

  const normalizedFilters = normalizeFilters(filters);

  const payload = {
    collection,
    query_text: query_text.trim(),
    top_k: topK,
    rerank_pool: rerankPool,
    filters: normalizedFilters,
  };

  const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "API_URL is not configured" },
      { status: 500 },
    );
  }

  const endpoint = `${backendUrl.replace(/\/$/, "")}/search/${method}_search`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseText = await response.text();

    let data: unknown;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `FastAPI ${response.status}`,
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      results: data,
      method,
      collection,
      top_k: topK,
      rerank_pool: rerankPool,
      filters: normalizedFilters,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: `cannot reach FastAPI: ${message}`,
      },
      { status: 502 },
    );
  }
}
