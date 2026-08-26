# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

FILE STRUCTURE analysis for /home/ismail/Documents/projects/JS/shkislam — READ-ONLY, produce a restructure proposal. Do NOT edit.

Known situation: dual layout — root has app/, components/, lib/, hooks/ AND src/ has components/, db/, lib/. The better-auth-ui CLI copied views into ROOT components/auth + lib/auth (per components.json aliases: "components": "@/components", "lib": "@/lib") while the original project code lives in src/. tsconfig paths need checking (@/* maps to?). AGENTS.md says app/ is at project ROOT so proxy.ts must be at root (Next 16 requirement).

Deliverables:
1. Precise inventory: which dirs exist at root vs src, file counts + LOC each, and which import aliases each uses (grep @/ vs @src/ vs relative). Map the ACTUAL dependency graph direction (do root components import src/lib? does src import root components?).
2. Constraints: Next 16 file conventions (app location determines proxy.ts/middleware placement), components.json registry aliases (better-auth-ui CLI writes to configured alias paths — moving files means future CLI copies land elsewhere again), tsconfig paths, Vercel build.
3. Propose 2-3 target structures ranked by churn-vs-benefit, e.g.: (a) leave as-is + document convention, (b) consolidate everything under src/ including app/ (moves proxy.ts to src/proxy.ts, updates components.json aliases so future CLI copies land in src/components), (c) full root-level consolidation. For each: exact mv/git-mv steps, every config that must change (tsconfig paths, components.json, drizzle.config, package.json, next.config), import rewrite scope (count of files touched), and risk of breakage.
4. Recommend ONE with justification. Also judge these stray dirs: better-auth-starter/ (5,740-line reference repo inside the project!), design-concepts/, notebooks/, docs/, skills-lock.json.

Be concrete: real counts, real grep evidence. No hand-waving.

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