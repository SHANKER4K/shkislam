import type { Metadata } from "next";
import { getBookBySlug, getChaptersByBookSlug } from "@/src/lib/hadith";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { SITE_URL, SITE_NAME } from "@/src/lib/seo";
import { ChapterReader } from "./chapter-reader";

interface ChapterPageProps {
  params: Promise<{ bookSlug: string; chapterOrder: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { bookSlug, chapterOrder } = await params;
  const [book] = await getBookBySlug(bookSlug);
  if (!book) return { title: "غير موجود" };
  const chapters = await getChaptersByBookSlug(bookSlug);
  const chapter = chapters.find((c) => c.order === parseInt(chapterOrder));
  if (!chapter) return { title: "غير موجود" };

  return {
    title: `${chapter.nameAr} - ${book.nameAr}`,
    description: `${chapter.nameEn} - تصفّح أحاديث الباب.`,
    openGraph: {
      title: `${chapter.nameAr} - ${book.nameAr} | ${SITE_NAME}`,
      url: `${SITE_URL}/hadith/${book.slug}/chapter/${chapterOrder}`,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookSlug, chapterOrder } = await params;
  const order = parseInt(chapterOrder);
  if (isNaN(order)) notFound();

  const [book] = await getBookBySlug(bookSlug);
  if (!book) notFound();

  const chapters = await getChaptersByBookSlug(bookSlug);
  const chapter = chapters.find((c) => c.order === order);
  if (!chapter) notFound();

  const idx = chapters.findIndex((c) => c.order === order);
  const prevChapter = idx > 0 ? chapters[idx - 1] : null;
  const nextChapter = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "الأحاديث النبوية", href: "/hadith" },
            { label: book.nameAr, href: `/hadith/${bookSlug}` },
            { label: chapter.nameAr },
          ]}
        />
        <Link href={`/hadith/${bookSlug}`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="ml-2 size-4" />
            العودة إلى {book.nameAr}
          </Button>
        </Link>
      </div>

      <ChapterReader
        bookSlug={bookSlug}
        chapterOrder={order}
        chapterNameAr={chapter.nameAr}
        chapterNameEn={chapter.nameEn ?? ""}
        hadithCount={chapter.hadithCount}
        prevChapter={
          prevChapter
            ? { order: prevChapter.order, nameAr: prevChapter.nameAr }
            : null
        }
        nextChapter={
          nextChapter
            ? { order: nextChapter.order, nameAr: nextChapter.nameAr }
            : null
        }
      />
    </main>
  );
}
