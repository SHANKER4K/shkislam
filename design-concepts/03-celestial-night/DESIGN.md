# Design Direction #3: CELESTIAL NIGHT (ليل)

## 1. Design Read (one line)

Reading this as: a dark-first AI study companion for Islamic seekers, with a night-sky indigo + lantern-gold visual language leaning toward calm, reverent, ChatGPT-proportioned product UI.

## 2. Concept Narrative

The app is a night study session. The scholar works by lamplight after Isha: the deep indigo sky holds a sparse field of stars and a thin crescent, and the only warmth in the room comes from the lantern. The chat is that lantern. Every question asked and every ayah or hadith returned glows softly in gold against the night, the way a page of mushaf catches candlelight. The design is dark-first because this product is used in the hours when the world is quiet and the mind is seeking. Light mode is the dawn: cool paper and indigo ink, the same single gold accent, never a separate aesthetic. The interface is calm, spacious, and legible; the sky is decoration, never noise, and it is entirely CSS so it costs nothing and respects reduced motion.

## 3. Palette (exact, oklch to match the existing token system)

### DARK (default theme, the primary experience)

| Token | Value | Rationale |
|---|---|---|
| `--background` | `oklch(0.155 0.026 264)` | Deep indigo night. Hue 264 is blue-violet sky, chroma 0.026 keeps it from reading as AI-purple slop. |
| `--foreground` | `oklch(0.94 0.012 90)` | Warm off-white text (candle-paper), never pure white. |
| `--card` | `oklch(0.19 0.028 265)` | One step up from sky; subtle surface lift. |
| `--card-foreground` | `oklch(0.94 0.012 90)` | Same as foreground. |
| `--popover` | `oklch(0.21 0.03 265)` | Menus/dropdowns, slightly lifted. |
| `--primary` | `oklch(0.83 0.115 82)` | **Lantern gold. The single accent.** Warm, moderate chroma. |
| `--primary-foreground` | `oklch(0.16 0.03 264)` | Deep indigo on gold for AA contrast. |
| `--secondary` | `oklch(0.24 0.024 265)` | Twilight blue; secondary surfaces. |
| `--secondary-foreground` | `oklch(0.88 0.015 90)` | Warm off-white. |
| `--muted` | `oklch(0.215 0.022 265)` | Hover/disabled surfaces. |
| `--muted-foreground` | `oklch(0.68 0.02 260)` | Secondary text; dimmer than foreground. |
| `--accent` | `oklch(0.24 0.028 265)` | Hover tint, matches muted family. |
| `--accent-foreground` | `oklch(0.94 0.012 90)` | |
| `--destructive` | `oklch(0.62 0.19 25)` | Keep current. |
| `--border` | `oklch(0.30 0.022 265)` | Hairlines between night layers. |
| `--input` | `oklch(0.30 0.022 265)` | Matches border. |
| `--ring` | `oklch(0.83 0.115 82 / 0.55)` | Focus ring = lantern glow at half opacity. |
| `--sidebar` | `oklch(0.17 0.027 264)` | Slightly darker than card; the sky edge. |
| `--sidebar-foreground` | `oklch(0.94 0.012 90)` | |
| `--sidebar-primary` | `oklch(0.83 0.115 82)` | Active item = gold. |
| `--sidebar-accent` | `oklch(0.235 0.028 265)` | Hover item. |
| `--sidebar-border` | `oklch(0.27 0.022 265)` | |

**Star field (new token, not in the current schema):** `--night-star: oklch(0.90 0.03 230 / 0.7)` for twinkle dots, `--night-moon-glow: oklch(0.83 0.115 82 / 0.12)` for the halo behind the brand crescent and empty-state moon.

### LIGHT (dawn, secondary but must ship and pass contrast)

| Token | Value |
|---|---|
| `--background` | `oklch(0.972 0.008 95)` | Cool dawn paper. |
| `--foreground` | `oklch(0.22 0.045 264)` | Indigo ink. |
| `--card` | `oklch(0.995 0.003 95)` |
| `--popover` | `oklch(0.995 0.003 95)` |
| `--primary` | `oklch(0.70 0.115 75)` | Deeper gold for contrast on paper. |
| `--primary-foreground` | `oklch(0.99 0.01 95)` | Off-white on gold. |
| `--secondary` | `oklch(0.93 0.015 95)` |
| `--muted` | `oklch(0.945 0.01 95)` |
| `--muted-foreground` | `oklch(0.48 0.03 260)` |
| `--accent` | `oklch(0.935 0.012 95)` |
| `--border` | `oklch(0.89 0.012 95)` |
| `--ring` | `oklch(0.70 0.115 75 / 0.5)` |
| `--sidebar` | `oklch(0.955 0.008 95)` |

## 4. Typography

- **UI (all labels, buttons, nav, body):** Tajawal, weights 400/500/700/800. Keep `--font-arabic` as-is. Display headers: Tajawal 800, `tracking-tight`, `leading-[1.1]` (italic-descender-safe; Tajawal has no italics, so no clearance hazard, but keep 1.1 for ascenders on Arabic script).
- **Quran display (ayah callouts):** `--font-quran` (KFGQPC-Uthmanic-HAFS) at `text-2xl md:text-3xl`, `leading-loose` for Arabic script rhythm, color `--foreground` with the callout card tinted by night layers.
- **Numbers/timestamps (session count, verse refs like 2:255):** tabular figures via `font-variant-numeric: tabular-nums` on `font-mono` for Latin refs; Arabic numerals inherit Tajawal.
- **Headline scale (chat empty state):** `text-3xl md:text-4xl font-extrabold`, the brand phrase "اسأل عن دينك" in Tajawal 800. Max 2 lines.

## 5. Layout System

### Chat shell wireframe (RTL: sidebar on the RIGHT = `start` side)

```
dir=rtl  ┌───────────────────────────────┬──────────────────────────────────┐
         │  ☾ SHK Islam      [◧ collapse]│                                  │
         │  ───────────────────────────── │            ⚲ نيّت                       │
         │  [ + محادثة جديدة ]            │    (crescent mark, gold)          │
         │  ───────────────────────────── │                                  │
         │  ✦ القرآن الكريم              │    … empty state or messages …   │
         │  ✦ الأحاديث النبوية           │    (centered column, max-w-3xl)  │
         │  ✦ المواضيع                   │                                  │
         │  ✦ المفضلة                    │                                  │
         │  ✦ البحث                      │                                  │
         │  ───────────────────────────── │                                  │
         │  ⚙ حول المنصة                 │  ┌────────────────────────────┐  │
         │                                │  │  اسأل عن دينك…          [➤] │  │
         └───────────────────────────────┴──└────────────────────────────┘──┘
            sidebar w-64 (collapses to w-14 icon rail, animate w via
            transform/transition, not layout thrash)   min-h-[100dvh] flex column
```

- **Shell:** `<div className="flex min-h-[100dvh]">` with `AppSidebar` as first child (RTL start = right). Content column is `flex-1 min-w-0 flex flex-col`.
- **Sidebar:** 256px (`w-64`), collapses to 56px (`w-14`) icon rail. Collapse button is a gold ghost icon at the top. Active item: gold text + `bg-primary/10` rounded tile with a soft `ring-1 ring-primary/20`. Collapse animates `width` via CSS transition `transition-[width] duration-300` (width is layout, but this is a one-shot 300ms collapse, acceptable; alternative: `grid-template-columns` trick if we want transform-only, note in code review).
- **Chat column:** `max-w-3xl mx-auto w-full px-4` for the message list and input. Messages full-bleed width inside that column, NOT cards with shadow; only the input gets a container.
- **Night ambience:** a single `fixed inset-0 -z-10 pointer-events-none` div with the CSS starfield (see 5.1). The chat content sits on `--background`; the starfield is 4-6% opacity so it never competes with text. `prefers-contrast` (forced-colors/contrast) users get it removed via media query.

### 5.1 Starfield (CSS-only, no canvas, reduced-motion-safe)

```css
.night-stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -10;
  /* three tiny radial-gradient star "layers" at different scales */
  background-image:
    radial-gradient(1px 1px at 12% 22%, var(--night-star), transparent 40%),
    radial-gradient(1px 1px at 38% 68%, var(--night-star), transparent 40%),
    radial-gradient(1.5px 1.5px at 64% 31%, var(--night-star), transparent 45%),
    radial-gradient(1px 1px at 81% 12%, var(--night-star), transparent 40%),
    radial-gradient(1px 1px at 92% 54%, var(--night-star), transparent 40%),
    radial-gradient(1.5px 1.5px at 22% 83%, var(--night-star), transparent 45%),
    radial-gradient(1px 1px at 48% 9%, var(--night-star), transparent 40%),
    radial-gradient(1px 1px at 71% 77%, var(--night-star), transparent 40%);
  background-size: 640px 640px;
  opacity: 0.05;
}
@media (prefers-reduced-motion: no-preference) {
  .night-stars { animation: star-drift 120s linear infinite; }
  @keyframes star-drift { to { background-position: 640px 640px; } }
}
@media (prefers-reduced-motion: reduce), (forced-colors: active) {
  .night-stars { display: none; }
}
/* Light mode: swap to a single warm paper tone, no stars */
:root:not(.dark) .night-stars { opacity: 0; }
```

One tiny SVG crescent mark (allowed, it is the brand avatar, not decoration): a `<svg viewBox="0 0 24 24">` crescent path filled `--primary`, used in sidebar header + empty state. No other hand-rolled SVG.

### Sidebar treatment

- Header: crescent SVG + "SHK Islam" in Tajawal 800.
- "New chat" button: full-width, `bg-primary text-primary-foreground`, radius 12px, `active:scale-[0.98]`, label "محادثة جديدة" (3 words max, no wrap).
- Nav sections labeled with small `text-[11px]` muted labels (المصادر, الحساب). Max 1 eyebrow per 3 sections rule respected; here only 2 labels on a sidebar, fine.
- Item hover: `bg-muted`, `active:scale-[0.98]`. Active: gold tile described above.
- Bottom: "حول المنصة" link + theme toggle (moon/sun, the one allowed icon switch).

## 6. Component Inventory

- **Chat input (the lantern):** container `rounded-2xl border border-border bg-card shadow-[0_0_0_1px_var(--ring)] focus-within:shadow-[0_0_0_2px_var(--ring),0_0_24px_-6px_var(--night-moon-glow)]`, `p-3`, autosizing `PromptInputTextarea` (no border), submit button `size-9 rounded-xl bg-primary text-primary-foreground` inside the bottom corner, disabled state `opacity-40`. Focus = lantern glow: a 2px gold ring + a soft 24px gold halo. Placeholder `text-muted-foreground`.
- **User message:** right-aligned (RTL end), Tajawal 500, `text-[0.975rem] leading-relaxed`, no bubble (ChatGPT style), just text on background. Optionally a soft `bg-primary/8 rounded-xl px-4 py-2` bubble; spec: no bubble, cleaner.
- **Assistant message:** left-aligned, same type scale, `text-foreground`. Long answers wrap freely.
- **Tool callouts (ayah/hadith = star-ruled cards):** reuse existing `.callout-*` pattern but restyle for night: `rounded-xl border border-border bg-card/70` with `border-inline-start: 3px solid var(--primary)` (gold rule on the start edge), title in Tajawal 700 gold-ish (`text-primary`), body in `--font-quran` for ayahs / Tajawal for hadith text. Citation footer: small `text-xs text-muted-foreground tabular-nums` (e.g. `البقرة 2:255`). The gold rule reads as a beam of lamplight across the card.
- **Sidebar nav items:** 40px tall rows, `gap-3`, lucide icon `size-4.5 text-muted-foreground` (active: `text-primary`), label `text-sm font-medium`.
- **Empty state (the night sky screen):** centered column; crescent SVG (36px, gold) with a `--night-moon-glow` halo; headline "اسأل عن دينك"; subtext one line muted; **suggested-question grid** of 4 chips (`rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5`, click fills input): "آية عن الصبر", "حديث عن بر الوالدين", "تفسير آية الكرسي", "أحاديث فضل العلم". Chip grid: `grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md`.
- **Loading state:** existing `Shimmer` component retinted gold (`via-primary/10`), text "جاري البحث في المصادر…".
- **Error state:** inline muted text "حدث خطأ في الاتصال. حاول مرة أخرى." + retry button (secondary variant), no alert().

## 7. Motion Spec (calm, motivated)

| Element | Motion | Why |
|---|---|---|
| Sidebar collapse | `transition-[width] duration-300 ease-out`, icons fade `opacity` | state transition |
| New message entry | `opacity 0→1` + `translateY(8px→0)`, 250ms, ease `[0.16,1,0.3,1]` | hierarchy/reveal |
| Send button | `active:scale-[0.96]` | tactile feedback |
| Focus ring on input | CSS `transition: box-shadow 200ms` | feedback |
| Starfield drift | 120s linear background-position loop | ambience; killed by reduced-motion |
| Nav item hover | `bg` 150ms + `scale-[0.98]` on active | feedback |

No scroll-hijack, no marquee, no parallax, no `window.addEventListener('scroll')`. All transforms/opacity except the one-shot sidebar width transition (noted). `prefers-reduced-motion: reduce` = everything static, stars hidden.

## 8. Corner Radius + Surface System

- One system, all soft: `rounded-xl` (12px) for cards/callouts/inputs/buttons; `rounded-full` ONLY for the suggestion chips and the submit icon button is `rounded-xl` to stay in-system (chips are the documented exception, like pills in a pill row).
- Surfaces by elevation: sky (`--background`) → card (`--card`) → popover (`--popover`); sidebar is its own slightly-darker sky edge. No shadows except the input glow and a faint `shadow-sm` on popovers. No pure black, no pure white anywhere.

## 9. Three Signature Premium Details

1. **The lantern input glow:** focus turns the chat input into a lit lantern: a 2px gold ring + 24px warm halo (`--night-moon-glow`). The one place on screen that is *lit*; everything else recedes. This single detail sells the whole metaphor.
2. **Star-ruled callouts:** every ayah/hadith citation card gets a gold beam on its start edge (3px `border-inline-start`) over a night-tinted card, with the reference in tabular numerals. The sources are the treasure; the gold beam marks them.
3. **Crescent empty state with suggested questions:** the moon hangs over four clickable question chips. It is the only "hero" the app has, and it turns a blank canvas into a night-sky study invitation. One compositional moment, no marketing slop.

## 10. Anti-Slop Self-Audit

- [x] Zero em-dashes in any copy or docs; used hyphens only. (Verified: this doc uses hyphens, never the em or en dash character.)
- [x] Exactly ONE accent: lantern gold. All interactive elements use `--primary` or its tints.
- [x] One corner-radius system: 12px base, full only for chips (documented exception).
- [x] `min-h-[100dvh]`, no `h-screen` anywhere in the spec.
- [x] RTL first: sidebar on the `start` (right) side, `border-inline-start` for callout rules, `ms-`/`me-` logical props.
- [x] Calm motion: transform/opacity + one 300ms width collapse; starfield drift only; all gated by `prefers-reduced-motion`.
- [x] Starfield is CSS radial-gradients on one fixed pointer-events-none layer, no canvas, no JS scroll listeners; removed under reduce/forced-colors and in light mode.
- [x] No AI-purple: hue 264 chroma 0.026 reads as night-sky blue, not neon purple; gold accent is warm, not neon.
- [x] Tajawal reused for UI; Uthmanic for Quran display; no new fonts, no new dependencies.
- [x] Contrast: gold on indigo primary-foreground pair (0.83 L gold vs 0.16 L indigo) passes AA; warm off-white text on indigo passes AA; muted-foreground kept at 0.68 L for body-adjacent text.
- [x] No 3-equal-cards feature row; no centered hero on the chat page (empty state is centered by design, it IS the canvas); no version badges, no scroll cues, no locale strips.
- [x] Loading (shimmer), empty (night-sky + chips), error (inline + retry) states all specified.
- [x] Dark mode is the default (this direction is dark-first) and light dawn mode is specified with its own tokens; one theme per page, no section inversions.

## Implementation notes for the engineer

- Swap the `.dark` block in `app/globals.css` to the dark table above and the `:root` block to the light (dawn) table, since this direction is dark-first: put night values in `.dark` and dawn in `:root`, then set `defaultTheme="dark"` in the ThemeProvider in `app/layout.tsx`.
- Add `--night-star` and `--night-moon-glow` to both `:root` and `.dark`, then to the `@theme inline` block as `--color-night-star` / `--color-night-moon-glow`.
- Add `.night-stars` CSS as written in 5.1 and mount `<div className="night-stars" aria-hidden />` once in the root layout inside ThemeProvider.
- Sidebar: build with shadcn `sidebar` primitives (tokens already exist); RTL is handled by `dir=rtl` + logical properties.
- Move `app/chat/page.tsx` to `app/page.tsx`; wrap all pages in the shell; delete the old marketing homepage.
