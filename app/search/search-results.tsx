"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, X, BookMarked, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { highlightText, formatVerseCitation, formatHadithCitation } from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";
import type { SearchResult } from "@/src/lib/search";

interface SearchApiResponse {
  results: SearchResult[];
  total: number;
  offset: number;
  limit: number;
}

interface SearchResultsProps {
  query: string;
  initialType: string;
}

const PAGE_SIZE = 20;

function getResultHref(result: SearchResult): string {
  if (result.type === "quran" && result.surahNumber && result.verseNumber) {
    return `/quran/${result.surahNumber}/${result.verseNumber}`;
  }
  if (result.type === "hadith" && result.bookSlug) {
    return `/hadith/${result.bookSlug}/${result.id}`;
  }
  return "#";
}

function ResultCard({
  result,
  query,
  selected,
  onToggle,
}: {
  result: SearchResult;
  query: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const displayHtml = result.snippet || highlightText(result.text, query);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox
              checked={selected}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              aria-label={`تحديد ${result.title}`}
            />
          </div>
          <Link href={getResultHref(result)} className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={result.type === "quran" ? "default" : "secondary"}>
                {result.type === "quran" ? "قرآن" : "حديث"}
              </Badge>
              <span className="text-sm font-semibold">{result.title}</span>
              <span className="text-xs text-muted-foreground">{result.subtitle}</span>
              {result.themeName && (
                <Badge variant="outline" className="text-xs">{result.themeName}</Badge>
              )}
            </div>
            <div
              className="font-arabic text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchResults({ query, initialType }: SearchResultsProps) {
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"literal" | "thematic">("literal");
  const [activeTab, setActiveTab] = useState<"all" | "quran" | "hadith">(
    initialType as "all" | "quran" | "hadith"
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setVisibleCount(PAGE_SIZE);
    setSelectedIds(new Set());

    const startTime = performance.now();
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=all&mode=${mode}&limit=100`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchApiResponse = await res.json();
      setAllResults(data.results);
      setTotal(data.total);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("فشل في البحث");
      toast.error("فشل في البحث");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setDuration(performance.now() - startTime);
      }
    }
  }, [query, mode]);

  useEffect(() => {
    fetchResults();
    return () => abortRef.current?.abort();
  }, [fetchResults]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const getCitationText = useCallback((result: SearchResult): string => {
    if (result.type === "quran" && result.surahName && result.verseNumber) {
      return formatVerseCitation(result.text, result.surahName, result.verseNumber);
    }
    if (result.type === "hadith" && result.bookNameAr && result.hadithNumber) {
      return formatHadithCitation(result.text, result.bookNameAr, result.hadithNumber, result.narrator);
    }
    return result.text;
  }, []);

  const handleBulkCopy = useCallback(async () => {
    const selectedResults = allResults.filter((r) => selectedIds.has(`${r.type}-${r.id}`));
    if (selectedResults.length === 0) {
      toast.error("لم يتم تحديد أي عناصر");
      return;
    }
    const bulkText = selectedResults.map((r) => getCitationText(r)).join("\n\n---\n\n");
    const ok = await copyToClipboard(bulkText);
    if (ok) {
      toast.success(`تم نسخ ${selectedResults.length} عناصر بنجاح`);
      clearSelection();
    } else {
      toast.error("فشل في النسخ");
    }
  }, [selectedIds, allResults, getCitationText, clearSelection]);

  // Filter by active tab
  const filteredResults =
    activeTab === "all"
      ? allResults
      : allResults.filter((r) => r.type === activeTab);

  const curatedResults = filteredResults.filter((r) => r.isCurated);
  const regularResults = filteredResults.filter((r) => !r.isCurated);
  const showMore = filteredResults.length > visibleCount;

  const quranCount = allResults.filter((r) => r.type === "quran").length;
  const hadithCount = allResults.filter((r) => r.type === "hadith").length;

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Loader2 className="size-4 animate-spin" />
          جاري البحث...
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchResults}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs & stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as typeof activeTab); setVisibleCount(PAGE_SIZE); }}>
          <TabsList>
            <TabsTrigger value="all">الكل ({allResults.length})</TabsTrigger>
            <TabsTrigger value="quran">القرآن ({quranCount})</TabsTrigger>
            <TabsTrigger value="hadith">الحديث ({hadithCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        {duration !== null && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            {(duration / 1000).toFixed(2)} ثانية
          </span>
        )}
      </div>

      {/* Mode toggle */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList>
          <TabsTrigger value="literal">بحث حرفي</TabsTrigger>
          <TabsTrigger value="thematic">بحث موضوعي</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Curated results */}
      {curatedResults.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" className="bg-primary">
              <BookMarked className="size-3 ml-1" />
              نتائج مُراجعة
            </Badge>
          </div>
          <div className="space-y-3">
            {curatedResults.slice(0, visibleCount).map((result) => {
              const id = `${result.type}-${result.id}`;
              return (
                <ResultCard
                  key={id}
                  result={result}
                  query={query}
                  selected={selectedIds.has(id)}
                  onToggle={() => toggleSelection(id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Regular results */}
      {regularResults.length > 0 && (
        <div>
          {curatedResults.length > 0 && (
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">نتائج إضافية</h3>
          )}
          <div className="space-y-3">
            {regularResults.slice(0, Math.max(0, visibleCount - curatedResults.slice(0, visibleCount).length)).map((result) => {
              const id = `${result.type}-${result.id}`;
              return (
                <ResultCard
                  key={id}
                  result={result}
                  query={query}
                  selected={selectedIds.has(id)}
                  onToggle={() => toggleSelection(id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Load more */}
      {showMore && (
        <div className="text-center pt-2">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredResults.length))}
          >
            عرض المزيد ({filteredResults.length - visibleCount})
          </Button>
        </div>
      )}

      {/* Empty state */}
      {curatedResults.length === 0 && regularResults.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لم يتم العثور على نتائج
        </div>
      )}

      {/* Bulk copy bar */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-6 right-1/2 translate-x-1/2 w-fit z-50">
          <Card className="shadow-lg border">
            <CardContent className="p-3 flex items-center gap-4">
              <span className="text-sm font-semibold">{selectedIds.size} محدد</span>
              <Button size="sm" onClick={handleBulkCopy}>
                <Copy className="size-4 ml-1" />
                نسخ المحدد
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                <X className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
