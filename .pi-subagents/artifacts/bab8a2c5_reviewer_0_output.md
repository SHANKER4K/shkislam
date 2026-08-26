All files inspected. No edits were made (read-only audit confirmed — I only used `read`/`bash` grep/cat/ls).

## Review

**1. Drizzle adapter (`src/lib/auth.ts`)**
- **ISSUE (blocker)** — `drizzleAdapter(db, { provider: "pg" })` passes no `schema`. Verified against installed adapter source (`node_modules/@better-auth/drizzle-adapter/dist/index.mjs`, `getSchema()`): schema resolution is `config.schema || db._.fullSchema`, keyed **by model name**. Your `db` does have `fullSchema` (schema passed in `src/db/index.ts`), but its keys are the export names `{ users, session, account, verification, apiKeys, sessions, ... }`. Better Auth looks up model `"user"` → key `user` doesn't exist → throws `"The model 'user' was not found in the schema object"`. Neither pure-singular nor `usePlural: true` fits your mixed exports (`users` plural, `session` singular), so an explicit mapping is required:
  ```ts
  drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, session, account, verification },
  })
  ```
- **ISSUE (blocker)** — `users` table has **no `name` column** (`src/db/schema.ts:184-202`: telegramId, username, displayName, email…). Adapter's `checkMissingFields` throws on sign-up when writing the required `name` field. Fix either way:
  - map it: `user: { fields: { name: "displayName" } }` inside the adapter options, or
  - add a `name` column and re-run `bun run db:push`.
- OK — `provider: "pg"` matches `node-postgres` driver; db instance passed correctly.
- OK — rest of the four tables match Better Auth expectations: `id` text PK (BA supplies its own ID), `emailVerified`, `token` varchar(255) unique, `issuer NOT NULL` is safe because v1.7 sets `issuer: "credential"` on local account creation (verified in `dist/api/routes/sign-up.mjs:246`).
- Note — two legacy tables coexist: `users` (auth) vs old `sessions`/apiKeys tables at `schema.ts:285-330`. Different table names so no conflict, just naming confusion risk.

**2. Route handler (`app/api/auth/[...all]/route.ts`)**
- OK — `export const { POST, GET } = toNextJsHandler(auth)` — canonical Next.js App Router pattern.

**3. Env vars (`.env.example`)**
- **MISSING** — `.env.example` contains only `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL`. Add `BETTER_AUTH_SECRET` (and optionally `BETTER_AUTH_URL`). `.env` itself already defines `BETTER_AUTH_SECRET` (name checked, value not read) but no `BETTER_AUTH_URL` — works since BA infers base URL from the request, but explicit is safer behind proxies.
- Note — ensure `BETTER_AUTH_SECRET` is set in **Vercel env vars** for production; absent secret fails at runtime, not build time.

**4. Secret/baseURL handling (`src/lib/auth.ts`)**
- OK — nothing hardcoded; relies on env lookup order (config → `BETTER_AUTH_SECRET` → `AUTH_SECRET`). Correct pattern per security skill.

**5. emailAndPassword / social providers**
- OK — `enabled: true`; no social providers declared (consistent with schema having a generic `account` table).
- Note — no `sendResetPassword` handler → `/forgot-password` flow will be non-functional. Fine until you need it.

**6. trustedOrigins**
- **MISSING (minor)** — not configured. `baseURL` origin is auto-trusted and localhost is allowed in dev, so prod main domain works — but **Vercel preview deployments** (distinct URLs) will get 403 on `callbackURL`/redirect validation. Add when needed:
  ```ts
  trustedOrigins: ["https://*.vercel.app"] // or exact preview origins
  ```
  or set `BETTER_AUTH_TRUSTED_ORIGINS` env var.

**7. Rate limiting / cookies / CSRF**
- OK — rate limiting is enabled by default in production (v1.7), CSRF check and origin check enabled by default, secure cookies + `__Secure-` prefix + httpOnly automatic on HTTPS. Don't touch `advanced.disableCSRFCheck`.
- **ISSUE (minor)** — default rate-limit storage is **memory**, which resets per lambda instance on Vercel serverless → limits are effectively per-warm-instance and trivially bypassed by cold starts. If you care, `rateLimit: { storage: "database" }` (costs a Neon roundtrip) — acceptable to defer given sensitive endpoints already cap at 3 req/10s per instance.

**8. Session options**
- OK — defaults (7-day expiry, updateAge 24h) reasonable. `cookieCache` optional; skip until session reads show up in profiling (each read hits Neon).

**9. basePath / collisions**
- OK — default basePath `/api/auth` matches `app/api/auth/[...all]/route.ts`. No middleware.ts anywhere, `next.config.ts` empty, no other route under `app/api/auth/` → no collision possible.

**10. Plugins / migrations**
- OK — no plugins server-side → no CLI re-run needed beyond base tables, which already exist hand-written in `schema.ts` (presumably pushed via `db:push`). Tables match what `@better-auth/cli generate` would emit closely enough (field names snake_cased consistently).
- Note — verify once after fixes with `GET /api/auth/ok` → `{"status":"ok"}`.

### Prioritized fixes
1. `src/lib/auth.ts` — pass explicit `schema: { user: users, session, account, verification }` to `drizzleAdapter` (**blocker**: current config throws on first auth request).
2. `src/lib/auth.ts` — resolve the missing `name` field: `user: { fields: { name: "displayName" } }` in adapter opts, or add `name` column to `users` + `bun run db:push` (**blocker**: sign-up insert fails).
3. `.env.example` — add `BETTER_AUTH_SECRET=""` (+ optional `BETTER_AUTH_URL`); ensure secret is set in Vercel dashboard.
4. When using Vercel previews: add `trustedOrigins: ["https://*.vercel.app"]` or `BETTER_AUTH_TRUSTED_ORIGINS`.
5. Optional hardening: `rateLimit: { storage: "database" }`.