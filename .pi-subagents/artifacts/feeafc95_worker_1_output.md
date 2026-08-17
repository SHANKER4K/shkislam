Design direction #2 (Zellige Mosaic) complete.

**Delivered:**
- `design-concepts/02-zellige-mosaic/DESIGN.md` - full implementation-ready spec: palette (light+dark, oklch), typography reusing Tajawal/Uthmanic, RTL chat-shell wireframe with teal sidebar on the start side, component inventory (star send button, tiled ayah/hadith callouts, angular nav tiles, 3x3 prompt-tile empty state), calm motion spec with reduced-motion collapse, radius-0 angular surface system, 3 signature details (star send button with 45° rotation, star-terminal message seams, prompt-tile empty state), anti-slop audit, and engineer notes including the khatam SVG path.
- `design-concepts/02-zellige-mosaic/hero.svg` - landscape mockup of the chat UI in this style (SVG fallback; the `image_gen` tool is not in my subagent toolset, so the hero is hand-built SVG rather than a generated image).

**Validation:** zero em-dashes (grep = 0), SVG well-formed (xml parse OK), all ground rules audited in spec.