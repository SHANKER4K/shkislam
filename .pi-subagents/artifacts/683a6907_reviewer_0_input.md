# Task for reviewer

You are the FINAL whole-branch code reviewer for a completed feature branch. All 6 tasks passed their individual task-scoped gates; your job is the broad review: does the branch as a whole meet its requirements, and are there any merge-blocking problems the per-task reviews couldn't see (cross-task integration, spec gaps, dead code, regressions)?

## What Was Requested (spec)
Read the design spec: /home/ismail/Documents/projects/JS/shkislam/.worktrees/vector-search-tool/docs/superpowers/specs/2026-02-19-vector-search-tool-design.md
And the plan: /home/ismail/Documents/projects/JS/shkislam/.worktrees/vector-search-tool/docs/superpowers/plans/2026-02-19-vector-search-tool.md (skim for cross-task intent; the task briefs were already verified individually).

Feature summary: Replace the /search page (old unifiedSearch quran+hadith) with a vector-search tool: query input, method tabs (hybrid/sparse/dense), collection combobox (quran/hadith/tafsir/books/sunnah), per-collection filter fields (FILTER_SCHEMA hardcoded; combobox suggestions from hardcoded book lists), top_k (+pool for hybrid), POST /api/search proxy → localhost:8000 FastAPI {method}_search, results showing payload["text"] as body + metadata as badges + score + raw JSON toggle. Old search-results.tsx and GlobalSearchBar deleted.

## Branch Context
Branch: feat/vector-search-tool, 6 commits, merge-base d85bae5 (from update-design).
Diff file (the whole branch, one file): /home/ismail/Documents/projects/JS/shkislam/.worktrees/vector-search-tool/.superpowers/sdd/2026-02-19-vector-search-tool/review-d85bae5..348853b.diff
Read it once. Do not crawl the broader codebase except for named risks.

## Known deferred items to triage (from the task ledger — say for each whether it blocks merge or can ship):
1. (plan-mandated, Task 2) components/ui/popover.tsx imports `@radix-ui/react-popover` — an undeclared dependency (transitive via the `radix-ui` umbrella in package.json). Repo convention is `import { Popover as PopoverPrimitive } from "radix-ui"` (see dialog.tsx, select.tsx, dropdown-menu.tsx, sheet.tsx, tooltip.tsx). It resolves today and the build passes; the risk is a Vercel `npm install` clean install relying on hoisting.
2. (Task 1) buildSearchUrl hardcodes localhost:8000 (plan-mandated; matches chat route precedent app/api/chat/route.ts).
3. (Task 1) buildFiltersPayload Number() can yield NaN on non-numeric int filter input.
4. (Task 3) fractional top_k/pool not rounded; wire format (filters as JSON query param) unverified against live FastAPI — deferred to the user's manual curl.
5. (Task 5) onRetry with empty query re-submits (server 400s, error redisplays); upstream contract: FastAPI returns bare array (route does `results: data`).

## Cross-task integration risks to verify (each a single focused check against the diff or committed files):
- Wire flow end-to-end: form POST body (vector-search.tsx) ↔ route destructure/validation (app/api/search/route.ts) ↔ buildSearchUrl (src/lib/vector-data.ts) ↔ FastAPI contract (query params collection/query_text/top_k/pool, filters JSON). Any mismatch that a task-scoped review couldn't see because both sides moved?
- Route: `filters` non-object → {}; FastAPI 422 (filters dict query param rejected) would surface as 502 — is that acceptable per spec (documented manual check)?
- RTL/UX: Arabic UI text, dir/ms/me conventions consistent across the two new app/search components?
- Dead code check: anything in the branch that is never consumed (exports no task uses)? e.g. COLLECTIONS exported but route re-declares its own — acceptable? DISPLAY_FIELDS keys vs payload reality is unknown (external system) — fine.
- Repo conventions: does the branch follow the established component patterns (data-slot, size-*, logical properties) closely enough to merge, or does it stand out?

## Your verdict
Report: (1) per-deferred-item triage (BLOCKS MERGE | ship), (2) integration findings with file:line (Critical/Important/Minor), (3) overall verdict: READY TO MERGE | NEEDS FIXES.

Treat the implementer reports as unverified claims — verify against the diff. Read-only review: do not mutate the working tree/index/HEAD.

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