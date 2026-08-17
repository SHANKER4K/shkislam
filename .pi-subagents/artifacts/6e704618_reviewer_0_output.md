### Spec Compliance

**Verdict: COMPLIANT.** Matches the brief's template and all global constraints.

- Props interface `VectorResultsProps` is byte-identical to the contract: `collection: Collection; results: VectorHit[] | null; loading: boolean; error: string | null; duration: number | null; onRetry: () => void` (lines 36-43).
- `VectorHit` exported with exact shape `{ score?: number; payload?: Record<string, unknown>; [key: string]: unknown }` (lines 27-32) — matches what Task 5 imports.
- `payload["text"]` rendered as card body with `dir="rtl"` + `font-arabic`, with an empty-text fallback "لا يوجد نص" (lines 112-119).
- Metadata = `DISPLAY_FIELDS[collection]` entries present in payload, rendered as `Badge variant="outline"` as `label: value` (lines 120-128 via `metadataRows` lines 46-51).
- Score in card header, `toFixed(4)` for numeric scores, else `formatValue` fallback (lines 102-107).
- Raw payload JSON in a Collapsible, `<pre dir="ltr">` (lines 129-148).
- All four states: loading skeleton (5-19), error card + retry (21-33), `!results` → null (35), results render (39+), plus a bonus empty-state card (37-44).
- **Named risk verified:** `DISPLAY_FIELDS` and `Collection` both exist and are committed exports in `src/lib/vector-data.ts` (Collection line 4; DISPLAY_FIELDS lines ~237-262); entry shape `{key, label}` matches `metadataRows`'s usage of `f.key`/`f.label`. `DISPLAY_FIELDS[collection]` indexing is type-safe against `Record<Collection, ...>`.

### Strengths
- **Dead-import removal was correct:** the brief template's `import { useState } from "react"` was unused (Collapsible manages its own open state) — removed cleanly; no other `useState` reference exists in the file, so the file is self-consistent (diff is only the new file, no mutations elsewhere).
- **Shadcn imports verified real:** `card`, `badge`, `button`, `skeleton`, `collapsible` all exist in `components/ui/`; lint passing alone wouldn't catch broken module paths, now confirmed safe.
- Four-state handling is complete and adds a sensible empty-state card beyond the literal requirement.
- Follows repo RTL/logical-property conventions (`ms-1`, `gap-1.5`, `size-*`); no over-building, no extra props, helpers (`formatValue`, `metadataRows`) are small and named clearly.

### Issues
#### Critical
- None.
#### Important
- None. Verified: the two consumed exports match Task 1's committed exports exactly, and the `useState` removal is correct.
#### Minor
- `key={i}` on result cards (146) — fine for a static presentational list; could use a stable id if hits ever re-sort in place. Not a blocker.
- Score fallback `formatValue(undefined)` returns `""`, rendering "Score: " with empty value — cosmetic only, and only when a hit lacks a numeric score.

### Assessment
**Task quality:** Approved
**Reasoning:** Spec contract is implemented exactly (props, `VectorHit`, all four states, text/meta/score/JSON layout), the only template divergence (removing dead `useState`) is correct and file-consistent, and the named import risk against Task 1 resolved cleanly. No fixes required.

---
### Acceptance Report

Tasks beyond acceptance contract clause: criterion-1 (concrete findings with severity) satisfied by the refs above. Acceptance level: attested — evidenced by files and commits, not prose.