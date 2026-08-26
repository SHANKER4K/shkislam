# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

PONYTAIL-AUDIT of /home/ismail/Documents/projects/JS/shkislam — whole-repo over-engineering scan. READ-ONLY, report only.

Scope: app/, src/, components/, lib/, hooks/, scripts/, drizzle.config.ts, next.config.ts, package.json deps vs imports. EXCLUDE node_modules/ and better-auth-starter/ (reference repo, judged separately). This is a Next.js 16 + Drizzle + Better Auth project.

Hunt ONLY complexity/dead weight (NOT bugs/security/perf):
- delete: dead code, unused exports/components/routes, speculative features, files exporting one unused thing
- stdlib: hand-rolled things the standard library ships
- native: dependencies or custom code doing what the platform/Next already does (e.g. custom fetch caching where next/cache exists, custom debounce where one-liner suffices)
- yagni: single-implementation interfaces/factories, config nobody sets, wrappers that only delegate, layers with one caller
- shrink: same logic in fewer lines (only when substantial, >30% reduction)

Method: list exported symbols per dir and grep for usage to find dead exports; compare package.json dependencies against actual import statements; look for duplicated logic between root lib/ and src/lib/; check hooks/ usage; check scripts/ and docs/ and design-concepts/ and notebooks/ for dead weight.

Output format — one line per finding, ranked biggest cut first:
`<tag> <what to cut>. <replacement>. [path]`
End with `net: -<N> lines, -<M> deps possible.` If an area is lean, say so. Verify each finding by grepping usages before reporting — no false positives.

## Acceptance Contract
Acceptance level: attested
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Return concrete findings with file paths and severity when applicable

Required evidence: review-findings, residual-risks

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