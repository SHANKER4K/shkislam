# Task 1: Palette Foundation — Progress

- [x] Read `app/globals.css`
- [x] Replaced `:root` block with terracotta/parchment light-mode tokens
- [x] Replaced `.dark` block with umber/lit-clay dark-mode tokens
- [x] Fixed truncated `.dark` block (shadow variables were cut, now complete)
- [x] Updated `.callout-quran-ayah` background from `var(--chart-2)` to `var(--accent)`
- [x] Kept `.callout-hadith` as `var(--card)` (already correct)
- [x] Ran `bun run lint` — errors are all pre-existing in other files, none from CSS changes
- [x] Ran `bun run build` — passed successfully

## Changed files
- `app/globals.css` — full palette swap (light + dark tokens, shadows tinted sepia, callout colors)

---

# Task 2: Sidebar Restyling — Progress

- [x] Read `src/components/app-sidebar.tsx`
- [x] Added `cn` import from `@/lib/utils`
- [x] Updated `SidebarMenuButton` className to include terracotta active state (`border-r-2 border-sidebar-primary text-sidebar-primary bg-sidebar-accent`)
- [x] Restyled "New chat" button with terracotta border and text, hover fill
- [x] Added `stroke-[1.5]` to ALL icon components: nav items, Sun, Moon, MessageSquare
- [x] Fixed JSX parsing error in theme toggle ternary (multiline expression)
- [x] Ran `bun run lint` — `app-sidebar.tsx` passes clean. Remaining errors are pre-existing in other files.

## Changed files
- `src/components/app-sidebar.tsx` — leather binding styling, active nav rule, icon standardization
