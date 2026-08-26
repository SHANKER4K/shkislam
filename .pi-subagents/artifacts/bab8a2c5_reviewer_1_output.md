## Review

Read-only audit. No files edited. Evidence: `node_modules/better-auth@1.7.1` (`@better-auth/core/dist/db/schema/{user,session,account,verification}.d.mts`, `@better-auth/drizzle-adapter/dist/index.mjs`), `src/db/schema.ts:184-278`, `src/lib/auth.ts`, `src/db/index.ts`, `drizzle.config.ts`, `drizzle/0003_thick_skullbuster.sql`.

**1. Auth table location — OK**
All in `src/db/schema.ts` (no separate auth-schema.ts): `users` (:184), `session` (:206), `account` (:229), `verification` (:262). No plugin tables needed — `src/lib/auth.ts` configures only `emailAndPassword`. Note the namespace collision: custom chat tables `apiKeys`/`sessions` coexist with BA's `session` table in the same file.

**2. Columns vs Better Auth v1.7.1 expectations — ISSUE (blocker on user model)**
- `session`, `account`, `verification`: exact match to v1.7 core schemas, including v1.7-specific `account.issuer NOT NULL`, `session.token varchar(255) unique`, `timestamp(6) with time zone`, text PKs, and all three indexes (`*_userId_idx`, `verification_identifier_idx`). Clearly generated against this version.
- `users` table is **not** a valid BA user model:
  - Missing required `name` column (v1.7 `userSchema.name: ZodString`, inserted on every signUp).
  - Missing optional `image` column.
  - `id uuid defaultRandom()` vs BA's generated alphanumeric string id → non-UUID string insert fails with PG 22P02 unless `advanced.database.generateId: false`.
  - Extra columns `telegramId`, `username`, `displayName` not declared via `user.additionalFields` — adapter throws on unknown-field writes only if mapped wrong, but sign-up will already fail on `name`.
- Adapter behavior verified at `@better-auth/drizzle-adapter/dist/index.mjs:59-63`: `getSchema("user")` does `schema["user"]` over `db._.fullSchema`; key is `users` → throws `BetterAuthError: The model "user" was not found`. Field validation at :265 would throw next for missing `name`.

**3. drizzle.config.ts — OK**
`schema: "./src/db/schema.ts"` covers all auth tables; dialect postgresql; `bun run db:push` creates them.

**4. drizzle/ migrations — OK**
`0003_thick_skullbuster.sql` CREATEs `account`, `session`, `verification` (+ `users`, `api_keys`, `sessions`) with FKs (`ON DELETE cascade`) and indexes; `meta/_journal.json` records it applied (idx 3).

**5. Pool singleton usage — OK**
`src/lib/auth.ts:3` imports `db` from `@/src/db`, which is the `globalThis.__pgPool` singleton. Other `new Pool(...)` hits are one-off CLI scripts (`seed.ts`, `migrate-search.ts`, etc.) — intentional, not HMR leaks.

**6. Model-name vs schema-key mismatch — ISSUE (same blocker as #2)**
BA models `user/session/account/verification`; schema exports `users/session/account/verification`. `session/account/verification` resolve; `user` does not. `drizzleAdapter(db, {provider:"pg"})` passes no `schema` mapping and no `usePlural`.

### Prioritized fixes
1. **Blocker:** make the user model BA-conformant — rename export to `user` (SQL name can stay or become `"user"`), add `name text notNull`, `image text`, keep telegram/display fields as `user.additionalFields: { telegramId: {...}, username: {...}, displayName: {...} }`, and either set `advanced.database.generateId: false` (let `gen_random_uuid()` fill) or change `id` to `text`. Then regenerate migration / `db:push`.
2. Minor: mount `/api/auth/[...all]` route handler — none exists yet, so `auth` is currently unused server-side.
3. Minor: consider explicit `schema: { user, session, account, verification }` in `drizzleAdapter` to decouple from full-schema key names.