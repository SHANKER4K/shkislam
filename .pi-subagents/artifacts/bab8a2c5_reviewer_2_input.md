# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

READ-ONLY audit of the Better Auth UI + CLIENT side in /home/ismail/Documents/projects/JS/shkislam. Do NOT edit any files.

Context: Next.js 16 App Router, shadcn/ui + Tailwind v4, RTL-first (lang="ar", dir="rtl"). Uses @better-auth-ui/react + @better-auth-ui/core v1.7.12 with better-auth v1.7. The user said "for the ui i will use better-auth-ui" — verify wiring matches the library's intended usage.

Docs reference: ./LLM.txt at repo root is the better-auth-ui docs index. The most relevant pages are docs/shadcn.md (quick start) and docs/shadcn/integrations/nextjs.md — fetch them from the live site (use web_fetch; LLM.txt shows relative doc paths, try https://better-auth-ui.com<relative-path> or search for the real host) OR check node_modules/@better-auth-ui packages' README/dist for ground truth. Don't guess APIs — verify against real sources.

Your scope:
1. Read src/lib/auth-client.ts — correct createAuthClient import path for React (better-auth/react), baseURL handling, client plugins matching server plugins?
2. Read components/auth/auth-provider.tsx — does it wrap the app (check src/app/layout.tsx)? Is it used per the Next.js integration guide?
3. Read app/auth/* pages and components/auth/auth.tsx, auth-result.tsx, auth-redirect.tsx — do they use the copied shadcn views from better-auth-ui correctly (viewUrls, redirectTo conventions, basePath /api/auth)?
4. RTL concern: do auth pages respect dir="rtl"/Arabic (hardcoded English strings? physical CSS properties)?
5. Middleware/route protection: any middleware.ts protecting pages? Is auth-redirect used consistently?
6. Version sanity: imports match 1.7.x API (LLM.txt index mentions a 1.6→1.7 migration guide — check code isn't using pre-1.7 import patterns).

Output: verdict per item (OK / ISSUE / MISSING) + prioritized concrete fixes with exact file paths and corrected import/prop patterns verified against the library source. Tight, no essays.

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