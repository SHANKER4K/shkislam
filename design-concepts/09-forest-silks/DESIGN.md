# Design Direction 09: FOREST SILKS

## 1. Design Read

Reading this as: a dark-first AI companion for Islamic scholarship, dressed in deep old-growth forest green with warm bone text and one amber lamplight accent - durable, grounding, quietly premium (Filson/Patagonia energy, applied to sacred text).

## 2. Concept Narrative

The app is not a glowing chatbot toy, it is a solid object: a carved wooden scholar's desk lamp-lit at dusk. Deep forest green wraps the whole surface - the sidebar, the chat canvas, the input - like a heavy wool blanket of quiet. Bone-warm text reads like parchment by lamplight, and a single amber accent (the lamp itself) marks exactly one thing per view: the active conversation, the send button, the current ayah being cited. Where siblings in this fleet go light and gallery-calm, FOREST SILKS goes dark and material: surfaces have depth like stacked timber, borders are hairline wood-grain separations, and the chat feels like a trusted companion who sits with you rather than a dashboard you operate. Craft without rustic-kitsch: no visible wood textures, no leaves, no ornament. The green IS the wood. The amber IS the warmth. Everything else steps back.

## 3. Palette

### Light (optional secondary mode, "birch at noon")

| Token | oklch | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.935 0.03 150)` | `#E3EAD9` | page wash (faded moss) |
| surface | `oklch(0.985 0.012 100)` | `#F8F7F0` | sidebar, input, raised panels (bone) |
| primary | `oklch(0.38 0.06 155)` | `#2E5D3F` | deep forest green: accents, active states |
| primary-foreground | `oklch(0.985 0.012 100)` | `#F8F7F0` | text on primary |
| secondary | `oklch(0.9 0.04 150)` | `#D8E2CE` | green wash: hover bg, tool bg |
| accent | `oklch(0.7 0.12 70)` | `#C98A2D` | amber: send button, focus, ONE active marker |
| foreground | `oklch(0.28 0.03 155)` | `#223A2B` | primary text (deep green ink) |
| muted-foreground | `oklch(0.5 0.025 150)` | `#6E7F6C` | secondary text |
| border | `oklch(0.84 0.025 150)` | `#C9D2BD` | hairlines |
| ring | `oklch(0.7 0.12 70)` | `#C98A2D` | focus rings (amber) |

### Dark (hero mode - this is THE mode)

| Token | oklch | Hex approx | Use |
|---|---|---|---|
| background | `oklch(0.22 0.035 155)` | `#14271C` | deep forest green: page wall, chat canvas |
| surface | `oklch(0.27 0.04 155)` | `#1B3323` | sidebar, input dock, raised panels (green silk) |
| surface-2 | `oklch(0.32 0.045 155)` | `#22402A` | hover bg, active nav wash |
| primary | `oklch(0.72 0.08 150)` | `#7FB58A` | lifted moss green: links, secondary text emphasis |
| primary-foreground | `oklch(0.2 0.03 155)` | `#0F2015` | text on primary |
| secondary | `oklch(0.32 0.045 155)` | `#22402A` | wash surfaces, tool callout bg |
| accent | `oklch(0.75 0.13 70)` | `#E0A33C` | amber lamplight: send, focus, active chat marker |
| accent-foreground | `oklch(0.22 0.04 155)` | `#14271C` | text on amber |
| foreground | `oklch(0.93 0.02 95)` | `#EBE7D8` | bone text (parchment by lamplight) |
| muted-foreground | `oklch(0.72 0.03 130)` | `#9DB3A0` | secondary text (fogged moss) |
| border | `oklch(0.35 0.04 155)` | `#29442F` | hairline separations (wood grain) |
| ring | `oklch(0.75 0.13 70)` | `#E0A33C` | amber focus rings |

Rules: amber is rationed to ONE interactive truth per view (send button, active chat title, the ayah currently being cited). Green carries the surface. Bone carries the reading. Dark is default and intentional; light exists for `prefers-color-scheme: light` users but the identity is the dark forest.

## 4. Typography

- **Arabic UI: Tajawal** (already loaded, no new dependency). Weights: 400 body, 500 labels, 700 sub-heads, 800 display.
- **Display (empty state, page titles):** Tajawal ExtraBold 800, `text-3xl md:text-4xl`, `tracking-tight`, `leading-tight`, bone foreground.
- **Body (chat messages):** Tajawal 400, `text-base md:text-lg`, `leading-8`, bone foreground, `max-w-[65ch]`. The lamplight-read voice: generous leading, never cramped.
- **Labels / meta (sidebar, timestamps, tool names):** Tajawal Medium 500, `text-xs md:text-sm`, `tracking-wide`, muted-foreground.
- **Verse refs / numbers:** `font-variant-numeric: tabular-nums` so `2:255` aligns down the conversation.
- **Quran display font (Uthmanic):** unchanged - ayah text keeps the existing Uthmanic HAFS font, rendered on a slightly-raised green panel so it reads as the artifact, the text carved into the wood.
- Hierarchy via weight + size + color only. No all-caps, no italic flourishes, no serif injections, no transliterated latin decorations.

## 5. Layout System

### Chat shell wireframe (desktop, dir=rtl - sidebar on the RIGHT visually)

```
┌──────────────┬────────────────────────────────────────────────┐
│ ▦ logo       │                                                │
│ + محادثة جديـ │                                                │
│ ─────────────│                                                │
│ ◉ القرآن      │          [ centered conversation column ]      │
│   الأحاديث   │                                                │
│   المواضيع   │         ┌──────────────────────────────┐       │
│   المفضلة    │         │  user bubble (green silk)    │       │
│   البحث      │         └──────────────────────────────┘       │
│ ─────────────│         ┌──────────────────────────────┐       │
│   عن المنصة  │         │  ayah callout (raised panel, │       │
│              │         │  amber top hairline)         │       │
│              │         └──────────────────────────────┘       │
│              │         ┌──────────────────────────────┐       │
│              │         │  assistant text (bone)       │       │
│              │         └──────────────────────────────┘       │
│              │                                                │
│              │  ┌────────────────────────────────────────┐    │
│              │  │  اكتب سؤالك هنا...              [send] │    │
│              │  └────────────────────────────────────────┘    │
│              │   input dock: surface green, amber send        │
└──────────────┴────────────────────────────────────────────────┘
```

- **Sidebar:** right side (start side in RTL), width 280px expanded / 64px icon rail collapsed (`collapsible="icon"`). Background `surface` green, hairline `border` on its left edge (toward content). Logo wordmark bone at top, `+ محادثة جديدة` as a ghost-button plate (hairline border, hover = `surface-2`), then nav items.
- **Nav items:** full-width rows, rounded (radius system below), 400-weight bone text. Active item = `surface-2` wash + amber 3px start-edge marker (the lamp on the shelf). Hover = `surface-2` wash, no marker.
- **Chat canvas:** `background` deep green, full-bleed. Messages in a centered `max-w-3xl` column - content is the column, the canvas is the forest around it.
- **Input dock:** fixed bottom, centered `max-w-3xl`, `surface` green rounded panel, hairline `border`, inner textarea bone, send button solid `accent` amber (the single lit object). Shadow: tinted green, not black (`shadow-[0_8px_32px_oklch(0.15_0.03_155/0.35)]`).
- **Mobile (<768px):** sidebar collapses to an off-canvas drawer (dialog pattern, backdrop `background/60`), input dock stays bottom with `pb-[env(safe-area-inset-bottom)]`, messages `px-4`. Single column throughout.

## 6. Component Inventory

- **Chat input:** docked `surface` panel, `rounded-2xl`, hairline `border`, textarea Tajawal 400 bone, placeholder muted-foreground, amber send button `rounded-xl` with `scale-[0.98]` on `:active`. Focus ring amber, 2px, offset 2.
- **Message bubbles:** NO bubbles on the assistant side - assistant text is bone on `background` (reads as voice, not a card). User messages get a subtle `surface-2` rounded panel so turns are separable at a glance, `max-w-[75%]` start-aligned (right in RTL).
- **Tool callouts (ayah/hadith):** raised `surface` panel `rounded-2xl`, `border` hairline, and a 2px amber top edge (the lamp highlight = this is the cited artifact). Uthmanic ayah text inside on a slightly darker inset strip (`background`), reference `2:255` in amber, tabular-nums. Tool name (القرآن الكريم / صحيح البخاري) as small muted label above. Loading state: skeleton bars in `secondary` with slow amber shimmer.
- **Sidebar nav items:** described in section 5. Bottom cluster: theme toggle (ghost icon, amber sun/moon), settings/about links as muted text rows.
- **Empty state:** centered on the forest. Logo mark (amber), Tajawal 800 display "كيف أساعدك في العلم اليوم؟", one muted line of subtext, then a 2x2 grid of suggested prompts as `surface` plates (hover = `surface-2`, border hairline, amber prompt arrow). No illustration, no mascot - the green and amber carry the mood.
- **Loading / streaming:** assistant streaming uses the existing Shimmer but tinted amber (`accent/30` glow, not white); tool execution shows a compact progress row (tool icon + name + pulsing amber dot, dot = real semantic state).
- **Error state:** inline, bone text on `surface-2` rounded panel with amber warning glyph (lucide `TriangleAlert`), never a toast-stack of alarms.
- **Scroll button:** `surface` green circle, bone arrow, amber hover ring - the lamp lights when there is something to see.

## 7. Motion Spec

- Calm, heavy, no bounce. `MOTION_INTENSITY: 3`. Everything 200-300ms `cubic-bezier(0.16, 1, 0.3, 1)` on transform/opacity only.
- Sidebar collapse: spring-ish ease on `width` via the shadcn sidebar mechanism (transform translate for the drawer on mobile), 250ms.
- Message entry: `opacity 0→1` + `translateY(8px→0)`, 200ms, staggered 30ms per turn. No scale-pop.
- Send button `:active`: `scale(0.98)`. Nav item `:active`: `translateX(1px)` (RTL: nudges toward start edge, tactile push).
- Shimmer on loading callouts: 2.4s slow loop, amber-tinted, `prefers-reduced-motion` freezes it to a static `secondary` block.
- NO scroll-hijack, NO marquee, NO parallax, NO infinite loops outside the shimmer. Streaming text appears as it arrives - no typewriter effect.
- All motion gated behind `@media (prefers-reduced-motion: no-preference)`; reduced-motion users get instant swaps.

## 8. Corner Radius + Surface System

- ONE radius scale, soft throughout: `--radius: 0.75rem`. Input dock, callouts, nav items, buttons all `rounded-xl`/`rounded-2xl` (12-16px). No pill, no sharp, no mixed system. The single exception is the 3px start-edge marker on active nav (a bar, not a shape).
- Surfaces stack like timber: `background` (forest floor) < `surface` (raised plank) < `surface-2` (lit plank / hover). Depth expressed by lightness steps within the same green hue - never by black shadows. Shadows, when used, are green-tinted (`oklch(0.15 0.03 155 / 0.35)`).
- No card-on-card nesting. One raised panel per visual group. Callouts nest their ayah strip at most one level (`background` inset inside `surface`).

## 9. Three Signature Premium Details

1. **The lamp rule.** Exactly one amber element per view. Send button, active chat title, the ayah currently cited. If two things are amber, one is wrong. This rationing is the whole luxury feel - the eye always lands where the truth is.
2. **Wood-grain hairlines.** Borders are `oklch(0.35 0.04 155)` - not grey, not black, a warm green-black that reads as the seam between planks. On hover, the active item's hairline warms toward amber at 30% (`border-accent/30`) as if the lamp is reaching over. Subtle, one-directional, consistent light source.
3. **The carved artifact.** Ayah callouts sit on a `surface` panel with a darker `background` inset strip holding the Uthmanic text, ringed by the 2px amber top edge. The verse reads as an object set into the desk, not a UI card. Reference in amber tabular-nums below, like a museum plate: "الآية ٢:٢٥٥".

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes (— or –) anywhere in this spec or in any copy I prescribe. Hyphens only.
- [x] Exactly ONE accent: amber. Green and bone are surfaces/text, not competing accents.
- [x] One corner-radius system: soft 12-16px, no mixed pill/sharp.
- [x] `min-h-[100dvh]` specified, no `h-screen` anywhere.
- [x] RTL first: sidebar on the start side (right), arrows/markers mirrored for RTL.
- [x] Calm motion: transform/opacity only, reduced-motion honored, no scroll-hijack, no marquee, no parallax.
- [x] No AI-purple, no beige+brass cliche: the palette is green-dominant with a single amber light, not a warm-paper default.
- [x] Tajawal retained, zero new dependencies.
- [x] No generic 3-equal-card rows: empty state uses a 2x2 prompt grid, bento absent.
- [x] Real states: loading skeleton (amber shimmer), empty state composed, error inline, active nav wash + marker.
- [x] Buttons contrast-checked: amber `#E0A33C` on deep green carries dark `#14271C` text (contrast ~7:1), primary green on bone similarly safe.
- [x] Copy register consistent: calm Arabic, no "elevate/seamless" filler, no exclamation marks.
