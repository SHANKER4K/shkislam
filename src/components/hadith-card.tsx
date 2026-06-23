"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Image } from "lucide-react";
import { CopyButton } from "./copy-button";
import { ExportModal } from "./export-modal";
import { formatHadithCitation } from "@/src/lib/citation";
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
}: HadithCardProps) {
  const [showSharh, setShowSharh] = useState(false);

  const citationText = formatHadithCitation(text, bookNameAr, number, narrator);

  const gradeColor =
    grade === "Sahih"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : grade === "Hasan"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  // ponytail: grade dot indicator — pure CSS, no icon dep
  const gradeDot =
    grade === "Sahih"
      ? "bg-green-500"
      : grade === "Hasan"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {bookNameAr}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              حديث رقم {number}
            </Badge>
            <Badge
              className={`text-xs ${gradeColor} flex items-center gap-1.5`}
            >
              <span className={`size-1.5 rounded-full ${gradeDot}`} />
              {grade === "Sahih" ? "صحيح" : grade === "Hasan" ? "حسن" : "ضعيف"}
            </Badge>
          </div>
          <div className="flex items-center">
            <ExportModal
              text={matn || text}
              source={`${bookNameAr} - حديث رقم ${number}`}
              type="hadith"
            >
              <Button variant="ghost" size="sm">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="size-4" />
              </Button>
            </ExportModal>
            <CopyButton text={text} citationText={citationText} />
          </div>
        </div>
        <Link
          className=""
          key={hadithId}
          href={`/hadith/${bookSlug}/${hadithId}`}
        >
          <div className="font-arabic leading-relaxed text-foreground text-base mb-2">
            {sanad && <span className="text-muted-foreground">{sanad} </span>}
            <strong>{matn || text}</strong>
          </div>
        </Link>

        {narrator && (
          <div className="text-sm text-muted-foreground mt-2">
            <span className="font-semibold">الراوي:</span> {narrator}
          </div>
        )}

        {sharh && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSharh(!showSharh)}
              className="text-muted-foreground hover:text-foreground"
            >
              الشرح
              {showSharh ? (
                <ChevronUp className="mr-1 size-4" />
              ) : (
                <ChevronDown className="mr-1 size-4" />
              )}
            </Button>

            {showSharh && (
              <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
                {sharh}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
