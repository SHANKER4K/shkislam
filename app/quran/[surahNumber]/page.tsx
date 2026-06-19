import type { Metadata } from "next";
import { getSurahByNumber, getAyahsBySurahNumber } from "@/src/lib/quran";
import { VerseCard } from "@/src/components/verse-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { SITE_URL, SITE_NAME } from "@/src/lib/seo";

interface SurahPageProps {
  params: Promise<{ surahNumber: string }>;
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber);
  if (isNaN(num) || num < 1 || num > 114) return { title: "سورة غير موجودة" };

  const [surah] = await getSurahByNumber(num);
  if (!surah) return { title: "سورة غير موجودة" };

  return {
    title: `${surah.nameAr} - القرآن الكريم`,
    description: `${surah.nameTranslation} - ${surah.versesCount} آية - ${surah.revelationType === "Meccan" ? "مكية" : "مدنية"}`,
    openGraph: {
      title: `${surah.nameAr} - القرآن الكريم | ${SITE_NAME}`,
      description: `${surah.nameTranslation} - ${surah.versesCount} آية`,
      url: `${SITE_URL}/quran/${surah.number}`,
    },
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber);

  if (isNaN(num) || num < 1 || num > 114) {
    notFound();
  }

  const [surah] = await getSurahByNumber(num);
  if (!surah) notFound();

  const ayahs = await getAyahsBySurahNumber(num);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "القرآن الكريم", href: "/quran" },
            { label: surah.nameAr },
          ]}
        />
        <Link href="/quran">
          <Button variant="ghost" size="sm">
            <ArrowRight className="ml-2 size-4" />
            العودة إلى فهرس السور
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-arabic text-3xl font-bold mb-2">{surah.nameAr}</h1>
        <p className="text-muted-foreground">
          {surah.nameTranslation} • {surah.versesCount} آية •{" "}
          {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {ayahs.map((ayah) => (
          <VerseCard
            ayahId={ayah.id}
            verseNumber={ayah.numberInSurah}
            textUthmani={ayah.textUthmani}
            tafsirText={ayah.tafsirText}
            surahName={surah.nameAr}
            surahNumber={surah.number}
          />
        ))}
      </div>
    </main>
  );
}
