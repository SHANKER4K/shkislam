"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useReadingProgress } from "@/src/lib/reading-progress";
import { HadithCard } from "@/src/components/hadith-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface HadithData {
  id: number;
  number: number;
  narrator: string | null;
  text: string;
  grade: string;
  sanad: string | null;
  matn: string | null;
  sharh: string | null;
  bookNameAr: string;
  bookSlug: string;
}

interface ChapterReaderProps {
  bookSlug: string;
  chapterOrder: number;
  chapterNameAr: string;
  chapterNameEn: string;
  hadithCount: number;
  prevChapter: { order: number; nameAr: string } | null;
  nextChapter: { order: number; nameAr: string } | null;
}

export function ChapterReader({
  bookSlug,
  chapterOrder,
  chapterNameAr,
  chapterNameEn,
  hadithCount,
  prevChapter,
  nextChapter,
}: ChapterReaderProps) {
  const [hadiths, setHadiths] = useState<HadithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getChapterReadSet, markRead, getLastRead } = useReadingProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef(null);
  // scroll to hadith
  useEffect(() => {
    if (!loading && targetElementRef.current) {
      targetElementRef.current.scrollIntoView({
        behavior: "smooth", // Use 'auto' if you want an instant jump without animation
        block: "start", // Aligns the top of the element to the top of the screen
        inline: "center",
      });
    }
  }, [loading, currentIndex]); // Empty array means "run only once on page load"

  // Fetch hadiths for this chapter
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/hadith?book=${bookSlug}&chapter=${chapterOrder}`,
        );
        const data: HadithData[] = await res.json();
        if (cancelled) return;
        setHadiths(data);

        // Resume from last read, or first unread, or start at 0
        const readSet = getChapterReadSet(bookSlug, chapterOrder);
        const lastRead = getLastRead(bookSlug, chapterOrder);

        if (lastRead) {
          const idx = data.findIndex((h) => h.number === lastRead);
          if (idx !== -1) {
            // Find the first unread after last read
            let start = idx;
            for (let i = idx + 1; i < data.length; i++) {
              if (!readSet.has(data[i].number)) {
                start = i;
                break;
              }
            }
            setCurrentIndex(start);
          }
        } else {
          const firstUnread = data.findIndex((h) => !readSet.has(h.number));
          if (firstUnread !== -1) setCurrentIndex(firstUnread);
        }
      } catch (e) {
        console.error("Failed to load hadiths", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [bookSlug, chapterOrder]); // ponytail: AbortController overkill for one fetch

  // Navigate and mark previous as read
  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= hadiths.length) return;
      markRead(bookSlug, chapterOrder, hadiths[currentIndex].number);
      setCurrentIndex(index);
      containerRef.current?.focus();
    },
    [currentIndex, hadiths, bookSlug, chapterOrder, markRead],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " " || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex < hadiths.length - 1) goTo(currentIndex + 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex > 0) goTo(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, hadiths.length, goTo]);

  // Auto-mark as read after 2 seconds of viewing
  const viewedRef = useRef<number | null>(null);
  useEffect(() => {
    if (loading || hadiths.length === 0) return;
    const current = hadiths[currentIndex];
    if (!current) return;
    if (viewedRef.current === current.number) return;

    viewedRef.current = current.number;
    const timer = setTimeout(() => {
      markRead(bookSlug, chapterOrder, current.number);
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentIndex, loading, hadiths, bookSlug, chapterOrder, markRead]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (hadiths.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        لا توجد أحاديث في هذا الباب
      </div>
    );
  }

  const current = hadiths[currentIndex];
  const readSet = getChapterReadSet(bookSlug, chapterOrder);
  const readCount = readSet.size;
  const progressPct = hadithCount > 0 ? (readCount / hadithCount) * 100 : 0;
  const allRead = readCount >= hadithCount;

  return (
    <div tabIndex={-1} className="max-w-full mx-auto outline-none px-20">
      <h1
        ref={targetElementRef}
        className="font-arabic text-2xl font-bold mb-1"
      >
        {chapterNameAr}
      </h1>
      <p className="text-sm text-muted-foreground mb-4">{chapterNameEn}</p>
      {/* Current hadith */}
      {current && (
        <div key={current.id} className="scroll-mt-20">
          <HadithCard
            hadithId={current.id}
            number={current.number}
            text={current.text}
            narrator={current.narrator}
            bookNameAr={current.bookNameAr}
            bookSlug={current.bookSlug}
            grade={current.grade}
            sanad={current.sanad}
            matn={current.matn}
            sharh={current.sharh}
            chapterTitle={chapterNameAr}
            chapterOrder={chapterOrder}
          />
        </div>
      )}

      {/* Chapter header + progress */}
      <div className="text-center mb-8">
        <div className="w-full bg-muted rounded-full h-2 mb-2 mt-10 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {allRead ? (
            <span className="text-green-600 dark:text-green-400 inline-flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> تمت قراءة جميع الأحاديث
            </span>
          ) : (
            <>
              {readCount}/{hadithCount} مقروءة — {hadithCount - readCount} متبقي
            </>
          )}
        </p>
      </div>

      {/* Navigation counter */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronRight className="size-4 ml-1" />
          السابق
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums min-w-16 text-center">
          {currentIndex + 1} / {hadiths.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === hadiths.length - 1}
        >
          التالي
          <ChevronLeft className="size-4 mr-1" />
        </Button>
      </div>

      {/* Bottom navigation — chapter links */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        {prevChapter ? (
          <Link href={`/hadith/${bookSlug}/chapter/${prevChapter.order}`}>
            <Button variant="outline" size="sm">
              <ChevronRight className="size-4 ml-1" />
              {prevChapter.nameAr}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link href={`/hadith/${bookSlug}/chapter/${nextChapter.order}`}>
            <Button variant="outline" size="sm">
              {nextChapter.nameAr}
              <ChevronLeft className="size-4 mr-1" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
