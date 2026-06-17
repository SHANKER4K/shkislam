import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getThemeBySlug } from "@/src/lib/themes";
import { VerseCard } from "@/src/components/verse-card";
import { HadithCard } from "@/src/components/hadith-card";
import { ArrowRight, BookOpen, BookText } from "lucide-react";

interface ThemePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ThemePageProps) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) return { title: "الموضوع غير موجود | SHK Islam" };

  return {
    title: `${theme.nameAr} | SHK Islam`,
    description: theme.description || `${theme.nameAr} - مواضيع إسلامية`,
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/themes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 font-arabic"
        >
          <ArrowRight className="size-4 ml-1" />
          العودة للمواضيع
        </Link>

        <h1 className="text-3xl font-bold font-arabic mb-2">{theme.nameAr}</h1>
        <p className="text-lg text-muted-foreground font-arabic">
          {theme.nameEn}
        </p>
        {theme.description && (
          <p className="text-muted-foreground font-arabic mt-2">
            {theme.description}
          </p>
        )}
      </div>

      {/* Quranic Verses Section */}
      {theme.ayahs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="size-5 text-primary" />
            <h2 className="text-xl font-bold font-arabic">
              الآيات القرآنية ({theme.ayahs.length})
            </h2>
          </div>
          <div className="space-y-4">
            {theme.ayahs.map((ayah) => (
              <VerseCard
                ayahId={ayah.id}
                verseNumber={ayah.numberInSurah}
                textUthmani={ayah.textUthmani}
                surahName={ayah.surahName}
                surahNumber={ayah.surahNumber}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hadiths Section */}
      {theme.hadiths.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookText className="size-5 text-primary" />
            <h2 className="text-xl font-bold font-arabic">
              الأحاديث النبوية ({theme.hadiths.length})
            </h2>
          </div>
          <div className="space-y-4">
            {theme.hadiths.map((hadith) => (
              <HadithCard
                hadithId={hadith.id}
                number={hadith.hadithNumber}
                text={hadith.text}
                narrator={hadith.narrator}
                bookNameAr={hadith.bookNameAr}
                bookSlug={hadith.bookSlug}
                grade={hadith.grade}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {theme.ayahs.length === 0 && theme.hadiths.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-arabic">
              لا توجد نصوص مرتبط بهذا الموضوع حالياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
