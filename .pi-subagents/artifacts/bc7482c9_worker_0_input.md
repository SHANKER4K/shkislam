# Task for worker

[Read from: /home/ismail/Documents/projects/JS/shkislam/context.md, /home/ismail/Documents/projects/JS/shkislam/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
**Task 4: VerseCard Redesign**

Rewrite `src/components/verse-card.tsx` completely:

1. Replace the import `Image` from `lucide-react` with `Share`.
2. Remove `Card` and `CardContent` imports (use a `<div>` instead).
3. The return statement should be a `<div className="group relative py-5 border-b border-border last:border-b-0">` containing:
   - `<Link>` with the ayah text. The font-quran div keeps its style. The verse number badge becomes: `<span className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-foreground text-xs font-bold tabular-nums mx-2 align-middle">{verseNumber}</span>`
   - An action bar below: `<div className="flex items-center gap-1 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">` containing `<FavoriteButton>`, `<CopyButton>`, `<ExportModal>` (with `<Share className="size-4 stroke-[1.5]" />` inside a rounded-full icon button), and if `tafsirText` exists, a "التفسير الميسر" toggle button.
   - If showTafsir: `<div className="mt-3 rounded-xl bg-card border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">` with the HTML content.
4. Ensure the component still exports the same `VerseCard` function with the same props.

Run `bun run lint`. Report errors. DO NOT commit.

---
Update progress at: /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/artifacts/progress/bc7482c9/progress.md

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