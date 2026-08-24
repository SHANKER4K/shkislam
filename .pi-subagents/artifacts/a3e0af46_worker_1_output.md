 Task 7 complete. Here's the summary:

**Changes made:**
- **`app/globals.css`**: Added `.transition-default` utility (150ms, `cubic-bezier(0.16, 1, 0.3, 1)`) and `@media (prefers-reduced-motion: reduce)` block that neuters all animations/transitions system-wide.
- **`app/layout.tsx`**: Added grain overlay `<div>` as the last child of `<body>` — `fixed inset-0 z-[9999] pointer-events-none` with SVG feTurbulence noise at 2.5% opacity.

**Lint:** `bun run lint` ran. All 29 errors/warnings are **pre-existing** in other files — zero new lint issues from these changes. No staged files per instruction.