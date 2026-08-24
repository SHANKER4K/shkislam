# Task for worker

[Read from: /home/ismail/Documents/projects/JS/shkislam/context.md, /home/ismail/Documents/projects/JS/shkislam/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
**Task 6: Content Page Layouts**

Modify these 5 page files. Keep all data fetching and logic intact — only change layout/Tailwind classes.

**`app/quran/page.tsx`:**
- Replace inner `<main>` content. Keep `getAllSurahs()` call and `surahs` map.
- Add `cn` import if missing.
- Grid headline: left-aligned. Add eyebrow "١١٤ سورة" in `text-xs text-muted-foreground` above the H1.
- H1: `font-arabic text-4xl md:text-5xl font-extrabold tracking-tight`
- Grid: keep `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`
- Each surah card: replace `<Card>` with `<div className="bg-card rounded-lg p-4 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer flex items-center gap-3">`
- Number badge: `size-9 rounded-full bg-muted text-foreground font-bold text-sm tabular-nums`
- Revelation badge: use `cn` with conditional classes:
  - Meccan: `bg-[#EDF3EC] text-[#4A7C59]`
  - Medinan: `bg-[#E1F3FE] text-[#1F6C9F]`

**`app/hadith/page.tsx`:**
- Left-aligned headline "الأحاديث النبوية" with eyebrow "كتب السنة" above.
- Replace 2-column grid with editorial cards: `<div className="bg-card rounded-xl p-8 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer h-full flex flex-col items-start gap-4">`
- Icon container: `size-14 rounded-lg bg-muted`, icon `size-7 text-primary stroke-[1.5]`
- Keep `max-w-3xl` container.

**`app/themes/page.tsx`:**
- Left-aligned headline "المواضيع".
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`. If themes.length >= 4, first card gets `lg:col-span-2`.
- Each card: `<div className="bg-card rounded-xl p-6 border-t-2 border-primary/20 border border-transparent hover:border-border hover:bg-secondary transition-all duration-150 cursor-pointer h-full">`
- Add a ghost watermark inside each card: `<span className="text-[40px] text-muted-foreground/10 font-arabic leading-none block mb-2">{theme.nameAr.charAt(0)}</span>` before the title.

**`app/favorites/page.tsx`:**
- Header: `Heart` icon `size-6 text-primary fill-primary`, "المفضلة" H1, count badge: `bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs`.
- Empty state: centered with `py-24`. Heart `size-16 text-muted-foreground/20`. Headline "لم تضف أي شيء بعد" H3. Two CTA buttons: primary `rounded-lg bg-primary text-primary-foreground`, secondary `rounded-lg border border-input`.
- Ayah groups: surah name is sticky header: `<div className="sticky top-0 bg-background py-2 z-10 border-b border-border mb-3">` containing the Link.
- Hadith groups: same sticky header pattern for book names.
- Cards: `bg-card rounded-lg p-4`.

**`app/about/page.tsx`:**
- Left-aligned headline "عن المنصة" in Display size.
- Sources section: use a 2-column grid instead of `<ul>`. Each source is a card: `<div className="bg-card rounded-xl p-6">` with icon, title, description.
- Add a closing section with tagline.

Run `bun run lint`. Report errors. DO NOT commit.

---
Update progress at: /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/artifacts/progress/a3e0af46/progress.md

## Acceptance Contract
Acceptance level: checked
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope

Required evidence: changed-files, tests-added, commands-run, residual-risks, no-staged-files

Finish with a fenced JSON block tagged `acceptance-report` in this shape:
Use empty arrays when no items apply; array fields contain strings unless object entries are shown.
`criteriaSatisfied[].status` must be exactly one of: satisfied, not-satisfied, not-applicable.
`commandsRun[].result` must be exactly one of: passed, failed, not-run.
`manualNotes` and `notes` are optional strings; an empty string means no note and does not satisfy `manual-notes` evidence.
```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "specific proof"
    }
  ],
  "changedFiles": [
    "src/file.ts"
  ],
  "testsAddedOrUpdated": [
    "test/file.test.ts"
  ],
  "commandsRun": [
    {
      "command": "command",
      "result": "passed",
      "summary": "short result"
    }
  ],
  "validationOutput": [
    "validation output or concise summary"
  ],
  "residualRisks": [
    "none"
  ],
  "noStagedFiles": true,
  "diffSummary": "short description of the diff",
  "reviewFindings": [
    "blocker: file.ts:12 - issue found, or no blockers"
  ],
  "manualNotes": "anything else the parent should know"
}
```