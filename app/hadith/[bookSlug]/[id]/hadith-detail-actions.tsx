"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Image } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/src/components/copy-button";
import { ExportModal } from "@/src/components/export-modal";
import { formatHadithCitation } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";

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
  const [copiedAll, setCopiedAll] = useState(false);
  const citationAr = formatHadithCitation(text, bookNameAr, hadithNumber, narrator);

  const handleCopyEn = async () => {
    if (!textEn) return;
    const citation = `${textEn}\n\n(${bookNameAr} - Hadith ${hadithNumber}${narrator ? `, Narrator: ${narrator}` : ""})`;
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
      parts.push(`${textEn}\n\n(${bookNameAr} - Hadith ${hadithNumber})`);
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
      <CopyButton text={text} citationText={citationAr} />
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
        source={`${bookNameAr} - حديث رقم ${hadithNumber}`}
        type="hadith"
      >
        <Button variant="ghost" size="sm">
          <Image className="size-4" /> {/* eslint-disable-line jsx-a11y/alt-text */}
        </Button>
      </ExportModal>
    </div>
  );
}
