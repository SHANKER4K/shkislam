"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Plus, RefreshCw } from "lucide-react";

import { useAuth, useSession } from "@better-auth-ui/react";
import type { AppAuthClient } from "@/lib/auth-client";
import { listKeyProviders } from "@/lib/api-keys";
import { PROVIDERS, providerLabel } from "@/lib/provider-meta";
import { ApiKeyGate } from "@/components/api-key-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChefStatus = "unknown" | "present" | "missing" | "no-key-needed";

export default function ApiKeysSettingsPage() {
  const { authClient } = useAuth<AppAuthClient>();
  const { data: session } = useSession(authClient);
  const userId = session?.user?.id;

  const [statuses, setStatuses] = useState<Record<string, ChefStatus>>({});
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState<{
    open: boolean;
    mode: "add" | "update";
    provider: string;
  }>({ open: false, mode: "add", provider: "" });

  const refresh = async () => {
    setLoading(true);
    try {
      const providers = await listKeyProviders();
      const next: Record<string, ChefStatus> = {};
      for (const chef of Object.keys(PROVIDERS)) {
        const meta = (PROVIDERS as Record<string, { requiresKey?: boolean }>)[chef];
        if (meta?.requiresKey === false) {
          next[chef] = "no-key-needed";
        } else {
          next[chef] = providers.includes(chef) ? "present" : "missing";
        }
      }
      setStatuses(next);
    } catch {
      toast.error("تعذّر تحميل المفاتيح");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    refresh();
  }, [userId]);

  function openGate(provider: string, mode: "add" | "update") {
    setGate({ open: true, mode, provider });
  }

  if (!userId) {
    return (
      <div className="p-6 text-sm text-muted-foreground" dir="rtl">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">مفتاح API KEY</h1>
        <p className="text-sm text-muted-foreground">
          أضف مفاتيحك الخاصة للمزودين الذين تريد استخدامهم. تُحفظ المفاتيح
          مشفّرة ولا تُعرض مرة أخرى.
        </p>
      </header>

      <div className="grid gap-3">
        {Object.keys(PROVIDERS).map((chef) => {
          const status = statuses[chef] ?? "unknown";
          const meta = (PROVIDERS as Record<string, { label?: string; docsUrl?: string | null; requiresKey?: boolean }>)[chef];
          const label = meta?.label ?? providerLabel(chef);

          return (
            <Card key={chef}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <KeyRound className="size-4 stroke-[1.5]" />
                    {label}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {status === "present" && "تم إعداد المفتاح"}
                    {status === "missing" && "لا يوجد مفتاح بعد"}
                    {status === "no-key-needed" && "لا يحتاج مفتاح"}
                    {status === "unknown" && "..."}
                    {meta?.docsUrl && (
                      <>
                        {" · "}
                        <a
                          href={meta.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-foreground"
                        >
                          احصل على مفتاح
                        </a>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="shrink-0">
                  {status === "no-key-needed" ? (
                    <Button variant="ghost" disabled>
                      —
                    </Button>
                  ) : status === "present" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGate(chef, "update")}
                      disabled={loading}
                    >
                      <RefreshCw className="size-3.5" />
                      تحديث
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => openGate(chef, "add")}
                      disabled={loading}
                    >
                      <Plus className="size-3.5" />
                      إضافة
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {userId && gate.provider && (
        <ApiKeyGate
          mode={gate.mode}
          provider={gate.provider}
          open={gate.open}
          onOpenChange={(o) => setGate((g) => ({ ...g, open: o }))}
          onSaved={() => refresh()}
        />
      )}
    </div>
  );
}
