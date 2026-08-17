All checks complete. Here is my whole-branch review.

## Review

**Scope verified:** diff `d85bae5..348853b`, 6 commits, 10 files (±1093/−427). Read full diff. Working tree clean (only untracked tooling dir `.pi-subagents/`, untouched). Ran `bun test` on the new test (2 pass). No files mutated.

### Per-deferred-item triage

1. **popover.tsx `@radix-ui/react-popover` (undeclared)** — **SHIP.** Plan *mandated* the direct import (plan lines 223–229: "standard shadcn wrapper around `@radix-ui/react-popover`, already in node_modules — no npm install"), so it is not an implementer drift. Confirmed the other 5 ui components use `import { X as XPrimitive } from "radix-ui"` (dialog/select/dropdown-menu/sheet/tooltip) and `radix-ui` umbrella re-exports Popover (`node_modules/radix-ui/dist/index.d.ts:37`), so a one-line `import { Popover as PopoverPrimitive } from "radix-ui"` would match convention. Risk is nominal: `@radix-ui/react-popover` is a transitive of `radix-ui` and hoists on `npm install`. Not merge-blocking; optional cleanup.
- **localhost:8000 hardcode (vector-data.ts `buildSearchUrl`)** — **SHIP.** Plan-mandated; matches precedent `app/api/chat/route.ts:5` (`http://localhost:8000/chat`). Vercel can't reach it anyway (tool is dev-only), consistent with chat.
- **buildFiltersPayload NaN (vector-data.ts)** — **SHIP.** Edge: `Number("e")`/non-numeric int input → `NaN` → `JSON.stringify`→`null` in filters param. Guarded in practice (trimmed-empty dropped; `type="number"` restricts input) so only hits via exponent/partial input. Cosmetic hardening, not blocking.
- **fractional top_k/pool + wire unverified** — **SHIP.** Route clamps (`topK`/`pool_`) but doesn't round, so `10.5` would forward. This is external-system contract verification (filters-as-JSON query param vs live FastAPI), correctly deferred to the user's manual curl. Cannot be resolved by static review.
- **onRetry empty query (vector-search.tsx)** — **SHIP.** Retry button (`onRetry={run}`) lacks the `!query.trim()` guard the primary button has; empty-query retry → route 400 → error redisplays. Minor UX dead-end, no data/security impact. Optional guard worth noting.

### Integration findings

- **Wire flow end-to-end: CONSISTENT.** form body `{method, collection, query_text, top_k, pool, filters}` (vector-search.tsx:51-61) == route destructure (route.ts:17-18) == `buildSearchUrl` params (vector-data.ts) == spec query params `collection/query_text/top_k/pool` + JSON `filters`. Method level clamps (1–100 / 1–500) match browser input min/max. Route wraps bare array as `results`; client guards `Array.isArray(data.results)`. No mismatch.
- **filters non-object → route coerces to `{}`** (route.ts:30-32); empty filters → `buildSearchUrl` omits `filters=` param entirely (vector-data.ts:481-483), consistent with the test. If live FastAPI requires a filters query param and 422s on a dict, route surfaces 502 with the FastAPI body — matches spec, documented as the manual check.
- **Deletions clean:** and search-components Gap `GlobalSearchBar`, `SearchResults` deleted; no remaining importers (grep'd). Only `vector-search.tsx` calls `/api/search` (the new POST). Removing old GET broke no caller.
- **RTL/UX:** consistent — new uicons use logical `ms-*`/`me-*`, Arabic labels present across app-search components (heading "البحث المتجه", filters "الفلاتر", placeholders Arabic); `dir="rtl"` on text, `dir="ltr"` on JSON toggle.

### Minor notes (file:line)
- **Dead code (out of named scope): src/lib/search.ts `unifiedSearch` (src/lib/search.ts:31) now has no importer** — orphaned by this branch. Not a spec violation (only the two components were mandated for deletion), but it is now dead. The 4-tier hadith / quran-search-engine modules are still used by hadith/quran pages — only `unifiedSearch` is orphaned.
- **route re-declares its own `COLLECTIONS`/`METHODS`** (route.ts:10-13) instead of importing them from `vector-data.ts` (exported but unused by route) — duplication risk if a collection is added. Acceptable, but importing `COLLECTIONS` would keep single source of truth.
- **DISPLAY_FIELDS `sunnah` omits `source`** (only tafsir has it, vector-data.ts:436) even though the spec lists `source` for sunnah. External payload reality unknown; raw-JSON toggle covers it. Also `books`/`sunnah` use `all_authors` key (matches FILTER_SCHEMA) where the spec prose says `author` — likely intentional, unknown externally.
- **Minor UX/cosmetic:** "نتيجة" plural (Arabic needs "نتائج" for >1, vector-results.tsx:83); "Score:" label in English amid Arabic UI (vector-results.tsx:73); trailing `,]` array commas in `BOOKS_LIST`/`SUNNAH_BOOKS`; missing newline-at-EOF on several new files.
- **Repo-convention fit:** new components follow established patterns (factory-style dataclasses, `border-*` classes, logical props, `h-4 w-4` icons). `combobox.tsx` uses `h-4 w-4` while `vector-results` uses `size-4` — mixed, both present in repo. No blocker.

### Overall verdict: **READY TO MERGE** — no blockers. All deferred items ship. Findings are Minor (dead `unifiedSearch`, popover convention deviation, pluralization, DISPLAY_FIELDS `source` gap).