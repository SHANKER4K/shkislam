# Task for worker

[Read from: /home/ismail/Documents/projects/JS/shkislam/context.md, /home/ismail/Documents/projects/JS/shkislam/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
**Task 5: HadithCard Redesign**

Rewrite `src/components/hadith-card.tsx`:

1. Replace `Image` import from `lucide-react` with `Share`.
2. Remove `Card` and `CardContent` imports (use `<div>` instead).
3. Replace the grade color system. Instead of `gradeColor` and `gradeDot`, use:

```tsx
const gradeBadge =
  grade === "Sahih"
    ? { bg: "bg-[#EDF3EC]", text: "text-[#4A7C59]", dot: "bg-[#4A7C59]", label: "صحيح" }
    : grade === "Hasan"
      ? { bg: "bg-[#FBF3DB]", text: "text-[#8B6914]", dot: "bg-[#B4882E]", label: "حسن" }
      : { bg: "bg-[#FDEBEC]", text: "text-[#9B2C2C]", dot: "bg-[#C44B4B]", label: "ضعيف" };
```

4. The return should be: `<div className="group relative bg-card rounded-xl p-5 shadow-none">` containing:
   - Top metadata row with book name badge (`bg-muted text-muted-foreground`), hadith number badge (`bg-muted`), and grade badge using `gradeBadge` with a dot span.
   - Text section as before but with `hover:text-primary transition-colors duration-150` on the Link.
   - Narrator row.
   - Action bar: `<div className="flex items-center gap-1 mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">` with FavoriteButton, CopyButton, ExportModal (with Share icon inside rounded-full button), and sharh toggle.
   - Sharh expand: `<div className="mt-3 rounded-xl bg-background border-r-2 border-primary p-5 text-sm leading-relaxed text-muted-foreground">`

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