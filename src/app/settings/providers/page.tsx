"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Boxes, KeyRound, Plus, RefreshCw, Trash2 } from "lucide-react";

import { useAuth, useSession } from "@better-auth-ui/react";
import type { AppAuthClient } from "@/lib/auth-client";
import {
  addCustomProvider,
  addModel,
  connectProvider,
  deleteConnection,
  listMyProviders,
  syncConnection,
  updateModel,
  type CatalogProvider,
  type MyProviders,
  type ProviderApiStyle,
  type ProviderConnection,
} from "@/lib/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const API_STYLES: { value: ProviderApiStyle; label: string }[] = [
  { value: "openai_compatible", label: "OpenAI-compatible" },
  { value: "anthropic_compatible", label: "Anthropic-compatible" },
];

export default function ProvidersSettingsPage() {
  const { authClient } = useAuth<AppAuthClient>();
  const { data: session } = useSession(authClient);
  const userId = session?.user?.id;

  const [data, setData] = useState<MyProviders | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: "builtin" | "custom";
    provider: CatalogProvider | null;
  }>({ open: false, mode: "builtin", provider: null });

  const refresh = async () => {
    setLoading(true);
    try {
      setData(await listMyProviders());
    } catch {
      toast.error("تعذّر تحميل المزودين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    refresh();
  }, [userId]);

  if (!userId) {
    return (
      <div className="p-6 text-sm text-muted-foreground" dir="rtl">
        جارٍ التحميل...
      </div>
    );
  }

  const connections = data?.connections ?? [];
  const catalog = data?.catalog ?? [];

  return (
    <div className="space-y-6 p-20" dir="rtl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Boxes className="size-6 stroke-[1.5]" />
          المزودون
        </h1>
        <p className="text-sm text-muted-foreground">
          اربط مزودي الذكاء الاصطناعي الذين تريد استخدامهم. تُحفظ المفاتيح
          مشفّرة ولا تُعرض مرة أخرى.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {catalog.map((provider) => {
          const connection = connections.find(
            (c) => c.providerId === provider.id,
          );
          return (
            <ProviderCard
              key={provider.id}
              provider={provider}
              connection={connection}
              loading={loading}
              onConnect={() =>
                setDialog({ open: true, mode: "builtin", provider })
              }
              onDisconnect={async () => {
                if (!connection) return;
                try {
                  await deleteConnection(connection.id);
                  toast.success("تم فصل المزود");
                  refresh();
                } catch {
                  toast.error("تعذّر فصل المزود");
                }
              }}
            />
          );
        })}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="size-4 stroke-[1.5]" />
                إضافة مزود مخصص
              </CardTitle>
              <CardDescription className="text-xs">
                أي واجهة متوافقة مع OpenAI أو Anthropic
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() =>
                setDialog({ open: true, mode: "custom", provider: null })
              }
            >
              <Plus className="size-3.5" />
              إضافة
            </Button>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">الاتصالات</h2>
        {connections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            لا توجد اتصالات بعد. اختر مزوداً من الأعلى للبدء.
          </p>
        ) : (
          connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onChanged={refresh}
            />
          ))
        )}
      </section>

      <ConnectDialog
        key={`${dialog.mode}-${dialog.provider?.id ?? "custom"}-${dialog.open}`}
        open={dialog.open}
        mode={dialog.mode}
        provider={dialog.provider}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        onSaved={refresh}
      />
    </div>
  );
}

function ProviderCard({
  provider,
  connection,
  loading,
  onConnect,
  onDisconnect,
}: {
  provider: CatalogProvider;
  connection: ProviderConnection | undefined;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div className="space-y-1 min-w-0">
          <CardTitle className="text-base flex items-center gap-2">
            <ProviderLogo provider={provider} />
            {provider.name}
          </CardTitle>
          <CardDescription className="text-xs flex items-center gap-2">
            {connection ? (
              <Badge variant="secondary">متصل</Badge>
            ) : (
              <Badge variant="outline">غير متصل</Badge>
            )}
            {connection?.hasKey && (
              <span className="inline-flex items-center gap-1">
                <KeyRound className="size-3" />
                مفتاح محفوظ
              </span>
            )}
            {provider.docsUrl && (
              <a
                href={provider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                احصل على مفتاح
              </a>
            )}
          </CardDescription>
        </div>
        <div className="shrink-0">
          {connection ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              disabled={loading}
            >
              <Trash2 className="size-3.5" />
              فصل
            </Button>
          ) : (
            <Button size="sm" onClick={onConnect} disabled={loading}>
              <Plus className="size-3.5" />
              اتصال
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function ProviderLogo({ provider }: { provider: CatalogProvider }) {
  if (provider.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={provider.logoUrl}
        alt=""
        className="size-5 shrink-0 rounded object-contain"
      />
    );
  }
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
      {provider.name[0]?.toUpperCase()}
    </span>
  );
}

function ConnectionCard({
  connection,
  onChanged,
}: {
  connection: ProviderConnection;
  onChanged: () => void;
}) {
  const [modelId, setModelId] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>, error: string) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } catch {
      toast.error(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          {connection.name}
          {connection.isCustom && (
            <Badge variant="outline" className="ms-2">
              مخصص
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs break-all" dir="ltr">
          {connection.baseUrl} · {connection.apiStyle}
          {connection.hasKey ? " · مفتاح محفوظ" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() =>
              run(async () => {
                const result = await syncConnection(connection.id);
                if (result.discovery_supported) {
                  toast.success(`تمت المزامنة (${result.models.length} نموذج)`);
                } else {
                  toast.info("المزود لا يدعم اكتشاف النماذج، أضفها يدوياً");
                }
              }, "تعذّرت المزامنة")
            }
          >
            <RefreshCw className="size-3.5" />
            مزامنة
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() =>
              run(async () => {
                await deleteConnection(connection.id);
                toast.success("تم حذف الاتصال");
              }, "تعذّر حذف الاتصال")
            }
          >
            <Trash2 className="size-3.5" />
            حذف
          </Button>
        </div>

        <div className="space-y-2">
          {connection.models.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              لا توجد نماذج. زامن أو أضف نموذجاً بالمعرّف.
            </p>
          ) : (
            connection.models.map((model) => (
              <div
                key={model.modelId}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate text-sm" dir="ltr">
                  {model.displayName ?? model.modelId}
                </span>
                <Switch
                  checked={model.enabled}
                  disabled={busy}
                  onCheckedChange={(enabled) =>
                    run(async () => {
                      await updateModel(connection.id, model.modelId, {
                        enabled,
                      });
                    }, "تعذّر تحديث النموذج")
                  }
                  aria-label={model.modelId}
                />
              </div>
            ))
          )}
        </div>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = modelId.trim();
            if (!value) return;
            run(async () => {
              await addModel(connection.id, value);
              setModelId("");
              toast.success("تمت إضافة النموذج");
            }, "تعذّرت إضافة النموذج");
          }}
        >
          <Input
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            placeholder="gpt-4o"
            dir="ltr"
            className="h-8"
          />
          <Button type="submit" variant="outline" size="sm" disabled={busy}>
            <Plus className="size-3.5" />
            إضافة نموذج
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ConnectDialog({
  open,
  mode,
  provider,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  mode: "builtin" | "custom";
  provider: CatalogProvider | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(provider?.name ?? "");
  const [baseUrl, setBaseUrl] = useState(provider?.defaultBaseUrl ?? "");
  const [apiStyle, setApiStyle] = useState<ProviderApiStyle>(
    provider?.apiStyle ?? "openai_compatible",
  );
  const [apiKey, setApiKey] = useState("");
  const [headersText, setHeadersText] = useState("");
  const [pending, setPending] = useState(false);

  const requiresKey =
    mode === "custom" ? true : (provider?.requiresKey ?? true);

  async function handleSubmit() {
    let extraHeaders: Record<string, string>;
    try {
      const parsed = headersText.trim() ? JSON.parse(headersText) : {};
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error("bad json");
      }
      extraHeaders = parsed as Record<string, string>;
    } catch {
      toast.error("ترويسات إضافية غير صالحة (JSON)");
      return;
    }

    setPending(true);
    try {
      if (mode === "custom") {
        if (!name.trim() || !baseUrl.trim()) {
          toast.error("أدخل الاسم ورابط الـ API");
          return;
        }
        await addCustomProvider({
          name: name.trim(),
          baseUrl: baseUrl.trim(),
          apiStyle,
          apiKey: apiKey.trim() || undefined,
          extraHeaders,
        });
      } else if (provider) {
        await connectProvider({
          providerId: provider.id,
          apiKey: apiKey.trim() || undefined,
          baseUrl: baseUrl.trim() || undefined,
          extraHeaders,
        });
      }
      toast.success("تم حفظ المزود");
      setApiKey("");
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(
        e instanceof Error && e.message
          ? e.message
          : "فشل الحفظ، حاول مرة أخرى",
      );
      // The connection row is saved before discovery runs, so refresh anyway.
      onSaved();
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
            {mode === "custom"
              ? "إضافة مزود مخصص"
              : `اتصال ${provider?.name ?? ""}`}
          </DialogTitle>
          <DialogDescription>
            أدخل البيانات ثم اضغط اتصال للتحقق من الرابط وجلب النماذج.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {mode === "custom" && (
            <div className="space-y-1.5">
              <Label htmlFor="provider-name">الاسم</Label>
              <Input
                id="provider-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My endpoint"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="provider-base-url">
              {mode === "custom" ? "رابط الـ API (base URL)" : "رابط الـ API"}
            </Label>
            <Input
              id="provider-base-url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              dir="ltr"
            />
          </div>

          {mode === "custom" && (
            <fieldset className="space-y-1.5">
              <legend className="text-sm font-medium">واجهة الـ API</legend>
              {API_STYLES.map((style) => (
                <label
                  key={style.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="api-style"
                    value={style.value}
                    checked={apiStyle === style.value}
                    onChange={() => setApiStyle(style.value)}
                  />
                  {style.label}
                </label>
              ))}
            </fieldset>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="provider-key">
              مفتاح API {requiresKey ? "" : "(اختياري)"}
            </Label>
            <Input
              id="provider-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="provider-headers">ترويسات إضافية (JSON)</Label>
            <Input
              id="provider-headers"
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              placeholder='{"X-Org": "acme"}'
              dir="ltr"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "جارٍ التحقق..." : "اتصال والمزامنة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
