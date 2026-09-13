"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, ExternalLink, Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { addKey, updateKey } from "@/lib/api-keys";
import { PROVIDERS, providerLabel } from "@/lib/provider-meta";

export type ApiKeyGateProps = {
  mode: "add" | "update";
  userId: string;
  provider: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export function ApiKeyGate({
  mode,
  userId,
  provider,
  open,
  onOpenChange,
  onSaved,
}: ApiKeyGateProps) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  const meta = (PROVIDERS as Record<string, { label?: string; docsUrl?: string | null }>)[provider];
  const label = meta?.label ?? providerLabel(provider);
  const docsUrl = meta?.docsUrl;

  async function handleSave() {
    if (!value.trim()) {
      toast.error("أدخل المفتاح");
      return;
    }
    setPending(true);
    try {
      if (mode === "add") {
        await addKey(userId, provider, value.trim());
        toast.success("تم حفظ المفتاح");
      } else {
        try {
          await updateKey(userId, provider, value.trim());
          toast.success("تم تحديث المفتاح");
        } catch (e) {
          if (e instanceof Error && e.message === "NOT_FOUND") {
            await addKey(userId, provider, value.trim());
            toast.success("تم حفظ المفتاح");
          } else {
            throw e;
          }
        }
      }
      setValue("");
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast.error("فشل الحفظ، حاول مرة أخرى");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            {mode === "add" ? "أضف مفتاح API" : "حدّث مفتاح API"}
          </DialogTitle>
          <DialogDescription>
            للمزود: <span className="font-semibold">{label}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label htmlFor="api-key-input">المفتاح</Label>
          <div className="relative">
            <Input
              id="api-key-input"
              type={show ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-..."
              className="pe-10"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={show ? "إخفاء" : "إظهار"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {docsUrl && (
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3" />
              احصل على المفتاح من هنا
            </a>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={pending || !value.trim()}>
            {pending ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
