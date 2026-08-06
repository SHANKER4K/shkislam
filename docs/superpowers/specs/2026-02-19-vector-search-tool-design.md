# Vector Search Tool — Design

**Goal:** Replace the current `/search` page (quran+hadith `unifiedSearch`) with an embedding-vector search tool that queries the local Qdrant-backed FastAPI (`localhost:8000`) via `dense_search`, `sparse_search`, and `hybrid_search`.

**Architecture:** Next.js client page → Next.js `POST /api/search` proxy route → FastAPI on `localhost:8000` (`POST /{method}_search`, query params `collection, query_text, top_k, pool, filters`). Same proxy pattern the chat route already uses (`app/api/chat/route.ts` fetches `http://localhost:8000/chat`). All filter schema and combobox suggestion data hardcoded client-side (no HTTP for lists).

## Requirements

- Text query input.
- Method tabs: `hybrid` | `sparse` | `dense`. Selecting a tab shows that method's args.
- Collection selection (ComboBox) from 5 collections: `quran`, `hadith`, `tafsir`, `books`, `sunnah`.
- Per-collection filter fields derived from `FILTER_SCHEMA` (hardcoded). int keys → number input; book/category keys → ComboBox with suggestion lists; other str keys → free-text input. Multiple filters AND-combined.
- Method args: `top_k` (all methods, default 10); `pool` (hybrid only, default 50).
- Results: each card shows **score** + useful payload fields + a raw-payload toggle. Loading skeleton, empty state, error + retry.
- Delete `GlobalSearchBar` and old `SearchResults` (only used by the old page).

## FILTER_SCHEMA (hardcoded)

```
quran  -> surah_number (int), surah (str)
hadith -> book (str), grade (str)
tafsir -> surah_number (int), surah (str), ayah_number (int)
books  -> book_id (int), book_name (str), category_name (str), all_authors (str), author_death (int), book_date (int)
sunnah -> book_id (int), book_name (str), category_name (str), all_authors (str), author_death (int), book_date (int), athar_number (int)
```

## Result card payload fields (best-effort per collection)

Show any that exist in the payload; fall back to raw payload JSON so nothing is hidden:
- quran: surah, ayah_number
- hadith: book, hadith_number, grade
- tafsir: book (tafsir_book), surah, ayah_number, source
- books: book_name, category_name, author, page
- sunnah: book_name, category_name, author, page, source

## Files

- Create: `src/lib/vector-data.ts` — FILTER_SCHEMA, collections, HADITH_BOOKS, TAFSIR_BOOKS, SUNNAH_BOOKS, CATEGORIES_NAMES, suggestion helpers.
- Create: `components/ui/combobox.tsx` — generic shadcn combobox (Command + Popover).
- Create: `app/search/vector-search.tsx` — the form (client).
- Create: `app/search/vector-results.tsx` — result list (client).
- Modify: `app/search/page.tsx` — rebuilt client page.
- Modify: `app/api/search/route.ts` — add `POST` proxy; keep old `GET` unless unused.
- Delete: `app/search/search-results.tsx`, `src/components/global-search-bar.tsx` (only used by removed page).

## Wire format

Proxy forwards to FastAPI with `collection`, `query_text`, `top_k`, `pool` as query params and `filters` as a JSON-serialized query param. If the live FastAPI expects form/body, the proxy change is minimal.