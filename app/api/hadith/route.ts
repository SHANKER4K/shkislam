import { NextRequest, NextResponse } from "next/server";
import { getHadithsByBookSlug } from "@/src/lib/hadith";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");

  if (!book) {
    return NextResponse.json({ error: "book parameter required" }, { status: 400 });
  }

  const chapterOrder = chapter ? parseInt(chapter) : undefined;

  const hadiths = await getHadithsByBookSlug(book, chapterOrder);
  return NextResponse.json(hadiths);
}
