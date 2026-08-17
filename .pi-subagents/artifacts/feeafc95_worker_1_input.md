# Task for worker

[Read from: /home/ismail/Documents/projects/JS/shkislam/context.md, /home/ismail/Documents/projects/JS/shkislam/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are a senior design director. Design direction #2: ZELLIGE MOSAIC. Produce a complete, original visual design for the project below and write it to design-concepts/02-zellige-mosaic/DESIGN.md, then generate ONE hero image (landscape, showing the chat UI in this style) via the image_gen tool saved as design-concepts/02-zellige-mosaic/hero.png.

PROJECT: 'SHK Islam' - Arabic-first Islamic platform (RTL, lang=ar dir=rtl) for preachers/khatibs/students. Next.js 16 App Router + Tailwind v4 + shadcn/ui + next-themes (light/dark). The AI chat assistant is THE product: answers Islamic questions, cites Quran ayahs and hadiths via tool calls. REDESIGN GOAL: ChatGPT-style chat-first app. `/` = chat page. A collapsible sidebar holds the other pages (Quran browser, Hadith browser, Themes, Favorites, Search, About).

YOUR AESTHETIC SEED: 8-point star geometric tessellation, deep teal and gold, mosaic tile surfaces. Borrow from Moroccan zellige and the 8-pointed star khatam pattern. Structured geometry everywhere: the star pattern appears subtly as background texture, in divider motifs, and as the chat avatar/mark. Deep teal + cobalt + gold on ivory. The chat feels like walking through a tiled courtyard. Geometry is the identity, not decoration.

GROUND RULES (non-negotiable): Zero em-dashes (— or –) in any copy/docs, use hyphen. Exactly ONE accent color (gold counts as the single accent; teal is the base, not a second accent). One corner-radius system (zellige suggests 0 or minimal radius, angular). min-h-[100dvh] never h-screen. RTL first: in dir=rtl the sidebar sits on the RIGHT visually (use the 'start' side). Calm motion: transform/opacity only, prefers-reduced-motion honored, no scroll-hijack. No AI-purple gradients. Tajawal stays as Arabic UI font. Recommend zero new dependencies (the star pattern must be achievable with pure CSS/SVG, no canvas lib).

DESIGN.md must contain, in order: (1) One-line Design Read, (2) 3-4 sentence concept narrative, (3) exact palette (light AND dark) with concrete color values for background, surface, primary accent, secondary, text, borders, (4) typography plan reusing Tajawal, (5) full layout system: chat shell wireframe (ASCII), collapsible sidebar treatment, how the geometric motif integrates without being busy, (6) component inventory: chat input, message bubbles, tool callouts (ayah/hadith citations as tiled callouts), sidebar nav items, empty state, (7) motion spec, (8) corner radius + surface system (angular), (9) 3 signature premium details unique to this direction, (10) anti-slop self-audit checklist confirming every ground rule.

Be opinionated and specific. Concrete values, not vibes. This is a real spec another engineer will implement.

---
Update progress at: /home/ismail/Documents/projects/JS/shkislam/.pi-subagents/artifacts/progress/feeafc95/progress.md

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