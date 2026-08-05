# Design Direction 06 - Desert Dune

## 1. Design Read

Reading this as: an airy, warm, wide-open AI assistant for students of Islamic knowledge, with a desert-minimalist visual language, leaning toward sand-neutrals + a single burnt-orange accent + sweeping organic curves (Tailwind tokens, zero new dependencies).

## 2. Concept Narrative

The app reads as a calm surface of wind-blown sand: the sidebar is a tall dune rising on the right, the chat thread is the open desert floor, and the burnt-orange accent is the single honest heat in the landscape, marking every interactive element the way late sun marks the horizon. Whitespace is the luxury here. Nothing crowds; every message breathes. Tool callouts (ayah and hadith) arrive as smooth, rounded panels of pale sand that feel poured into the thread rather than pasted as UI cards. The whole composition is quiet, wide, and horizon-hungry: generous leading, huge negative space, curves everywhere instead of sharp corners, and motion so subtle it feels like weather, not animation.

## 3. Palette

All values are oklch. Desert sand is the neutral envelope. Burnt-orange is THE single accent, used sparingly (interactive markers only). No other hues. Warm greys only, never cool; the entire neutrals family leans warm.

### Light mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.975 0.012 75)` | pale dune floor |
| `--foreground` | `oklch(0.24 0.02 55)` | dusk-warm near-black ink |
| `--card` | `oklch(0.995 0.008 80)` | bright sunlit sand, raised |
| `--card-foreground` | `oklch(0.24 0.02 55)` | |
| `--popover` | `oklch(0.995 0.008 80)` | |
| `--popover-foreground` | `oklch(0.24 0.02 55)` | |
| `--primary` | `oklch(0.62 0.13 45)` | burnt-orange (single accent) |
| `--primary-foreground` | `oklch(0.99 0.006 80)` | cream on orange |
| `--secondary` | `oklch(0.93 0.02 70)` | warm sand wash, hover fills |
| `--secondary-foreground` | `oklch(0.3 0.025 55)` | |
| `--muted` | `oklch(0.947 0.014 75)` | hairline-adjacent wash |
| `--muted-foreground` | `oklch(0.5 0.018 55)` | ink at half-warmth |
| `--accent` | `oklch(0.93 0.025 70)` | orange-tinted wash |
| `--accent-foreground` | `oklch(0.3 0.03 55)` | |
| `--destructive` | `oklch(0.577 0.19 27)` | kept for errors only |
| `--border` | `oklch(0.88 0.02 75)` | faint sand hairline |
| `--input` | `oklch(0.895 0.018 75)` | sand input bed |
| `--ring` | `oklch(0.62 0.13 45)` | orange focus ring |
| `--sidebar` | `oklch(0.945 0.016 78)` | tall pale dune (slightly deeper than bg) |
| `--sidebar-foreground` | `oklch(0.24 0.02 55)` | |
| `--sidebar-primary` | `oklch(0.62 0.13 45)` | orange nav accent dot/underline |
| `--sidebar-primary-foreground` | `oklch(0.99 0.006 80)` | |
| `--sidebar-accent` | `oklch(0.9 0.022 72)` | dune shadow hover fill |
| `--sidebar-accent-foreground` | `oklch(0.3 0.03 55)` | |
| `--sidebar-border` | `oklch(0.885 0.02 76)` | faint dune crease |

### Dark mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.185 0.014 60)` | dark desert night |
| `--foreground` | `oklch(0.94 0.014 80)` | moonlit sand |
| `--card` | `oklch(0.22 0.016 60)` | raised night dune panel |
| `--card-foreground` | `oklch(0.94 0.014 80)` | |
| `--popover` | `oklch(0.22 0.016 60)` | |
| `--popover-foreground` | `oklch(0.94 0.014 80)` | |
| `--primary` | `oklch(0.78 0.12 60)` | brighter ember-orange for AA |
| `--primary-foreground` | `oklch(0.2 0.02 55)` | ink on ember |
| `--secondary` | `oklch(0.27 0.02 60)` | |
| `--secondary-foreground` | `oklch(0.92 0.016 80)` | |
| `--muted` | `oklch(0.245 0.016 60)` | |
| `--muted-foreground` | `oklch(0.72 0.02 75)` | |
| `--accent` | `oklch(0.29 0.025 60)` | ember-tinted wash |
| `--accent-foreground` | `oklch(0.92 0.016 80)` | |
| `--destructive` | `oklch(0.677 0.17 27)` | |
| `--border` | `oklch(0.29 0.018 62)` | faint star-dark hairline |
| `--input` | `oklch(0.25 0.016 60)` | |
| `--ring` | `oklch(0.78 0.12 60)` | ember focus ring |
| `--sidebar` | `oklch(0.215 0.016 62)` | night dune |
| `--sidebar-foreground` | `oklch(0.94 0.014 80)` | |
| `--sidebar-primary` | `oklch(0.78 0.12 60)` | ember nav accent |
| `--sidebar-primary-foreground` | `oklch(0.2 0.02 55)` | |
| `--sidebar-accent` | `oklch(0.27 0.02 62)` | |
| `--sidebar-accent-foreground` | `oklch(0.92 0.016 80)` | |
| `--sidebar-border` | `oklch(0.29 0.018 62)` | |

## 4. Typography

Reuse the loaded family stack. No new fonts, no new dependencies.

- **Arabic UI:** `Tajawal` remains the workhorse. Set generous leading (`leading-relaxed`, 1.6-1.75) on all body prose. Use weight 500 for labels, 700 for headings. Avoid 400 for interactive text; 400 is fine for long-form ayah/hadith quotes where comfort beats emphasis.
- **Quran display:** `--font-uthmanic` (KFGQPC-Uthmanic-HAFS) for every ayah callout and hadith quote core text, as already wired in the project.
- **Latin / numerals:** `Inter` for Latin side bits and any tabular numbers. Enable `font-variant-numeric: tabular-nums` on Surah/Ayah/chapter numerals and timestamps.
- **Display scale:** Headings tracked tight (`tracking-tight`), generous size. Large empty state heading at `text-2xl md:text-3xl`, chat is a tool not a billboard, restraint is the premium move. Body text uses `text-base` and cropped 65ch lines; ayah/hadith in Uthmanic at `text-lg md:text-xl`.
- **Sentence case** everywhere. No all-caps eyebrows except a single tiny screen-reader-visible label if truly needed; prefer nothing.

## 5. Layout System

### 5.1 Chat shell wireframe (RTL, sidebar on the right/start side)

```
┌──────────────────────────────────────┬─────────────────────┐
│                                      │ LOGO ▾    acc       │
│            CHAT THREAD               │ + New chat          │
│                                      ├─────────────────────┤
│       (open desert floor,            │ ◈ القرآن الكريم     │
│        max-w-2xl mx-auto)            │ ◈ الأحاديث النبوية  │
│                                      │ ◈ المواضيع          │
│   ▸ user message        (pale chip)  │ ◈ المفضلة           │
│   ▸ assistant text      plain, flow  │ ◈ البحث             │
│   ▸ ayah callout     rounded inset   │ ◈ حول                │
│                                      ├─────────────────────┤
│                                      │ ☾ theme             │
│                                      └─────────────────────┘
│                                      ▲ sidebar collapses
│          [ suggested prompt chips ]    to icon rail
│        ┌───────────────────────────┐
│        │  اكتب سؤالك هنا...   [↑] │   ← sand input bed
│        └───────────────────────────┘
```

- **Main stage:** full viewport flex column, `min-h-[100dvh]`, no card frame over the thread. Chat content column restricted to `max-w-2xl` (open, narrow like a horizon note). Background is the page sand, not a panel: no chrome around messages.
- **Sidebar:** shadcn `collapsible="icon"` right-anchored (start side in RTL). Expanded ≈ `w-64`, collapsed to a `w-16` icon rail. When collapsed, active item shows a small burnt-orange vertical rule + filled orange icon dot so polarity survives at rail width. Slide and width changes animate via `transform` (the CSS `sidebar` primitive handles this); honor reduced-motion by snapping.
- **Whitespace discipline:** this is a `VISUAL_DENSITY ~ 2` direction. Section gaps `py-20`+ on supporting pages. Chat: `gap-6` between messages, generous `pb-32` above the docked composer so the bottom message never hides under the input. The empty view intentionally huge: centered content in the open floor.

### 5.2 Docked composer

The input is a single smooth "sand bed": full-width within the 2xl column, `rounded-3xl`, soft sand surface (`--input`), `py-4`, inner textarea autosizes, and a burnt-orange circular send button nesting in the bed corner. Top edge shares the sand tone; a subtle inner glow (not a hard border) separates it from content above.

## 6. Component Inventory

### 6.1 Chat input
Rounded-3xl sand bed, orange circular submit (`size-11`, `rounded-full`), placeholder `text-muted-foreground` at 60% warmth. Disabled state = bed dulls, circle greys, no pulse. Focus ring = `--ring` orange with a soft halo. `:active` sends button scale[0.96]. Mirror current `PromptInput` structure (textarea + absolute submit) as in `app/chat/page.tsx`.

### 6.2 Message bubbles
- **User:** pale sand chip, `rounded-2xl` soft (maybe `rounded-3xl` for the message), `bg-secondary`, text `text-secondary-foreground`, padding `px-4 py-2.5`, left-to-right = the assistant side per RTL reading. No shadow, no border, color-only elevation.
- **Assistant:** no bubble at all. Plain flow text on the floor, `text-base`, `leading-relaxed`. The distinction between writer (user chip) and guide (open assistant text) is deliberate: the guide speaks ON the sand, the user sits ON a chip.

### 6.3 Tool callouts (ayah / hadith)
Poured-sand inset: `rounded-3xl bg-card` with a single `border border-border/60`, inside roomy `p-5`. A thin burnt-orange left rule (in RTL, right is "start" so rule on the right edge) marks it as a citation. Header: small muted label like "القرآن الكريم · سورة البقرة" (no em-dash, use `·` at most once / midline or use a hyphen). Body: Uthmanic script at `text-lg md:text-xl`, magenta-free, high contrast `text-foreground`. Matches current `Tool` component (`components/ui/tool.tsx`) with optional rich content.

### 6.4 Sidebar nav items
Row `h-11`, `rounded-xl` (soft), `px-3`, gap-3. Label `text-sm font-medium`. Hover: `bg-sidebar-accent text-sidebar-accent-foreground`. Active: `bg-sidebar-accent` + `text-sidebar-primary` + a 2px burnt-orange vertical rule on the start edge (right in RTL) + the item icon fills orange. Icons: use a warm-duotone treatment, default grey turns orange on active. Collapsed rail = icon-only centered, orange dot for active.

### 6.5 Empty state (open, spacious)
Centered in the open floor with lots of sky. Uthmanic greeting line (optional), `text-xl font-medium` in Tajawal: "ما الذي تود معرفته اليوم؟" (sentence case, warm). Below: 2-4 **suggested prompt chips** in a `flex flex-wrap justify-center gap-2`: pill `rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors`. Clicking a chip fills the composer. Breathes, no clutter.

### 6.6 Loading state
Replace spinner with a shimmering sand tone matching current `Shimmer` fluid shape (`src/components/ai-elements/shimmer.tsx`) tinted warm; placeholder skeleton lines rounded and low-contrast, not harsh grey.

## 7. Motion Spec

- All in `transform` + `opacity` only. No `top/left/width/height` animation, no canvas, no scroll-jack, no marquee.
- **Message entry:** fade + 8px rise, ~300ms ease-out. Staggered lightly for the user message then assistant content.
- **User chip hover:** no drift, `bg-secondary` → slightly darker sand. Press: `scale(0.98)`.
- **Send button:** hover scale 1.04, `:active` scale 0.95. Spring (`stiffness 100, damping 20`).
- **Sidebar collapse:** width change driven by the shadcn sidebar primitive; gate behind `transform` where feasible; snap under `prefers-reduced-motion`.
- **Callouts:** soft scale-in 0.98→1 + fade on mount, 250ms.
- **Scroll cue:** none. No "Scroll" prompts, no mouse indicator.
- **Skeleton:** soft opacity pulse only, warm tone, respects reduced-motion (dims to static).
- Every motion gated by `prefers-reduced-motion: reduce` collapsing to instant/static.

## 8. Corner Radius + Surface System

One consistent system, all organic/soft, no sharp corners anywhere:

- `--radius: 1rem` (16px) base.
- Interactive controls (nav items, chips): `rounded-xl` (12px).
- Buttons / send: `rounded-full` (pills, interactive).
- Message user chip: `rounded-2xl` (16px).
- Callouts / input bed / cards: `rounded-3xl` (24px).
- Surfaces: color-and-tone elevation, not shadow. Shadows where used are warm-tinted and faint; never pure `#000`. Border hairlines are sand, not grey. Cards exist only where elevation communicates layering (callouts, sidebar), everything else is spacing and negative space.

## 9. Three Signature Premium Details

1. **The sand bed composer.** The single most distinctive element: a round, warm, pill-nested input that looks carved out of the page rather than placed on it, with a burnt-orange sun behind the text cursor. Feels like writing in warm sand.
2. **Dune-crease sidebar.** On the sidebar's inner edge a soft, very faint `border-start` + a 1-step sand-gradient that makes the panel read as a tall dune casting onto the floor. The collapsed icon rail keeps an orange ember dot on the active item so wayfinding persists at rail width.
3. **The ember citation rule.** Every ayah/hadith callout carries a 2px burnt-orange rule on its start edge and a single warm-tinted hairline elsewhere. The thinnest application of accent on the whole app, and it always points at *cited source* not *decoration*. Restraint that reads as authority.

## 10. Anti-Slop Self-Audit

Confirmed all ground rules hold for this direction:

- **Zero em-dashes:** the characters U+2014 and U+2013 appear nowhere in copy or docs; headers/dividers use hyphens or `·` at most once per line. ✔
- **One accent:** burnt-orange is the only accent; all neutrals stay in the warm sand family; no second hue sneaks in. ✔
- **One radius system:** organic-soft family (xl/full/2xl/3xl), no sharp corners. ✔
- **`min-h-[100dvh]`**, never `h-screen`. ✔
- **RTL first:** sidebar on the start (right) side; ember rule on start edge of callouts. ✔
- **Calm motion:** transform/opacity only, reduced-motion honored, no scroll-hijack, no marquee, curves via border-radius + SVG only, no canvas. ✔
- **No AI-purple gradients**, no beige-overuse (sand is the brand, used consistently, not beige-by-default). ✔
- **No new dependencies.** Tajawal stays. zero-install. ✔
- **Contrast:** burnt-orange on sand passes AA for large text; normal link/CTA text uses `text-primary` at 700 weight; bodies use `--foreground` near-ink for AAA reading. Dark mode brightened ember for AA. ✔
- **Low visual density kept** (target 2): whitespace is the aesthetic, no data-dump, no repeated equal cards. ✔