## Review

Read-only audit of Better Auth UI + client wiring. `plan.md` / `progress.md` do not exist at repo root (nothing to read there). Verified against live docs (`better-auth-ui.com/docs/shadcn.md`, `/docs/shadcn/integrations/nextjs.md`, `/docs/migrations/1-7.md`) and installed package ground truth (`@better-auth-ui/{core,react}@1.7.x` dist types). No files edited.

### 1. src/lib/auth-client.ts — **ISSUE (blocker)**
- `baseURL: "http://localhost:3000"` (`src/lib/auth-client.ts:4`) is hardcoded → in production every auth fetch from the browser hits `localhost:3000/api/auth/*` and fails. Per better-auth docs, baseURL is optional for same-origin; delete it (or gate on an env var if cross-domain).
- Line 6 creates a **second** `createAuthClient()` and destructures `{ signIn, signUp, useSession }` — nothing in the repo imports these (only `authClient` is imported, by `src/components/providers.tsx:16`). Dead code + two divergent client instances; delete the line.
- Import path `better-auth/react` is correct for React.

### 2. components/auth/auth-provider.tsx — **OK**
- Wraps the app correctly: `app/layout.tsx` → `<Providers>` (`src/components/providers.tsx`) → `QueryClientProvider` > `AuthProviderPrimitive` with `authClient`, `redirectTo`, `navigate({to, replace})`, `Link={next/link}`. This matches the official Next.js integration example nearly verbatim (including the module augmentation of `AuthConfig.Link`). The `ErrorToaster` injection inside the wrapper is a benign local addition.

### 3. Auth pages / views — **OK** (one route bug under item 5)
- `app/auth/[path]/page.tsx` validates against `viewPaths.auth` + plugin viewPaths — matches docs example exactly.
- `components/auth/auth.tsx` resolves views via `useAuth()` context (`basePaths.auth` = `/auth`, matching server handler at `app/api/auth/[...all]/route.ts`; better-auth's own API base stays at its default `/api/auth`). Plugin override → fallback → built-in resolution is coherent.
- `auth-result.tsx` / `auth-redirect.tsx` use `parseAuthResult`, `getAuthRedirectAction`, `${basePaths.auth}/${viewPaths.auth.signIn}` — correct 1.7 core APIs.
- `app/settings/[path]/page.tsx` uses `ensureSessionServer` from `@better-auth-ui/core/server` + `HydrationBoundary` + `redirect("/auth/sign-in?redirectTo=...")` — exactly the docs "Protecting Routes" SSR pattern.

### 4. RTL / Arabic — **ISSUE**
- All copied views pull copy from `localization` via `useAuth()` (good, no hardcoded English), but **no `localization`/`locale` prop is passed to `AuthProvider`** → everything renders in English on an Arabic-first RTL site. Core ships locale infrastructure (`defineAuthLocale`, `AuthLocale.direction: "rtl"`, `matchAuthLocale` — `dist/lib/auth-locale.d.ts`) but **no built-in locales**, so an Arabic localization object must be authored and passed to `AuthProvider`.
- Minor physical-CSS nits in copied components: `text-left` (`components/auth/user/user-view.tsx:51,64`, `user-button.tsx:163` → should be `text-start`) and `top-0 right-0 translate-x-…` badge positioning (`last-login-method/last-used-badge.tsx:34`, wrong corner under RTL).

### 5. Middleware / route protection — **PARTIAL**
- No `middleware.ts` anywhere — consistent with the library's guidance (SSR guard pattern instead of middleware).
- Settings is protected server-side ✓. But:
  - **`app/register/page.tsx` is 0 bytes** → blank page at `/register`. Delete it or render `<SignUp />` like `app/login/page.tsx` renders `<SignIn />`.
  - `UserButton` / sign-in affordance is **never mounted** (no reference outside `components/auth/user/`; sidebar has no session UI) → auth pages are unreachable through navigation. Missing wiring, not broken code.
- Client/server drift: `providers.tsx` sets `socialProviders={["google","github"]}` but `src/lib/auth.ts` configures no social providers → Google/GitHub buttons render and will 404/fail at runtime.

### 6. Version sanity — **OK**
- All imports follow 1.7 patterns: `@better-auth-ui/core/plugins/magic-link` (per-entry plugin paths), `@better-auth-ui/core/server`, `authMutationKeys` from root, `ensureSessionServer`. Grep found zero pre-1.7 patterns (`@better-auth-ui/*/plugins"` aggregates, `react/server`). better-auth 1.7.1 satisfies the 1.7 requirement. `AuthProviderProps` shape verified against `dist/config/auth-config.d.ts`.

### Prioritized fixes
1. **Blocker** — `src/lib/auth-client.ts`: remove `baseURL` (same-origin), delete the duplicate `createAuthClient()` destructure line.
2. Align social providers: either add `socialProviders` config to `src/lib/auth.ts` (with provider credentials) or remove `"google","github"` from `providers.tsx`.
3. Add Arabic `localization`/`locale` (direction rtl) to `AuthProvider` in `src/components/providers.tsx`.
4. Fix/delete empty `app/register/page.tsx`; mount `UserButton` (or a sign-in link) in `src/components/app-sidebar.tsx` footer so auth pages are reachable.
5. Cosmetic RTL: `text-left` → `text-start` in user-view/user-button; mirror badge corner in last-used-badge.