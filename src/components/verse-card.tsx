"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Image } from "lucide-react";
import { CopyButton } from "./copy-button";
import { ExportModal } from "./export-modal";
import { formatVerseCitation } from "@/src/lib/citation";
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

  const citationText = formatVerseCitation(textUthmani, surahName, verseNumber);

  return (
    <Card key={ayahId} className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Link key={ayahId} href={`/quran/${surahNumber}/${verseNumber}`}>
              <div
                className="font-quran leading-loose text-foreground mb-3"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2" }}
              >
                {textUthmani}
                <span className="text-primary mx-2 font-arabic text-sm font-semibold">
                  ﴿{verseNumber}﴾
                </span>
              </div>
            </Link>

            {tafsirText && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTafsir(!showTafsir)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  التفسير الميسر
                  {showTafsir ? (
                    <ChevronUp className="mr-1 size-4" />
                  ) : (
                    <ChevronDown className="mr-1 size-4" />
                  )}
                </Button>

                {showTafsir && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
                    <div
                      dangerouslySetInnerHTML={{ __html: tafsirText }}
                      className="font-arabic [&_span.green]:text-green-600 [&_span.green]:dark:text-green-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <CopyButton text={textUthmani} citationText={citationText} />
          <ExportModal
            text={textUthmani}
            source={`${surahName} - الآية ${verseNumber}`}
            type="ayah"
          >
            <Button variant="ghost" size="sm">
              <Image className="size-4" />
            </Button>
          </ExportModal>
        </div>
      </CardContent>
    </Card>
  );
}
