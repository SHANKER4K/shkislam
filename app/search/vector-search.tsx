"use client";

import { useCallback, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import {
  COLLECTIONS,
  FILTER_SCHEMA,
  getSuggestions,
  buildFiltersPayload,
  type Collection,
} from "@/src/lib/vector-data";
import { VectorResults, type VectorHit } from "./vector-results";

type Method = "dense" | "sparse" | "hybrid";

const METHOD_LABELS: Record<Method, string> = {
  dense: "Dense",
  sparse: "Sparse",
  hybrid: "Hybrid",
};

const COLLECTION_OPTIONS = COLLECTIONS.map((c) => ({ value: c, label: c }));

export function VectorSearchTool() {
  const [method, setMethod] = useState<Method>("hybrid");
  const [collection, setCollection] = useState<Collection>("quran");
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(10);
  const [pool, setPool] = useState(50);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [results, setResults] = useState<VectorHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    const filtersPayload = buildFiltersPayload(collection, filters);
    const start = performance.now();
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          collection,
          query_text: query,
          top_k: topK,
          pool,
          filters: filtersPayload,
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "فشل البحث");
      setResults(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setDuration(performance.now() - start);
      }
    }
  }, [method, collection, query, topK, pool, filters]);

  const schema = FILTER_SCHEMA[collection];

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "") delete next[key];
      else next[key] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="query-text">
              نص البحث
            </label>
            <Textarea
              id="query-text"
              dir="rtl"
              rows={2}
              placeholder="اكتب نص البحث هنا..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">نوع البحث</span>
            <Tabs value={method} onValueChange={(v) => setMethod(v as Method)}>
              <TabsList>
                {(Object.keys(METHOD_LABELS) as Method[]).map((m) => (
                  <TabsTrigger key={m} value={m}>
                    {METHOD_LABELS[m]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium">المجموعة</span>
              <Combobox
                value={collection}
                onValueChange={(v) => {
                  setCollection(v as Collection);
                  setFilters({});
                }}
                options={COLLECTION_OPTIONS}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="top-k">
                  top_k
                </label>
                <Input
                  id="top-k"
                  type="number"
                  min={1}
                  max={100}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                />
              </div>
              {method === "hybrid" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="pool">
                    pool
                  </label>
                  <Input
                    id="pool"
                    type="number"
                    min={1}
                    max={500}
                    value={pool}
                    onChange={(e) => setPool(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              الفلاتر ({Object.keys(schema).length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(schema).map(([key, kind]) => {
                const suggestions = getSuggestions(collection, key);
                return (
                  <div key={key} className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor={`filter-${key}`}
                    >
                      {key}
                    </label>
                    {suggestions.length > 0 ? (
                      <Combobox
                        value={filters[key] ?? ""}
                        onValueChange={(v) => setFilter(key, v)}
                        options={suggestions.map((s) => ({
                          value: s,
                          label: s,
                        }))}
                        placeholder={`اختر ${key}...`}
                      />
                    ) : (
                      <Input
                        id={`filter-${key}`}
                        dir={kind === "int" ? "ltr" : "rtl"}
                        type={kind === "int" ? "number" : "text"}
                        value={filters[key] ?? ""}
                        onChange={(e) => setFilter(key, e.target.value)}
                        placeholder={kind === "int" ? "رقم" : "نص"}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={run}
            disabled={loading || !query.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="ms-1 size-4 animate-spin" />
            ) : (
              <Search className="ms-1 size-4" />
            )}
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
