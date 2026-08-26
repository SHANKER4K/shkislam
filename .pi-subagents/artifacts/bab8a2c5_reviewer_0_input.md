# Task for reviewer

[Read from: /home/ismail/Documents/projects/JS/shkislam/plan.md, /home/ismail/Documents/projects/JS/shkislam/progress.md]

READ-ONLY audit of Better Auth BACKEND setup in /home/ismail/Documents/projects/JS/shkislam. Do NOT edit any files.

Context: Next.js 16 App Router project (RTL Arabic), Bun dev runtime, PostgreSQL via Neon serverless + Drizzle ORM, deploys to Vercel. User is adding better-auth v1.7 and wants to know if they're on the right track.

Your scope — the SERVER side only:
1. Read src/lib/auth.ts fully.
2. Read the API route handler under app/api/auth/ (find it, e.g. [...all]/route.ts).
3. Check .env.example (NOT .env values — just which var names are expected) for BETTER_AUTH_SECRET / BETTER_AUTH_URL.
4. Review criteria from the better-auth-best-practices skill at .agents/skills/better-auth-best-practices/SKILL.md and the security skill at .agents/skills/better-auth-security-best-practices/SKILL.md — read both SKILL.md files first.

Check specifically:
- Drizzle adapter configured correctly (db instance passed, provider "pg", model names match schema)
- Secret/baseURL handling (env vars vs hardcoded)
- emailAndPassword config, social providers if any
- trustedOrigins (important: Vercel prod URL vs localhost)
- Rate limiting enabled? secure cookies? CSRF settings sane?
- Session options reasonable (expiresIn, cookieCache)?
- Route handler exports GET/POST correctly and passes to auth.handler
- Any plugins on the server that require re-running CLI generate/migrate
- basePath correctness given next.config.ts / middleware (check if anything could collide with /api/auth)

Output format: verdict per item (OK / ISSUE / MISSING), then a prioritized list of concrete fixes (file + what to change). Keep it tight, no prose essays.

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