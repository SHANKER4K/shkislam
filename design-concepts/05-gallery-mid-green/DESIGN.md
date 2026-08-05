# Design Direction 05: GALLERY MID-GREEN

## 1. Design Read

Reading this as: an AI assistant app for Islamic knowledge, styled like a modern art gallery - muted olive on bone, thin geometric frames, asymmetric quiet confidence, the chat reading as a well-set catalogue page.

## 2. Concept Narrative

The app presents itself as a gallery of sacred texts, not a chatbot toy. Bone-white walls, one muted olive accent, and hairline frames give the interface the calm of a print catalogue: nothing shouts, everything is displayed with respect. The chat conversation is the "current exhibition" - a centered, whitespace-led column where ayahs and hadiths are shown like framed plates on a wall. The sidebar is the gallery index: quiet typographic links, no pills, no color noise. Motion is the slow footfall of a visitor: nothing bounces, nothing loops. The authority of the content (Quran, Sunnah) is carried by restraint - the interface steps aside and lets the text command the room.

## 3. Palette

### Light

| Token | oklch | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.975 0.006 100)` | `#F5F4EF` | page wall (bone) |
| surface | `oklch(0.992 0.004 100)` | `#FCFBF8` | sidebar, input, raised plates |
| primary | `oklch(0.42 0.065 130)` | `#4C5B3C` | muted olive: accents, links, active states |
| primary-foreground | `oklch(0.99 0.004 100)` | `#FCFBF8` | text on primary |
| secondary | `oklch(0.93 0.02 115)` | `#E4E3D8` | olive-tinted wash: hover bg, tool bg |
| foreground | `oklch(0.25 0.02 105)` | `#2B2A24` | primary text (warm ink) |
| muted-foreground | `oklch(0.5 0.02 100)` | `#7A786E` | secondary text |
| border | `oklch(0.87 0.012 100)` | `#DAD8CE` | hairlines, frames |
| ring | `oklch(0.42 0.065 130)` | `#4C5B3C` | focus rings |

### Dark

| Token | oklch | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.2 0.012 105)` | `#24241F` | page wall (dark bone-ash) |
| surface | `oklch(0.24 0.012 105)` | `#2C2C26` | sidebar, input, raised plates |
| primary | `oklch(0.72 0.06 125)` | `#9DAB7E` | muted olive (lifted for contrast) |
| primary-foreground | `oklch(0.2 0.012 105)` | `#24241F` | text on primary |
| secondary | `oklch(0.29 0.014 110)` | `#37372F` | olive-tinted wash |
| foreground | `oklch(0.92 0.008 95)` | `#E8E6DE` | primary text |
| muted-foreground | `oklch(0.68 0.012 95)` | `#A8A69B` | secondary text |
| border | `oklch(0.32 0.014 105)` | `#3B3B33` | hairlines, frames |
| ring | `oklch(0.72 0.06 125)` | `#9DAB7E` | focus rings |

Rule: ONE accent. Olive is used for interactive truth (links, active states, primary buttons, focus rings, tool frames). Bone carries the surface. Never introduce a second hue.

## 4. Typography

- **Arabic UI: Tajawal** (already loaded). Weights: 400 body, 500 labels, 700 sub-heads, 800 display. No font swap, no new dependency.
- **Display (chat empty state, page titles):** Tajawal ExtraBold 800, `text-3xl md:text-4xl`, `tracking-tight`, `leading-tight`. Sentence case (Arabic has no case - keep natural sentence flow, no all-caps transliteration).
- **Body (chat messages):** Tajawal 400, `text-base md:text-lg`, `leading-8` (generous, gallery-plaque readability), `max-w-[65ch]`.
- **Labels / meta (sidebar, timestamps, tool names):** Tajawal Medium 500, `text-xs md:text-sm`, `tracking-wide`, muted-foreground. This is the gallery plaque voice: small, quiet, uppercase-like restraint.
- **Numbers / verse refs:** tabular-nums (`font-variant-numeric: tabular-nums`) so `2:255` aligns across the conversation.
- **Quran display font (Uthmanic):** unchanged - ayah text keeps the existing Uthmanic HAFS font. It is the artwork; the interface frame is Tajawal.
- Hierarchy via weight + size + color only. No all-caps decorations, no italic flourishes, no serif injections.

## 5. Layout System

### Chat shell wireframe (desktop, dir=rtl - sidebar on the RIGHT)

```
┌──────────────────────────┬────────────────────────────────────────────┐
│ ▦ logo (wordmark)        │                                            │
│ 新 chat  (new chat)      │                                            │
│ ────── hairline ──────   │         ┌──────────────────────────┐      │
│ القرآن الكريم  (index)   │         │   [empty state / intro]  │      │
│ الأحاديث النبوية          │         │    display headline      │      │
│ المواضيع                 │         │    prompt suggestions     │      │
│ المفضلة                  │  chat   │                          │      │
│ البحث                    │  column │   ┌─── framed plate ───┐ │      │
│ نبذة عن الموقع            │  (flex-1│   │  ayah/hadith tool  │ │      │
│ ────── hairline ──────   │  center,│   └────────────────────┘ │      │
│ theme toggle  · about    │  max-w- │   user message           │      │
│                          │  3xl)   │   assistant reply        │      │
│  [collapsed: 16px rail   │         │                          │      │
│   with icon-only items]  │         └──────────────────────────┘      │
│                          │         ┌──────────────────────────┐      │
│                          │         │  [docked input plate]     │      │
│                          │         │  اكتب سؤالك هنا...  (send)│      │
│                          │         └──────────────────────────┘      │
└──────────────────────────┴────────────────────────────────────────────┘
```

- Sidebar: fixed-width `w-64` expanded, `w-16` collapsed (`collapsible="icon"`, shadcn sidebar pattern). `border-inline-start` (right edge in RTL). Background = `surface`.
- Chat column: `flex-1`, `min-h-[100dvh]` wrapper, content column `max-w-3xl mx-auto w-full`, generous vertical rhythm `gap-6`.
- Input: **docked** at bottom of the column (`sticky bottom-0` on the wrapper, `bg-background` with a soft top fade via gradient to background for scroll-over readability). Not floating, not a card with heavy shadow - a framed plate, flush with the column.
- Mobile (<768px): sidebar becomes an overlay drawer from the start side; chat column `px-4`; input plate full-width.
- Grid discipline: everything aligns to the content column; plates share the same inset (`p-4 md:p-5`) so framed items create one continuous left edge (in RTL: right edge). Asymmetry only in the empty state (prompt suggestions staggered), never in the message column.

## 6. Component Inventory

- **Chat input:** a bordered plate (`border`, `bg-surface`, `rounded-md`, `focus-within:ring-1 ring-primary`), textarea `border-none bg-transparent` inside, send button `bg-primary text-primary-foreground` square `rounded-md` at the inline-end, `:active:scale-[0.98]`. Placeholder muted-foreground. Height auto-grows, single row minimum.
- **User message:** borderless, `self-end`, `bg-secondary/60`, `rounded-md`, `px-4 py-2.5`, `text-foreground`, `max-w-[80%]`. Subtle olive-tinted wash, not a bubble - a note card.
- **Assistant message:** borderless, `self-start`, NO background (pure whitespace-led), `text-foreground`, `max-w-[80%]`. The gallery does not box its prose.
- **Tool callout (ayah/hadith plate):** `border`, `bg-surface`, `rounded-md`, `p-4`, with a 3px `border-inline-start` in `primary` (right rule in RTL). Quran text in Uthmanic font `text-xl md:text-2xl leading-loose`. Reference line below: `tabular-nums`, `text-xs`, muted-foreground, Tajawal Medium. This is the signature framed plate.
- **Tool status (loading/streaming):** the plate renders with the same frame but the content area shows a thin 1px shimmer line (2-3 skeleton bars matching Uthmanic height). No spinner. State is communicated by the frame filling with text.
- **Sidebar nav item:** full-width row, `px-3 py-2`, `text-sm`, Tajawal Medium, muted-foreground, `rounded-sm`, `hover:bg-secondary/50 hover:text-foreground`. Active: `bg-secondary/70 text-foreground` + 3px `border-inline-start border-primary`. No icons on expanded items for index pages (text is the plaque); icons only when collapsed to `w-16` rail (lucide, single stroke weight 1.5).
- **New chat button:** top of sidebar, `border border-border rounded-md h-9 w-full bg-transparent hover:bg-secondary/50`, label `chat جديد`. Ghost-plate, not a filled CTA.
- **Empty state (no messages):** centered, `text-center`, composition: small primary-rule accent (24px wide, 3px, `bg-primary` centered), display headline (Tajawal 800, `text-3xl`), one muted-foreground sentence, then a 2-column staggered suggestion list (asymmetric offsets `md:translate-y-4` on the second column) of 4 plain-text prompt suggestions with `hover:text-primary` and a thin underline on hover. Clicking fills the input.
- **Scroll button / download:** ghost `rounded-sm` icon buttons, border hairline, muted-foreground, hover tints.

## 7. Motion Spec

- Intensity: 3/10. Gallery footfall, not theme-park.
- Transitions: `transition-colors duration-200` for hover/active tints; `transition-[transform,opacity] duration-300 ease-out` for any movement (sidebar collapse spring via shadcn default is fine).
- Message entry: fade + 4px translateY, `duration-300`, no stagger beyond natural order, `viewport={{ once: true }}` if scroll-revealed (prefer no scroll-reveal inside the chat column at all - it re-flows text).
- Sidebar collapse: standard shadcn sidebar transition (transform + width), `duration-300`, ease.
- Reduced motion (`prefers-reduced-motion: reduce`): all entry animations collapse to opacity-only or none; sidebar still works, just instant.
- Hard bans: no marquee, no scroll-jack, no parallax, no infinite loops, no `window.scroll` listeners. No animations on `top/left/width/height` except the sidebar's own collapsible (which uses transform).
- Tactile: `:active` on buttons = `scale-[0.98]`; links get color change only.

## 8. Corner Radius + Surface System

- ONE system: `rounded-sm` (2px) and `rounded-md` (6px) only. Small plates = `rounded-sm`; input + main plates = `rounded-md`. Nothing pill, nothing 16px+. Sharp geometry is the point.
- Surfaces by elevation: `background` (wall) < `secondary/60` (tinted note) < `surface` + `border` (framed plate) < `primary` (single accent fill). Shadows are banned - elevation is communicated by frames and tint, never by drop shadows. This is the anti-AI-tell move: no generic card shadow anywhere.
- Hairlines (`border` at 1px) are the only divider. Use `divide-y` or `border-t` sparingly in the sidebar (one hairline above the footer cluster).

## 9. Three Signature Premium Details

1. **The framed plate:** every ayah/hadith citation renders as a bordered plate with a 3px olive inline-start rule and the Uthmanic text inside. The chat becomes a wall of framed artworks, each citation a hung piece. This single component carries the entire gallery metaphor and reads expensive with zero assets.
2. **The plaque voice:** all metadata (verse refs, tool names, timestamps) is set in small Tajawal Medium, `tracking-wide`, muted-foreground, with tabular numerals. Verse refs like `البقرة 2:255` align column-straight through the whole conversation - a print-catalogue detail users feel but don't see.
3. **The asymmetric empty state:** the intro is deliberately off-balance - headline centered, but the four prompt suggestions sit in a 2-column grid with the second column offset down 16px. It is the only asymmetry on the page, which makes it read as designed, not default. One rule: the conversation column itself stays perfectly symmetrical (texts on their edge), because the content is the art.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dash or en-dash characters in this spec; hyphens only. Verified: none present.
- [x] Exactly ONE accent color (muted olive) across light and dark.
- [x] One corner-radius system (rounded-sm/md only, no pills).
- [x] `min-h-[100dvh]` everywhere; `h-screen` banned in the spec.
- [x] RTL-first: sidebar on the start side (right in RTL), `border-inline-start`, text on `inline-end`.
- [x] Calm motion: transform/opacity only, prefers-reduced-motion honored, no scroll-jack, no marquee, no infinite loops.
- [x] No AI-purple gradients; shadows banned entirely (frames + tints instead).
- [x] Tajawal stays the UI font; zero new dependencies.
- [x] No three-equal-card feature rows; no generic card shadows; no centering-everything (asymmetric empty state); no Inter-only default (Tajawal is the UI voice).
- [x] Dark mode tokens defined with lifted olive for contrast (AA on both modes: primary-foreground pairs contrast 4.5:1+).
- [x] Loading (skeleton plate), empty (composed intro), and error (plain Arabic error line, no "Oops") states specified.
