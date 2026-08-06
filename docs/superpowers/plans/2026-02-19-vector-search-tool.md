# Vector Search Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `/search` page (quran+hadith `unifiedSearch`) with a vector-search tool querying the local FastAPI (`localhost:8000`) `dense_search` / `sparse_search` / `hybrid_search` endpoints through a Next.js proxy.

**Architecture:** Client form (method tabs + collection combobox + dynamic filters + top_k/pool) → `POST /api/search` proxy route → FastAPI `POST /{method}_search` with query params (`collection, query_text, top_k, pool, filters` as JSON string). Filter schema, combobox suggestion lists, and result display fields are hardcoded client-side in `src/lib/vector-data.ts`. No new npm dependencies (radix `react-popover` already present in node_modules; `cmdk` already used by `command.tsx`).

**Tech Stack:** Next.js 16 App Router (RTL), shadcn/ui (Tabs, Card, Button, Input, Textarea, Badge, Skeleton, Collapsible, Command+Popover), Bun (`bun test` for the one logic check).

## Global Constraints

- Copy `BOOKS_LIST` and `SUNNAH_BOOKS` verbatim from the FastAPI `server.py` the user pasted (Arabic titles, ~260 + ~130 entries) — they are data, not code.
- `@/src/lib/*` resolves to `src/lib/*`; `@/lib/utils` is `cn`. Use `@/src/lib/vector-data` imports in app code.
- All UI text in Arabic, RTL-first (`dir="rtl"`, `font-arabic` where Arabic is displayed).
- No test framework: one `bun test` file for the non-trivial logic (`vector-data.test.ts`). UI components verified via `bun run build` + `bun run lint`.
- FastAPI wire format (query params + JSON-string `filters`) is a documented assumption — verify against live server in Task 3; changing to form/body is a 1-line URL change.
- `strict: false` in tsconfig — `any`/loose casts acceptable.

---

### Task 1: Data + logic helpers (`src/lib/vector-data.ts` + test)

**Files:**
- Create: `src/lib/vector-data.ts`
- Test: `src/lib/vector-data.test.ts`

**Interfaces:**
- Produces: `COLLECTIONS` (array + `Collection` type), `FILTER_SCHEMA`, `HADITH_BOOKS`, `TAFSIR_BOOKS`, `SUNNAH_BOOKS`, `BOOKS_LIST`, `CATEGORIES_NAMES`, `getSuggestions(collection, key)`, `buildFiltersPayload(collection, raw)`, `buildSearchUrl(method, params)`, `DISPLAY_FIELDS[collection]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/vector-data.test.ts`:

```ts
import { expect, test } from "bun:test";
import { buildFiltersPayload, buildSearchUrl } from "./vector-data";

test("buildFiltersPayload drops unknown/empty values and coerces int keys", () => {
  expect(
    buildFiltersPayload("quran", { surah: "الفاتحة", surah_number: "7", bogus: "x", empty: "  " })
  ).toEqual({ surah: "الفاتحة", surah_number: 7 });
  expect(buildFiltersPayload("hadith", { book: "", grade: "صحيح" })).toEqual({ grade: "صحيح" });
});

test("buildSearchUrl sets params; pool only for hybrid; filters as JSON", () => {
  const hybrid = buildSearchUrl("hybrid", {
    collection: "quran",
    query_text: "نور",
    top_k: 5,
    pool: 50,
    filters: { surah_number: { gte: 2 } },
  });
  expect(hybrid).toContain("http://localhost:8000/hybrid_search");
  expect(hybrid).toContain("collection=quran");
  expect(hybrid).toContain("query_text=" + encodeURIComponent("نور"));
  expect(hybrid).toContain("top_k=5");
  expect(hybrid).toContain("pool=50");
  expect(hybrid).toContain("filters=" + encodeURIComponent(JSON.stringify({ surah_number: { gte: 2 } })));

  const dense = buildSearchUrl("dense", {
    collection: "hadith", query_text: "x", top_k: 10, pool: 50, filters: {},
  });
  expect(dense).not.toContain("pool=");
  expect(dense).not.toContain("filters=");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/lib/vector-data.test.ts`
Expected: FAIL — "Cannot find module './vector-data'"

- [ ] **Step 3: Write the implementation**

Create `src/lib/vector-data.ts`:

```ts
// Hardcoded from the FastAPI server (server.py). Single source of truth for
// filter schema, combobox suggestions, and result display fields.

export const COLLECTIONS = ["quran", "hadith", "tafsir", "books", "sunnah"] as const;
export type Collection = (typeof COLLECTIONS)[number];

// Allowed filter keys per collection with value type.
// "int" keys accept numbers, "str" keys accept strings. Multiple keys AND-combined.
export const FILTER_SCHEMA: Record<Collection, Record<string, "int" | "str">> = {
  quran: { surah_number: "int", surah: "str" },
  hadith: { book: "str", grade: "str" },
  tafsir: { surah_number: "int", surah: "str", ayah_number: "int" },
  books: {
    book_id: "int", book_name: "str", category_name: "str", all_authors: "str",
    author_death: "int", book_date: "int",
  },
  sunnah: {
    book_id: "int", book_name: "str", category_name: "str", all_authors: "str",
    author_death: "int", book_date: "int", athar_number: "int",
  },
};

export const HADITH_BOOKS = [
  "abudawud", "bukhari", "dehlawi", "ibnmajah", "malik",
  "nasai", "nawawi", "qudsi", "tirmidhi",
];

export const TAFSIR_BOOKS = ["saadi", "katheer", "moyassar", "tabary", "baghawy"];

export const CATEGORIES_NAMES = [
  "العقيدة", "كتب السنة", "العلل والسؤلات الحديثية", "التراجم والطبقات",
  "الفقه الحنبلي", "الرقائق والآداب والأذكار", "علوم الحديث", "شروح الحديث",
];

// Copy VERBATIM from server.py (user-provided): all ~260 Arabic titles.
export const BOOKS_LIST: string[] = [ /* <-- paste from server.py BOOKS_LIST */ ];

// Copy VERBATIM from server.py (user-provided): all ~130 Arabic titles.
export const SUNNAH_BOOKS: string[] = [ /* <-- paste from server.py SUNNAH_BOOKS */ ];

// Combobox suggestion options per (collection, filter key).
const SUGGESTIONS: Partial<Record<Collection, Record<string, string[]>>> = {
  hadith: { book: HADITH_BOOKS },
  books: { book_name: BOOKS_LIST, category_name: CATEGORIES_NAMES },
  sunnah: { book_name: SUNNAH_BOOKS, category_name: CATEGORIES_NAMES },
};

export function getSuggestions(collection: Collection, key: string): string[] {
  return SUGGESTIONS[collection]?.[key] ?? [];
}

// Payload fields worth showing per collection, in display order.
export const DISPLAY_FIELDS: Record<Collection, { key: string; label: string }[]> = {
  quran: [
    { key: "surah", label: "السورة" },
    { key: "ayah_number", label: "رقم الآية" },
  ],
  hadith: [
    { key: "book", label: "الكتاب" },
    { key: "hadith_number", label: "رقم الحديث" },
    { key: "grade", label: "الدرجة" },
  ],
  tafsir: [
    { key: "tafsir_book", label: "كتاب التفسير" },
    { key: "surah", label: "السورة" },
    { key: "ayah_number", label: "رقم الآية" },
    { key: "source", label: "المصدر" },
  ],
  books: [
    { key: "book_name", label: "الكتاب" },
    { key: "category_name", label: "التصنيف" },
    { key: "all_authors", label: "المؤلف" },
    { key: "page", label: "الصفحة" },
  ],
  sunnah: [
    { key: "book_name", label: "الكتاب" },
    { key: "category_name", label: "التصنيف" },
    { key: "all_authors", label: "المؤلف" },
    { key: "page", label: "الصفحة" },
  ],
};

// Drop unknown/empty filter values; coerce int keys to numbers.
export function buildFiltersPayload(
  collection: Collection,
  raw: Record<string, string>
): Record<string, string | number> {
  const schema = FILTER_SCHEMA[collection];
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!(key in schema) || value.trim() === "") continue;
    out[key] = schema[key] === "int" ? Number(value) : value.trim();
  }
  return out;
}

// FastAPI URL: query params, pool only for hybrid, filters as JSON string.
export function buildSearchUrl(
  method: "dense" | "sparse" | "hybrid",
  params: {
    collection: Collection;
    query_text: string;
    top_k: number;
    pool: number;
    filters: Record<string, unknown>;
  }
): string {
  const url = new URL(`http://localhost:8000/${method}_search`);
  url.searchParams.set("collection", params.collection);
  url.searchParams.set("query_text", params.query_text);
  url.searchParams.set("top_k", String(params.top_k));
  if (method === "hybrid") url.searchParams.set("pool", String(params.pool));
  if (Object.keys(params.filters).length > 0) {
    url.searchParams.set("filters", JSON.stringify(params.filters));
  }
  return url.toString();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/lib/vector-data.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/vector-data.ts src/lib/vector-data.test.ts
git commit -m "feat: vector search data constants and helpers"
```

---

### Task 2: shadcn Popover + Combobox components

**Files:**
- Create: `components/ui/popover.tsx`
- Create: `components/ui/combobox.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`, `Command*` from `@/components/ui/command`.
- Produces: `Combobox` with props `{ value: string; onValueChange: (v: string) => void; options: {value: string; label: string}[]; placeholder?: string; emptyText?: string }`.

- [ ] **Step 1: Create `components/ui/popover.tsx`** (standard shadcn wrapper around `@radix-ui/react-popover`, already in node_modules — no npm install):

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
```

- [ ] **Step 2: Create `components/ui/combobox.tsx`** (shadcn Combobox pattern):

```tsx
"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  emptyText?: string
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "اختر...",
  emptyText = "لا توجد نتائج.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? selected.label : value || placeholder}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="بحث..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "me-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 3: Verify build + lint**

Run: `bun run build` and `bun run lint`
Expected: No errors referencing popover/combobox. (`bun run build` may fail on unrelated pre-existing issues — if so, lint the changed files only.)

- [ ] **Step 4: Commit**

```bash
git add components/ui/popover.tsx components/ui/combobox.tsx
git commit -m "feat: add shadcn popover and combobox components"
```

---

### Task 3: Proxy route (`app/api/search/route.ts`)

**Files:**
- Modify: `app/api/search/route.ts` (full replace)

**Interfaces:**
- Consumes: `buildSearchUrl` from `@/src/lib/vector-data`.
- Produces: `POST /api/search` accepting JSON `{ method: "dense"|"sparse"|"hybrid", collection, query_text, top_k?, pool?, filters? }` → `{ results, method, collection, top_k, pool, filters }` or `{ error }` with 400/502.

- [ ] **Step 1: Write the implementation** (replaces the old GET `unifiedSearch` handler — its only caller, `app/search/search-results.tsx`, is deleted in Task 6):

```ts
import { NextRequest, NextResponse } from "next/server";
import { buildSearchUrl } from "@/src/lib/vector-data";

export const maxDuration = 20;

const METHODS = ["dense", "sparse", "hybrid"] as const;
type Method = (typeof METHODS)[number];
const COLLECTIONS = ["quran", "hadith", "tafsir", "books", "sunnah"] as const;
type Collection = (typeof COLLECTIONS)[number];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const { method, collection, query_text, top_k, pool, filters } =
    (body ?? {}) as Record<string, unknown>;

  if (!METHODS.includes(method as Method)) {
    return NextResponse.json(
      { error: "method must be dense|sparse|hybrid" },
      { status: 400 }
    );
  }
  if (!COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json(
      { error: `collection must be one of ${COLLECTIONS.join(", ")}` },
      { status: 400 }
    );
  }
  if (typeof query_text !== "string" || !query_text.trim()) {
    return NextResponse.json({ error: "query_text is required" }, { status: 400 });
  }

  const topK = Math.min(100, Math.max(1, Number(top_k) || 10));
  const pool_ = Math.min(500, Math.max(1, Number(pool) || 50));
  const filters_ =
    filters && typeof filters === "object" && !Array.isArray(filters) ? filters : {};

  const url = buildSearchUrl(method as Method, {
    collection: collection as Collection,
    query_text: query_text.trim(),
    top_k: topK,
    pool: pool_,
    filters: filters_ as Record<string, unknown>,
  });

  try {
    const res = await fetch(url, { method: "POST", cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `FastAPI ${res.status}: ${text.slice(0, 500)}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json({
      results: data,
      method,
      collection,
      top_k: topK,
      pool: pool_,
      filters: filters_,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `cannot reach localhost:8000: ${msg}` },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 2: Manual wire-format check against live FastAPI** (requires the user's server running on port 8000)

Run: `curl -X POST "http://localhost:8000/dense_search?collection=quran&query_text=نور&top_k=3&filters=%7B%7D"`
Expected: JSON list of `{id, score, payload}`.
If FastAPI returns 422 (filters param rejected as dict), the server likely expects `filters` as form field or the params via `Body` — change the proxy to `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })` or send `filters` as a form field, per the live server's actual signature, and re-run. (No code test — verified by the user's running server.)

- [ ] **Step 3: Commit**

```bash
git add app/api/search/route.ts
git commit -m "feat: proxy /api/search to FastAPI vector search endpoints"
```

---

### Task 4: Results component (`app/search/vector-results.tsx`)

**Files:**
- Create: `app/search/vector-results.tsx`

**Interfaces:**
- Consumes: `DISPLAY_FIELDS`, `Collection` from `@/src/lib/vector-data`.
- Produces: `VectorResults` with props `{ collection: Collection; results: VectorHit[] | null; loading: boolean; error: string | null; duration: number | null; onRetry: () => void }`, exporting `VectorHit` type (`{ score?: number; payload?: Record<string, unknown>; [key: string]: unknown }`).

- [ ] **Step 1: Write the implementation**

```tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Loader2, ChevronDown, RefreshCw, Clock } from "lucide-react"
import { DISPLAY_FIELDS, type Collection } from "@/src/lib/vector-data"

export interface VectorHit {
  score?: number
  payload?: Record<string, unknown>
  [key: string]: unknown
}

interface VectorResultsProps {
  collection: Collection
  results: VectorHit[] | null
  loading: boolean
  error: string | null
  duration: number | null
  onRetry: () => void
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return ""
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
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
    )
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
    )
  }

  if (!results) return null

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          لم يتم العثور على نتائج
        </CardContent>
      </Card>
    )
  }

  const fields = DISPLAY_FIELDS[collection]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{results.length} نتيجة</span>
        {duration !== null && (
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {(duration / 1000).toFixed(2)} ثانية
          </span>
        )}
      </div>
      {results.map((hit, i) => {
        const payload = (hit.payload ?? {}) as Record<string, unknown>
        const shown = fields.filter(
          (f) => payload[f.key] !== undefined && payload[f.key] !== null
        )
        return (
          <Card key={i} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">النتيجة #{i + 1}</Badge>
                <span className="text-sm font-semibold">
                  Score:{" "}
                  {typeof hit.score === "number"
                    ? hit.score.toFixed(4)
                    : formatValue(hit.score)}
                </span>
              </div>
              {shown.length > 0 ? (
                <dl className="space-y-1 text-sm">
                  {shown.map((f) => (
                    <div key={f.key} className="flex gap-2">
                      <dt className="shrink-0 text-muted-foreground">{f.label}:</dt>
                      <dd className="font-arabic">{formatValue(payload[f.key])}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">لا توجد حقول معروفة</p>
              )}
              <Collapsible className="mt-3">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-muted-foreground"
                  >
                    <ChevronDown className="size-3" />
                    الحمولة الكاملة (JSON)
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
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify** — `bun run lint` on the file; visual check deferred to Task 6 (page integration).

- [ ] **Step 3: Commit**

```bash
git add app/search/vector-results.tsx
git commit -m "feat: vector search results component"
```

---

### Task 5: Form component (`app/search/vector-search.tsx`)

**Files:**
- Create: `app/search/vector-search.tsx`

**Interfaces:**
- Consumes: `COLLECTIONS`, `FILTER_SCHEMA`, `getSuggestions`, `buildFiltersPayload`, `Collection` from `@/src/lib/vector-data`; `Combobox` from `@/components/ui/combobox`; `VectorResults`, `VectorHit` from `./vector-results`.
- Produces: `VectorSearchTool` — zero-prop client component owning all form state and rendering results.

- [ ] **Step 1: Write the implementation**

```tsx
"use client"

import { useCallback, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Combobox } from "@/components/ui/combobox"
import {
  COLLECTIONS,
  FILTER_SCHEMA,
  getSuggestions,
  buildFiltersPayload,
  type Collection,
} from "@/src/lib/vector-data"
import { VectorResults, type VectorHit } from "./vector-results"

type Method = "dense" | "sparse" | "hybrid"

const METHOD_LABELS: Record<Method, string> = {
  dense: "Dense",
  sparse: "Sparse",
  hybrid: "Hybrid",
}

const COLLECTION_OPTIONS = COLLECTIONS.map((c) => ({ value: c, label: c }))

export function VectorSearchTool() {
  const [method, setMethod] = useState<Method>("hybrid")
  const [collection, setCollection] = useState<Collection>("quran")
  const [query, setQuery] = useState("")
  const [topK, setTopK] = useState(10)
  const [pool, setPool] = useState(50)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [results, setResults] = useState<VectorHit[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    const filtersPayload = buildFiltersPayload(collection, filters)
    const start = performance.now()
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
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setResults(Array.isArray(data.results) ? data.results : [])
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "فشل البحث")
      setResults(null)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        setDuration(performance.now() - start)
      }
    }
  }, [method, collection, query, topK, pool, filters])

  const schema = FILTER_SCHEMA[collection]

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (value === "") delete next[key]
      else next[key] = value
      return next
    })
  }

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
                  setCollection(v as Collection)
                  setFilters({})
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
                const suggestions = getSuggestions(collection, key)
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium" htmlFor={`filter-${key}`}>
                      {key}
                    </label>
                    {suggestions.length > 0 ? (
                      <Combobox
                        value={filters[key] ?? ""}
                        onValueChange={(v) => setFilter(key, v)}
                        options={suggestions.map((s) => ({ value: s, label: s }))}
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
                )
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
  )
}
```

- [ ] **Step 2: Verify** — `bun run lint` on the file.

- [ ] **Step 3: Commit**

```bash
git add app/search/vector-search.tsx
git commit -m "feat: vector search form with method tabs and filters"
```

---

### Task 6: Rebuild page + delete old search UI

**Files:**
- Modify: `app/search/page.tsx` (full replace)
- Delete: `app/search/search-results.tsx`
- Delete: `src/components/global-search-bar.tsx`

**Interfaces:**
- Consumes: `VectorSearchTool` from `./vector-search`.

- [ ] **Step 1: Replace `app/search/page.tsx`** (server component — keeps `metadata`, renders the client tool):

```tsx
import type { Metadata } from "next";
import { VectorSearchTool } from "./vector-search";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">البحث المتجه</h1>
        <VectorSearchTool />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Delete old files**

```bash
git rm app/search/search-results.tsx src/components/global-search-bar.tsx
```

- [ ] **Step 3: Verify**

Run: `bun run build` (if the build fails on pre-existing unrelated errors, run `bun run lint` and confirm only expected files are flagged) — then start `bun run dev`, open `/search`, and manually check: tabs switch, collection combobox swaps filter fields, filters combobox (hadith/book) lists suggestions, submitting renders result cards with score + payload fields + raw JSON toggle, empty query disables the button.

- [ ] **Step 4: Commit**

```bash
git add app/search/page.tsx
git commit -m "feat: replace search page with vector search tool"
```
