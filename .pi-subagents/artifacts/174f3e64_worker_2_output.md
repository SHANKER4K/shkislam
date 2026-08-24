 Task 3 (Chat Page Redesign) completed.

**What changed in `app/page.tsx`:**

| Change | Before | After |
|---|---|---|
| **Empty state** | Centered logo + "كيف يمكنني مساعدتك؟" + 2×2 suggestion grid | CSS ornament + "ما الذي تريد أن تتعلمه؟" + wrapping suggestion chips |
| **User messages** | Plain text, no container | Right-aligned `bg-muted/60` well with `rounded-xl` |
| **Assistant messages** | Plain text | Plain text with `leading-relaxed`, no container |
| **Copy button** | `opacity-0 group-hover:opacity-100` (mobile-invisible) | `opacity-100 md:opacity-0 md:group-hover:opacity-100` (always on mobile) |
| **Loading** | `<Shimmer>سوف ادهشك!</Shimmer>` | Neutral skeleton blocks (`animate-pulse`), placeholder text removed |
| **Input dock** | Textarea with border, generic submit | `rounded-2xl` parchment well, borderless textarea, terracotta submit button with `hover:brightness-110 active:scale-[0.98]` |
| **Imports** | `Logo`, `Image`, `Shimmer` imported, `cn` missing | `cn` added, unused imports removed |

**Validation:**
- `bun run build`: ✅ Pass
- `bun run lint`: ✅ No new errors introduced (the single `any` type at line 156 is pre-existing `parseEvent` function; all other lint errors are in unrelated files)

**State:** `app/page.tsx` modified in working tree, no staged files.