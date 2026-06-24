"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useReadingProgress } from "@/src/lib/reading-progress";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
interface ChapterInfo {
  id: number;
  order: number;
  nameAr: string;
  nameEn: string;
  hadithCount: number;
}

interface ChapterCardsProps {
  bookSlug: string;
  chapters: ChapterInfo[];
}

export function ChapterCards({ bookSlug, chapters }: ChapterCardsProps) {
  const { getChapterReadSet } = useReadingProgress();

  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {chapters.map((chapter) => {
        const readSet = getChapterReadSet(bookSlug, chapter.order);
        const readCount = readSet.size;
        const remaining = Math.max(0, chapter.hadithCount - readCount);
        const pct =
          chapter.hadithCount > 0 ? (readCount / chapter.hadithCount) * 100 : 0;

        return (
          <Link
            key={chapter.id}
            href={`/hadith/${bookSlug}/chapter/${chapter.order}`}
            className="block"
          >
            <Card className="group hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                {/* Right: remaining count */}
                <div className="shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary tabular-nums">
                    {chapter.order}
                  </span>
                </div>

                {/* Center: chapter title */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-arabic text-base font-semibold truncate">
                    {chapter.nameAr}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {chapter.hadithCount}{" "}
                    {chapter.hadithCount > 10 ? "حديث" : "احاديث"}
                  </p>
                </div>
                <div className="group-hover:-translate-x-1 transition duration-300">
                  <ChevronLeft color="#77767b" />
                </div>
              </CardContent>
              {/* Bottom: progress bar */}
              <CardFooter>
                <div className="text-xs pl-5">
                  {chapter.hadithCount - remaining}/{chapter.hadithCount}
                </div>
                <Progress
                  value={100 - (remaining * 100) / chapter.hadithCount}
                />
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
