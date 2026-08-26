import type { Metadata } from "next";
import { getAllSurahs } from "@/lib/quran";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "القرآن الكريم",
  description:
    "تصفّح القرآن الكريم - 114 سورة مع التفسير الميسر والنصوص العثمانية.",
};

export default async function QuranPage() {
  const surahs = await getAllSurahs();

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs items={[{ label: "القرآن الكريم" }]} />

      <div className="mt-6 mb-8">
        <p className="text-xs text-muted-foreground font-medium mb-1 tabular-nums">١١٤ سورة</p>
        <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          القرآن الكريم
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {surahs.map((surah) => (
          <Link key={surah.id} href={`/quran/${surah.number}`}>
            <div className="bg-card rounded-lg p-4 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer flex items-center gap-3">
              <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-sm tabular-nums shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-arabic font-semibold truncate text-foreground">{surah.nameAr}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {surah.nameTranslation} • {surah.versesCount} آية
                </p>
              </div>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0",
                surah.revelationType === "Meccan"
                  ? "bg-[#EDF3EC] text-[#4A7C59]"
                  : "bg-[#E1F3FE] text-[#1F6C9F]"
              )}>
                {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
