Implemented design #8 "OFF-BLACK CHROME" spec and hero mockup. The dispatch referenced context.md/plan.md which don't exist at the given paths; the brief was self-contained so I proceeded. image_gen wasn't available, so the hero is a hand-built SVG mockup.

Changed files:
- `design-concepts/08-off-black-chrome/DESIGN.md` (complete spec: read, narrative, palette, type, layout, components, motion, radius system, signature details, anti-slop audit)
- `design-concepts/08-off-black-chrome/hero.svg` (dark chat-UI mockup)
- `.pi-subagents/artifacts/progress/0cb0dcf5/progress.md`

Validation: spec grounded against actual repo (Tajawal/Uthmanic/Inter fonts, existing `--sidebar-*` oklch tokens, current 0.5rem radius all confirmed present before writing). No source code touched.

Open risks/questions: none blocking.

Recommended next step: parent regenerates hero via image_gen (worker lacked the tool), then user selects among all 10 directions for implementation.