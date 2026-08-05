# Design Direction 07 - Lapis Celadon

## 1. Design Read

Reading this as: a jewel-box AI chat surface for students of Islamic knowledge, with a color-forward sacred-geometry language, leaning toward saturated lapis lazuli blue surfaces, celadon ceramic accents, and fine gold linework (Tailwind tokens, zero new dependencies). The most saturated direction in the fleet, executed with intent.

## 2. Concept Narrative

The app is not a grey chat rail, it is the blue of a mosque's dome and the blue of lapis-ground manuscripts, made into software. Lapis lazuli is the hero surface: deep, saturated, unmistakably blue, the color field the conversation lives in. Celadon is the calm ceramic secondary, used for the second layer of surfaces and quiet fills. Gold is rationed to the fine linework and the mark: the logo, focus rings, the start-rule on every citation, and the send button. The chat feels like handling a jeweled object: the conversation floats on a lapis ground, ayah and hadith citations arrive as thin gold-ruled panels, and the whole thing stays composed and quiet despite its saturation because blue is doing the heavy lifting, not the accent. It is rich, but controlled: lapis and celadon are surfaces, gold is the only accent, and no element ever screams.

## 3. Palette

All values are oklch. Gold is THE single accent. Lapis blue and celadon green are the surface/neutrals family. No other hues; the warmth comes only from the gold accent.

### Light mode

Reasoning: even in light mode this direction stays blue-forward. The "light" surface is a pale lapis-washed sky, not a sterile white; the deep lapis moves into the sidebar (the dome). Cards are celadon-washed. Gold carries all interaction.

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.94 0.02 230)` | pale lapis sky, page ground |
| `--foreground` | `oklch(0.22 0.03 255)` | deep lapis ink |
| `--card` | `oklch(0.905 0.028 205)` | celadon-washed raised surface |
| `--card-foreground` | `oklch(0.22 0.03 255)` | |
| `--popover` | `oklch(0.905 0.028 205)` | |
| `--popover-foreground` | `oklch(0.22 0.03 255)` | |
| `--primary` | `oklch(0.72 0.125 82)` | gold (single accent) |
| `--primary-foreground` | `oklch(0.95 0.02 230)` | pale lapis on gold |
| `--secondary` | `oklch(0.84 0.045 200)` | celadon wash, hover fills |
| `--secondary-foreground` | `oklch(0.25 0.03 255)` | |
| `--muted` | `oklch(0.89 0.025 215)` | quiet wash between surfaces |
| `--muted-foreground` | `oklch(0.45 0.025 250)` | lapis ink at 50% |
| `--accent` | `oklch(0.83 0.06 190)` | brighter celadon, selected fills |
| `--accent-foreground` | `oklch(0.22 0.03 255)` | |
| `--destructive` | `oklch(0.577 0.19 27)` | kept for errors only |
| `--border` | `oklch(0.72 0.035 230)` | lapis hairline |
| `--input` | `oklch(0.72 0.035 230)` | |
| `--ring` | `oklch(0.72 0.125 82)` | gold focus ring |
| `--sidebar` | `oklch(0.26 0.065 265)` | deep lapis dome |
| `--sidebar-foreground` | `oklch(0.93 0.02 210)` | pale celadon on lapis |
| `--sidebar-primary` | `oklch(0.76 0.125 82)` | gold nav accent |
| `--sidebar-primary-foreground` | `oklch(0.22 0.05 265)` | |
| `--sidebar-accent` | `oklch(0.33 0.07 265)` | hover fill on lapis |
| `--sidebar-accent-foreground` | `oklch(0.95 0.02 210)` | |
| `--sidebar-border` | `oklch(0.4 0.05 270)` | darker lapis hairline |

### Dark mode

Reasoning: the dome closes in. The page ground becomes deep ink-lapis, the sidebar becomes a darker still lapis, celadon dims to a candle-green, and the gold accent brightens slightly to hold contrast on the dark field.

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.16 0.035 255)` | deep lapis-night |
| `--foreground` | `oklch(0.93 0.015 210)` | pale celadon |
| `--card` | `oklch(0.2 0.035 250)` | raised lapis |
| `--card-foreground` | `oklch(0.93 0.015 210)` | |
| `--popover` | `oklch(0.22 0.038 252)` | |
| `--popover-foreground` | `oklch(0.93 0.015 210)` | |
| `--primary` | `oklch(0.78 0.13 85)` | brighter gold |
| `--primary-foreground` | `oklch(0.18 0.04 255)` | deep lapis on gold |
| `--secondary` | `oklch(0.26 0.045 210)` | dim celadon fill |
| `--secondary-foreground` | `oklch(0.9 0.02 210)` | |
| `--muted` | `oklch(0.23 0.03 255)` | |
| `--muted-foreground` | `oklch(0.7 0.02 210)` | |
| `--accent` | `oklch(0.3 0.05 200)` | celadon-glow fill |
| `--accent-foreground` | `oklch(0.93 0.015 210)` | |
| `--destructive` | `oklch(0.65 0.19 25)` | errors only |
| `--border` | `oklch(0.32 0.03 250)` | |
| `--input` | `oklch(0.34 0.03 250)` | |
| `--ring` | `oklch(0.78 0.13 85)` | gold focus ring |
| `--sidebar` | `oklch(0.13 0.04 262)` | darkest lapis |
| `--sidebar-foreground` | `oklch(0.9 0.02 210)` | |
| `--sidebar-primary` | `oklch(0.8 0.13 85)` | |
| `--sidebar-primary-foreground` | `oklch(0.15 0.04 262)` | |
| `--sidebar-accent` | `oklch(0.2 0.045 262)` | |
| `--sidebar-accent-foreground` | `oklch(0.93 0.015 210)` | |
| `--sidebar-border` | `oklch(0.28 0.04 262)` | |

## 4. Typography

Tajawal stays as the Arabic UI font (weights 400/500/700/800 are loaded). KFGQPC-Uthmanic-HAFS is loaded for Quran text and stays for all source scripture inside citations. Inter remains the Latin pairing for numerals, references, and metadata. No new font dependencies.

- Display (empty-state headline, section titles): Tajawal 800, `tracking-tight`, `text-2xl` to `text-4xl`. Lapis or pale-celadon per mode; never gold as a large type face.
- Body/chat copy: Tajawal 400/500, `text-base`, `leading-relaxed`, `max-w-[65ch]`.
- Metadata (references, timestamps, tool names): Inter or Tajawal 400 `text-sm` with `tabular-nums` for any numerals; `text-muted-foreground`.
- The only gold typographic use: small labels and the emphasized active nav label, both `text-primary`, both short strings on dark lapis (sidebar) where AA holds.

## 5. Layout System

Shell: same chat-first skeleton as the fleet. Sidebar on the `start` side (right in `dir="rtl"`), collapsible to an icon rail. Main region = chat column. Other pages (Quran, Hadith, Themes, Favorites, Search, About) inherit the shell with the sidebar always present.

```
LAPIS CELADON - chat shell (RTL, direction: right-to-left)
┌──────────────────────────────────┬────────────────────────────────┐
│ ⬡ logo + SHK Islam   (gold)     │                                │
│ ─────────────────────           │                                │
│ ＋ New chat   (gold)            │───────────────────────────      │
│ ─────────────────────           │  center column max-w-3xl       │
│ قرآن  ⬡  (gold active)          │  mx-auto                       │
│ Hadith                          │                                │
│ Themes        ┌─────────────────│────────────────────────────┐    │
│ Favorites     │ Empty state (centered on lapis):            │    │
│ Search        │   ⬡ gold mark                               │    │
│ About         │   "ما الذي تبحث عنه؟" Tajawal 800           │    │
│ ───────────── │   3 suggested-question pills (celadon,       │    │
│ theme avatar  │   gold border on hover)                      │    │
│               └─────────────────│────────────────────────────┘    │
│  (collapsed: 64px icon rail)   │                                │
└──────────────────────────────────┼────────────────────────────────┘
                                   │ messages scroll freely        │
                                   │  (assistant: plain on sky)     │
                                   │  (user: celadon inset)         │
                                   │  (citations: gold-ruled panels)│
                                   ┌──────────────────────────┐      │
                                   │ input dock (celadon,     │      │
                                   │ gold send jewel)         │      │
                                   └──────────────────────────┘      │
                                   h-dvh flex layout, never h-screen │
```

Implementation notes:
- Shell = `flex h-dvh` (or `min-h-dvh` with inner scroll) inside layout; sidebar on `start` side. `dir="rtl"` makes start = right, so sidebar renders right, ChatGPT mirrored.
- Sidebar: shadcn `sidebar`, `collapsible="icon"`. Width 264px expanded, 64px icon rail collapsed. Deep lapis ground `bg-sidebar`, thin `border-sidebar-border` hairline framing, gold disambiguation only on logo + active.
- Main chat column: `flex flex-col`, inner scroll region with center `max-w-3xl mx-auto`, input dock pinned bottom (`mt-auto`), celadon surface (`bg-card`), 1px lapis border, gold send jewel.
- Other pages: sidebar always present; content scrolls in main region with `max-w-4xl mx-auto px-6 py-8`; Quran reader keeps a wider `max-w-5xl` for surah display within the main region.
- Old top `Navbar` removed for chat surfaces; logo moves to sidebar header; theme toggle to sidebar footer.

## 6. Component Inventory

- **Sidebar nav items**: 40px row, `text-sm`, `text-sidebar-foreground/80`, hover = `bg-sidebar-accent` + right-aligned 1px gold inset rule, active = `bg-sidebar-accent` + gold text + gold start rule. Icon 18px `strokeWidth={1.5}`. Icons tint `text-sidebar-foreground/70`, active icons `text-sidebar-primary`.
- **New chat button**: quiet full-width plate, `bg-sidebar-accent/60`, gold border `border-primary/40`, `text-sidebar-primary` label. Hover lifts to `bg-sidebar-accent` + gold text. Not a loud pill, a gilded plate on lapis.
- **Chat input dock**: rounded `0.5rem`, celadon `bg-card`, 1px `border-input`, borderless inner textarea, right-aligned (RTL) gold circular send jewel 36px, gold icon. Focus ring gold `ring-2 ring-ring/60`.
- **User message**: celadon inset `bg-secondary/50` rounded `0.5rem`, no hard bubble box, `max-w-[70ch]`. Distinguishable from plain assistant text without bubble chrome.
- **Assistant message**: plain text on the sky/lapis ground, no surface. Tool/step chips (`tool_result` stream) as small gold-outlined text pills, not cards.
- **Citation callout (ayah/hadith)**: the jewel of this direction. Celadon-washed panel `bg-card` with a 2px gold rule on the start edge + a small gold diamond (rotated square) at the top of that rule, `rounded-[0.375rem]`, `p-4`. A thin gold hairline runs the top edge of the panel. Uthmanic font for the source text, small gold label row above ("القرآن الكريم - سورة البقرة") with source reference in `text-muted-foreground`, copy action available. The citation reads as a gilded ceramic tile.
- **Empty state**: centered, `max-w-md`, gold mark (CSS hairlines + rotated-square diamond, no SVG dep), Tajawal 800 `text-xl` headline, one muted line of guidance, three suggested-question pills (celadon fill, gold border on hover).
- **Loading**: skeleton blocks matching message shapes, `bg-muted` with a celadon shimmer keyframe. Send button shows a gold pulsing dot while streaming.
- **Scroll button**: floating circular 32px, `bg-card` (celadon) + gold border, sits above the dock.

## 7. Motion Spec

- Intensity: calm (MOTION 3-4). Every animation serves a state transition or feedback; nothing decorative.
- Allowed: 150-250ms `transform` + `opacity` transitions on hover/active/expand. Sidebar collapse/expand spring `type: "spring", stiffness: 300, damping: 30`.
- Message entry: fade + `translateY(4px)` over 200ms on mount only. Streaming text: no animation.
- Shimmer on skeletons: 2s loop, `opacity`/`background-position` only, gated behind `@media (prefers-reduced-motion: no-preference)`.
- `:active` feedback: `scale(0.98)` on send jewel and nav items.
- Reduced motion: all entry/loop animations collapse to instant; sidebar collapse becomes a plain width switch. Never `window.addEventListener('scroll')`; no scroll-hijack; no marquee.
- GPU rule: animate only `transform` and `opacity`.

## 8. Corner Radius + Surface System

- Surfaces (cards, input dock, callouts, skeletons): `0.375rem` (6px). Tight, ceramic-tile precision, never cartoonish.
- Micro controls (icon buttons, send jewel, scroll button, avatar): fully round `9999px`. Documented exception: micro controls only.
- Sidebar: radius `0` on the spine edge (flush against viewport edge), like the wall of the dome.
- Elevation: no floating shadows as default. Hierarchy comes from lapis-dome vs celadon-tile vs pale-sky contrast plus gold rules. Only shadows: input dock `shadow-sm` tinted `oklch(0.22 0.03 255 / 0.08)` (lapis-tinted, not pure black), popovers `shadow-md` same tint.

## 9. Three Signature Details

1. **The gold start-rule + top hairline on every citation.** Every ayah/hadith callout is a celadon panel with a 2px gold start-rule, a tiny gold diamond at the top of that rule, and a 1px gold hairline across the top edge. One glance says "sourced scripture", the glazed-tile equivalent of illumination. This is THE recurring motif of the direction.
2. **The lapis dome sidebar with a gold crown.** The sidebar is deep lapis with a single 1px gold hairline across the top of the panel (the "gilt dome edge") under the logo, and a darker lapis `border-sidebar-border` inner frame. It reads as a tiled mosque wall, not an admin rail.
3. **The gold send jewel.** The send button is a small gold circle with a pale-lapis icon; on hover a subtle `brightness(1.06)` lift, on press `scale(0.98)`. Gold is rationed to exactly this button + logo + citation rules + nav accents, so sending feels like pressing a golden seal onto a tile.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes in all copy and docs (this document uses hyphen only).
- [x] Exactly one accent: gold. Lapis and celadon are the surface/neutral family, never accents.
- [x] One corner-radius system: 6px surfaces + documented full-round micro-control exception.
- [x] `h-dvh`/`min-h-dvh` flex layout, never `h-screen`.
- [x] RTL first: sidebar on the start (right) side via `dir="rtl"`, all flows mirrored.
- [x] Calm motion: transform/opacity only, reduced-motion honored, no scroll-hijack, no marquee, no `scroll` listeners.
- [x] No AI-purple: lapis is a blue (hue ~255-265), sapphire-family, not a purple gradient; the equalized saturation is confined to surfaces, not gradient blobs.
- [x] Tajawal retained as Arabic UI font; Uthmanic for Quran; zero new dependencies.
- [x] No generic card-with-black-shadow spam: hierarchy via lapis/celadon contrast + gold rules, shadows lapis-tinted.
- [x] Not a centered-hero marketing page: product UI, no hero, no logo wall, no trust strip.
- [x] Copy register: calm, direct, natural Arabic. No filler verbs, no fake-precise numbers.
- [x] Contrast: gold text only on dark lapis/ceramic surfaces at AA-checked values (gold `0.72` on sidebar `0.26` in light; gold `0.78` on background `0.16` in dark). Gold never used as a large filled surface; pale-lapis (`primary-foreground`) sits on gold for button labels.

## Notes for the implementing engineer

- Keep `lang="ar"` and `dir="rtl"` in `layout.tsx`; do not flip.
- shadcn sidebar tokens already exist in `app/globals.css`; replace values with the table above, then `npx shadcn@latest add sidebar` if the component is missing.
- Chat moves from `app/chat/page.tsx` to `app/page.tsx`; old marketing homepage deleted.
- `app/layout.tsx` moves `Navbar` out and wraps children in the new shell (sidebar + main region).
- All implementable with the existing component set (button, card, input, tooltip, sidebar-to-add) plus Tailwind utilities; no new packages.

<!-- TODO: hero image (landscape, chat UI in lapis-celadon style) - image_gen tool not available in this worker session; SVG mockup provided as hero.svg. Regenerate hero via image_gen before presenting to the user. -->