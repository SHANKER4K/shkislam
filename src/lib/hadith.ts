import { db } from "@/src/db";
import { hadiths, hadithChapters, hadithBooks } from "@/src/db/schema";
import { eq, asc, sql, desc } from "drizzle-orm";
import { stripDiacritics } from "./citation";

// Regex for stripping Arabic diacritics — used in SQL for hadiths (no text_simple column)
const DIACRITICS_REGEX = "[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]";
const STRIP_SQL = sql.raw(`regexp_replace(text, '${DIACRITICS_REGEX}', '', 'g')`);

export async function getAllBooks() {
  return db.select().from(hadithBooks).orderBy(asc(hadithBooks.id));
}

export async function getBookBySlug(slug: string) {
  return db.select().from(hadithBooks).where(eq(hadithBooks.slug, slug)).limit(1);
}

export async function getHadithById(id: number) {
  return db
    .select({
      id: hadiths.id,
      number: hadiths.number,
      narrator: hadiths.narrator,
      text: hadiths.text,
      textEn: hadiths.textEn,
      grade: hadiths.grade,
      sharh: hadiths.sharh,
      bookNameAr: hadithBooks.nameAr,
      bookNameEn: hadithBooks.nameEn,
      bookSlug: hadithBooks.slug,
      chapterNameAr: hadithChapters.nameAr,
      chapterNameEn: hadithChapters.nameEn,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
    .where(eq(hadiths.id, id))
    .limit(1);
}

export async function getChaptersByBookSlug(slug: string) {
  const book = await getBookBySlug(slug);
  if (book.length === 0) return [];

  return db
    .select()
    .from(hadithChapters)
    .where(eq(hadithChapters.bookId, book[0].id))
    .orderBy(asc(hadithChapters.order));
}

export async function getHadithsByBookSlug(slug: string, chapterOrder?: number) {
  const book = await getBookBySlug(slug);
  if (book.length === 0) return [];

  if (chapterOrder !== undefined) {
    return db
      .select({
        id: hadiths.id,
        number: hadiths.number,
        narrator: hadiths.narrator,
        text: hadiths.text,
        grade: hadiths.grade,
        sharh: hadiths.sharh,
        bookNameAr: hadithBooks.nameAr,
        bookSlug: hadithBooks.slug,
        chapterNameAr: hadithChapters.nameAr,
        chapterOrder: hadithChapters.order,
      })
      .from(hadiths)
      .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
      .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
      .where(
        sql`${hadiths.bookId} = ${book[0].id} AND ${hadithChapters.order} = ${chapterOrder}`
      )
      .orderBy(asc(hadiths.number));
  }

  return db
    .select({
      id: hadiths.id,
      number: hadiths.number,
      narrator: hadiths.narrator,
      text: hadiths.text,
      grade: hadiths.grade,
      sharh: hadiths.sharh,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      chapterNameAr: hadithChapters.nameAr,
      chapterOrder: hadithChapters.order,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
    .where(eq(hadiths.bookId, book[0].id))
    .orderBy(asc(hadiths.number));
}

export async function searchHadiths(query: string) {
  if (!query.trim()) return [];

  const trimmed = query.trim();
  const stripped = stripDiacritics(trimmed);

  // Tier 1: FTS full query
  const ftsResults = await db
    .select({
      id: hadiths.id,
      text: hadiths.text,
      number: hadiths.number,
      narrator: hadiths.narrator,
      grade: hadiths.grade,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      rank: sql<number>`ts_rank_cd(${sql.raw("hadiths.search_vector")}, plainto_tsquery('arabic', ${trimmed}))::float`,
      snippet: sql<string>`ts_headline('arabic', ${hadiths.text}, plainto_tsquery('arabic', ${trimmed}), 'StartSel=<b>, StopSel=</b>, MaxWords=60, MinWords=20')`,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .where(sql`${sql.raw("hadiths.search_vector")} @@ plainto_tsquery('arabic', ${trimmed})`)
    .orderBy(desc(sql`ts_rank_cd(${sql.raw("hadiths.search_vector")}, plainto_tsquery('arabic', ${trimmed}))`))
    .limit(50);

  if (ftsResults.length > 0) return ftsResults;

  // Tier 2: FTS per-word
  // ponytail: single-char Arabic letters match everything, skip them
  const words = stripped.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length > 0) {
    const seen = new Set<number>();
    const perWordResults: typeof ftsResults = [];
    for (const word of words) {
      const rows = await db
        .select({
          id: hadiths.id,
          text: hadiths.text,
          number: hadiths.number,
          narrator: hadiths.narrator,
          grade: hadiths.grade,
          bookNameAr: hadithBooks.nameAr,
          bookSlug: hadithBooks.slug,
          rank: sql<number>`ts_rank_cd(${sql.raw("hadiths.search_vector")}, plainto_tsquery('arabic', ${word}))::float`,
          snippet: sql<string>`ts_headline('arabic', ${hadiths.text}, plainto_tsquery('arabic', ${word}), 'StartSel=<b>, StopSel=</b>, MaxWords=60, MinWords=20')`,
        })
        .from(hadiths)
        .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
        .where(sql`${sql.raw("hadiths.search_vector")} @@ plainto_tsquery('arabic', ${word})`)
        .orderBy(desc(sql`ts_rank_cd(${sql.raw("hadiths.search_vector")}, plainto_tsquery('arabic', ${word}))`))
        .limit(20);
      for (const row of rows) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          perWordResults.push(row);
        }
      }
    }
    if (perWordResults.length > 0) {
      perWordResults.sort((a, b) => b.rank - a.rank);
      return perWordResults.slice(0, 50);
    }
  }

  // Tier 3: Trigram (cleaned query)
  const cleaned = words.join(" ");
  if (!cleaned) return [];

  const trigramResults = await db
    .select({
      id: hadiths.id,
      text: hadiths.text,
      number: hadiths.number,
      narrator: hadiths.narrator,
      grade: hadiths.grade,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      rank: sql<number>`similarity(${STRIP_SQL}, ${cleaned})::float`,
      snippet: sql<string>`NULL`,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .where(sql`similarity(${STRIP_SQL}, ${cleaned}) > 0.15`)
    .orderBy(desc(sql`similarity(${STRIP_SQL}, ${cleaned})`))
    .limit(50);

  if (trigramResults.length > 0) return trigramResults;

  // Tier 4: LIKE fallback
  const likePattern = `%${cleaned}%`;
  return db
    .select({
      id: hadiths.id,
      text: hadiths.text,
      number: hadiths.number,
      narrator: hadiths.narrator,
      grade: hadiths.grade,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      rank: sql<number>`0.1::float`,
      snippet: sql<string>`NULL`,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .where(sql`${STRIP_SQL} ILIKE ${likePattern}`)
    .limit(50);
}

export type Hadith = typeof hadiths.$inferSelect;
export type HadithBook = typeof hadithBooks.$inferSelect;
export type HadithChapter = typeof hadithChapters.$inferSelect;
