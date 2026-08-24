 The full design refresh is **complete**. All 7 tasks from the plan are done, the build passes, and zero new dependencies were added.

### What changed

| Task | Files | What happened |
|---|---|---|
| **1. Palette** | `app/globals.css` | Full terracotta/parchment swap — light + dark tokens, sepia-tinted shadows |
| **2. Sidebar** | `src/components/app-sidebar.tsx` | Leather binding colors, terracotta start-edge rule on active nav, icon stroke standardization |
| **3. Chat** | `app/page.tsx` | CSS ornament empty state, "ما الذي تريد أن تتعلمه؟" headline, user message wells, assistant plain text, terracotta send button, skeleton loading (placeholder text removed) |
| **4. VerseCard** | `src/components/verse-card.tsx` | Transparent surface, muted verse badge, action bar below text, **mobile visibility fix** (`opacity-100 md:opacity-0`), tafsir with terracotta rule |
| **5. HadithCard** | `src/components/hadith-card.tsx` | Dot+label grade badges (pale green/yellow/red), unified `bg-card` surface, action bar, sharh with terracotta rule |
| **6. Content Pages** | `app/quran/page.tsx`, `app/hadith/page.tsx`, `app/themes/page.tsx`, `app/favorites/page.tsx`, `app/about/page.tsx` | Display-size left-aligned headlines, editorial layouts, broken grid on themes, sticky group headers in favorites, source cards in about |
| **7. Grain Overlay** | `app/layout.tsx` | Fixed `pointer-events-none` noise texture at 2.5% opacity |

### Verification

- ✅ `bun run build` — **passed** (19s compile, all 16 pages generated)
- ✅ `bun run lint` — errors are all **pre-existing** in unrelated files; zero new errors introduced
- ✅ Zero new npm packages added
- ✅ No functional logic changed — purely visual
- ✅ 11 files modified, 520 insertions / 523 deletions

### Ready for review

Run `bun run dev` and navigate through:
- `/` — chat with the new empty state and input dock
- `/quran` — surah index with color-coded badges
- `/quran/1` — ayah reader with transparent cards and action bars
- `/hadith` — editorial book cards
- `/themes` — broken grid with ghost watermarks
- `/favorites` — sticky headers and styled empty state
- `/about` — source cards grid

Toggle dark mode in the sidebar to see the umber leather + lit clay palette.