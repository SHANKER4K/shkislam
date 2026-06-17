"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/src/components/copy-button";
import { ExportModal } from "@/src/components/export-modal";
import { formatVerseCitation } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";
import { Image } from "lucide-react";

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
  const citationAr = formatVerseCitation(textUthmani, surahName, verseNumber);
  const citationEn = textEn
    ? `${textEn}\n\n(${surahName} - Verse ${verseNumber})`
    : null;

  const handleCopyEn = async () => {
    if (!citationEn) return;
    const ok = await copyToClipboard(citationEn);
    if (ok) {
      setCopiedEn(true);
      toast.success("تم النسخ بنجاح — English");
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      toast.error("فشل في النسخ");
    }
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      <CopyButton text={textUthmani} citationText={citationAr} />
      {citationEn && (
        <Button variant="ghost" size="sm" onClick={handleCopyEn}>
          {copiedEn ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span className="mr-1">English</span>
        </Button>
      )}
      <ExportModal
        text={citationAr}
        source={`${surahName} - الآية ${verseNumber}`}
        type="ayah"
      >
        <Button variant="ghost" size="sm">
          <Image className="size-4" />
        </Button>
      </ExportModal>
    </div>
  );
}
