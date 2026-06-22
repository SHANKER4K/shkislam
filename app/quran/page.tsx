import type { Metadata } from "next";
import { getAllSurahs } from "@/src/lib/quran";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/src/components/breadcrumbs";

export const metadata: Metadata = {
  title: "القرآن الكريم",
  description:
    "تصفّح القرآن الكريم - 114 سورة مع التفسير الميسر والنصوص العثمانية.",
};

export default async function QuranPage() {
  const surahs = await getAllSurahs();

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "القرآن الكريم" }]} />
        <h1 className="font-arabic text-3xl font-bold mb-6 text-center">
          القرآن الكريم
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {surahs.map((surah) => (
            <Link key={surah.id} href={`/quran/${surah.number}`}>
              <Card className="card-hover hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-arabic font-semibold truncate">{surah.nameAr}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {surah.nameTranslation} • {surah.versesCount} آية
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
  );
}
