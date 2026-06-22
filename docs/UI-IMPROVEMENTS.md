# UI/UX Improvements — Plan

**Colors:** Unchanged — keep existing shadcn theme palette.
**Fonts:** Unchanged — Tajawal, Uthmanic, Inter.
**New dependencies:** Zero.
**Scope:** Layout, spacing, micro-interactions, typography hierarchy, homepage restructure.

## Changes

### 1. globals.css — Animations & utilities
- `@keyframes ping-small` — sparkle on copy success
- `@keyframes fade-in` — page entrance
- `.noise-overlay` — subtle CSS grain texture (3% opacity)
- `.card-hover` — reusable hover elevation + translate

### 2. layout.tsx — Noise overlay
- Absolute-positioned `.noise-overlay` div between body and content

### 3. Homepage (app/page.tsx) — Bentō grid
- 3 cards in a staggered CSS grid (1 large + 2 small)
- Featured surah spotlight in the large slot
- Rest stays: search bar prominent, theme links

### 4. Navbar — Animated link underlines
- RTL-aware underline animation on nav links
- Active page indicator

### 5. VerseCard — Elevation + verse number badge
- Circular verse number badge (like surah index)
- Hover elevation
- Smooth tafsir toggle

### 6. HadithCard — Elevation + cleaner badge
- Hover elevation
- Grade badge with left colored dot

### 7. GlobalSearchBar — Focus glow
- `ring-primary/20` glow on focus

### 8. CopyButton — Success ping animation
- Brief scale-up ping on successful copy

### 9. Breadcrumbs — Pill hover fill
- Pill-shaped items, background fill on hover

## Files touched
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `src/components/navbar.tsx`
- `src/components/verse-card.tsx`
- `src/components/hadith-card.tsx`
- `src/components/global-search-bar.tsx`
- `src/components/copy-button.tsx`
- `src/components/breadcrumbs.tsx`

## Non-goals
- No new dependencies
- No new components
- No color changes
- No font changes
- No restructuring of routes or data fetching
- No Playwright export changes
