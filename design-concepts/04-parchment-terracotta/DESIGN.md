# Design Direction 04: PARCHMENT TERRACOTTA

## 1. Design Read

Reading this as: a warm, scholarly AI chat app for Islamic students, with a vintage-library editorial language, leaning toward aged parchment surfaces + sepia ink + a single clay-terracotta accent, chat shaped like letters exchanged in a library.

## 2. Concept Narrative

The chat is not a machine interface, it is a correspondence with a scholar. Every exchange reads like a letter written on paper that has aged well: warm parchment ground, sepia ink for text, and clay terracotta only where the hand reaches (the send button, the active nav mark, the quote rules around ayahs and hadiths). The sidebar is a leather-and-paper folio: a parchment panel with a subtle fibre grain, closed by a brass-less clasp (just a clean chevron). The design earns its warmth from texture, not from generic cream: visible paper grain, ink weight hierarchy, clay surfaces with soft edges. No beige-brass e-commerce cliché, no AI-purple anywhere. The whole app feels like it belongs on a scholar's desk, and the AI answers feel like they were written in the same hand.

## 3. Palette

Light mode (parchment daylight):
- Background: `#F4EDDD` (warm parchment, slightly textured, not flat cream)
- Surface (cards, sidebar panel, input well): `#FBF6EA` (lighter leaf of the same paper)
- Surface elevated (hover, active wells): `#F7EFDF`
- Primary accent (clay terracotta): `#B4552D` (saturated but muted clay, AA-safe on parchment)
- Primary foreground (text on clay): `#FBF6EA`
- Secondary (sepia ink): `#5C4633` (warm dark ink, not pure black)
- Text (body): `#4A3B2E` on parchment, reading contrast ~9:1
- Muted text: `#8A735C`
- Borders: `#E0D3BC` (hairline, paper-edge tone)
- Focus ring: `#B4552D` at 40% + 2px ring
- Shadow tint: `#3A2E22` at 6-10% (never pure black)

Dark mode (lamplight study):
- Background: `#221A12` (deep umber, not pure black)
- Surface: `#2B2118`
- Surface elevated: `#33271C`
- Primary accent (lit clay, brighter for dark): `#D97A4A`
- Primary foreground: `#221A12`
- Secondary (ink-light): `#D9C7AE`
- Text: `#E8D9C3`
- Muted text: `#A08A6E`
- Borders: `#3E3023`
- Focus ring: `#D97A4A` at 40%

One accent rule: terracotta appears only on interactive affordances and quote rules. Ink and parchment do the rest.

## 4. Typography

- Arabic UI: Tajawal (already loaded, `--font-arabic`). Weights: 400 body, 500 labels, 700 titles, 800 for the chat empty-state headline only. No new font dependency.
- Quran display: Uthmanic (`--font-uthmanic`) for ayah text inside tool callouts and message quotes. Never for UI chrome.
- Latin/numbers: Inter already loaded; use tabular figures for any metadata (surah:ayah refs) via `font-variant-numeric: tabular-nums`.
- Display moves: headlines in Tajawal 700/800 with `tracking-tight`; metadata (page titles in sidebar, empty-state eyebrow) in Tajawal 500, `text-[11px]` with `letter-spacing: 0.08em` and uppercase where Latin, but Arabic has no uppercase, so use weight + size for hierarchy instead of case. Never all-caps-and-spaced the Arabic.
- Ink weight hierarchy: body `text-[15px]` `leading-relaxed`; quoted ayahs/hadiths `text-lg` Uthmanic `leading-loose`.

## 5. Layout System

Chat shell wireframe (dir=rtl, so the sidebar is the right column):

```
┌─────────────────────────────────────────────────────────────┐
│ PARCHMENT SIDEBAR (right)    │ CHAT COLUMN (left)           │
│ ┌──────────────────────────┐ │                              │
│ │ ✦ SHK Islam        [<<] │ │                              │
│ │ ──────────────────────── │ │      [composed empty state] │
│ │ [+ New chat]             │ │                              │
│ │                          │ │      prompt suggestion      │
│ │ ▸ القرآن الكريم          │ │      chips (3)              │
│ │ ▸ الأحاديث النبوية       │ │                              │
│ │ ▸ المواضيع               │ │                              │
│ │ ▸ المفضلة                │ │      ┌──────────────────┐   │
│ │ ▸ البحث                  │ │      │ parchment input  │   │
│ │ ▸ حول المنصة              │ │      │ well (clay ring) │   │
│ │ ──────────────────────── │ │      │ [text…] [▶ clay] │   │
│ │ 🌙 theme   [collapse ▸]  │ │      └──────────────────┘   │
│ └──────────────────────────┘ │                              │
└─────────────────────────────────────────────────────────────┘
```

- Shell: `flex min-h-[100dvh]`; sidebar `w-72` collapsible to `w-16` (icon rail) via a chevron at its bottom. In RTL the sidebar is the first flex child = right side.
- Sidebar treatment: parchment panel, hairline right border (left border in RTL layout terms, the edge facing the chat), subtle paper-grain overlay. Active item: clay text + a 2px clay rule on the inline-start edge. New chat button: clay solid pill.
- Chat column: `flex-1 flex flex-col min-h-[100dvh]`, messages centered `max-w-2xl mx-auto`, input docked at the bottom in a parchment well with a clay submit button inside.
- The page grid never uses `h-screen`; every full-height region is `min-h-[100dvh]`.

## 6. Component Inventory

- Chat input: parchment well `rounded-2xl` (radius 16px), hairline border `#E0D3BC`, inner shadow from the top (ink-shadow tinted), clay circular submit button `size-10 rounded-full` inside the well at the inline-end, `scale-[0.98]` on `:active`. Placeholder in muted sepia.
- Message bubbles: NO bubbles. Messages sit directly on the parchment column, user messages aligned to the inline-end with a clay hairline on their edge, assistant messages aligned inline-start with no container, only ink text. This is a letter, not a thread of stickers.
- Tool callouts (ayah/hadith): an inked card, `rounded-xl`, background surface, 2px clay rule on the inline-start edge, Uthmanic text, small metadata row (surah:ayah or book:number) in tabular numerals + muted sepia. Title of tool in Tajawal 500.
- Sidebar nav items: full-width rows `rounded-lg` (8px), 8px padding, hover background surface-elevated + ink text; active gets clay text + edge rule. Icons: Phosphor-style outlined (project already on lucide; keep lucide to avoid a new dependency, stroke-width 1.75 globally).
- Empty state: centered composition, Uthmanic ayah as a large faint ornament? No. Keep it clean: Tajawal 800 headline, one muted line, three suggestion chips (parchment wells, clay hover) that fill the input on click.
- Loading: skeleton blocks shaped like the message column (lines + a callout block), shimmering in parchment tones (surface-elevated sweep), never a spinner loop. Shimmer already exists in ai-elements; recolor it.
- Scroll button: a floating clay pill at the bottom of the conversation, appears on scroll-up.

## 7. Motion Spec

- Calm, `MOTION_INTENSITY: 3`. Motivated only: state transitions (message entry, sidebar collapse, scroll button) and feedback (button press, hover).
- Message entry: `opacity 0→1` + `translateY(8px→0)`, 240ms, ease-out, transform/opacity only.
- Sidebar collapse: `width` is layout-affecting; animate `transform: translateX` of the content column instead, 250ms spring-ish cubic-bezier(0.16,1,0.3,1). Icon rail is a layout state, not an animation.
- Hover: `background-color` 150ms; press: `scale-[0.98]`.
- `prefers-reduced-motion: reduce` kills all of it (instant opacity, no translate, no spring).
- No scroll-hijack, no parallax, no marquee, no infinite loops.

## 8. Corner Radius + Surface System

- One system, three steps: interactive small (inputs, buttons, nav rows) `rounded-lg` 8px; tool callouts and input well `rounded-xl` 12px; big containers (sidebar panel) `rounded-2xl` 16px optional or 0 for full-bleed edge (prefer edge-to-edge on the shell, radius only on floating elements).
- Elevation via tone, not shadow: elevated = lighter parchment (surface vs background). Shadows are reserved for floating elements (scroll button, input well) and tinted `#3A2E22` at low opacity.
- Grain: one fixed `pointer-events-none` overlay (`position: fixed; inset: 0; z-index: 60`), a tiny SVG feTurbulence noise at ~3% opacity, baked into the app root, never animated, removed entirely under `prefers-reduced-transparency` if honored, else kept static.

## 9. Three Signature Details

1. The inked quote rule: every ayah/hadith callout gets a 2px clay rule with a small ink finial dot at its top (a tiny SVG circle), making quotes feel stamped, not boxed.
2. The leaf-of-paper elevation: surfaces differ by tone only (parchment leaf over paper), so the app reads as stacked paper, not floating cards. No drop shadows on cards, ever.
3. The clay inkwell send button: the submit button is a solid clay disc with the paper color used for the arrow glyph, pressed with `scale-[0.98]`; it is the only pure-clay element on screen at rest, so the eye lands on where the hand acts.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dash characters anywhere in spec or copy, only the ASCII hyphen is used. Re-read copy: passes.
- [x] Exactly ONE accent: terracotta `#B4552D` light / `#D97A4A` dark, used identically across the whole page.
- [x] One corner-radius system: 8/12/16 scale as defined.
- [x] `min-h-[100dvh]` everywhere, no `h-screen`.
- [x] RTL first: sidebar on the right (inline-start), collapse chevron position mirrored, input well submit on the inline-end.
- [x] Motion: transform/opacity only, reduced-motion honored, no scroll-hijack.
- [x] No AI-purple, no beige+brass cliché (warmth comes from grain + ink weight, not cream-gold).
- [x] Grain is a fixed pointer-events-none overlay, never animated on scroll.
- [x] Zero new dependencies: Tajawal, Inter, Uthmanic, lucide all already in the project.
- [x] Contrast: body ink `#4A3B2E` on `#F4EDDD` ~9:1; clay `#B4552D` on parchment ~4.6:1 (AA for large text/UI, used for affordances not body); dark mode re-checked with brighter clay `#D97A4A`.
- [x] No em-dash in the generated image copy either (image copy uses plain Arabic labels).
