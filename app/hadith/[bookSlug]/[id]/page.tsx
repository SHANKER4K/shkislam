import type { Metadata } from "next";
import { getHadithById } from "@/src/lib/hadith";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { separateSanadAndMatn } from "@/src/lib/citation";
import { HadithDetailActions } from "./hadith-detail-actions";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { CreativeWorkJsonLd } from "@/src/components/structured-data";
import { SITE_URL, truncate, hadithTitle } from "@/src/lib/seo";

interface HadithDetailPageProps {
  params: Promise<{ bookSlug: string; id: string }>;
}

export async function generateMetadata({ params }: HadithDetailPageProps): Promise<Metadata> {
  const { bookSlug, id } = await params;
  const hadithId = parseInt(id);
  if (isNaN(hadithId)) return { title: "حديث غير موجود" };

  const [hadith] = await getHadithById(hadithId);
  if (!hadith || hadith.bookSlug !== bookSlug) return { title: "حديث غير موجود" };

  const { matn } = separateSanadAndMatn(hadith.text);
  const desc = truncate(matn || hadith.text, 155);

  return {
    title: hadithTitle(hadith.bookNameAr, hadith.number),
    description: desc,
    openGraph: {
      title: hadithTitle(hadith.bookNameAr, hadith.number),
      description: desc,
      url: `${SITE_URL}/hadith/${bookSlug}/${hadithId}`,
    },
  };
}

export default async function HadithDetailPage({
  params,
}: HadithDetailPageProps) {
  const { bookSlug, id } = await params;
  const hadithId = parseInt(id);
  if (isNaN(hadithId)) notFound();

  const [hadith] = await getHadithById(hadithId);
  if (!hadith || hadith.bookSlug !== bookSlug) notFound();

  const { sanad, matn } = separateSanadAndMatn(hadith.text);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <CreativeWorkJsonLd
        name={`${hadith.bookNameAr} - حديث رقم ${hadith.number}`}
        text={hadith.text}
        author="SHK Islam"
        url={`${SITE_URL}/hadith/${bookSlug}/${hadithId}`}
      />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "الأحاديث النبوية", href: "/hadith" },
            { label: hadith.bookNameAr, href: `/hadith/${bookSlug}` },
            { label: `حديث رقم ${hadith.number}` },
          ]}
        />
        <Link href={`/hadith/${bookSlug}`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="ml-2 size-4" />
            العودة إلى {hadith.bookNameAr}
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-arabic text-2xl font-bold mb-2">
            {hadith.bookNameAr}
          </h1>
          <p className="text-muted-foreground text-sm">{hadith.bookNameEn}</p>
          {hadith.chapterNameAr && (
            <p className="text-muted-foreground text-sm mt-1">
              {hadith.chapterNameAr}
              {hadith.chapterNameEn && ` — ${hadith.chapterNameEn}`}
            </p>
          )}
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">حديث رقم {hadith.number}</Badge>
              <Badge
                variant={
                  hadith.grade === "Sahih"
                    ? "default"
                    : hadith.grade === "Hasan"
                      ? "secondary"
                      : "destructive"
                }
              >
                {hadith.grade === "Sahih"
                  ? "صحيح"
                  : hadith.grade === "Hasan"
                    ? "حسن"
                    : "ضعيف"}
              </Badge>
              {hadith.narrator && (
                <span className="text-sm text-muted-foreground">
                  الراوي: {hadith.narrator}
                </span>
              )}
            </div>

            <div
              dir="rtl"
              className="font-arabic text-lg leading-loose space-y-2"
            >
              {sanad && (
                <p className="text-muted-foreground text-base leading-relaxed">
                  {sanad}
                </p>
              )}
              <p className="font-semibold">{matn}</p>
            </div>

            {hadith.textEn && (
              <div dir="ltr" className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">
                  English
                </p>
                <p className="text-sm leading-relaxed">{hadith.textEn}</p>
              </div>
            )}

            {hadith.sharh && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">
                  الشرح
                </p>
                <p className="font-arabic text-sm leading-relaxed">
                  {hadith.sharh}
                </p>
              </div>
            )}

            <HadithDetailActions
              text={hadith.text}
              textEn={hadith.textEn}
              bookNameAr={hadith.bookNameAr}
              hadithNumber={hadith.number}
              narrator={hadith.narrator}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
