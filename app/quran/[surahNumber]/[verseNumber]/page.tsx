import type { Metadata } from "next";
import { getAyahBySurahAndVerse, getAdjacentAyahs } from "@/src/lib/quran";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { VerseDetailActions } from "./verse-detail-actions";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { CreativeWorkJsonLd } from "@/src/components/structured-data";
import { SITE_URL, truncate, verseTitle } from "@/src/lib/seo";

interface VerseDetailPageProps {
  params: Promise<{ surahNumber: string; verseNumber: string }>;
}

export async function generateMetadata({ params }: VerseDetailPageProps): Promise<Metadata> {
  const { surahNumber, verseNumber } = await params;
  const surahNum = parseInt(surahNumber);
  const verseNum = parseInt(verseNumber);
  if (isNaN(surahNum) || isNaN(verseNum)) return { title: "آية غير موجودة" };

  const [ayah] = await getAyahBySurahAndVerse(surahNum, verseNum);
  if (!ayah) return { title: "آية غير موجودة" };

  const desc = ayah.tafsirText
    ? truncate(ayah.tafsirText.replace(/<[^>]*>/g, ""), 155)
    : truncate(ayah.textUthmani, 155);

  return {
    title: verseTitle(ayah.surahNameAr, ayah.numberInSurah),
    description: desc,
    openGraph: {
      title: verseTitle(ayah.surahNameAr, ayah.numberInSurah),
      description: desc,
      url: `${SITE_URL}/quran/${surahNum}/${verseNum}`,
    },
  };
}

export default async function VerseDetailPage({
  params,
}: VerseDetailPageProps) {
  const { surahNumber, verseNumber } = await params;
  const surahNum = parseInt(surahNumber);
  const verseNum = parseInt(verseNumber);
  if (isNaN(surahNum) || isNaN(verseNum)) notFound();

  const [ayah] = await getAyahBySurahAndVerse(surahNum, verseNum);
  if (!ayah) notFound();

  const { prev, next } = await getAdjacentAyahs(ayah.surahId, ayah.numberInSurah);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <CreativeWorkJsonLd
        name={`سورة ${ayah.surahNameAr} - الآية ${ayah.numberInSurah}`}
        text={ayah.textUthmani}
        author="SHK Islam"
        url={`${SITE_URL}/quran/${surahNum}/${verseNum}`}
      />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "القرآن الكريم", href: "/quran" },
            { label: ayah.surahNameAr, href: `/quran/${surahNum}` },
            { label: `الآية ${ayah.numberInSurah}` },
          ]}
        />
        <Link href={`/quran/${surahNum}`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="ml-2 size-4" />
            العودة إلى سورة {ayah.surahNameAr}
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-arabic text-2xl font-bold mb-1">
            سورة {ayah.surahNameAr}
          </h1>
          <p className="text-muted-foreground text-sm">
            {ayah.nameTranslation} — الآية {ayah.numberInSurah}
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div
              dir="rtl"
              className="font-quran text-2xl leading-loose text-center"
              style={{ lineHeight: "2.2" }}
            >
              {ayah.textUthmani}
              <span className="inline-flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-xs font-arabic font-semibold mx-2 align-middle">
                {ayah.numberInSurah}
              </span>
            </div>

            {ayah.textEn && (
              <div dir="ltr" className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">
                  English
                </p>
                <p className="text-sm leading-relaxed">{ayah.textEn}</p>
              </div>
            )}

            {ayah.tafsirText && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">
                  التفسير الميسر
                </p>
                <div
                  className="font-arabic text-sm leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: ayah.tafsirText }}
                />
              </div>
            )}

            <VerseDetailActions
              textUthmani={ayah.textUthmani}
              textEn={ayah.textEn}
              surahName={ayah.surahNameAr}
              verseNumber={ayah.numberInSurah}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          {prev ? (
            <Link href={`/quran/${surahNum}/${prev}`}>
              <Button variant="outline" size="sm">
                <ArrowRight className="ml-2 size-4" />
                الآية {prev}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/quran/${surahNum}/${next}`}>
              <Button variant="outline" size="sm">
                الآية {next}
                <ArrowLeft className="mr-2 size-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
