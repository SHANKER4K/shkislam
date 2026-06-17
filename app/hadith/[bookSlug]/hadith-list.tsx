"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HadithCard } from "@/src/components/hadith-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Hadith {
  id: number;
  number: number;
  narrator: string | null;
  text: string;
  grade: string;
  sharh: string | null;
  bookNameAr: string;
  bookSlug: string;
  chapterNameAr: string;
  chapterOrder: number;
}

interface HadithListProps {
  bookSlug: string;
  chapterOrder: number;
}

export function HadithList({ bookSlug, chapterOrder }: HadithListProps) {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHadiths() {
      try {
        const res = await fetch(
          `/api/hadith?book=${bookSlug}&chapter=${chapterOrder}`,
        );
        const data = await res.json();
        setHadiths(data);
      } catch (error) {
        console.error("Failed to fetch hadiths:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHadiths();
  }, [bookSlug, chapterOrder]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hadiths.map((hadith) => (
        <HadithCard
          hadithId={hadith.id}
          number={hadith.number}
          text={hadith.text}
          narrator={hadith.narrator}
          bookNameAr={hadith.bookNameAr}
          bookSlug={hadith.bookSlug}
          grade={hadith.grade}
          sharh={hadith.sharh}
        />
      ))}
    </div>
  );
}
