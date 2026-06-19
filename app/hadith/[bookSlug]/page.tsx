import type { Metadata } from "next";
import { getBookBySlug, getChaptersByBookSlug } from "@/src/lib/hadith";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HadithList } from "./hadith-list";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { SITE_URL, SITE_NAME } from "@/src/lib/seo";

interface HadithBookPageProps {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: HadithBookPageProps): Promise<Metadata> {
  const { bookSlug } = await params;
  const [book] = await getBookBySlug(bookSlug);
  if (!book) return { title: "كتاب غير موجود" };

  return {
    title: `${book.nameAr} - الأحاديث النبوية`,
    description: `${book.nameEn} - مجموعة أحاديث نبوية موثقة.`,
    openGraph: {
      title: `${book.nameAr} - الأحاديث النبوية | ${SITE_NAME}`,
      description: `${book.nameEn} - مجموعة أحاديث نبوية موثقة.`,
      url: `${SITE_URL}/hadith/${book.slug}`,
    },
  };
}

export default async function HadithBookPage({ params }: HadithBookPageProps) {
  const { bookSlug } = await params;

  const [book] = await getBookBySlug(bookSlug);
  if (!book) notFound();

  const chapters = await getChaptersByBookSlug(bookSlug);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "الأحاديث النبوية", href: "/hadith" },
            { label: book.nameAr },
          ]}
        />
        <Link href="/hadith">
          <Button variant="ghost" size="sm">
            <ArrowRight className="ml-2 size-4" />
            العودة إلى الكتب
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-arabic text-3xl font-bold mb-2">{book.nameAr}</h1>
        <p className="text-muted-foreground">{book.nameEn}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-2">
        {chapters.map((chapter) => (
          <Accordion key={chapter.id}>
            <AccordionItem key={chapter.id} value={`chapter-${chapter.order}`}>
              <AccordionTrigger className="font-arabic text-base px-4">
                {chapter.nameEn} - {chapter.nameAr}
              </AccordionTrigger>
              <AccordionContent dir="rtl">
                <HadithList bookSlug={bookSlug} chapterOrder={chapter.order} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </main>
  );
}
