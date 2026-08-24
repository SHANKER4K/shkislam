# Task for worker

[Read from: /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/chain-runs/174f3e64/context.md, /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/chain-runs/174f3e64/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
**Task 2: Sidebar Restyling**

Modify `src/components/app-sidebar.tsx`. Make these EXACT changes:

1. In the `navItems.map` block, change the `SidebarMenuButton` className:

From:
```tsx
className="text-sm"
```
To:
```tsx
className={cn(
  "text-sm transition-colors duration-150",
  active && "border-r-2 border-sidebar-primary text-sidebar-primary bg-sidebar-accent"
)}
```

2. Restyle the "محادثة جديدة" button. Change it to:

```tsx
<Button
  asChild
  variant="outline"
  className="mt-3 w-full justify-start gap-2 text-sm border-primary/40 text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-150"
>
  <Link href="/">
    <MessageSquare className="size-4 stroke-[1.5]" />
    <span className="truncate">محادثة جديدة</span>
  </Link>
</Button>
```

3. Add `stroke-[1.5]` to ALL icon components in the file:
   - Theme toggle icons (`Sun`, `Moon`)
   - Nav item icons (`<item.icon className="size-4 stroke-[1.5]" />`)
   - Sidebar collapse icon if applicable

4. Make sure `cn` is imported from `@/lib/utils`.

Run `bun run lint`. Report back any errors. DO NOT commit.

---
Update progress at: /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/chain-runs/174f3e64/progress.md

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