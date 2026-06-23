"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Check, ChevronDown, FileText, Link, Type } from "lucide-react";
import { toast } from "sonner";
import { stripDiacritics } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";

interface CopyButtonProps {
  text: string;
  citationText?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CopyButton({
  text,
  citationText,
  variant = "ghost",
  size = "sm",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async (content: string, label: string) => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      toast.success(`تم النسخ بنجاح — ${label}`);
      setOpen(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("فشل في النسخ");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button className={`${className} relative`} variant={variant} size={size}>
            {copied ? (
              <Check className="size-4" />
            ) : (
              <>
                <ChevronDown className="size-3 mr-1" />
                <Copy className="size-4" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleCopy(citationText || text, "بالتشكيل")}
        >
          <Type className="size-4 ml-2" />
          نسخ بالتشكيل
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleCopy(stripDiacritics(citationText || text), "نص بسيط")
          }
        >
          <FileText className="size-4 ml-2" />
          نسخ نص بسيط
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const sourceUrl =
              typeof window !== "undefined" ? window.location.href : "";
            handleCopy(
              `${citationText || text}\n\n— من موقع SHK Islam\n${sourceUrl}`,
              "مع المصدر",
            );
          }}
        >
          <Link className="size-4 ml-2" />
          نسخ مع المصدر
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
