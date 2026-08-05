# Design 08 - OFF-BLACK CHROME

## 1. Design Read

Reading this as: the AI as a precision instrument for religious scholarship - cold dev-tool luxury, off-black surfaces with chrome/silver edges, hairline rules, sharp corners, monospace metadata. Dark-first, ChatGPT-shaped shell.

## 2. Concept Narrative

The chat is not a friendly assistant here, it is a calibration instrument. Every element reads as machined: off-black panels, hairline chrome separators, strict monospace labels for metadata, sharp zero-radius corners. The Quran text, set in Uthmanic against near-black, becomes the single warm, human artifact in a cold instrument - the one thing the tool is built to surface. Tool calls (ayah/hadith citations) render as terminal-precision panels: numbered, monospaced headers, tabular data, a scanning cursor while the source is being fetched. The user is not chatting with a bot; they are operating a precision instrument whose output is scripture. Trust comes from exactness: every citation is numbered, every source labeled in mono, every state change communicated by a crisp chrome indicator.

## 3. Palette

### Dark (default - primary mode)

| Token | Value (oklch) | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.13 0.005 0)` | `#1a1a1a` | app base |
| surface | `oklch(0.16 0.005 0)` | `#212121` | sidebar, input, panels |
| surface-raised | `oklch(0.20 0.005 0)` | `#2a2a2a` | hover, tool callout header |
| primary (chrome) | `oklch(0.87 0.01 0)` | `#d8d8d8` | accent: active states, focus, chrome edges |
| primary-strong | `oklch(0.95 0.01 0)` | `#f0f0f0` | text on accent, active nav |
| secondary | `oklch(0.30 0.005 0)` | `#3d3d3d` | subtle fills, muted chrome |
| text | `oklch(0.93 0.005 0)` | `#ececec` | body |
| text-muted | `oklch(0.62 0.005 0)` | `#8a8a8a` | secondary text, placeholders |
| border (hairline) | `oklch(0.28 0.005 0)` | `#383838` | 1px rules, panel edges |
| border-strong | `oklch(0.42 0.005 0)` | `#565656` | focused chrome edge |
| quran-text | `oklch(0.90 0.02 0)` | `#e8e6e2` | Uthmanic text (slight warm lift) |

### Light (secondary mode - explicit opt-in)

| Token | Value (oklch) | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.955 0.003 0)` | `#f2f2f2` | app base |
| surface | `oklch(0.975 0.003 0)` | `#f8f8f8` | sidebar, input, panels |
| surface-raised | `oklch(1 0 0)` | `#ffffff` | hover, tool callout header |
| primary (chrome) | `oklch(0.35 0.005 0)` | `#484848` | accent, active states |
| primary-strong | `oklch(0.15 0.005 0)` | `#1c1c1c` | text on accent |
| secondary | `oklch(0.88 0.003 0)` | `#dddddd` | subtle fills |
| text | `oklch(0.22 0.005 0)` | `#2c2c2c` | body |
| text-muted | `oklch(0.50 0.005 0)` | `#6e6e6e` | secondary text |
| border (hairline) | `oklch(0.85 0.003 0)` | `#d4d4d4` | 1px rules |
| border-strong | `oklch(0.60 0.005 0)` | `#828282` | focused chrome edge |
| quran-text | `oklch(0.25 0.01 0)` | `#2e2c28` | Uthmanic text |

No warm gold anywhere. Chrome is achromatic silver; the only chromatic light is the Uthmanic text itself.

## 4. Typography

- Arabic UI: **Tajawal** (existing, `--font-tajawal`). Weights 400 body, 500 nav, 700 headers. Headers get `tracking-tight` (Tailwind's negative tracking works for Arabic too).
- Quran display: **KFGQPC Uthmanic** (existing, `--font-uthmanic`), `leading-[1.9]` for diacritic clearance, `text-2xl md:text-3xl`.
- Latin/metadata: **system mono stack** - `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. No new dependency. Used for: labels, timestamps, source references, page numbers, token/status readouts, keyboard hints. `text-[11px] tracking-wide uppercase` for micro-labels (English micro-labels only; Arabic labels stay Tajawal 500).
- Numeric data (surah/ayah numbers, hadith refs): `font-variant-numeric: tabular-nums` so citation columns align.
- Hierarchy rule: prose in Tajawal, every piece of *instrument data* (numbers, sources, states) in mono. The visual grammar is: human text is proportional, machine data is monospaced.

## 5. Layout System

### Chat shell wireframe (dark, RTL - sidebar on the right visually)

```
┌──────────────┬──────────────────────────────────────────────────┐
│ SIDEBAR      │  main (flex col, h-[calc(100dvh-0px)])            │
│ (right,      │  ┌────────────────────────────────────────────┐  │
│  start side) │  │  top bar: [chrome-dot] chat-id · mono       │  │
│              │  │  src: `SHK/INSTR-01`           [theme] [≡] │  │
│  ┌────────┐  │  ├────────────────────────────────────────────┤  │
│  │ LOGO   │  │  │  scroll area (flex-1, overflow-y-auto)      │  │
│  │ mono   │  │  │  ┌──────────────────────────────────────┐   │  │
│  ├────────┤  │  │  │  empty state:                        │   │  │
│  │ + NEW  │  │  │  │  Uthmanic "بسم الله" + prompt grid    │   │  │
│  │ CHAT   │  │  │  └──────────────────────────────────────┘   │  │
│  ├────────┤  │  │  or message stream (max-w-3xl mx-auto)       │  │
│  │ ▸ Quran│  │  │  ┌──────────────────────────────────────┐   │  │
│  │ ▸ Had. │  │  │  │ user msg: flat, right-ish (start)    │   │  │
│  │ ▸ Theme│  │  │  │ assistant: Uthmanic ayah callout     │   │  │
│  │ ▸ Fav  │  │  │  │ + mono source line: `Q 2:255 · 1/1`  │   │  │
│  │ ▸ Search│ │  │  └──────────────────────────────────────┘   │  │
│  ├────────┤  │  ├────────────────────────────────────────────┤  │
│  │ About  │  │  │  input dock: surface panel, sharp corners,  │  │
│  │ [≡]    │  │  │  hairline top border, mono placeholder      │  │
│  └────────┘  │  │  [ textarea ]                    [send ▸]  │  │
│              │  └────────────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────────┘
```

### Rules

- **Sidebar**: fixed-width 260px, collapsed to 56px icon rail (`collapsible="icon"`). RTL: renders on the right (`inset-inline-start: 0` is wrong in RTL - use logical `start`; shadcn sidebar handles this). `bg-surface`, `border-s` hairline between it and main.
- **Hairline discipline**: all separation is 1px `border` at the hairline token, never shadows, never cards floating on cards. Panels are separated by rules, not elevation.
- **Chat column**: messages + input constrained to `max-w-3xl mx-auto w-full`. Background is the app background; the sidebar and top bar are the only "panels".
- **Top bar**: 48px, hairline bottom border, mono left (in RTL: start side) readout, theme toggle + collapse toggle on the end side. No title bar - the chat IS the app.
- **Viewport**: main is `h-[calc(100dvh-0px)]` with `overflow-hidden`; the scroll area inside is the only scroller. Never `h-screen`, always `min-h-[100dvh]` where heights are involved.

## 6. Component Inventory

### Chat input dock
- Surface panel, `rounded-none` (sharp), hairline border on all sides (`border-border`), hairline top-strong line when focused (`border-strong` = chrome edge).
- Autosizing textarea, `bg-transparent`, Tajawal 400, mono placeholder: `اكتب سؤالك... (Type a question)` - mixed; keep placeholder Tajawal.
- Send button: square (sharp), `bg-primary text-primary-strong` (light chrome on dark = `#d8d8d8` bg, dark text). Hover: `bg-primary-strong`. Active: `translate-y-[1px]`. Disabled: `bg-secondary text-muted`.
- Below input: mono status strip, `text-[11px] text-muted`: `ENTER = send · SHIFT+ENTER = newline`.

### Message bubbles
- User: flat text, no bubble at all (ChatGPT-style, plain Tajawal on background), or a minimal surface chip with sharp corners if the page needs grouping. Default: no bubble - text with a mono timestamp above it.
- Assistant: plain text. Uthmanic quotes inside `> [!quran-ayah]` callouts (existing ai-elements mechanism), restyled: sharp corners, hairline border, `border-s-2` chrome accent bar on the start edge.

### Tool callouts (ayah/hadith - terminal-precision panels)
- Header row: mono `11px uppercase tracking-wide` on `surface-raised` with a `border-b` hairline. Format: `TOOL · quran-search` + right-aligned mono state readout: `FETCH` while streaming (chrome-dot blinking), `200 · 1 RESULT` when done, `ERR` on failure.
- Body: Uthmanic ayah text, then a mono citation footer: `Q 2:255 · البقرة · 1/1`. Hadith: `BUKHARI 1 · 1/7544`.
- Corners: sharp. One 1px hairline outline total, no shadow.

### Sidebar nav items
- Height 36px, `rounded-none`. Icon (lucide, strokeWidth 1.5) at 18px + label Tajawal 500 `text-sm`.
- Hover: `bg-surface-raised`. Active: `bg-primary/10` + `border-s-2 border-primary` chrome edge on the start side + label `text-primary-strong`.
- Section labels in mono `10px uppercase tracking-[0.18em] text-muted`: `LIBRARY`, `TOOLS`.
- New chat button: full-width, `border border-border`, `bg-transparent hover:bg-surface-raised`, plus icon, sharp corners. Mono shortcut hint on end side: `⌘K`.

### Empty state
- Centered, `max-w-2xl`. Uthmanic "بِسْمِ اللَّهِ" large, muted chrome. Sub: Tajawal `text-muted` one line.
- Prompt grid: 2x2 (desktop) / 1 col (mobile), sharp cells with hairline borders, mono index `01` top-start, Tajawal prompt text. Hover: chrome edge (border-strong). Click fills input.
- Mono hint under grid: `SELECT A PROMPT OR TYPE BELOW`.

## 7. Motion Spec

- Calm, instrument-like: 120-180ms, `ease-out`, transform/opacity only.
- Streamed text: opacity fade-in per chunk, no slide (the instrument reveals, it does not dance).
- Sidebar collapse: width via Motion layout (spring, `stiffness 300, damping 30`), icons-only rail.
- Chrome-dot on tool callouts: `animate-pulse` (opacity) while `FETCH`, stops when result lands.
- Hover chrome edges: `border-color` transition 150ms, no layout shift.
- `prefers-reduced-motion`: all of the above collapse to instant. Zero infinite loops except the single fetching indicator, which becomes a static dim dot under reduced motion.
- No scroll-hijack, no parallax, no marquee, no stagger beyond 60ms on empty-state grid items.

## 8. Corner Radius + Surface System

- **One rule: `rounded-none` everywhere.** Buttons, inputs, callouts, sidebar, chips. `--radius: 0` in theme.
- Only exception: the input textarea caret/marker uses none. The Uthmanic callout may use `rounded-[2px]` ONLY for the chrome accent bar end cap - decorative, optional, single value.
- Surfaces: exactly three levels, distinguished by lightness, never by radius or shadow:
  1. `background` (base)
  2. `surface` (sidebar, input dock, tool header)
  3. `surface-raised` (hover, active tool header)
- Separation exclusively via 1px hairlines. Zero drop shadows. Zero blurred cards. This is the discipline that makes it feel machined.

## 9. Signature Details

1. **The chrome edge.** Every active element (focused input, active nav item, streaming tool callout) carries a `border-s-2` (start side) or top hairline in `border-strong` - a 1-2px silver rule that says "this instrument is engaged". Focus rings are the same chrome, never a colored glow.
2. **Mono citation footer.** Every Quran/hadith answer ends with a tabular-nums mono line: `Q 2:255 · البقرة · 1/1` or `BUKHARI 1 · 7544`. It is the instrument's proof of work - the citation is the product, formatted like a machine readout, not a footnote.
3. **The Uthmanic contrast.** Quran text in Uthmanic HAFS against near-black with a faint warm lift (`oklch 0.90 0.02`) is deliberately the only warm, organic thing in the entire cold UI. The instrument exists to surface this text; nothing else gets to be warm.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes anywhere in this spec (all ranges/separators use hyphen or period). No en-dashes.
- [x] Exactly ONE accent: chrome/silver (achromatic). No warm gold, no purple, no second accent.
- [x] One corner system: sharp, `rounded-none`, single 2px decorative exception documented.
- [x] `min-h-[100dvh]` rule respected; chat main uses explicit `h-[calc(100dvh-0px)]` + inner scroll area, never `h-screen`.
- [x] RTL-first: sidebar on the start side (right in RTL), logical properties (`border-s`, `inset-inline-start`), Arabic-first copy.
- [x] Calm motion: transform/opacity only, 120-180ms, reduced-motion collapses to static, one static-dimmed fetching indicator under reduced motion.
- [x] Dark-first, light mode included with mirrored tokens. Page theme locked - no section inversion.
- [x] No new dependencies: system mono stack, existing Tajawal + Uthmanic, existing shadcn sidebar.
- [x] No generic AI tells: no purple gradients, no Inter-only (Inter stays as Latin fallback), no 3-equal-cards, no glow shadows (zero shadows), no pill-everything.
- [x] Contrast: text `0.93` vs background `0.13` (dark), primary `0.87` vs surface `0.16` - well above WCAG AA. Light mode mirrors.
- [x] Empty/loading/error states all specified (empty state grid, mono FETCH/200/ERR readouts).
- [x] One copy register: instrument-precise, no poetic filler.
