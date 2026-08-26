# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

READ-ONLY audit of the Better Auth DATABASE layer in /home/ismail/Documents/projects/JS/shkislam. Do NOT edit any files.

Context: Next.js project, PostgreSQL (Neon serverless) + Drizzle ORM. Schema lives in src/db/schema.ts (or similar under src/db). Better Auth v1.7 installed. Project conventions in AGENTS.md: search_vector column managed by raw SQL only (never add to Drizzle schema), db pool is globalThis singleton in src/db/index.ts, `bun run db:push` pushes schema.

Your scope:
1. Find the better-auth tables in the Drizzle schema (user, session, account, verification — plus any plugin tables). Likely in src/db/auth-schema.ts or merged into src/db/schema.ts. Report where they live.
2. Compare defined columns/types against what Better Auth v1.7 expects (check node_modules/better-auth dist types or CLI generate conventions: pgCore uuid/text/timestamp).
3. Verify drizzle.config.ts includes whatever file holds the auth tables so `bun run db:push` creates them.
4. Check drizzle/ folder for migration SQL covering auth tables.
5. Confirm src/db/index.ts singleton is used by auth.ts (not a second pool/connection — leak risk on HMR).
6. Flag naming mismatch between model names in src/lib/auth.ts and actual table constants in schema.

Read .agents/skills/drizzle-orm/SKILL.md and .agents/skills/drizzle-postgres/SKILL.md for review criteria first.

Output: verdict per item (OK / ISSUE / MISSING) + prioritized concrete fixes. Tight, no essays.

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