    <Link href={`/quran/${surahNumber}/${verseNumber}`}>
      <div
        className="font-quran leading-[2] text-foreground cursor-pointer"
        style={{ fontSize: `${fontSize}px` }}
      >
        {textUthmani}
        <span className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-foreground text-xs font-bold tabular-nums mx-2 align-middle">
          {verseNumber}
        </span>
      </div>
    </Link>

    {/* Action bar — always visible on mobile, hover-only on desktop */}
    <div className="flex items-center gap-1 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
      <FavoriteButton
        isFavorited={isFavorite(`ayah-${surahNumber}-${verseNumber}`)}
        onToggle={() =>
          toggleFavorite({
            type: "ayah",
            surahNumber,
            verseNumber,
            textUthmani,
            surahNameAr: surahName,
          } as FavoriteItem)
        }
      />
      <CopyButton text={textUthmani} citationText={citationText} />
      <ExportModal
        text={textUthmani}
        source={`${surahName} - الآية ${verseNumber}`}
        type="ayah"
      >
        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
          <Share className="size-4 stroke-[1.5]" />
        </Button>
      </ExportModal>
      {tafsirText && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTafsir(!showTafsir)}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          التفسير الميسر
          {showTafsir ? <ChevronUp className="size-4 stroke-[1.5]" /> : <ChevronDown className="size-4 stroke-[1.5]" />}
        </Button>
      )}
    </div>

    {/* Tafsir expand */}
    {tafsirText && showTafsir && (
      <div className="mt-3 rounded-xl bg-card border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">
        <div
          dangerouslySetInnerHTML={{ __html: tafsirText }}
          className="font-arabic [&_span.green]:text-green-700 [&_span.green]:dark:text-green-400"
        />
      </div>
    )}
  </div>
);
```

- [ ] **Step 2: Update imports**

Change `Image` import from `lucide-react` to `Share`:

```tsx
import { ChevronDown, ChevronUp, Share } from "lucide-react";
```

Remove unused `Card` and `CardContent` imports (or keep them if they are used elsewhere in the file — verify before removing).

- [ ] **Step 3: Verify and commit**

Run: `bun run lint`
Expected: Pass

Visual check on `/quran/1`: Ayahs have no card background. Verse number badge is muted grey. Action buttons appear below each ayah. On mobile, buttons are always visible. On desktop, they fade in on hover. Tafsir block has terracotta right-border.

```bash
git add src/components/verse-card.tsx
git commit -m "design: VerseCard — transparent surface, action bar, mobile visibility"
```

---

### Task 5: HadithCard Redesign

**Goal:** Unified card surface with dot+label grade badges. Action bar below text with mobile visibility. Sharh expand styled like tafsir.

**Files:**
- Modify: `src/components/hadith-card.tsx`
- Verify: visual check on any `/hadith/[slug]`, `bun run lint`

**Interfaces:**
- Consumes: `Card`, `CardContent`, `Badge`, `Button`, `ChevronDown`, `ChevronUp`, `CopyButton`, `ExportModal`, `FavoriteButton`
- Produces: `HadithCard` component — same props, new DOM structure.

- [ ] **Step 1: Replace grade badge system**

Replace the existing `gradeColor` and `gradeDot` logic with the DESIGN.md dot+label system:

Before:
```tsx
const gradeColor = grade === "Sahih" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : grade === "Hasan" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
const gradeDot = grade === "Sahih" ? "bg-green-500" : grade === "Hasan" ? "bg-yellow-500" : "bg-red-500";
```

After:
```tsx
const gradeBadge =
  grade === "Sahih"
    ? { bg: "bg-[#EDF3EC]", text: "text-[#4A7C59]", dot: "bg-[#4A7C59]", label: "صحيح" }
    : grade === "Hasan"
      ? { bg: "bg-[#FBF3DB]", text: "text-[#8B6914]", dot: "bg-[#B4882E]", label: "حسن" }
      : { bg: "bg-[#FDEBEC]", text: "text-[#9B2C2C]", dot: "bg-[#C44B4B]", label: "ضعيف" };
```

Then update the grade Badge usage:

```tsx
<Badge className={`text-xs ${gradeBadge.bg} ${gradeBadge.text} flex items-center gap-1.5 border-0`}>
  <span className={`size-1.5 rounded-full ${gradeBadge.dot}`} />
  {gradeBadge.label}
</Badge>
```

- [ ] **Step 2: Rewrite HadithCard JSX**

Replace the entire return statement with:

```tsx
return (
  <div className="group relative bg-card rounded-xl p-5 shadow-none">
    {/* Top row: metadata */}
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
          {bookNameAr}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium tabular-nums">
          حديث رقم {number}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-md ${gradeBadge.bg} ${gradeBadge.text} font-medium flex items-center gap-1.5`}>
          <span className={`size-1.5 rounded-full ${gradeBadge.dot}`} />
          {gradeBadge.label}
        </span>
      </div>
    </div>

    {/* Text */}
    <Link href={`/hadith/${bookSlug}/${hadithId}`}>
      <div className="font-arabic leading-relaxed text-foreground text-base mb-2 cursor-pointer hover:text-primary transition-colors duration-150">
        {sanad && <span className="text-muted-foreground">{sanad} </span>}
        <strong>{matn || text}</strong>
      </div>
    </Link>

    {narrator && (
      <div className="text-sm text-muted-foreground mt-2">
        <span className="font-medium">الراوي:</span> {narrator}
      </div>
    )}

    {/* Action bar — always visible mobile, hover desktop */}
    <div className="flex items-center gap-1 mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
      <FavoriteButton
        isFavorited={isFavorite(`hadith-${hadithId}`)}
        onToggle={() =>
          toggleFavorite({
            type: "hadith",
            hadithId,
            text,
            narrator: narrator || null,
            grade,
            bookNameAr,
            bookSlug,
            chapterTitle,
            chapterOrder,
          } as FavoriteItem)
        }
      />
      <CopyButton text={text} citationText={citationText} />
      <ExportModal
        text={matn || text}
        source={`${bookNameAr} - حديث رقم ${number}`}
        type="hadith"
      >
        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
          <Share className="size-4 stroke-[1.5]" />
        </Button>
      </ExportModal>
      {sharh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSharh(!showSharh)}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          الشرح
          {showSharh ? <ChevronUp className="size-4 stroke-[1.5]" /> : <ChevronDown className="size-4 stroke-[1.5]" />}
        </Button>
      )}
    </div>

    {/* Sharh expand */}
    {sharh && showSharh && (
      <div className="mt-3 rounded-xl bg-background border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">
        {sharh}
      </div>
    )}
  </div>
);
```

- [ ] **Step 3: Update imports**

Change `Image` to `Share` in the lucide import:

```tsx
import { ChevronDown, ChevronUp, Share } from "lucide-react";
```

Remove unused `Badge` import if no longer used elsewhere in the file.

- [ ] **Step 4: Verify and commit**

Run: `bun run lint`
Expected: Pass

Visual check: Cards have `rounded-xl bg-card` with no border/shadow combo. Grade badges use pale dot+label system. Action bar appears below text. Sharh expand has terracotta right-border.

```bash
git add src/components/hadith-card.tsx
git commit -m "design: HadithCard — dot+label grades, action bar, unified surface"
```

---

### Task 6: Content Page Layouts

**Goal:** Break generic grids, restyle headings, apply unified card language across Quran index, Hadith index, Themes, Favorites, and About.

**Files:**
- Modify: `app/quran/page.tsx`, `app/hadith/page.tsx`, `app/themes/page.tsx`, `app/favorites/page.tsx`, `app/about/page.tsx`
- Verify: visual check on each page, `bun run lint`

**Interfaces:**
- Consumes: existing page data fetching functions, `VerseCard` (via favorites), `HadithCard` (via favorites in future — not currently).
- Produces: JSX layout changes only.

- [ ] **Step 1: Quran index (`app/quran/page.tsx`)**

Replace the entire inner content (after `<main>`) with:

```tsx
  <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
    <Breadcrumbs items={[{ label: "القرآن الكريم" }]} />

    <div className="mt-6 mb-8">
      <p className="text-xs text-muted-foreground font-medium mb-1 tabular-nums">١١٤ سورة</p>
      <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        القرآن الكريم
      </h1>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {surahs.map((surah) => (
        <Link key={surah.id} href={`/quran/${surah.number}`}>
          <div className="bg-card rounded-lg p-4 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer flex items-center gap-3">
            <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-sm tabular-nums shrink-0">
              {surah.number}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-arabic font-semibold truncate text-foreground">{surah.nameAr}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {surah.nameTranslation} • {surah.versesCount} آية
              </p>
            </div>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0",
              surah.revelationType === "Meccan"
                ? "bg-[#EDF3EC] text-[#4A7C59]"
                : "bg-[#E1F3FE] text-[#1F6C9F]"
            )}>
              {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </main>
```

Add `cn` import at top if missing:
```tsx
import { cn } from "@/lib/utils";
```

- [ ] **Step 2: Hadith index (`app/hadith/page.tsx`)**

Replace inner content with editorial split layout:

```tsx
  <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
    <Breadcrumbs items={[{ label: "الأحاديث النبوية" }]} />

    <div className="mt-6 mb-10">
      <p className="text-xs text-muted-foreground font-medium mb-1">كتب السنة</p>
      <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        الأحاديث النبوية
      </h1>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {books.map((book) => (
        <Link key={book.id} href={`/hadith/${book.slug}`}>
          <div className="bg-card rounded-xl p-8 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer h-full flex flex-col items-start gap-4">
            <div className="size-14 rounded-lg bg-muted flex items-center justify-center">
              <BookMarked className="size-7 text-primary stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-arabic text-2xl font-bold text-foreground">{book.nameAr}</h2>
              <p className="text-sm text-muted-foreground mt-1">{book.nameEn}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </main>
```

- [ ] **Step 3: Themes page (`app/themes/page.tsx`)**

Replace inner content with broken grid:

```tsx
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <div className="mb-10">
      <h1 className="font-arabic text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        المواضيع
      </h1>
      <p className="text-muted-foreground font-arabic mt-2">
        مواضيع إسلامية متنوعة مع نصوص من القرآن الكريم والسنة النبوية
      </p>
    </div>

    {themes.length === 0 ? (
      <div className="text-center py-24 text-muted-foreground font-arabic">
        لا تو