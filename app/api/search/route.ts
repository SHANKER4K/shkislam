import { NextRequest, NextResponse } from "next/server";
import { unifiedSearch, SearchType, SearchMode } from "@/src/lib/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const type = (searchParams.get("type") || "all") as SearchType;
  const mode = (searchParams.get("mode") || "literal") as SearchMode;

  if (!q) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const results = await unifiedSearch(q, type, mode);
  return NextResponse.json(results);
}
