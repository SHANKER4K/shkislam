"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Share } from "lucide-react";
import { CopyButton } from "./copy-button";
import { ExportModal } from "./export-modal";
import { FavoriteButton } from "./favorite-button";
import { useFavorites, type FavoriteItem } from "@/lib/use-favorites";
import { formatHadithCitation } from "@/lib/citation";
import Link from "next/link";

interface HadithCardProps {
  hadithId: number;
  number: number;
  text: string;
  narrator?: string | null;
  bookNameAr: string;
  bookSlug: string;
  grade: string;
  sanad?: string | null;
  matn?: string | null;
  sharh?: string | null;
  chapterTitle?: string;
  chapterOrder?: number;
}

export function HadithCard({
  hadithId,
  number,
  text,
  narrator,
  bookNameAr,
  bookSlug,
  grade,
  sanad,
  matn,
  sharh,
  chapterTitle,
  chapterOrder,
}: HadithCardProps) {
  const [showSharh, setShowSharh] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const citationText = formatHadithCitation(text, bookNameAr, number, narrator);

  const gradeBadge =
    grade === "Sahih"
      ? { bg: "bg-[#EDF3EC]", text: "text-[#4A7C59]", dot: "bg-[#4A7C59]", label: "صحيح" }
      : grade === "Hasan"
        ? { bg: "bg-[#FBF3DB]", text: "text-[#8B6914]", dot: "bg-[#B4882E]", label: "حسن" }
        : { bg: "bg-[#FDEBEC]", text: "text-[#9B2C2C]", dot: "bg-[#C44B4B]", label: "ضعيف" };

  return (
    <div className="group relative bg-card rounded-xl p-5 shadow-none">
      {/* Top row: metadata */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
            {bookNameAr}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium tabular-nums">
            حديث رقم {number}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md ${gradeBadge.bg} ${gradeBadge.text} font-medium flex items-center gap-1.5`}>
            <span className={`size-1.5 rounded-full ${gradeBadge.dot}`} />
            {gradeBadge.label}
          </span>
        </div>
      </div>

      {/* Text */}
      <Link href={`/hadith/${bookSlug}/${hadithId}`}>
        <div className="font-arabic leading-relaxed text-foreground text-base mb-2 cursor-pointer hover:text-primary transition-colors duration-150">
          {sanad && <span className="text-muted-foreground">{sanad} </span>}
          <strong>{matn || text}</strong>
        </div>
      </Link>

      {narrator && (
        <div className="text-sm text-muted-foreground mt-2">
          <span className="font-medium">الراوي:</span> {narrator}
        </div>
      )}

      {/* Action bar — always visible mobile, hover desktop */}
      <div className="flex items-center gap-1 mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
        <FavoriteButton
          isFavorited={isFavorite(`hadith-${hadithId}`)}
          onToggle={() =>
            toggleFavorite({
              type: "hadith",
              hadithId,
              text,
              narrator: narrator || null,
              grade,
              bookNameAr,
              bookSlug,
              chapterTitle,
              chapterOrder,
            } as FavoriteItem)
          }
        />
        <CopyButton text={text} citationText={citationText} />
        <ExportModal
          text={matn || text}
          source={`${bookNameAr} - حديث رقم ${number}`}
          type="hadith"
        >
          <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
            <Share className="size-4 stroke-[1.5]" />
          </Button>
        </ExportModal>
        {sharh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSharh(!showSharh)}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            الشرح
            {showSharh ? (
              <ChevronUp className="size-4 stroke-[1.5]" />
            ) : (
              <ChevronDown className="size-4 stroke-[1.5]" />
            )}
          </Button>
        )}
      </div>

      {/* Sharh expand */}
      {sharh && showSharh && (
        <div className="mt-3 rounded-xl bg-background border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">
          {sharh}
        </div>
      )}
    </div>
  );
}
