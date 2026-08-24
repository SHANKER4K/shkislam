# SHK Islam — Design System (Enhanced)

> **Design Read:** A content-first Islamic knowledge tool for scholars and students, with a calm editorial language. Not a marketing page. The product IS the text — Quran, Hadith, and AI-assisted study. Direction: warm manuscript minimalism, modernized. Scholarly authority without ornament overload.

---

## 0. Design Dials

| Dial | Value | Rationale |
|---|---|---|
| `DESIGN_VARIANCE` | 5 | Asymmetric editorial offset (not centered-generic), but not chaotic |
| `MOTION_INTENSITY` | 4 | Calm transitions only; text is the focus, never spectacle |
| `VISUAL_DENSITY` | 5 | Content-heavy app (Quran + Hadith + chat), but every page needs breathing room |

---

## 1. Palette

One accent only: **terracotta clay** (warm, scholarly, earth-grounded). No gold, no emerald, no purple. Neutrals are warm parchment and sepia ink families.

**Light mode (default):**

| Token | Value | Role |
|---|---|---|
| `--background` | `#F5F0E6` | warm parchment, the scholar's page |
| `--foreground` | `#3A2E22` | sepia ink — body text, never pure black |
| `--card` | `#FAF7F0` | lighter leaf of parchment, raised surfaces |
| `--card-foreground` | `#3A2E22` | |
| `--popover` | `#FAF7F0` | |
| `--popover-foreground` | `#3A2E22` | |
| `--primary` | `#B4552D` | terracotta accent — buttons, active nav, quote rules |
| `--primary-foreground` | `#FAF7F0` | cream on clay |
| `--secondary` | `#EDE7DB` | muted parchment wash for hover states |
| `--secondary-foreground` | `#3A2E22` | |
| `--muted` | `#E8E0D2` | divider-adjacent wash |
| `--muted-foreground` | `#8A7D6E` | ink at 50%, metadata, placeholders |
| `--accent` | `#F0E9DC` | warm tinted wash |
| `--accent-foreground` | `#3A2E22` | |
| `--destructive` | `#9B2C2C` | error red, kept minimal |
| `--destructive-foreground` | `#FAF7F0` | |
| `--border` | `#DDD5C5` | hairline — paper edge tone |
| `--input` | `#DDD5C5` | |
| `--ring` | `#B4552D` | terracotta focus ring |
| `--sidebar` | `#2B2118` | deep umber leather binding |
| `--sidebar-foreground` | `#E8D9C3` | parchment text on leather |
| `--sidebar-primary` | `#D97A4A` | brighter terracotta for AA on dark |
| `--sidebar-primary-foreground` | `#2B2118` | |
| `--sidebar-accent` | `#3D3024` | hover fill on leather |
| `--sidebar-accent-foreground` | `#FAF7F0` | |
| `--sidebar-border` | `#4A3B2E` | gilded hairline on binding |
| `--shadow-color` | `#3A2E22` | all shadows tinted sepia, never pure black |

**Dark mode (lamplight study):**

| Token | Value | Role |
|---|---|---|
| `--background` | `#1E1710` | deep umber, not pure black |
| `--foreground` | `#E8D9C3` | warm parchment text |
| `--card` | `#282018` | raised leather panel |
| `--card-foreground` | `#E8D9C3` | |
| `--popover` | `#282018` | |
| `--popover-foreground` | `#E8D9C3` | |
| `--primary` | `#D97A4A` | lit clay, brighter for dark AA |
| `--primary-foreground` | `#1E1710` | ink on clay |
| `--secondary` | `#3D3024` | umber wash |
| `--secondary-foreground` | `#E8D9C3` | |
| `--muted` | `#352A1F` | |
| `--muted-foreground` | `#A08A6E` | muted parchment at 50% |
| `--accent` | `#3D3024` | warm umber wash |
| `--accent-foreground` | `#E8D9C3` | |
| `--destructive` | `#EF4444` | |
| `--destructive-foreground` | `#FAF7F0` | |
| `--border` | `#4A3B2E` | hairline on dark leather |
| `--input` | `#4A3B2E` | |
| `--ring` | `#D97A4A` | lit clay focus ring |
| `--sidebar` | `#16100C` | near-black leather |
| `--sidebar-foreground` | `#E8D9C3` | |
| `--sidebar-primary` | `#E88F60` | |
| `--sidebar-primary-foreground` | `#16100C` | |
| `--sidebar-accent` | `#2B2118` | |
| `--sidebar-accent-foreground` | `#FAF7F0` | |
| `--sidebar-border` | `#3D3024` | |

**Global shadow scale (tinted sepia):**
```
--shadow-2xs: 0 1px 2px 0px hsl(25 20% 18% / 0.03);
--shadow-xs:  0 1px 2px 0px hsl(25 20% 18% / 0.03);
--shadow-sm:  0 1px 3px 0px hsl(25 20% 18% / 0.04);
--shadow:     0 1px 3px 0px hsl(25 20% 18% / 0.05);
--shadow-md:  0 4px 12px -2px hsl(25 20% 18% / 0.06);
--shadow-lg:  0 8px 20px -4px hsl(25 20% 18% / 0.07);
--shadow-xl:  0 12px 28px -6px hsl(25 20% 18% / 0.08);
--shadow-2xl: 0 16px 40px -8px hsl(25 20% 18% / 0.09);
```

---

## 2. Typography

**Fonts (existing — zero new dependencies):**
- Arabic UI: `Tajawal` (weights 400/500/700/800)
- Quran display: `KFGQPC Uthmanic` (`--font-uthmanic`)
- Latin/numbers: `Inter` (use `font-variant-numeric: tabular-nums` for all verse numbers, counts, metadata)

**Scale:**

| Level | Size | Weight | Letter-spacing | Line-height | Usage |
|---|---|---|---|---|---|
| Display | `text-4xl md:text-5xl` | 800 | `-0.02em` | 1.15 | Page hero headlines (Quran, Hadith index) |
| H1 | `text-3xl` | 700 | `-0.01em` | 1.2 | Section titles |
| H2 | `text-2xl` | 700 | `0` | 1.25 | Card titles, surah names |
| H3 | `text-xl` | 600 | `0` | 1.3 | Subsection headers |
| Label | `text-sm` | 500 | `0.01em` | 1.4 | Nav items, badges, metadata |
| Body | `text-base` (`15-16px`) | 400 | `0` | 1.75 | Arabic body — generous leading for readability |
| Caption | `text-xs` | 500 | `0.02em` | 1.5 | Footnotes, timestamps, source refs |
| Quran | `text-lg` to `text-[28px]` | 400 | `0` | 2.0 | Uthmanic script in callouts and reader |

**Rules:**
- `max-w-[65ch]` on all body paragraphs and chat messages.
- `text-wrap: pretty` on all headings.
- Numbers in metadata: always `tabular-nums`.
- No all-caps Arabic. Ever. Arabic has no uppercase; hierarchy comes from weight and size.

---

## 3. Layout System

### Global Shell

The app is a **single shell** — sidebar + main region — consistent on every page.

```
┌────────────────────────────┬──────────────────────────────────────┐
│  SIDEBAR (leather binding) │  MAIN (parchment page)               │
│  (right side, RTL)         │                                      │
│                            │  ┌──────────────────────────────┐    │
│  [logo]  SHK Islam         │  │  breadcrumbs (if applicable) │    │
│  ──────────────────        │  └──────────────────────────────┘    │
│  [+ New chat]              │                                      │
│                            │  ┌──────────────────────────────┐    │
│  ▸ القرآن الكريم           │  │  page content                │    │
│  ▸ الأحاديث النبوية        │  │  (scrollable, padded)        │    │
│  ▸ المواضيع                │  └──────────────────────────────┘    │
│  ▸ البحث                   │                                      │
│  ▸ المفضلة                 │                                      │
│  ▸ عن المنصة               │                                      │
│  ──────────────────        │                                      │
│  [theme toggle]  [collapse]│                                      │
└────────────────────────────┴──────────────────────────────────────┘
```

- Shell: `flex min-h-[100dvh]`.
- Sidebar: `w-64` expanded, `w-16` collapsed. `collapsible="icon"`. Persisted state.
- Sidebar is on the **start** side — in `dir="rtl"`, start = right. This is correct.
- Main region: `flex-1`, scrollable, every page uses a constrained inner column.
- **NEVER use `h-screen`**. Always `min-h-[100dvh]`.

### Content Widths

| Page | Max Width | Rationale |
|---|---|---|
| Chat | `max-w-3xl` | Reading comfort for AI responses |
| Quran index | `max-w-6xl` | Grid of 114 cards needs room |
| Surah reader | `max-w-4xl` | Wide enough for ayah lines, narrow enough for focus |
| Hadith index | `max-w-3xl` | Only 2 books, centered editorial |
| Hadith book | `max-w-5xl` | Chapter grid + hadith list |
| Themes | `max-w-6xl` | Card grid |
| Favorites | `max-w-4xl` | Grouped lists |
| Search | `max-w-4xl` | Search input + results |
| About | `max-w-3xl` | Editorial single-column |

---

## 4. Spacing System

**Section rhythm (macro):**
- Between major sections on a page: `py-16 md:py-24`
- Within a section, content blocks: `gap-8 md:gap-12`
- Page top padding (below breadcrumbs): `pt-6 pb-8`

**Component rhythm (micro):**
- Card internal padding: `p-5` to `p-6`
- Inline gaps (icon + text, badge row): `gap-2` to `gap-3`
- Input padding: `px-4 py-3`

**Container padding:**
- Mobile: `px-4`
- Tablet+: `px-6`
- Never edge-to-edge text on wide screens.

---

## 5. Surface + Elevation System

One documented radius scale:

| Token | Value | Usage |
|---|---|---|
| Micro | `rounded-md` (6px) | Small buttons, tags, badges |
| Standard | `rounded-lg` (8px) | Cards, nav rows, inputs |
| Elevated | `rounded-xl` (12px) | Tool callouts, popovers, modals |
| Well | `rounded-2xl` (16px) | Chat input dock, floating panels |
| Pill | `rounded-full` | Icon-only buttons, send button, avatars |

**Elevation rules:**
- Hierarchy comes from **tone contrast**, not shadow. A card on parchment uses `bg-card` (lighter) on `bg-background`.
- Shadows are reserved for floating elements: input dock (`shadow-sm`), popovers (`shadow-md`), scroll-to-bottom button (`shadow-sm`).
- All shadows are tinted sepia (`#3A2E22`), never pure black.
- No border + shadow + background on the same element. Pick two max.

---

## 6. Component Specs

### 6.1 Sidebar

- Background: `bg-sidebar` (deep umber leather).
- Text: `text-sidebar-foreground` (warm parchment).
- Active nav item:
  - Text: `text-sidebar-primary` (terracotta).
  - Background: `bg-sidebar-accent`.
  - **Start-edge rule**: 2px terracotta line on the inline-start side (`border-r-2 border-sidebar-primary` in RTL).
- Hover: `bg-sidebar-accent` transition 150ms.
- Collapse toggle at footer.
- Header: logo (28px) + "SHK Islam" in Tajawal 700.
- "New chat" button: full-width, terracotta border (`border-primary/40`), terracotta text, hover fills `bg-primary/10`. Not a big pill — a quiet tooled plate.

### 6.2 Chat Page (Homepage)

The chat is the hero experience. It must feel like correspondence, not a machine interface.

**Empty state:**
- Centered, max-w-md.
- A small CSS ornament (two hairlines crossing + a rotated square, terracotta) — no SVG dependency.
- Headline: Tajawal 800, `text-2xl md:text-3xl`, `tracking-tight`: **"ما الذي تريد أن تتعلمه؟"**
- Subline: `text-muted-foreground`, `text-sm`, max-w-xs: "اسأل عن آية أو حديث أو مسألة، وسأجيبك بمصادر من القرآن والسنة"
- Suggestion chips: `rounded-lg` parchment wells (`bg-card border border-border`), terracotta text on hover, `text-sm`, 3 items max. Clicking fills the input.
- No generic AI-chat 2×2 grid. Chips are a single row that wraps.

**Messages:**
- User turns: right-aligned in flow, `bg-muted/60 rounded-lg px-4 py-3` — a subtle well, not a bubble. Text is `text-foreground`.
- Assistant turns: left-aligned, NO container. Plain `text-foreground` on `bg-background`. The text IS the design.
- Tool callouts (ayah/hadith results): `bg-card rounded-xl p-5 border-r-2 border-primary` (terracotta rule on start edge). Inner source text in Uthmanic font `text-lg leading-loose`. Metadata row above: `text-xs text-muted-foreground` with source reference.
- Streaming loading: skeleton blocks matching message shapes (`bg-muted rounded-lg`), shimmer sweep in parchment tones. The text "سوف ادهشك!" is removed — placeholder text must not ship.
- Send button: solid terracotta circle (`bg-primary text-primary-foreground`), 36px, `rounded-full`. Hover: `brightness-1.06`. Active: `scale-[0.98]`.
- Input dock: `bg-card rounded-2xl border border-input shadow-sm`, inner textarea borderless, placeholder in `text-muted-foreground`.
- Scroll-to-bottom button: floating, `bg-card border border-border rounded-full size-8`, terracotta chevron.

### 6.3 Quran Index (`/quran`)

**Current problem:** 4-column grid of identical cards — the generic AI layout.

**Fix:**
- Headline: Display size, **left-aligned** (not centered). "القرآن الكريم" with a small `text-xs text-muted-foreground` eyebrow above: "١١٤ سورة".
- Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3` — but cards are redesigned.
- **Card redesign:** No border + shadow + background combo. Use: `bg-card rounded-lg p-4` with a 1px `border-border` hairline on hover only. No shadow. The number badge is a `rounded-full bg-muted size-9` with `text-sm font-bold tabular-nums`, NOT a bright primary circle. Revelation type badge (`مكية`/`مدنية`) uses the muted pastel system: `مكية` = pale green bg + green text, `مدنية` = pale blue bg + blue text.
- Hover: `bg-secondary` transition 150ms. No shadow lift.

### 6.4 Surah Reader (`/quran/[n]`)

- Breadcrumbs + back button at top.
- Surah header: centered, Display size name, metadata row below in `text-muted-foreground`.
- **Bismillah line:** Rendered in Uthmanic font, `text-xl`, centered, `text-muted-foreground`, with decorative spacing `py-6`.
- Ayah list: each ayah is a `VerseCard` with the new unified card spec.
- **VerseCard redesign:**
  - Background: transparent (no card). Ayah text sits directly on the parchment page.
  - Verse number: inline `rounded-full bg-muted size-7 text-xs font-bold tabular-nums` — muted, not bright.
  - Action bar (copy, favorite, export, tafsir toggle): appears below the ayah text, `opacity-0 group-hover:opacity-100` on desktop, **always visible on mobile** (`md:opacity-0`). This fixes the mobile-copy bug.
  - Tafsir expand: `bg-card rounded-xl p-5` with a terracotta start-rule. Slides down with `grid-template-rows` or simple height transition.
  - Action buttons: icon-only, `rounded-full size-8 hover:bg-muted`, standardized stroke width 1.5.

### 6.5 Hadith Index (`/hadith`)

- Headline: Display size, left-aligned. Eyebrow: "كتب السنة".
- Only 2 books: use a **split editorial layout** instead of a grid.
  - Left half: large book card with icon + title + description + hadith count.
  - Right half: second book card.
  - On mobile: stack vertically.
- Each card: `bg-card rounded-xl p-8`, no shadow. Icon in a `rounded-lg bg-muted size-14` container. Title in H2. Hover: `bg-secondary`.

### 6.6 Hadith Book Page (`/hadith/[slug]`)

- Chapter grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`.
- Chapter card: `bg-card rounded-lg p-4 text-center`. Chapter number in `tabular-nums`, title in Tajawal 600.
- Hadith list: `space-y-4`. Each hadith is a `HadithCard` with the unified spec.

**HadithCard redesign:**
- `bg-card rounded-xl p-5 border-0 shadow-none`. No generic card-with-border-and-shadow.
- Top row: book name badge (`bg-muted text-muted-foreground text-xs` — NOT a border-outline badge), hadith number (`tabular-nums`), grade badge with **dot + label** system:
  - `صحيح`: pale green bg (`#EDF3EC`) + green dot `#4A7C59`
  - `حسن`: pale yellow bg (`#FBF3DB`) + yellow dot `#B4882E`
  - `ضعيف`: pale red bg (`#FDEBEC`) + red dot `#9B2C2C`
- Text: `font-arabic text-base leading-relaxed`. Sanad in `text-muted-foreground`, matn in `text-foreground` bold.
- Narrator row: `text-sm text-muted-foreground`.
- Action bar: same pattern as VerseCard — `group-hover` on desktop, always visible on mobile.
- Sharh expand: same treatment as Tafsir — `bg-card rounded-xl p-5` with terracotta start-rule.

### 6.7 Themes Page (`/themes`)

**Current problem:** Literal 3-column equal feature-card grid — the most generic AI layout.

**Fix:**
- Headline: Display size, left-aligned.
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` but with **visual diversity**:
  - First theme card spans 2 columns on `lg` if there are >= 4 themes (`lg:col-span-2`).
  - Each card has a **subtle gradient tint** based on theme category (not random — assign from a fixed set of 4 muted pastels).
  - Cards have a small icon or Arabic letter mark in the corner (`text-[40px] text-muted-foreground/10` — ghost watermark).
- Card: `bg-card rounded-xl p-6` with an internal top border (`border-t-2 border-primary/20`). No shadow.

### 6.8 Favorites Page (`/favorites`)

**Current problem:** Dense, utilitarian, cramped.

**Fix:**
- Header: heart icon (filled terracotta, `size-6`) + "المفضلة" in H1 + count badge (`bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs`).
- Empty state: centered, generous `py-24`. Heart icon `size-16 text-muted-foreground/20`. Headline: "لم تضف أي شيء بعد" in H3. Subline + two CTA buttons (`rounded-lg bg-primary text-primary-foreground` for primary, `rounded-lg border border-input` for secondary).
- Grouped ayahs: surah name is a **sticky section header** (`sticky top-0 bg-background py-2 z-10`) with a 1px bottom border, NOT just a text link.
- Hadith groups: book name as section header, chapter names as H4.
- Cards: `bg-card rounded-lg p-4` with hover `bg-secondary`. Action buttons always visible on mobile.

### 6.9 Search Page (`/search`)

- Headline: H1, left-aligned: "البحث المتجه".
- Search input: `bg-card rounded-2xl border border-input shadow-sm`, large (`text-lg`), with a terracotta submit icon inside.
- Results: grouped by source (Quran / Hadith). Each group has a sticky header.
- Result cards: same treatment as VerseCard/HadithCard but compact.

### 6.10 About Page (`/about`)

**Current problem:** Plain HTML sections, no visual treatment.

**Fix:**
- Headline: Display size, left-aligned.
- Content: `max-w-3xl`, generous `leading-relaxed`.
- Sources section: use a **2-column card grid** instead of a bullet list. Each source (Quran API, Hadith API) gets its own card with icon, title, and description.
- Add a footer-like closing section with the platform tagline and links.

---

## 7. Motion Spec

**Intensity: calm (4/10).** Every animation is state-driven, never decorative.

### Allowed Motions
| Trigger | Effect | Duration | Easing |
|---|---|---|---|
| Element first appears (mount) | `opacity 0→1`, `translateY(8px→0)` | 240ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Hover on card/nav | `background-color` shift | 150ms | ease-out |
| Hover on button | `brightness(1.05)` or `translateY(-1px)` | 150ms | ease-out |
| Active / pressed | `scale(0.98)` or `translateY(1px)` | 80ms | ease-in |
| Sidebar collapse | width layout switch (no animation on width) OR `transform: translateX` on content | 250ms | springish `cubic-bezier(0.16, 1, 0.3, 1)` |
| Expand/collapse (tafsir/sharh) | `grid-template-rows` or `max-height` with opacity | 250ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Skeleton shimmer | `background-position` sweep | 2s loop | linear (gated by `prefers-reduced-motion`) |
| Streaming text | no animation, text appears instantly | — | — |

### Banned Motions
- `window.addEventListener('scroll')` — hard ban.
- Parallax, scroll-hijack, marquees.
- Infinite decorative loops on anything except loading skeletons.
- `top`, `left`, `width`, `height` animations — use `transform` only.
- `layout` prop on static content.

### Reduced Motion
All entry animations collapse to instant. Spring transitions become instant. Shimmer removed. `scale` active state becomes instant opacity shift.

---

## 8. Iconography

**Current problem:** Lucide icons exclusively — the default AI choice.

**Fix:** Keep Lucide (already in deps) but **standardize** to avoid the "default" feel:
- Stroke width: `1.5` globally (not the default 2).
- Size: `size-4` for inline, `size-5` for nav, `size-6` for empty states.
- Use consistent metaphors:
  - Quran: `BookOpen`
  - Hadith: `BookMarked`
  - Themes: `Library`
  - Search: `Search`
  - Favorites: `Heart` (filled when active)
  - About: `Info`
  - Theme toggle: `Sun` / `Moon`
  - Copy: `Copy`
  - Export: `Share` (NOT `Image`)
  - Delete: `Trash2`
  - Expand: `ChevronDown` / `ChevronUp`
  - Send: `ArrowUp` (inside circle)
  - Scroll down: `ChevronDown`
  - Back: `ArrowRight` (RTL-correct)

**No icon-only buttons without labels** unless the context is absolutely unambiguous (copy, favorite, delete in a card action bar is acceptable because the pattern is established).

---

## 9. Image & Asset Strategy

- **No stock photos.** This is a text product.
- **Logo:** keep the existing `logo.png`. Render at 28px in sidebar, 56px in chat empty state.
- **Ornaments:** All decorative elements are CSS — rotated squares, hairlines, borders. No SVG illustrations.
- **Grain texture (optional but recommended):** One fixed `pointer-events-none` overlay across the entire app:
  ```css
  .grain {
    position: fixed; inset: 0; z-index: 9999; pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  ```
  - Light mode: black noise at 2.5% opacity.
  - Dark mode: white noise at 2% opacity.
  - Remove entirely under `prefers-reduced-transparency`.

---

## 10. Z-Index Scale

Documented, no arbitrary values:

| Layer | Z-Index | Elements |
|---|---|---|
| Base | 0 | All content |
| Elevated | 10 | Sticky section headers, floating buttons |
| Overlay | 20 | Popovers, dropdowns |
| Modal | 30 | Modals, dialog backdrops |
| Grain | 9999 | Fixed noise overlay (pointer-events: none) |

---

## 11. Implementation Order

Do NOT change everything at once. Apply in this order for minimum risk:

1. **Palette swap** — update `globals.css` color tokens. This alone transforms the feel.
2. **Sidebar styling** — apply leather binding colors + terracotta active rule.
3. **Chat page redesign** — empty state, message styling, input dock. This is the homepage.
4. **Card unification** — update `VerseCard` and `HadithCard` surfaces, remove border+shadow spam.
5. **Action bar mobile fix** — make copy/favorite/export always visible on mobile.
6. **Page heading restyle** — bump to Display size, left-align where appropriate.
7. **Themes page grid break** — add `col-span-2` and gradient tints.
8. **Favorites whitespace** — empty state, sticky group headers.
9. **About page visual treatment** — source cards instead of list.
10. **Motion polish** — add hover/active states, entry transitions, reduced-motion gating.
11. **Grain overlay** — optional final texture layer.

---

## 12. Anti-Slop Self-Audit

- [x] Exactly **one accent**: terracotta `#B4552D`. No gold, no emerald, no purple.
- [x] No generic AI-purple gradients anywhere.
- [x] No beige+brass e-commerce cliché.
- [x] No border + shadow + background on the same card.
- [x] One radius system: 6/8/12/16/pill, documented.
- [x] `min-h-[100dvh]` everywhere, no `h-screen`.
- [x] RTL first: sidebar on start (right), all flows mirrored.
- [x] No all-caps Arabic. Hierarchy via weight/size only.
- [x] No em-dashes in copy. Plain Arabic.
- [x] No placeholder text shipped ("سوف ادهشك!" removed).
- [x] No `window.addEventListener('scroll')`.
- [x] Motion: transform/opacity only, reduced-motion honored.
- [x] Shadows tinted sepia, never pure black.
- [x] Grain: fixed, pointer-events-none, not on scrolling containers.
- [x] Contrast: body ink `#3A2E22` on `#F5F0E6` ~10:1. Terracotta on parchment ~4.6:1 (used for affordances, not body text).
- [x] Zero new dependencies: Tajawal, Inter, Uthmanic already loaded.
- [x] Lucide retained but standardized (stroke 1.5, size discipline).
