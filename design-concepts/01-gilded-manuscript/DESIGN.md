# Design Direction 01 - Gilded Manuscript

## 1. Design Read

Reading this as: a scholar's illuminated manuscript made interactive, for students of Islamic knowledge, with a heritage-luxury language, leaning toward deep emerald leather + gold-leaf tooling + cream parchment surfaces (Tailwind tokens, zero new dependencies).

## 2. Concept Narrative

The app is not a chat tool, it is a scholar's notebook bound in emerald leather with gilded tooling. The sidebar is the binding itself (dark emerald, gold rules), the chat thread is the parchment page where the scholar writes and the citations arrive as gold-ruled excerpts pressed from the source books. Gold is the single accent and it is earned: it marks every act of citation and every interactive element, the way gilding marks illumination in a real manuscript. Ayah and hadith callouts render as parchment insets with a thin gold frame and the Uthmanic script, making the source material feel physically pressed into the page rather than pasted as a UI card. The overall posture is calm, deliberate, and expensive: wide quiet margins, generous leading, restrained motion that never distracts from the text.

## 3. Palette

All values are oklch. Gold is THE single accent. Green is the neutral envelope (ink/emerald family), parchment is the surface family. No other hues.

### Light mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.966 0.008 85)` | parchment page |
| `--foreground` | `oklch(0.235 0.03 170)` | ink (emerald-black) |
| `--card` | `oklch(0.992 0.004 85)` | bright parchment, raised surface |
| `--card-foreground` | `oklch(0.235 0.03 170)` | |
| `--popover` | `oklch(0.992 0.004 85)` | |
| `--popover-foreground` | `oklch(0.235 0.03 170)` | |
| `--primary` | `oklch(0.68 0.115 78)` | gold (single accent) |
| `--primary-foreground` | `oklch(0.99 0.006 85)` | cream on gold |
| `--secondary` | `oklch(0.91 0.02 150)` | sage wash, hover fills |
| `--secondary-foreground` | `oklch(0.28 0.03 170)` | |
| `--muted` | `oklch(0.935 0.01 85)` | hairline-adjacent wash |
| `--muted-foreground` | `oklch(0.48 0.02 170)` | ink at 50% |
| `--accent` | `oklch(0.925 0.03 85)` | gold-tinted wash |
| `--accent-foreground` | `oklch(0.28 0.04 170)` | |
| `--destructive` | `oklch(0.577 0.19 27)` | kept for errors only |
| `--border` | `oklch(0.855 0.015 85)` | thin ink rule |
| `--input` | `oklch(0.855 0.015 85)` | |
| `--ring` | `oklch(0.68 0.115 78)` | gold focus ring |
| `--sidebar` | `oklch(0.198 0.038 165)` | emerald leather binding |
| `--sidebar-foreground` | `oklch(0.93 0.008 85)` | parchment text on leather |
| `--sidebar-primary` | `oklch(0.72 0.11 80)` | gold nav accent |
| `--sidebar-primary-foreground` | `oklch(0.2 0.03 165)` | |
| `--sidebar-accent` | `oklch(0.26 0.04 165)` | hover fill on leather |
| `--sidebar-accent-foreground` | `oklch(0.95 0.008 85)` | |
| `--sidebar-border` | `oklch(0.28 0.035 165)` | gilded hairline |

### Dark mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.158 0.022 165)` | deep emerald-black |
| `--foreground` | `oklch(0.93 0.008 85)` | parchment |
| `--card` | `oklch(0.19 0.026 165)` | raised leather panel |
| `--card-foreground` | `oklch(0.93 0.008 85)` | |
| `--popover` | `oklch(0.19 0.026 165)` | |
| `--popover-foreground` | `oklch(0.93 0.008 85)` | |
| `--primary` | `oklch(0.785 0.11 85)` | brighter gold for AA contrast |
| `--primary-foreground` | `oklch(0.2 0.03 165)` | ink on gold |
| `--secondary` | `oklch(0.26 0.03 165)` | |
| `--secondary-foreground` | `oklch(0.9 0.012 85)` | |
| `--muted` | `oklch(0.225 0.025 165)` | |
| `--muted-foreground` | `oklch(0.71 0.015 85)` | |
| `--accent` | `oklch(0.26 0.035 165)` | gold-tinted dark wash |
| `--accent-foreground` | `oklch(0.9 0.012 85)` | |
| `--destructive` | `oklch(0.577 0.19 27)` | |
| `--border` | `oklch(0.285 0.03 165)` | gilded hairline |
| `--input` | `oklch(0.285 0.03 165)` | |
| `--ring` | `oklch(0.785 0.11 85)` | gold focus ring |
| `--sidebar` | `oklch(0.128 0.02 165)` | near-black leather |
| `--sidebar-foreground` | `oklch(0.93 0.008 85)` | |
| `--sidebar-primary` | `oklch(0.8 0.105 85)` | |
| `--sidebar-primary-foreground` | `oklch(0.16 0.02 165)` | |
| `--sidebar-accent` | `oklch(0.2 0.03 165)` | |
| `--sidebar-accent-foreground` | `oklch(0.95 0.008 85)` | |
| `--sidebar-border` | `oklch(0.24 0.03 165)` | |

Notes: gold never appears as a background fill on large surfaces (AA fails). It appears as text accent, 1px rules, icon tint, and small fills (send button, active pill) only. Emerald-green family is used solely as the neutral envelope; it is not a second accent.

## 4. Typography

- **Arabic UI: Tajawal** (already loaded, stays). Weights 400 / 500 / 700 / 800.
- **Quran display: KFGQPC Uthmanic** (already loaded via `--font-uthmanic`). Used for every ayah text inside citation callouts. Never for UI chrome.
- **Latin: Inter** (already loaded). Use `tabular-nums` for any verse/surah numbers, chapter counts, and loading counters.
- **Display pairing: no new font.** Tajawal 800 with `tracking-tight` (`-0.02em`) serves as the display face for Arabic headlines. This keeps the direction dependency-free and Arabic-first. If a later pass wants more manuscript gravity, the swap candidate is Amiri (Arabic Naskh serif, Google Fonts), but it is not required and not in this pass.
- Scale: chat messages `text-base` body with `leading-8` (Arabic needs generous leading), citation callouts `text-lg` for the ayah line, sidebar nav `text-sm`, page titles `text-2xl font-extrabold`.
- Copy rule: sentence case for Latin, natural Arabic. No all-caps Latin labels anywhere.

## 5. Layout System

### Chat shell wireframe (RTL: sidebar on the RIGHT, `dir="rtl"`)

```
┌────────────────────────────┬──────────────────────────────────────┐
│ SIDEBAR (binding)          │ MAIN (parchment page)                │
│ ┌────────────────────────┐ │                                      │
│ │ logo · SHK Islam (gold)│ │  ┌──────────────────────────────┐    │
│ │ ────────────────────── │ │  │ (collapsed: icon rail 64px)  │    │
│ │ ＋ New chat   (gold)   │ │  └──────────────────────────────┘    │
│ │ ────────────────────── │ │  center column max-w-3xl mx-auto     │
│ │ Quran  ✦  (gold active)│ │                                      │
│ │ Hadith                 │ │  ┌───────────────────────────┐       │
│ │ Themes                 │ │  │  Empty state (centered):   │       │
│ │ Favorites              │ │  │  ✦ ornament                │       │
│ │ Search                 │ │  │  "ما الذي تريد أن تتعلمه؟"  │       │
│ │ About                  │ │  │  3 suggested-question pills│       │
│ │ ────────────────────── │ │  └───────────────────────────┘       │
│ │ theme toggle  avatar   │ │                                      │
│ │ (collapsible to icons) │ │  messages scroll freely             │
└────────────────────────────┘  ┌───────────────────────────┐       │
                                │ input dock (parchment,    │       │
                                │ gold send button)         │       │
                                └───────────────────────────┘       │
                                h-[calc(100dvh-0px)] via flex,      │
                                never h-screen                       │
```

Implementation notes:
- Shell = `flex h-dvh` (or `min-h-dvh` with inner scroll) inside layout; sidebar on the `start` side. In `dir="rtl"`, start = right, so sidebar renders right, matching ChatGPT mirrored.
- Sidebar: shadcn `sidebar` component already has tokens wired in `globals.css`; set `collapsible="icon"`. Width 260px expanded, 64px icon rail collapsed. Persist state via the sidebar's own cookie/localStorage pattern.
- Main chat column: `flex flex-col`, inner scroll region with a center `max-w-3xl mx-auto` stack, input dock pinned to the bottom of the column (`mt-auto`), sticky, with a parchment background and a 1px gold top rule.
- Other pages (Quran, Hadith, Themes, Favorites, Search, About) inherit the same shell: sidebar always present, page content scrolls in the main region with `max-w-4xl mx-auto px-6 py-8`. Quran reader keeps its own wider container (`max-w-5xl`) for surah display, still within the main region.
- The old top `Navbar` is removed for authenticated/chat surfaces; the logo moves into the sidebar header. Theme toggle moves to the sidebar footer.

## 6. Component Inventory

- **Sidebar nav items**: 40px row, `text-sm`, `text-sidebar-foreground/80`, hover = `bg-sidebar-accent` + gold 1px inset rule on the leading edge (start side), active = `bg-sidebar-accent` + gold text + gold start rule. Icon 18px `strokeWidth={1.5}`.
- **New chat button**: full-width row, gold border (`border-primary/40`), `text-primary` label, hover fills `bg-primary/10`. Not a big pill, a quiet leather-tooled plate.
- **Chat input dock**: rounded `0.5rem` container, parchment surface (`bg-card`), 1px `border-input`, inner textarea borderless, right-aligned (RTL) gold circular send button 36px with cream icon. Focus ring = gold `ring-2 ring-ring/60`.
- **User message**: no bubble. Ink text on the page background, `max-w-[70ch]`, left-aligned in flow (right side in RTL reading order for user turns is conventional; keep user turns with a subtle `bg-muted/60` rounded inset so turns are distinguishable without bubble chrome).
- **Assistant message**: plain text, no surface. Tool/step chips (`tool_result` stream) render as small gold-outlined text pills, not cards.
- **Citation callout (ayah/hadith)**: parchment inset `bg-card` with `border-r-2 border-primary` (gold rule on start edge), `rounded-[0.375rem]`, inner padding `p-4`, Uthmanic font for the source text, small gold label row above ("القرآن الكريم - سورة البقرة" style) with the source reference in `text-xs text-muted-foreground`, plus a copy action. This is the manuscript's illuminated inset: gold rule, cream ground, Uthmanic script.
- **Empty state**: centered, `max-w-md`, a small gold ornament (CSS: two hairlines + diamond via rotated square, no SVG dependency), headline Tajawal 800 `text-xl`, one muted line of guidance, three suggested-question pills (gold border, hover fill).
- **Loading**: skeleton blocks matching message shapes (rounded `0.375rem`, `bg-muted` with a gold-tinted shimmer keyframe). No generic spinner for content; the send button shows a gold pulsing dot while streaming.
- **Scroll button**: floating circular 32px, `bg-card` + gold border, appears above the input dock.

## 7. Motion Spec

- Intensity: calm (MOTION 3-4). Every animation must serve a state transition or feedback; nothing decorative.
- Allowed: 150-250ms `transform` + `opacity` transitions on hover/active/expand. Sidebar collapse/expand spring `type: "spring", stiffness: 300, damping: 30`.
- Message entry: fade + `translateY(4px)` over 200ms, applied on mount only. Streaming text: no animation, let the text appear.
- Shimmer on skeletons: 2s loop, `opacity`/`background-position` only, gated behind `@media (prefers-reduced-motion: no-preference)`.
- `:active` feedback: `scale(0.98)` on the send button and nav items.
- Reduced motion: all entry/loop animations collapse to instant; sidebar collapse becomes a plain width switch (no spring). Never use `window.addEventListener('scroll')`; no scroll-hijack; no marquees (max one per page and this direction does not use one).
- GPU rule: animate only `transform` and `opacity`.

## 8. Corner Radius + Surface System

One documented system:
- Surfaces (cards, input dock, callouts, skeletons): `0.375rem` (6px). Tight, book-like, never cartoonish.
- Micro controls (icon buttons, send button, scroll button, avatar): fully round `9999px`. Documented exception: micro controls only.
- Sidebar: radius `0` on the binding edge (it is a spine, flush against the viewport edge).
- Elevation: no floating shadows as the default. Hierarchy comes from parchment-vs-leather contrast (`bg-card` on `bg-background`) plus the gold rule. The only shadow: input dock `shadow-sm` tinted `oklch(0.235 0.03 170 / 0.08)` (ink-tinted, not pure black), and popovers `shadow-md` same tint.

## 9. Three Signature Details

1. **The gold start-rule on every citation.** Every ayah/hadith callout carries a 2px gold rule on its start edge plus a tiny gold square ornament (rotated `square` element) at the top of that rule. One glance tells you "this is sourced scripture," the manuscript equivalent of illumination.
2. **Leather binding sidebar with gilded hairlines.** The sidebar is emerald leather: `bg-sidebar` with a 1px `border-sidebar-border` inner hairline framing the whole panel, and a double gold hairline (top border + inner offset line via `border-t`) under the logo and above the footer. It reads as a tooled book cover, not a grey admin rail.
3. **The cream send button pressed into gold.** The send button is a gold circle with a cream paper-colored icon; on hover it gains a subtle `brightness(1.06)` lift, on press `scale(0.98)`. Gold is rationed to exactly this button + nav accents, so the moment of sending feels like stamping a gold seal.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes in all copy and docs (checked: this document uses hyphen only).
- [x] Exactly one accent: gold. Emerald and parchment are neutrals/surfaces, not accents.
- [x] One corner-radius system: 6px surfaces + documented full-round micro-control exception.
- [x] `min-h-dvh`/`h-dvh` flex layout, never `h-screen`.
- [x] RTL first: sidebar on the start (right) side via `dir="rtl"`, all flows mirrored.
- [x] Calm motion: transform/opacity only, reduced-motion honored, no scroll-hijack, no marquee, no `scroll` listeners.
- [x] No AI-purple gradients anywhere; gold is heritage-intentional per the design read.
- [x] Tajawal retained as Arabic UI font; Uthmanic for Quran text; zero new dependencies.
- [x] No generic card-with-border-and-shadow spam: hierarchy via parchment/leather contrast + gold rules.
- [x] Not a centered-hero marketing page: product UI, no hero, no logo wall, no trust strip.
- [x] Copy register: calm, direct, natural Arabic. No filler verbs, no fake-precise numbers.
- [x] Contrast: gold text only on parchment/leather at AA-checked values (primary gold `0.68` on parchment `0.966`), cream on gold for button labels, gold never as large surface fill.

## Notes for the implementing engineer

- Keep `lang="ar"` and `dir="rtl"` in `layout.tsx`; do not flip.
- shadcn sidebar tokens already exist in `app/globals.css`; replace their values with the table above, then `npx shadcn@latest add sidebar` if the component itself is missing.
- The chat page moves from `app/chat/page.tsx` to `app/page.tsx`; the old marketing homepage is deleted.
- `app/layout.tsx` moves `Navbar` out and wraps children in the new shell (sidebar + main region).
- Everything in this spec is implementable with the existing component set (button, card, input, tooltip, sidebar-to-add) plus Tailwind utilities; no new packages.

<!-- TODO: hero image (landscape 1536x1024, chat UI in gilded-manuscript style) - image_gen tool not available in this worker session. Generate or provide before presenting to the user. -->
