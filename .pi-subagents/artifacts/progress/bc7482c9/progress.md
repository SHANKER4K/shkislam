# Task 5: HadithCard Redesign — Progress

- [x] Read `src/components/hadith-card.tsx`
- [x] Replaced `Image` import with `Share` from `lucide-react`
- [x] Removed `Card`, `CardContent`, and `Badge` imports
- [x] Replaced `gradeColor` + `gradeDot` with `gradeBadge` object matching DESIGN.md dot+label system
- [x] Rewrote return statement:
  - Root: `<div className="group relative bg-card rounded-xl p-5 shadow-none">`
  - Top metadata row: book name badge, hadith number badge, grade badge (dot+label)
  - Text section with `hover:text-primary transition-colors duration-150`
  - Narrator row with `font-medium` label
  - Action bar with `opacity-100 md:opacity-0 md:group-hover:opacity-100` mobile fix
  - Sharh expand with `rounded-xl bg-background border-r-2 border-primary p-5`
- [x] Ran `bun run lint` — 0 new errors from this file. All 29 errors/warnings are pre-existing in other files.

## Changed files
- `src/components/hadith-card.tsx` — full redesign per DESIGN.md §6.6
