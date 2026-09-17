"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSuggestions } from "@/lib/vector-data";
import { FILTER_SCHEMA, type Collection } from "@/lib/vector-search-config";

type Method = "dense" | "sparse" | "hybrid";

const METHOD_LABELS: Record<Method, string> = {
  hybrid: "متوازن",
  sparse: "مطابقة نصية",
  dense: "دلالي",
};

const FILTER_LABELS: Record<string, string> = {
  surah_number: "رقم السورة",
  surah: "السورة",
  book: "الكتاب",
  grade: "الدرجة",
  ayah_number: "رقم الآية",
  book_id: "معرّف الكتاب",
  book_name: "اسم الكتاب",
  category_name: "التصنيف",
  all_authors: "المؤلف",
  author_death: "وفاة المؤلف",
  book_date: "تاريخ الكتاب",
  athar_number: "رقم الأثر",
};

export function AdvancedSearchFilters({
  collection,
  filters,
  method,
  pool,
  topK,
  onFiltersChange,
  onMethodChange,
  onPoolChange,
  onTopKChange,
}: {
  collection: Collection;
  filters: Record<string, string>;
  method: Method;
  pool: number;
  topK: number;
  onFiltersChange: (filters: Record<string, string>) => void;
  onMethodChange: (method: Method) => void;
  onPoolChange: (pool: number) => void;
  onTopKChange: (topK: number) => void;
}) {
  const schema = FILTER_SCHEMA[collection];
  const setFilter = (key: string, value: string) => {
    const next = { ...filters };
    if (!value) delete next[key];
    else next[key] = value;
    onFiltersChange(next);
  };

  return (
    <Collapsible className="border-t pt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-0">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            بحث متقدم وتصفية النتائج
          </span>
          <ChevronDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-5">
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-sm font-medium">طريقة البحث</span>
            <Tabs value={method} onValueChange={(value) => onMethodChange(value as Method)}>
              <TabsList className="h-auto max-w-full flex-wrap">
                {(Object.keys(METHOD_LABELS) as Method[]).map((value) => (
                  <TabsTrigger key={value} value={value} className="min-h-8 px-3">
                    {METHOD_LABELS[value]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              عدد النتائج
              <Input
                type="number"
                min={1}
                max={100}
                value={topK}
                onChange={(event) => onTopKChange(Number(event.target.value))}
                dir="ltr"
              />
            </label>
            {method === "hybrid" && (
              <label className="space-y-2 text-sm font-medium">
                نطاق إعادة الترتيب
                <Input
                  type="number"
                  min={topK}
                  max={500}
                  value={pool}
                  onChange={(event) => onPoolChange(Number(event.target.value))}
                  dir="ltr"
                />
              </label>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(schema).map(([key, kind]) => {
              const suggestions = getSuggestions(collection, key);
              const disabled = ("book_name" in filters && key !== "book_name") ||
                ("category_name" in filters && key !== "category_name");

              return (
                <label key={key} className="space-y-2 text-sm font-medium">
                  {FILTER_LABELS[key] ?? key}
                  {suggestions.length > 0 ? (
                    <Combobox
                      value={filters[key] ?? ""}
                      onValueChange={(value) => setFilter(key, value)}
                      items={suggestions}
                    >
                      <ComboboxInput placeholder="الكل" showClear disabled={disabled} />
                      <ComboboxContent>
                        <ComboboxEmpty>لا توجد خيارات مطابقة</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  ) : (
                    <Input
                      type={kind === "int" ? "number" : "text"}
                      value={filters[key] ?? ""}
                      onChange={(event) => setFilter(key, event.target.value)}
                      placeholder={kind === "int" ? "أي رقم" : "الكل"}
                      dir={kind === "int" ? "ltr" : "rtl"}
                      disabled={disabled}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
