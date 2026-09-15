import { db } from "@/db";
import {
  hadiths,
  hadithChapters,
  hadithBooks,
  hadithsWithSanadMatn,
} from "@/db/schema";
import { eq, asc, sql, desc } from "drizzle-orm";

export async function getAllBooks() {
  return db.select().from(hadithBooks).orderBy(asc(hadithBooks.id));
}

export async function getBookBySlug(slug: string) {
  return db
    .select()
    .from(hadithBooks)
    .where(eq(hadithBooks.slug, slug))
    .limit(1);
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
      sanad: hadithsWithSanadMatn.sanad,
      matn: hadithsWithSanadMatn.matn,
      bookNameAr: hadithBooks.nameAr,
      bookNameEn: hadithBooks.nameEn,
      bookSlug: hadithBooks.slug,
      chapterNameAr: hadithChapters.nameAr,
      chapterNameEn: hadithChapters.nameEn,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
    .leftJoin(hadithsWithSanadMatn, eq(hadiths.id, hadithsWithSanadMatn.id))
    .where(eq(hadiths.id, id))
    .limit(1);
}

export async function getChaptersByBookSlug(slug: string) {
  const book = await getBookBySlug(slug);
  if (book.length === 0) return [];

  return db
    .select({
      id: hadithChapters.id,
      bookId: hadithChapters.bookId,
      nameAr: hadithChapters.nameAr,
      nameEn: hadithChapters.nameEn,
      order: hadithChapters.order,
      hadithCount: sql<number>`CAST(COUNT(${hadiths.id}) AS INTEGER)`,
    })
    .from(hadithChapters)
    .leftJoin(hadiths, eq(hadiths.chapterId, hadithChapters.id))
    .where(eq(hadithChapters.bookId, book[0].id))
    .groupBy(hadithChapters.id)
    .orderBy(asc(hadithChapters.order));
}

export async function getHadithsByBookSlug(
  slug: string,
  chapterOrder?: number,
) {
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
        sanad: hadithsWithSanadMatn.sanad,
        matn: hadithsWithSanadMatn.matn,
        bookNameAr: hadithBooks.nameAr,
        bookSlug: hadithBooks.slug,
        chapterNameAr: hadithChapters.nameAr,
        chapterOrder: hadithChapters.order,
      })
      .from(hadiths)
      .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
      .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
      .leftJoin(hadithsWithSanadMatn, eq(hadiths.id, hadithsWithSanadMatn.id))
      .where(
        sql`${hadiths.bookId} = ${book[0].id} AND ${hadithChapters.order} = ${chapterOrder}`,
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
      sanad: hadithsWithSanadMatn.sanad,
      matn: hadithsWithSanadMatn.matn,
      bookNameAr: hadithBooks.nameAr,
      bookSlug: hadithBooks.slug,
      chapterNameAr: hadithChapters.nameAr,
      chapterOrder: hadithChapters.order,
    })
    .from(hadiths)
    .innerJoin(hadithBooks, eq(hadiths.bookId, hadithBooks.id))
    .innerJoin(hadithChapters, eq(hadiths.chapterId, hadithChapters.id))
    .leftJoin(hadithsWithSanadMatn, eq(hadiths.id, hadithsWithSanadMatn.id))
    .where(eq(hadiths.bookId, book[0].id))
    .orderBy(asc(hadiths.number));
}

export async function getAdjacentHadiths(
  bookId: number,
  currentNumber: number,
) {
  const [prev] = await db
    .select({ id: hadiths.id, number: hadiths.number })
    .from(hadiths)
    .where(
      sql`${hadiths.bookId} = ${bookId} AND ${hadiths.number} < ${currentNumber}`,
    )
    .orderBy(desc(hadiths.number))
    .limit(1);

  const [next] = await db
    .select({ id: hadiths.id, number: hadiths.number })
    .from(hadiths)
    .where(
      sql`${hadiths.bookId} = ${bookId} AND ${hadiths.number} > ${currentNumber}`,
    )
    .orderBy(asc(hadiths.number))
    .limit(1);

  return { prev: prev ?? null, next: next ?? null };
}

export type Hadith = typeof hadiths.$inferSelect;
export type HadithBook = typeof hadithBooks.$inferSelect;
export type HadithChapter = typeof hadithChapters.$inferSelect;
