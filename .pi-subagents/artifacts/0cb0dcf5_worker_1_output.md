Done.

Implemented design direction #7, LAPIS CELADON: a complete color-forward spec (lapis-lazuli blue hero surfaces, celadon ceramic secondary, gold as the single accent) plus a landscape SVG hero mockup.

Changed files:
- `design-concepts/07-lapis-celadon/DESIGN.md` — full 10-section spec (design read, concept, light+dark oklch palette for all shadcn tokens, Tajawal typography plan, chat-shell wireframe with RTL sidebar on the right, component inventory, calm motion spec, corner-radius system, 3 signature details, anti-slop audit)
- `design-concepts/07-lapis-celadon/hero.svg` — 1536x1024 mockup: deep lapis dome sidebar, gold crown rule, celadon message tiles, gold-ruled citation panels for the ayah and hadith, gold send jewel
- `.pi-subagents/artifacts/progress/0cb0dcf5/progress.md`

Validation: SVG parsed well-formed; zero em-dashes and zero en-dashes in the spec (verified by grep).

Residual risks:
- `image_gen` not available in my tools, so the hero is an SVG mockup, not a generated PNG. The parent should regenerate the hero via image_gen (matching the fleet's real `hero.png` files) before presenting to the user. Spec carries a TODO flag for this.
- The rtl send-icon arrow `transform="rotate(180 ...)"` in the SVG renders an upward-pointing send arrow; if the intent was a rightward arrow for RTL, adjust at image regen time.

Recommended next step: parent regenerates the hero as a real image, then presents all 10 designs side by side. No staged files.