"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Share } from "lucide-react";
import { CopyButton } from "./copy-button";
import { ExportModal } from "./export-modal";
import { FavoriteButton } from "./favorite-button";
import { useFavorites, type FavoriteItem } from "@/lib/use-favorites";
import { formatVerseCitation } from "@/lib/citation";
import Link from "next/link";

interface VerseCardProps {
  ayahId: number;
  verseNumber: number;
  textUthmani: string;
  tafsirText?: string | null;
  surahName: string;
  surahNumber: number;
  fontSize?: number;
}

export function VerseCard({
  ayahId,
  verseNumber,
  textUthmani,
  tafsirText,
  surahName,
  surahNumber,
  fontSize = 28,
}: VerseCardProps) {
  const [showTafsir, setShowTafsir] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const citationText = formatVerseCitation(textUthmani, surahName, verseNumber);

  return (
    <div className="group relative py-5 border-b border-border last:border-b-0">
      <Link key={ayahId} href={`/quran/${surahNumber}/${verseNumber}`}>
        <div
          className="font-quran leading-[2] text-foreground cursor-pointer"
          style={{ fontSize: `${fontSize}px` }}
        >
          {textUthmani}
          <span className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-foreground text-xs font-bold tabular-nums mx-2 align-middle">
            {verseNumber}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-1 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
        <FavoriteButton
          isFavorited={isFavorite(`ayah-${surahNumber}-${verseNumber}`)}
          onToggle={() =>
            toggleFavorite({
              type: "ayah",
              surahNumber,
              verseNumber,
              textUthmani,
              surahNameAr: surahName,
            } as FavoriteItem)
          }
        />
        <CopyButton text={textUthmani} citationText={citationText} />
        <ExportModal
          text={textUthmani}
          source={`${surahName} - الآية ${verseNumber}`}
          type="ayah"
        >
          <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
            <Share className="size-4 stroke-[1.5]" />
          </Button>
        </ExportModal>
        {tafsirText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTafsir(!showTafsir)}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            التفسير الميسر
            {showTafsir ? (
              <ChevronUp className="size-4 stroke-[1.5]" />
            ) : (
              <ChevronDown className="size-4 stroke-[1.5]" />
            )}
          </Button>
        )}
      </div>

      {tafsirText && showTafsir && (
        <div className="mt-3 rounded-xl bg-card border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">
          <div
            dangerouslySetInnerHTML={{ __html: tafsirText }}
            className="font-arabic [&_span.green]:text-green-700 [&_span.green]:dark:text-green-400"
          />
        </div>
      )}
    </div>
  );
}
