"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Loader2, ChevronDown, RefreshCw, Clock } from "lucide-react";
import { DISPLAY_FIELDS, type Collection } from "@/lib/vector-search-config";

export interface VectorHit {
  score?: number;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

interface VectorResultsProps {
  collection: Collection;
  results: VectorHit[] | null;
  loading: boolean;
  error: string | null;
  duration: number | null;
  onRetry: () => void;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

// Metadata fields that exist in the payload, as {key, label, value} rows.
function metadataRows(
  collection: Collection,
  payload: Record<string, unknown>,
) {
  return DISPLAY_FIELDS[collection]
    .filter((f) => payload[f.key] !== undefined && payload[f.key] !== null)
    .map((f) => ({ ...f, value: formatValue(payload[f.key]) }));
}

export function VectorResults({
  collection,
  results,
  loading,
  error,
  duration,
  onRetry,
}: VectorResultsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          جارٍ البحث...
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="ms-1 size-4" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          لم يتم العثور على نتائج
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {results.length} {results.length === 1 ? "نتيجة" : "نتائج"}
        </span>
        {duration !== null && (
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {(duration / 1000).toFixed(2)} ثانية
          </span>
        )}
      </div>
      {[...results]
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .map((hit, i) => {
          const payload = (hit.payload ?? {}) as Record<string, unknown>;
          const meta = metadataRows(collection, payload);
          const text = payload.text;
          return (
            <Card key={`${formatValue(payload.id)}-${i}`} className="rounded-xl shadow-none transition-colors hover:bg-muted/30">
              <CardContent className="p-4 sm:p-5">

                {/* The searched text */}
                {text !== undefined && text !== null && text !== "" ? (
                  <p dir="rtl" className="font-arabic text-lg leading-9 sm:text-xl">
                    {formatValue(text)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">لا يوجد نص</p>
                )}

                {/* Metadata as badges */}
                {meta.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {meta.map((m) => (
                      <Badge key={m.key} variant="outline">
                        {m.label}: {m.value}
                      </Badge>
                    ))}
                  </div>
                )}

                <Collapsible className="mt-3">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-muted-foreground"
                    >
                      <ChevronDown className="size-3" />
                      التفاصيل التقنية
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre
                      dir="ltr"
                      className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs leading-relaxed"
                    >
                      {JSON.stringify(hit, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
