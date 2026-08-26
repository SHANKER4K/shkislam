# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

CODE REVIEW (security, correctness, performance) of the recently-added auth surface in /home/ismail/Documents/projects/JS/shkislam. READ-ONLY report — do NOT edit; the parent applies fixes.

Files in scope (the new/changed auth code):
- src/lib/auth.ts, src/lib/auth-client.ts, proxy.ts (project root)
- app/admin/layout.tsx, app/admin/users/page.tsx
- src/components/sidebar-profile.tsx, src/components/providers.tsx
- app/api/auth/[...all]/route.ts
- app/auth/[path]/page.tsx and app/settings/[path]/page.tsx (SSR guards)
- Any app/api routes touching the users/session/account tables (grep for them)
- src/db/schema.ts (auth tables only: users/session/account/verification)

Context: Better Auth 1.7 email/password (no social, no email verification), admin plugin, local Postgres via node-postgres pool singleton, deploys to Vercel later. proxy.ts runs on Edge and does optimistic session checks via betterFetch only.

Check specifically:
1. AuthZ gaps: /admin guard bypass possibilities, settings pages, any API route missing session/role checks, IDOR on user ids
2. Injection: raw SQL usage anywhere near auth tables, string-built queries
3. Secrets: anything hardcoded or logged (tokens, passwords, DATABASE_URL)
4. Cookie/session handling mistakes, open redirect via redirectTo params (are they validated?)
5. Race conditions or error-swallowing in sign-out/profile flows
6. React Query / useSession misuse causing waterfalls or unbounded refetch
7. N+1 or unbounded queries in any listed route

Read .agents/skills/code-review/SKILL.md dimensions. Output per its format: Summary, Critical Issues table (file/line/issue/severity), Suggestions table, What Looks Good, Verdict. Line numbers must be accurate — verify before reporting.

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