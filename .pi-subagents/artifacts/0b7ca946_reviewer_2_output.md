## Review — File-structure analysis of shkislam (READ-ONLY, no edits made)

Note: `plan.md` and `progress.md` do not exist at the repo root (ENOENT on both). Analysis proceeded from the task brief + repo inspection.

### 1. Precise inventory

| Location | Files | TS/TSX LOC | Contents |
|---|---|---|---|
| `app/` | 43 | 3,198 | all routes incl. untracked `app/auth`, `app/admin`, `app/settings`, `app/api/auth` |
| `components/ui/` (root) | 38 | 4,503 | shadcn kit + 10 untracked files |
| `components/auth/` (root) | 38 | 7,140 | better-auth-ui CLI views — **entirely untracked** |
| `lib/` (root) | 5 ts files (~179 LOC) | — | `utils.ts` (tracked) + `auth/{admin-plugin,auth-plugin,two-factor-methods,use-sign-in-continuation}.ts` (untracked) |
| `hooks/` (root) | 1 | 19 | `use-mobile.ts`, imported only by `components/ui/sidebar.tsx:1` |
| `src/components/` (+ai-elements) | 25 | 6,579 | project components |
| `src/db/` | 10 | 1,464 | schema, seeds, migrations |
| `src/lib/` | 18 | 1,967 | auth.ts (server), hadith.ts, quran*.ts etc. |
| `assets/` | 9 images, 0 ts | — | logo + jpgs; imported once as `@/assets/logo.png` |

**Import alias evidence (grep counts):**
- `app/`: 44×`@/components/ui`, **39×`@/src/lib`**, 23×`@/src/components`, 3×`@/components/auth`, 2×`@/lib/utils` → app imports BOTH trees.
- root `components/`: 142×`@/components/ui` (self), 64×`@/lib/utils`, 44 relative, 5×`@/lib/auth/*`, 1×`@/hooks/use-mobile`, **0×`@/src/*`**.
- `src/`: 32×`@/components/ui`, 9×`@/lib/utils`, 1×`@/lib/auth/admin-plugin`, 1×`@/components/auth/auth-provider`, plus 12 src files self-importing via `@/src/*`.

**Actual dependency graph direction (a clean DAG):**
```
src/db, src/lib  ←  app/* and src/components   (root components/lib/hooks NEVER import @/src)
root components/ui  ←  everyone (app 44, src 32+9, root auth views 142)
root components/auth + lib/auth  ←  app (3), src/providers.tsx, themselves
hooks/use-mobile ← only root ui/sidebar
```
The composition layer (`app/`) is the only place the two trees meet. There are **no cycles between trees**: nothing in root `components/` or `lib/` reaches into `src/`.

**Config ground truth:** `tsconfig.json` paths = `"@/*": ["./*"]` → both trees resolve under one alias; `@/src/lib/auth` and `@/lib/auth/admin-plugin` are both valid today. `components.json` aliases point at root (`@/components`, `@/lib`) — so future shadcn/better-auth-ui CLI copies land at root, matching where the last ones went. Next 16 docs confirm proxy placement: "in the project root, or inside `src` if applicable … same level as `pages` or `app`" (`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:35`). Zero imports of `@/app`. Untracked-but-live code includes `proxy.ts` itself, so much of the churn target has no git history to preserve.

### 2. Constraints
- **Next 16:** `app/` location dictates `proxy.ts` location. Today: root `app/` → root `proxy.ts`. If app moves to `src/app/`, proxy must move to `src/proxy.ts` (docs-supported).
- **components.json registry aliases:** better-auth-ui CLI writes wherever `@/components`/`@/lib` resolve. Fixing resolution via tsconfig fixes future CLI drops without touching components.json aliases.
- **Vercel build:** `next build` auto-detects `src/app`; vercel.json unchanged either way.
- `drizzle.config.ts` points at `./src/db/schema.ts`; package.json db scripts reference `src/db/*` — unaffected by option (b), affected by option (c).

### 3. Target structures, ranked

**(a) Leave as-is + document convention — churn: ~0.**
Add a paragraph to AGENTS.md: "shadcn/better-auth-ui registry code lives at root `components/ui`, `components/auth`, `lib/auth`; project code lives in `src/`; app may import both." Risk: zero. Cost: permanent two-home split; every future contributor/agent must learn the exception; grep-based refactors must always cover both trees.

**(b) Consolidate under `src/` (recommended) — churn: moderate, one-time.**
Steps:
1. `git mv app src/app` · `git mv components/ui src/components/ui` · `git mv components/auth src/components/auth` · `git mv lib/utils.ts lib/auth src/lib/` (dir `src/lib/auth/` coexists with file `src/lib/auth.ts` legally — subpath vs bare imports stay distinct; verified no bare `from "@/lib/auth"` exists, all 5 are subpaths like `@/lib/auth/admin-plugin`) · `git mv hooks src/hooks` · `git mv assets src/assets` · `mv proxy.ts src/proxy.ts`.
2. `tsconfig.json`: `"paths": {"@/*": ["./src/*"]}`.
3. Rewrite `@/src/` → `@/`: **41 files, ~95 occurrences** (29 in app/, 7 in src/components, 4 in src/lib; delete `src/lib/quran.ts.bak` rather than rewrite it). One sed pass.
4. `components.json`: update `"tailwind": {"css": "src/app/globals.css"}`; aliases stay `@/…` and now resolve into src — **future CLI copies land correctly automatically**.
5. Unchanged: drizzle.config, package.json scripts, next.config, vercel.json, eslint.
Risk: low-moderate — relative imports inside moved trees survive (whole subtrees move together; only 3 `../` imports, all intra-`components`). Verify with `bun run build` + `grep -r '@/src'`.
Benefit: single tree, convention matches Next's documented src layout, CLI writes fixed permanently.

**(c) Full root-level consolidation — churn: equal or worse, benefit: none.**
Move `src/*` to root, delete `src/`. Same ~40-file import rewrite (`@/src/x` → `@/x`), plus edit drizzle.config schema path and 5 package.json script paths; merge root `lib/` with ex-`src/lib/`. Keeps `@/*` → `./*` untouched. Downside: loses the src convention that already holds 42 tracked files' worth of history and matches the memory-documented Next patterns; root gets cluttered with app code next to config files.

### 4. Recommendation: **(b)**

Justification: it's the only option that fixes the *root cause* — the tsconfig alias mismatch that makes CLI tooling write outside the main tree — while touching exactly one config line and one mechanical sed. Option (a) cements a permanent dual-tree tax on every future change; option (c) does the same work as (b) but lands in the messier layout. Much of the moved material (proxy.ts, components/auth, lib/auth, app/auth|admin|settings) is currently untracked, so history-preservation concerns are minimal if done soon.

**Stray dirs verdict:**
- `better-auth-starter/` (121 files, 5,740 LOC, 3.3 MB): dead weight — zero references outside itself except its own tsconfig exclude. **Delete or move out of the repo**; it's a vendor reference, not project code.
- `design-concepts/` (10 mockup dirs, 1.4 MB): already `.gitignore`d, harmless design reference — keep locally, don't track.
- `notebooks/seed-embeddings.ipynb`: tracked, pairs with `db:seed-embeddings` — keep.
- `docs/`: keep.
- `skills-lock.json`: superpowers tooling state, tracked and actively modified — keep.

```
## Review
- Correct: dependency graph between the two trees is acyclic and clean (root never imports @/src); tsconfig single-alias design means consolidation needs no alias juggling; proxy placement rule confirmed against bundled Next 16 docs (16-proxy.md:35)
- Blocker: none blocking read-only analysis
- Note: plan.md / progress.md referenced by the task do not exist
- Note: quran.ts.bak should be deleted during any move (it contains 1 import occurrence)
```