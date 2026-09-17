"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { BookOpenText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  COLLECTIONS,
  COLLECTION_LABELS,
  buildFiltersPayload,
  type Collection,
} from "@/lib/vector-search-config";
import { VectorResults, type VectorHit } from "./vector-results";

const AdvancedSearchFilters = dynamic(
  () =>
    import("./advanced-search-filters").then(
      (module) => module.AdvancedSearchFilters,
    ),
  { ssr: false },
);

type Method = "dense" | "sparse" | "hybrid";

export function VectorSearchTool() {
  const [method, setMethod] = useState<Method>("hybrid");
  const [collection, setCollection] = useState<Collection>("quran");
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(10);
  const [pool, setPool] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [results, setResults] = useState<VectorHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    if (!query.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          collection,
          query_text: query,
          top_k: topK,
          pool,
          filters: buildFiltersPayload(collection, filters),
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError(error instanceof Error ? error.message : "فشل البحث");
      setResults(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setDuration(performance.now() - start);
      }
    }
  }, [collection, filters, method, pool, query, topK]);

  return (
    <div className="space-y-8" dir="rtl">
      <Card className="rounded-xl shadow-none">
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="space-y-3">
            <label className="text-base font-semibold" htmlFor="query-text">
              ما الذي تبحث عنه؟
            </label>
            <Textarea
              id="query-text"
              dir="rtl"
              rows={3}
              placeholder="مثال: آيات عن الصبر، أو أحاديث في طلب العلم"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void run();
                }
              }}
              className="resize-y text-base leading-7"
            />
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium">ابحث في</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {COLLECTIONS.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={collection === item ? "default" : "outline"}
                  onClick={() => {
                    setCollection(item);
                    setFilters({});
                  }}
                  className="min-h-11 justify-start px-3 text-sm"
                >
                  <BookOpenText className="size-4" />
                  <span className="truncate">{COLLECTION_LABELS[item]}</span>
                </Button>
              ))}
            </div>
          </div>

          <AdvancedSearchFilters
            collection={collection}
            filters={filters}
            method={method}
            pool={pool}
            topK={topK}
            onFiltersChange={setFilters}
            onMethodChange={setMethod}
            onPoolChange={setPool}
            onTopKChange={setTopK}
          />

          <Button onClick={run} disabled={loading || !query.trim()} className="w-full sm:w-auto">
            <Search className="size-4" />
            بحث
          </Button>
        </CardContent>
      </Card>

      <VectorResults
        collection={collection}
        results={results}
        loading={loading}
        error={error}
        duration={duration}
        onRetry={run}
      />
    </div>
  );
}
