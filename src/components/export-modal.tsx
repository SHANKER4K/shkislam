"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { templates } from "@/src/lib/export-templates";

interface ExportModalProps {
  text: string;
  source: string;
  type: "ayah" | "hadith";
  children: React.ReactNode;
}

export function ExportModal({ text, source, type, children }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (slug: string) => {
    setSelectedTemplate(slug);
    setGenerating(true);
    setImageBlob(null);
    setImageUrl(null);
    setCopied(false);

    try {
      const response = await fetch("/api/export-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source, type, templateSlug: slug }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      setImageBlob(blob);
      setImageUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Export error:", error);
      toast.error("فشل في إنشاء الصورة");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!imageBlob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": imageBlob }),
      ]);
      setCopied(true);
      toast.success("تم النسخ إلى الحافظة");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("فشل النسخ");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(null);
    setImageBlob(null);
    setImageUrl(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<span />}>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تصدير كصورة</DialogTitle>
        </DialogHeader>

        {!imageUrl ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">اختر التصميم:</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {templates.map((template) => (
                <Card
                  key={template.slug}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.slug
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleGenerate(template.slug)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      {generating && selectedTemplate === template.slug ? (
                        <Loader2 className="size-8 text-muted-foreground animate-spin" />
                      ) : (
                        <Image className="size-8 text-muted-foreground" /> // eslint-disable-line jsx-a11y/alt-text
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{template.nameAr}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.nameEn}
                      </div>
                    </div>
                    {selectedTemplate === template.slug && (
                      <Badge className="mt-2 w-full justify-center">محدد</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="النتيجة"
                className="w-full rounded-lg border"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setImageBlob(null); setImageUrl(null); setSelectedTemplate(null); setCopied(false); }}>
                تغيير التصميم
              </Button>
              <Button onClick={handleCopy} disabled={copied}>
                {copied ? (
                  <Check className="size-4 ml-2" />
                ) : (
                  <Copy className="size-4 ml-2" />
                )}
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
