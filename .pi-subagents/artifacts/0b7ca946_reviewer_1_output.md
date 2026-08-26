## Code Review: Better Auth surface (email/password + admin plugin + proxy guard)

### Summary
The auth surface is well-structured for its scope: server-side guards are the real gate (SSR `getSession` in admin layout, `ensureSessionServer` in settings), the Edge proxy is correctly framed as optimistic-only, all redirect targets flow through `@better-auth-ui`'s same-origin `getSafeRedirectTo` validation, and no raw SQL touches auth tables on any request path. No critical/blocker issues found; several medium and minor items below.

### Critical Issues

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| 1 | app/api/chat/route.ts | 1–10 | `/api/chat` POST is an **unauthenticated open relay**: it forwards an arbitrary JSON body to the inference backend with no session check. The proxy matcher (`/:path`, single segment) never matches `/api/chat`. If the FastAPI backend trusts a client-supplied user/session field (it has its own session model), anyone can impersonate or burn inference quota. Same pattern, lower impact: `/api/search` (no session check), `/api/hadith` (public DB reads). | 🟠 High (conditional — depends on backend auth; if the backend authenticates independently this drops to Medium) |
| 2 | .env | 1–4 | Real `BETTER_AUTH_SECRET` and DB password live in `.env` (correctly gitignored — verified line 34 of `.gitignore`). Not a code bug, but these exact values must **not** be reused when deploying to Vercel; generate fresh production secret/credentials. | 🟡 Medium (deploy hygiene) |

### Suggestions

| # | File | Line | Suggestion | Category |
|---|------|------|------------|----------|
| 1 | src/components/sidebar-profile.tsx | 116 | `authClient.signOut({}).then(() => router.push("/"))` — no `.catch`: on failure you get an unhandled rejection *and* the UI still shows the user as signed in with no feedback; on success there's no `router.refresh()`, so cached RSC payloads can render stale signed-in chrome until next navigation. The codebase already has the handled version — reuse `useSignOut` from `@better-auth-ui/react` (as `components/auth/sign-out.tsx:22–40` does) or add `.finally()` + refresh. | Correctness / error-swallowing |
| 2 | src/components/providers.tsx | 36 | `socialProviders={["google", "github"]}` renders Google/GitHub buttons on sign-in/sign-up views (`components/auth/sign-in.tsx:149`), but the server config (`src/lib/auth.ts`) has no social providers — every click fails at runtime. Remove the array or set `[]` until social OAuth is actually configured. | Correctness / UX |
| 3 | proxy.ts | 24 | Matcher `"/"` gates the home page behind login via the optimistic check only — `"/"` has **no SSR gate**, so a transient `betterFetch` failure bounces a validly-signed-in user to `/auth/sign-in` with no way back except manual nav. If "/" is meant to be public, drop it from the matcher; if gated, add an SSR check as the real gate like admin/settings have. Also fine to leave, but document it. | AuthZ consistency |
| 4 | src/lib/auth-client.ts | 5 | `baseURL: process.env.BETTER_AUTH_URL` — set today in `.env:4`, but if ever unset in prod the client silently falls back to same-origin (fine), while the *server* infers base URL from headers (requires `trustedOrigins`/host config on Vercel behind a proxy). Verify `BETTER_AUTH_URL` is set in Vercel env vars before deploy. | Deploy correctness |
| 5 | src/lib/auth.ts | 9–12 | `telegramId`/`username` declared as `additionalFields` but nothing in the reviewed surface writes or displays them, and the username plugin is commented out in providers.tsx. YAGNI candidate — delete until the Telegram bridge lands. | Maintainability |

### What Looks Good
- **Defense in depth done right**: proxy is explicitly optimistic (`proxy.ts:24` comment); the real gates are SSR — `app/admin/layout.tsx:11–19` checks session *and* role (`notFound()` for non-admins, no info leak), `app/settings/[path]/page.tsx:33–41` uses `ensureSessionServer`.
- **No open redirect**: every post-auth target goes through the library's origin-validating `getSafeRedirectTo`/`getSafeAuthRedirect` (verified in `node_modules/@better-auth-ui/core/dist/index.js:116`); app-side `redirectTo` values are hardcoded constants (`app/admin/layout.tsx:14`) or built from the validated `path` segment (`app/settings/[path]/page.tsx:39`, encodeURIComponent'd).
- **No injection surface**: raw SQL exists only in offline migration scripts (`src/db/migrate-search.ts` etc.), zero parameter interpolation near users/session/account/verification; all request-path access routes through Drizzle/Better Auth.
- **No IDOR**: no custom API route queries users/sessions by id; the Admin client (`components/auth/admin/admin-users.tsx:189–190`, paginated — no unbounded list) hits Better Auth admin endpoints which enforce `role === "admin"` server-side.
- **Schema** matches BA expectations: `users.role/banned/banExpires`, `session.impersonatedBy`, FK cascades on `session.userId`/`account.userId`, unique `token`; `generateId: crypto.randomUUID()` cleanly bridges uuid/text PK types.
- **Secrets not logged**: no console logging of tokens/passwords/hashes anywhere in the auth components; `account.password` (hash) is never selected outside BA internals.
- **QueryClient** (`src/lib/query-client.ts`) follows the TanStack SSR pattern — per-request client on server, singleton on browser, staleTime 5000 prevents waterfalls/refetch storms.

### Verdict
**Approve with follow-ups** — no blocker in the new auth code itself; resolve #1 (chat relay auth) and #2 (production secrets) before deploying.