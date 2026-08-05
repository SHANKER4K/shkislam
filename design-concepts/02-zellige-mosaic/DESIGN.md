# Design Direction 02: Zellige Mosaic

## 1. Design Read

Reading this as: a ChatGPT-style AI chat product for an Islamic knowledge platform, with a Moroccan zellige identity - deep teal and gold, angular tiles, the 8-pointed khatam star as the brand mark, geometry as identity rather than decoration.

## 2. Concept Narrative

The chat is a tiled courtyard. Every surface behaves like a tessellation: the sidebar is a deep teal tile wall, the message column is warm ivory grout, and the gold seams between tiles are the hairlines that separate content. The 8-pointed star (the khatam, two overlapping squares) is the single motif, repeated at three controlled scales - the brand mark (avatar, send button, empty state), the divider seams (a star at the start of every message separator), and the background texture (a faint starfield at 4-6% opacity, never competing with content). Nothing curved: radius 0 everywhere, because zellige is cut tile, not clay. The product says: the answer is structured, the knowledge is ordered, the geometry is the promise.

## 3. Palette

All values in oklch to match the existing token system. Gold is the ONE accent. Teal is the structural base (surfaces, not decoration). Ivory is the ground.

### Light

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.972 0.006 90)` | page ground, ivory grout |
| `--surface` (card/popover) | `oklch(0.988 0.005 90)` | panels on ivory |
| `--teal-base` | `oklch(0.33 0.045 215)` | sidebar bg, send button, user tiles |
| `--teal-deep` | `oklch(0.27 0.04 218)` | sidebar hover, pressed states |
| `--ink` (foreground) | `oklch(0.25 0.02 225)` | primary text |
| `--muted` | `oklch(0.55 0.02 215)` | secondary text |
| `--gold` (accent) | `oklch(0.72 0.10 80)` | focus rings, active borders, star motifs, hover edges |
| `--gold-deep` (text-safe gold) | `oklch(0.52 0.09 72)` | any gold-tinted *text* (AA-safe on ivory at 500 weight) |
| `--border` | `oklch(0.87 0.015 90)` | quiet hairlines |
| `--gold-seam` | `oklch(0.72 0.10 80 / 0.35)` | message dividers, callout borders |

### Dark

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.185 0.015 225)` | teal-black ground |
| `--surface` | `oklch(0.225 0.02 225)` | panels |
| `--teal-base` | `oklch(0.15 0.02 225)` | sidebar, even darker than ground |
| `--ink` | `oklch(0.94 0.005 90)` | warm ivory text |
| `--muted` | `oklch(0.68 0.015 220)` | secondary text |
| `--gold` | `oklch(0.80 0.11 82)` | accent, glows on dark |
| `--gold-deep` | `oklch(0.78 0.10 80)` | text-safe gold |
| `--border` | `oklch(0.30 0.02 225)` | hairlines |
| `--gold-seam` | `oklch(0.80 0.11 82 / 0.30)` | dividers, callout borders |

Contrast notes: gold is never used as a button *background* with small ivory text (fails AA). Primary actions use the teal tile with gold icon or ivory text. Gold-tinted text uses `--gold-deep` only, min 500 weight, min 14px.

## 4. Typography

- **Arabic UI: Tajawal** (already loaded) - 400 body, 500 labels, 700 message emphasis, 800 display/headings.
- **Latin: Inter** (already loaded) - keep for URLs, numbers, timestamps.
- **Quran display: Uthmanic** (already loaded, `--font-quran`) - for every ayah/hadith quote inside callouts.
- Small metadata (timestamps, tool names): 12px, `tabular-nums`, `--muted`.
- Arabic numbers inside tool metadata use Tajawal 500.
- No new fonts, no serif addition - zellige geometry does the identity work.

## 5. Layout System

### Chat shell wireframe (RTL - sidebar on the RIGHT, the "start" side)

```
┌──────────────────────────────────────────┬──────────────────────┐
│                                          │  ▚ LOGO + brand      │
│                                          │  ──────────────────  │
│                                          │  [+ New chat]        │
│               CHAT COLUMN                │  ──────────────────  │
│               (ivory ground,             │  ★ القرآن الكريم     │
│                max-w-3xl centered,       │  ★ الأحاديث النبوية  │
│                no card, no border)       │  ★ المواضيع          │
│                                          │  ★ المفضلة           │
│   ⋆ (empty state: star + prompt tiles)   │  ☆ البحث             │
│                                          │  ☆ من نحن            │
│                                          │  ──────────────────  │
│                                          │  🌙 theme · settings │
│                                          │  │ deep teal tile    │
│  ┌────────────────────────────────────┐  │  │ wall, collapsible │
│  │   ask anything...            ★    │  │  │ to 48px icon rail │
│  └────────────────────────────────────┘  └──────────────────────┘
```

- **Sidebar**: deep `--teal-base` panel on the right (RTL start side), `dir="rtl"` guarantees `start` = right. Collapsible via hamburger to a 48px icon rail. Logo row on top, nav in the middle, theme/settings pinned to the bottom.
- **Chat column**: ivory, `max-w-3xl mx-auto`, no card, no border, no page chrome. Header shows only the brand mark + collapse button (or nothing - sidebar owns nav).
- **Full viewport**: `min-h-[100dvh]` flex column; messages area scrolls, input docked at the bottom.

### How the geometric motif integrates (without being busy)

Three scales, three jobs, strict budget:

1. **Brand scale** (visible, low count): 8-point star as avatar mark, send button, empty-state hero, active-nav indicator. Max 1 star per view at any time except the empty state.
2. **Seam scale** (hairline): every message divider is a `1px` gold seam that starts with a tiny filled 8-point star at the start side, then a hairline to the edge. This is the "grout line" of the tiling - it replaces the generic `border-t` everywhere in the app.
3. **Texture scale** (background): the star lattice as an inline SVG data-URI background at 4-6% opacity on the chat column and 8-10% on the sidebar. `pointer-events-none`, fixed, never on a scrolling inner container. If it reads busy, halve it - content always wins.

The motif is never: used as a random overlay on images, animated in a loop, or placed on more than 3 scales simultaneously.

## 6. Component Inventory

### Chat input (docked, angular)

- Ivory `--surface` on `--background`, `radius: 2px` (the only curvature in the app), `1px` `--border` hairline.
- Focus: `2px` gold seam border (`--gold`), no shadow.
- Send button: an 8-point star tile, `--teal-base` fill with gold star glyph (see 5.3 signature), 40x40px, `radius: 0`. Disabled = `--border` fill, gold star at 40% opacity.
- Autosizes like the existing `PromptInputTextarea`; submit star sits at the bottom end side.

### Message bubbles

- **User**: solid `--teal-base` tile, ivory text, `radius: 0`, aligned to the end side (RTL: left).
- **Assistant**: no bubble at all (ChatGPT style) - plain ivory text on the ground, the gold seam star as its avatar at the start side.
- Max width `65ch` for assistant prose.

### Tool callouts (ayah/hadith citations as tiled callouts)

The citation is the zellige moment. A callout card:

- `--surface` background, `radius: 0`.
- Top edge: `1px` `--gold-seam` border with a small filled 8-point star at the start corner (the "tile seam").
- Quote text: Uthmanic font, `--ink`, generous `line-height`.
- Source line (e.g. "سورة البقرة ٢٥٥"): 12px Tajawal 500, `--gold-deep`.
- States: `input-streaming` shows the star seam outline only + shimmer on the quote area; `output-available` fills the seam star gold. This is the tool-call progress indicator - the star "sets" like a tile locking into place.

### Sidebar nav items

- Item: 11px padding, `radius: 0`, teal wall background.
- Idle: ivory text at 85% opacity, small outline star bullet before the label.
- Hover: text to full ivory + `1px` gold seam on the start edge.
- Active: `--teal-deep` tile fill + filled gold star bullet + full ivory text. No rounded pill - angular tile, not a capsule.
- "New chat" button: outlined gold seam border, gold star glyph, transparent fill.

### Empty state

- Center: large outline 8-point star (gold seam, 64px) with a filled gold center square.
- Title "ابدأ محادثة" (Tajawal 800), one muted line of guidance.
- Below: a 3x3 **prompt tile grid** - each tile is a mini zellige tile (ivory `--surface`, `1px` `--gold-seam` border, `radius: 0`) containing a suggested prompt ("آيات عن الصبر", "أحاديث عن الوالدين", ...). Clicking fills the input. Center tile (optional) is filled `--teal-base` with ivory text. This is the pattern-repetition device: the grid IS the tiling, not a decoration on top of it.

## 7. Motion Spec

Calm, structural. `transform` + `opacity` only. Nothing scroll-hijacked.

- **Sidebar collapse**: width `250ms` cubic-bezier(0.16, 1, 0.3, 1), content fade 150ms. Icon rail = 48px, tiles shrink to centered stars.
- **Message entry**: fade + `translateY(4px)`, 200ms, spring-ish ease, max 80ms stagger.
- **Send button**: on submit, star glyph rotates `45deg` in 150ms (an 8-point star rotated 45° is still a valid star - the symmetry is the point) and swaps to the streaming state. On streaming, the star slowly pulses opacity (2s loop) - this is the ONLY loop on the page, and it has a job (signaling the tool call is live).
- **Tool callout set**: when a tool result arrives, the seam star fills gold in 200ms (tile "locking in").
- **Hover**: nav items shift start-edge gold seam in 150ms; buttons `translateY(-1px)` on hover, `scale(0.98)` on `:active`.
- **Reduced motion** (`prefers-reduced-motion: reduce`): everything instant, no pulse, no rotation, no entry transforms. All transitions collapse to 0ms.

## 8. Corner Radius + Surface System

**One rule: angular. `radius: 0` everywhere.** The single exception is the docked input at `2px` (a practical concession, and 2px reads as "cut", not "curved").

- Cards, callouts, buttons, nav tiles, prompt tiles, tool panels: `radius: 0`.
- Elevation via tile color, never shadow: surfaces are ivory (`--surface`) on ivory (`--background`), teal (`--teal-base`) on teal-deep, separated by `1px` gold seams. If a shadow is ever needed, tint it: `oklch(0.25 0.04 220 / 0.12)`, never pure black.
- Dividers are gold seams with the star terminal (Section 5), never `border-b` rows.

## 9. Three Signature Premium Details

1. **The star send button and its 45° rotation.** The submit control is an 8-point star tile, not a circle or arrow. Submitting rotates it 45° (a valid star position - the tessellation's symmetry made literal). No other AI chat does this; it is the app's fingerprint.
2. **Message seams with star terminals.** Every message divider is a gold hairline that begins with a tiny filled 8-point star at the start side. The conversation reads as rows of tiles being laid down. This single detail replaces all `border-t`/`border-b` divider patterns in the app.
3. **The prompt-tile empty state.** The 3x3 suggested-prompt grid is built as an actual zellige patch: alternating ivory tiles with one filled teal tile in the center, each tile a tappable prompt, all joined by gold seams. The empty state demonstrates the product's geometry instead of describing it.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes in this spec or any copy suggestion - verified, only hyphens used.
- [x] Exactly one accent: gold. Teal is the structural base, used for surfaces/actions, not as a competing accent.
- [x] One corner-radius system: 0 (2px only on the input, documented).
- [x] `min-h-[100dvh]`, never `h-screen`.
- [x] RTL first: sidebar on the start side (right), all directional language uses start/end, never left/right.
- [x] Motion: transform + opacity only, one justified loop (streaming pulse), full reduced-motion collapse.
- [x] No AI-purple, no gradients anywhere (zellige is flat cut tile - zero gradients is a feature, not an omission).
- [x] Tajawal retained, no new fonts, no new dependencies (star motif = inline SVG, zero canvas libs).
- [x] Contrast: gold never carries small ivory text; text-safe `--gold-deep` for gold-tinted copy; teal tiles carry ivory text at high contrast.
- [x] No three-equal-card marketing row; the 3x3 prompt grid is an interactive pattern, not a feature row.
- [x] No marquee, no scroll-hijack, no infinite loops beyond the single streaming pulse.

## Implementation Notes for the Engineer

- 8-point star glyph (khatam, two overlapping squares, `fill-rule="evenodd"` for the hollow star):
```svg
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path fill="currentColor" fill-rule="evenodd"
        d="M6 6h12v12H6z M12 3.515 L20.485 12 L12 20.485 L3.515 12 Z" />
</svg>
```
- Background texture: inline SVG data-URI of the star lattice (repeat 64px tile, star stroke only), applied at 4-6% opacity on the chat column and 8-10% on the sidebar, `pointer-events-none`, not on scrolling containers.
- Wire the existing `ai-elements` components (`Conversation`, `PromptInput`, `Tool`, `Shimmer`) to these tokens; the seam divider replaces `border-t` in `ConversationContent`'s gap styling.
- `--radius` in `globals.css` stays `0.5rem` for any untouched shadcn primitives, but every surfaced component in this direction overrides to `0` (or `2px` for the input).
