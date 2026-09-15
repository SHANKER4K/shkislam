<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ponytail -->
# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut has a known ceiling (global lock, O(n²) scan, naive heuristic), the comment names the ceiling and the upgrade path.

Not lazy about: input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

(Yes, this file also applies to agents working on the ponytail repo itself. Especially to them.)
<!-- END:ponytail -->

# Project context

## Runtime

Bun is the dev runtime. Scripts use `bun run`, `bunx`. Lockfile is `bun.lock`. Deploy uses `npm install` (vercel.json) — mismatch is intentional, don't "fix" it.

## Commands

```bash
bun run dev              # dev server
bun run build            # production build
bun run lint             # eslint (strict: false; does not type-check)
bun run typecheck        # tsc --noEmit
bun run test             # bun test (src/**/*.test.ts)
bun run db:push          # push Drizzle schema to DB
bun run db:seed          # seed Quran + hadith data (re-runnable)
bun run db:seed-themes   # seed theme data
bun run db:migrate-search  # run search migration (pg_trgm + indexes + text_simple for hadith)
```

**DB setup order:** `db:push` → `db:seed` → `db:seed-themes`. Re-seeding rebuilds `search_vector` and `textSimple` for ALL rows.

## Architecture

- **Next.js 16.3.5** App Router, RTL-first (`lang="ar"`, `dir="rtl"`)
- **PostgreSQL** (Neon serverless) + **Drizzle ORM**
- **shadcn/ui** (radix-vega style) + **Tailwind CSS v4**
- Deploys to **Vercel**

### Search

Search runs in the FastAPI backend, not in Next.js: `../backend/api/search.py`
serves `/search/{dense,sparse,hybrid}_search` (the relay sends `rerank_pool`). The frontend is a
thin relay — the UI in `src/app/search/vector-search.tsx` POSTs to the auth-gated
`src/app/api/search/route.ts`, which signs the caller's identity and forwards to
that endpoint; `src/app/search/vector-results.tsx` renders the hits. Facet schema,
labels and book lists come from `src/lib/vector-data.ts`.

`src/lib/quran-search-engine.ts` (wraps the `quran-search-engine` npm package) and
the legacy in-repo helpers (`searchAyahs`, `searchHadiths`, `rankBySimilarity`,
`highlightText`, `src/lib/search.ts`) no longer have any importers.

### Key gotchas

- `search_vector` is **not in Drizzle schema** — tsvector column managed via raw SQL only. Don't add it to `schema.ts`. Only the backend's hadith search reads it.
- Hadiths have `text_simple` column (added by `migrate-search.ts`) — diacritics stripped via `ArabicServices.removeTashkeel` in seed, not regex.
- DB pool is a `globalThis` singleton (`src/db/index.ts`) — prevents leak on HMR.
- `strict: false` in tsconfig — `any` is pervasive and intentional.
- `bun test` runs the suite (`src/**/*.test.ts`). No CI workflows.
- Fonts: Tajawal (UI), Uthmanic (Quran display), Inter (Latin). All in `layout.tsx`.

### Database ownership

`src/db/schema.ts` + `drizzle/` are the only schema source of truth for the shared
Postgres database. The FastAPI service in `../backend/` reads and writes the same
tables with raw psycopg2 SQL (`backend/api/*.py`) and is **not** generated from this
schema. Every schema change therefore needs both: the Drizzle migration here, and a
matching hand-edit of the raw SQL there. There is no codegen and no drift check —
if you add a column, grep `backend/api/` for the table name before you finish.
