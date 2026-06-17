import { getAyahBySurahAndVerse, getSurahByNumber } from "@/src/lib/quran";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { VerseDetailActions } from "./verse-detail-actions";

interface VerseDetailPageProps {
  params: Promise<{ surahNumber: string; verseNumber: string }>;
}

export default async function VerseDetailPage({ params }: VerseDetailPageProps) {
  const { surahNumber, verseNumber } = await params;
  const surahNum = parseInt(surahNumber);
  const verseNum = parseInt(verseNumber);
  if (isNaN(surahNum) || isNaN(verseNum)) notFound();

  const [ayah] = await getAyahBySurahAndVerse(surahNum, verseNum);
  if (!ayah) notFound();

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
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
              <span className="text-primary mx-2 font-arabic text-sm font-semibold">
                ﴿{ayah.numberInSurah}﴾
              </span>
            </div>

            {ayah.textEn && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">English</p>
                <p className="text-sm leading-relaxed">{ayah.textEn}</p>
              </div>
            )}

            {ayah.tafsirText && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">التفسير الميسر</p>
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
      </div>
    </main>
  );
}
