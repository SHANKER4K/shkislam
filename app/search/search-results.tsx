"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, X, BookMarked } from "lucide-react";
import { toast } from "sonner";
import {
  highlightText,
  formatVerseCitation,
  formatHadithCitation,
} from "@/src/lib/citation";
import { copyToClipboard } from "@/src/lib/clipboard";
import type { SearchResult } from "@/src/lib/search";

interface SearchResultsProps {
  query: string;
  type: string;
}

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
          <Link href={getResultHref(result)}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={result.type === "quran" ? "default" : "secondary"}
                >
                  {result.type === "quran" ? "قرآن" : "حديث"}
                </Badge>
                <span className="text-sm font-semibold">{result.title}</span>
                <span className="text-xs text-muted-foreground">
                  {result.subtitle}
                </span>
                {result.themeName && (
                  <Badge variant="outline" className="text-xs">
                    {result.themeName}
                  </Badge>
                )}
              </div>
              <div
                className="font-arabic text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayHtml }}
              />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchResults({ query, type }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"literal" | "thematic">("literal");
  const [activeTab, setActiveTab] = useState<"all" | "quran" | "hadith">("all");

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${type}&mode=${mode}`,
        );
        const data = await res.json();
        setResults(data);
      } catch {
        toast.error("فشل في البحث");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, type, mode]);

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
      return formatVerseCitation(
        result.text,
        result.surahName,
        result.verseNumber,
      );
    }
    if (result.type === "hadith" && result.bookNameAr && result.hadithNumber) {
      return formatHadithCitation(
        result.text,
        result.bookNameAr,
        result.hadithNumber,
        result.narrator,
      );
    }
    return result.text;
  }, []);

  const handleBulkCopy = useCallback(async () => {
    const selectedResults = results.filter((r) =>
      selectedIds.has(`${r.type}-${r.id}`),
    );
    if (selectedResults.length === 0) {
      toast.error("لم يتم تحديد أي عناصر");
      return;
    }
    const bulkText = selectedResults
      .map((r) => getCitationText(r))
      .join("\n\n---\n\n");
    const ok = await copyToClipboard(bulkText);
    if (ok) {
      toast.success(`تم نسخ ${selectedResults.length} عناصر بنجاح`);
      clearSelection();
    } else {
      toast.error("فشل في النسخ");
    }
  }, [selectedIds, results, getCitationText, clearSelection]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const curatedResults = results.filter((r) => r.isCurated);
  const regularResults = results.filter((r) => !r.isCurated);

  const filteredCurated =
    activeTab === "all"
      ? curatedResults
      : curatedResults.filter((r) => r.type === activeTab);
  const filteredRegular =
    activeTab === "all"
      ? regularResults
      : regularResults.filter((r) => r.type === activeTab);

  const quranCount = results.filter((r) => r.type === "quran").length;
  const hadithCount = results.filter((r) => r.type === "hadith").length;

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "all" | "quran" | "hadith")}
      >
        <TabsList>
          <TabsTrigger value="all">الكل ({results.length})</TabsTrigger>
          <TabsTrigger value="quran">القرآن ({quranCount})</TabsTrigger>
          <TabsTrigger value="hadith">الحديث ({hadithCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "literal" | "thematic")}
      >
        <TabsList>
          <TabsTrigger value="literal">بحث حرفي</TabsTrigger>
          <TabsTrigger value="thematic">بحث موضوعي</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredCurated.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" className="bg-primary">
              <BookMarked className="size-3 ml-1" />
              نتائج مُراجعة
            </Badge>
          </div>
          <div className="space-y-3">
            {filteredCurated.map((result) => {
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

      {filteredRegular.length > 0 && (
        <div>
          {filteredCurated.length > 0 && (
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              نتائج إضافية
            </h3>
          )}
          <div className="space-y-3">
            {filteredRegular.map((result) => {
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

      {filteredCurated.length === 0 &&
        filteredRegular.length === 0 &&
        !loading && (
          <div className="text-center py-12 text-muted-foreground">
            لم يتم العثور على نتائج
          </div>
        )}

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Card className="shadow-lg border">
            <CardContent className="p-3 flex items-center gap-4">
              <span className="text-sm font-semibold">
                {selectedIds.size} محدد
              </span>
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
