"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/src/components/copy-button";
import { ExportModal } from "@/src/components/export-modal";
import { formatHadithCitation } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";
import { Image } from "lucide-react";

interface HadithDetailActionsProps {
  text: string;
  textEn: string | null;
  bookNameAr: string;
  hadithNumber: number;
  narrator: string | null;
}

export function HadithDetailActions({
  text,
  textEn,
  bookNameAr,
  hadithNumber,
  narrator,
}: HadithDetailActionsProps) {
  const [copiedEn, setCopiedEn] = useState(false);
  const citationAr = formatHadithCitation(text, bookNameAr, hadithNumber, narrator);
  const citationEn = textEn
    ? `${textEn}\n\n(${bookNameAr} - Hadith ${hadithNumber}${narrator ? `, Narrator: ${narrator}` : ""})`
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
      <CopyButton text={text} citationText={citationAr} />
      {citationEn && (
        <Button variant="ghost" size="sm" onClick={handleCopyEn}>
          {copiedEn ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span className="mr-1">English</span>
        </Button>
      )}
      <ExportModal
        text={citationAr}
        source={`${bookNameAr} - حديث رقم ${hadithNumber}`}
        type="hadith"
      >
        <Button variant="ghost" size="sm">
          <Image className="size-4" />
        </Button>
      </ExportModal>
    </div>
  );
}
