import { NextRequest, NextResponse } from "next/server";
import { unifiedSearch, SearchType, SearchMode } from "@/src/lib/search";

export const maxDuration = 20; // Vercel serverless timeout

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const type = (searchParams.get("type") || "all") as SearchType;
  const mode = (searchParams.get("mode") || "literal") as SearchMode;
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));

  if (!q) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const allResults = await unifiedSearch(q, type, mode);
  const total = allResults.length;
  const paginated = allResults.slice(offset, offset + limit);

  return NextResponse.json({ results: paginated, total, offset, limit });
}
