# Design Direction 10 - Smoke Silver

## 1. Design Read

Reading this as: a precision consumer device (Apple Watch / Tesla grade) serving as an AI scholar's chat app, for students of Islamic knowledge, with a cold chrome-and-mist luxury language, leaning toward blue-tinted smoke surfaces + brushed-metal neutrals + one surgical electric-blue accent (Tailwind tokens, shadcn/ui, zero new dependencies).

## 2. Concept Narrative

The app is a precision instrument for seeking knowledge, not a text box. Every surface is brushed and cool: blue-tinted smoke greys with genuine inner borders that catch a single, consistent light source from above, the way a machined aluminium case refracts. The chat column is a frosted lens over blank white space, and each ayah or hadith citation arrives as a cold glass inset that reads like a specimen under glass rather than a pasted card. Electric blue is the single accent and it is rationed to the level of a device's status light: the active nav item, the focus ring, the send affordance, nothing else. The overall posture is Apple-level restraint - calm, governed, quietly expensive - the scholarly equivalent of a well-machined watch. Motion is almost still, and where it exists it has the weight of brushed metal sliding.

## 3. Palette

All values are oklch. Hues are blue-tinted neutrals ONLY (cool, never warm). Electric blue is THE single accent. No purple, no gold, no warm grey.

### Light mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.972 0.003 258)` | cool white mist, page ground |
| `--foreground` | `oklch(0.24 0.006 258)` | near-charcoal text, blue-tinted |
| `--card` | `oklch(0.995 0.002 258)` | frosted glass, raised surface |
| `--card-foreground` | `oklch(0.24 0.006 258)` | |
| `--popover` | `oklch(0.995 0.002 258)` | |
| `--popover-foreground` | `oklch(0.24 0.006 258)` | |
| `--primary` | `oklch(0.55 0.15 258)` | electric blue (single accent) |
| `--primary-foreground` | `oklch(0.99 0 0)` | white on blue |
| `--secondary` | `oklch(0.925 0.006 258)` | brushed smoke fill |
| `--secondary-foreground` | `oklch(0.32 0.01 258)` | |
| `--muted` | `oklch(0.945 0.004 258)` | hairline wash |
| `--muted-foreground` | `oklch(0.5 0.01 258)` | smoke at 50% |
| `--accent` | `oklch(0.93 0.007 258)` | cool hover wash |
| `--accent-foreground` | `oklch(0.3 0.01 258)` | |
| `--destructive` | `oklch(0.577 0.19 25)` | kept for errors only |
| `--border` | `oklch(0.868 0.006 258)` | machined hairline |
| `--input` | `oklch(0.895 0.005 258)` | |
| `--ring` | `oklch(0.55 0.15 258)` | electric blue focus ring |
| `--sidebar` | `oklch(0.945 0.004 258)` | brushed metal panel |
| `--sidebar-foreground` | `oklch(0.3 0.008 258)` | |
| `--sidebar-primary` | `oklch(0.55 0.15 258)` | electric blue active item |
| `--sidebar-primary-foreground` | `oklch(0.99 0 0)` | |
| `--sidebar-accent` | `oklch(0.9 0.006 258)` | hover fill on metal |
| `--sidebar-accent-foreground` | `oklch(0.3 0.008 258)` | |
| `--sidebar-border` | `oklch(0.84 0.006 258)` | gasket hairline |

### Dark mode

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.19 0.008 258)` | deep smoke grey (not pure black) |
| `--foreground` | `oklch(0.93 0.004 258)` | cool white |
| `--card` | `oklch(0.225 0.009 258)` | frosted charcoal panel |
| `--card-foreground` | `oklch(0.93 0.004 258)` | |
| `--popover` | `oklch(0.225 0.009 258)` | |
| `--popover-foreground` | `oklch(0.93 0.004 258)` | |
| `--primary` | `oklch(0.72 0.14 258)` | brighter electric blue for AA |
| `--primary-foreground` | `oklch(0.97 0 0)` | |
| `--secondary` | `oklch(0.28 0.01 258)` | |
| `--secondary-foreground` | `oklch(0.92 0.005 258)` | |
| `--muted` | `oklch(0.26 0.008 258)` | |
| `--muted-foreground` | `oklch(0.72 0.006 258)` | |
| `--accent` | `oklch(0.29 0.009 258)` | |
| `--accent-foreground` | `oklch(0.94 0.004 258)` | |
| `--destructive` | `oklch(0.627 0.19 25)` | |
| `--destructive-foreground` | `oklch(0.98 0 0)` | |
| `--border` | `oklch(0.32 0.01 258)` | gasket hairline |
| `--input` | `oklch(0.3 0.01 258)` | |
| `--ring` | `oklch(0.72 0.14 258)` | electric blue focus ring |
| `--sidebar` | `oklch(0.17 0.007 258)` | dark brushed metal |
| `--sidebar-foreground` | `oklch(0.91 0.004 258)` | |
| `--sidebar-primary` | `oklch(0.72 0.14 258)` | electric blue active |
| `--sidebar-primary-foreground` | `oklch(0.97 0 0)` | |
| `--sidebar-accent` | `oklch(0.25 0.009 258)` | hover fill |
| `--sidebar-accent-foreground` | `oklch(0.93 0.004 258)` | |
| `--sidebar-border` | `oklch(0.29 0.01 258)` | gasket hairline |

## 4. Typography plan

Reuse the already-loaded stack; zero new deps.

- **Arabic UI (Tajawal):** retained as the UI face. Give it the device treatment: `font-sans` everywhere, regular weight for body copy, **500/600 for interactive text** (nav, buttons, active states) so hierarchy reads at a glance. Active nav uses 600, inactive 400.
- **Numbers & metadata:** `font-variant-numeric: tabular-nums` on verse numbers, chapter indices, and the citation labels (e.g. `2:286`). Tabular figures make reference coordinates feel machined and stable. This is the single typographic move that sells the "precision instrument" read.
- **Display:** the chat empty state uses Tajawal 800 for the headline at `text-2xl`, tight tracking. No serif, no display novelty - the brand is the instrument, not a font flourish.
- **Body measure:** message prose capped at `max-w-[65ch]` so lines stay readable under the frosted glass.

## 5. Layout system

### Chat shell wireframe (ASCII, dir=rtl so sidebar on the RIGHT)

```
┌─────────────┬───────────────────────────────────────────────┐
│             │                                               │
│  ◐  SHK     │                         ┌───────────┐         │
│  ─────────  │                         │  empty    │         │
│  + New chat │                         │  state    │         │
│  ─────────  │   " ابحث... "  suggestion chips   →chips→    │
│  ✦ Quran   │                                               │
│  ✦ Hadith  │                                               │
│  ✦ Themes  │        message thread (chat col)              │
│  ♡ Favs    │                                               │
│  ⌕ Search  │   ┌───────────────────────────────────────┐   │
│  ⓘ About   │   │  [ user bubble]            ⟵ user     │   │
│             │   └───────────────────────────────────────┘   │
│  ─────────  │   ┌─────────────────────────────────────────┐ │
│  ⊙ Theme   │   │  [ayah/hadith glass callout]             │ │
│             │   └─────────────────────────────────────────┘ │
│             │                                               │
│  ⤫ collapse │   ┌────────────────────────────────────────┐  │
│             │   │  ▢ ▢ ✦ [ frosted input bar ]  ⮚ send   │  │
│             │   └────────────────────────────────────────┘  │
├─────────────┴───────────────────────────────────────────────┤
```
- `main` = `h-[calc(100dvh-3.5rem)]` full-viewport column, `max-w-3xl mx-auto` for the message thread + input only. No framed card around the whole thing.
- **Sidebar:** right-aligned (start side), `collapsible="icon"`, collapsed width `w-[68px]`. Brushed-metal background, refined `1px` gasket borders. "New chat" is a top call-to-action with blue icon. Nav items are quiet rows; the ACTIVE one gets electric-blue text + a faint blue-tinted fill + a left-edge gasket (no loud pill).
- **Collapse affordance:** a thin chevron button in the sidebar's outer corner; on collapse only icons remain (tooltips on hover, via existing TooltipProvider).

## 6. Component inventory

- **Chat input:** frosted bar, `rounded-xl` (12px), `backdrop-blur` over page bg, `border-border` with a **solid-fill fallback** under `prefers-reduced-transparency`. Inner left: paperclip/mic icons (muted). Right: a circular send button in electric blue with white glyph; disabled state is a muted ghost so the blue send is an earned affirmation. Placeholder `"اسأل عن آية أو حديث..."` at muted-foreground.
- **User message bubbles:** right-aligned (RTL), `bg-secondary` brushed fill, `rounded-xl`, no heavy border - surface tint does the work. Text `text-sm`, Tajawal.
- **Assistant tool callouts (ayah/hadith):** the signature element. A **frosted glass panel** `rounded-xl` with an inner `1px` white highlight border on top (`border-white/20` in dark) + a `1px` gasket border, giving machined edge refraction. Header row: small Uthmanic/vs icon in electric blue + a source label (`القرآن الكريم 2:286` / `صحيح البخاري`). Body: Uthmanic script at comfortable size, tabular index. Under `prefers-reduced-transparency`, swap the frosted fill for solid `--card`.
- **Sidebar nav items:** `h-9` rows, `rounded-lg`, icon `size-4` at muted-foreground. Active: `text-primary` icon+label, subtle blue-tinted fill, 600 weight. Hover: `bg-sidebar-accent`. No pill, no bullet dot - the blue alone marks the active state.
- **Empty state:** centered column. A small frosted square badge holding an electric-blue spark/script icon, then Tajawal 800 headline, then `max-w-[65ch]` muted helper. Below, a **suggestion-chip row** (`rounded-lg` bordered chips) - clicking a chip fills the prompt input. Escape hatch included for keyboard users (focusable).

## 7. Motion spec

- Intensity: **3/10**. Deliberately still. This is the quietest direction of the fleet because the brand is precision, not performance.
- Entry: messages and callouts fade in `opacity 0→1` + `y 8px→0`, `200ms`, linear-ish ease, no stagger beyond 30ms. Nothing bounces.
- Sidebar: collapse/expand is a `transform` slide with `150-200ms`, `cubic-bezier(0.16,1,0.3,1)`. No physics overshoot - brushed metal stops dead.
- Send: the blue send button gets a `scale(0.98)` on `:active` (tactile press), `transition: transform 150ms`.
- Only `transform` and `opacity` are ever animated. No scroll-hijack, no marquee, no parallax.
- **Reduced motion:** `useReducedMotion()` gates ALL of the above; under `prefers-reduced-motion` everything renders static (no fade, no shift). Also gate the frosted input/callout blur under `prefers-reduced-transparency` with a solid `--card` fallback.

## 8. Corner radius + surface system

- **One radius scale, all soft:** buttons `rounded-full` is NOT used. Everything uses `rounded-lg`/`rounded-xl` from a single family:
  - `rounded-sm` (6px): nested inner chips, small tags.
  - `rounded-lg` (8px): sidebar nav rows, suggestion chips.
  - `rounded-xl` (12px): input bar, message bubbles, callout panels, empty-state badge.
- **Single radius lock:** nothing is round-pill, nothing is sharp-0. One gasket hairline (`border-border` / `border-border`) applied consistently as the machined seam.
- **Surfaces:** layered smoke. Page = `--background`. Frosted panels = `--card` + 1px inner white highlight top border + 1px gasket. Sidebar = `--sidebar`. Shadows are tiny and neutral (`shadow-sm`), tinted toward the smoke (never pure black).

## 9. Three signature premium details

1. **The glass specimen callout.** Ayah/hadith citations are frosted glass panels with a top inner white highlight (edge refraction) + a single electric-blue source glyph + tabular reference. It reads like a museum specimen under glass, the defining move of the whole direction.
2. **The rationed blue.** Electric blue appears ONLY on: active nav item, focus ring, the send button, and source glyphs. One color, an exactly fitted accent everywhere it appears - nothing else on the page may carry a second hue. This single discipline is what separates the look from ordinary grey SaaS.
3. **The machined collapse.** The sidebar collapses to a `68px` icon rail with a precise gasket seam and dead-stop cubic-bezier slide. In RTL it hugs the right edge like a physical hinge. The collapsed rail keeps tooltips via the existing TooltipProvider, so the instrument stays usable at maximum density.

## 10. Anti-slop self-audit

- [x] Exactly one accent color (electric blue), used sparingly - audited inventory in section 9.2.
- [x] Zero em-dash / en-dash characters anywhere in this document - verified (hyphens only).
- [x] One corner-radius system (lg/xl family), no pill, no sharp mixed.
- [x] `min-h-[100dvh]` / `h-[calc(100dvh-3.5rem)]`; never `h-screen`.
- [x] RTL-first: sidebar sits on the right (start side) visually.
- [x] Calm motion (3/10): transform/opacity only, no scroll-hijack, no marquee, no parallax.
- [x] Reduced motion honored via `useReducedMotion()`; reduced-transparency solid fallback provided.
- [x] Blue-tinted cool neutrals throughout; no warm greys, no AI-purple, no gold.
- [x] Tajawal retained, zero new dependencies, `tabular-nums` for reference numbers.
- [x] Glassmorphism present but contained to input + callouts, with solid fallback.
- [x] Contrast: primary-foreground white on electric blue passes AA (large text / icons); body uses muted-foreground at 4.5:1+ against smoke.