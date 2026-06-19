"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Image } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/src/components/copy-button";
import { ExportModal } from "@/src/components/export-modal";
import { formatVerseCitation } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";

interface VerseDetailActionsProps {
  textUthmani: string;
  textEn: string | null;
  surahName: string;
  verseNumber: number;
}

export function VerseDetailActions({
  textUthmani,
  textEn,
  surahName,
  verseNumber,
}: VerseDetailActionsProps) {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const citationAr = formatVerseCitation(textUthmani, surahName, verseNumber);

  const handleCopyEn = async () => {
    if (!textEn) return;
    const citation = `${textEn}\n\n(${surahName} - Verse ${verseNumber})`;
    const ok = await copyToClipboard(citation);
    if (ok) {
      setCopiedEn(true);
      toast.success("تم النسخ بنجاح — English");
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      toast.error("فشل في النسخ");
    }
  };

  const handleCopyAll = async () => {
    const url = window.location.href;
    const parts = [citationAr];
    if (textEn) {
      parts.push(`${textEn}\n\n(${surahName} - Verse ${verseNumber})`);
    }
    parts.push(url);
    const ok = await copyToClipboard(parts.join("\n\n---\n\n"));
    if (ok) {
      setCopiedAll(true);
      toast.success("تم النسخ — عربي + إنجليزي + رابط");
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      toast.error("فشل في النسخ");
    }
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      <CopyButton text={textUthmani} citationText={citationAr} />
      {textEn && (
        <Button variant="ghost" size="sm" onClick={handleCopyEn}>
          {copiedEn ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span className="mr-1">English</span>
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleCopyAll}>
        {copiedAll ? <Check className="size-4" /> : <Copy className="size-4" />}
        <span className="mr-1">الكل</span>
      </Button>
      <ExportModal
        text={citationAr}
        source={`${surahName} - الآية ${verseNumber}`}
        type="ayah"
      >
        <Button variant="ghost" size="sm">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="size-4" />
        </Button>
      </ExportModal>
    </div>
  );
}
