## Review — PONYTAIL-AUDIT of shkislam (read-only, no edits)

Verified every finding by grepping imports/usages across `app/ src/ components/ lib/ hooks/` plus config/CSS references. `plan.md` / `progress.md` don't exist in the repo root (nothing to read there). Findings ranked biggest cut first:

### Findings

```
delete src/components/ai-elements/prompt-input.tsx dead export blocks (~280 lines): ActionAddAttachments+ActionAddScreenshot+helpers (L81-99,411-483), Header (1071-1086), ActionMenu* (1169-1210), HoverCard* (1318-1345), Tab* family (1347-1400), Command* family (1402-1463). Only Provider/Input/Body/Textarea/Tools/Button/Footer/Submit/Select* are used by chat.tsx/model-selector. Deleting HoverCard* orphans components/ui/hover-card.tsx (-44 more). [src/components/ai-elements/prompt-input.tsx]
delete message.tsx dead exports (~250 lines): MessageActions, MessageAction, MessageBranch*, MessageToolbar — zero usage outside file. Orphans components/ui/button-group.tsx (-83 more, its only importer). [src/components/ai-elements/message.tsx]
delete whole dead files chain-of-thought.tsx (222) + task.tsx (87) + shimmer.tsx (77) — zero importers. [src/components/ai-elements/]
delete components/ui/accordion.tsx (78) and components/ui/scroll-button.tsx (40) — zero importers.
delete lib/auth/auth-plugin.ts (30 lines) — AuthPlugin/AuthViewProps/SettingsViewProps referenced nowhere outside itself. [lib/auth/auth-plugin.ts]
shrink conversation.tsx (~75 lines): ConversationEmptyState, ConversationDownload, messagesToMarkdown unused; chat.tsx uses only Conversation/Content/ScrollButton. [src/components/ai-elements/conversation.tsx]
delete components/ui/chat-container.tsx (65 lines) — only ChatContainerScrollAnchor is imported (chat.tsx:47), and it's a one-line <div className="h-px …"/>; inline it. Note: this file duplicates ai-elements/conversation.tsx (both wrap StickToBottom) — chat.tsx currently mixes BOTH scroll systems; consolidating on Conversation kills the duplicate entirely. [components/ui/chat-container.tsx]
delete src/lib/sessions.ts (10 lines) — not exported, not imported anywhere; stale fetch stubs to NEXT_PUBLIC_API_URL.
delete embed.ts rankBySimilarity + cosineSimilarity (~35 lines) — only caller of cosineSimilarity is dead rankBySimilarity; embedText stays (used by seed-embeddings).
delete dead named exports: highlightText [src/lib/citation.ts], searchAyahs [src/lib/quran.ts], getAllHadithsForSitemap [src/lib/hadith.ts], searchThemesByName [src/lib/themes.ts], TAFSIR_BOOKS [src/lib/vector-data.ts] (~40 lines total).
stdlib stripDiacritics duplicated: src/db/migrate-tashkeel-sanad.ts:25 hand-rolls what src/lib/citation.ts:4 already exports (~20 dup lines; import instead).
native 9 unused deps (0 imports anywhere incl. CSS/config): @ai-sdk/react, ansi-to-react, embla-carousel-react, media-chrome, react-jsx-parser, @rive-app/react-webgl2, shiki, tokenlens, @xyflow/react. Plus sharp (likely redundant — Next/Vercel provide image optimization; verify local `next start` images before dropping).
```

**Lean areas:** `app/` routes (no orphan routes/pages), `hooks/` (1 hook, used), root `lib/utils.ts` (3 lines), `scripts/generate-assets.sh` (wired to `assets:generate`), `src/db/*` seed/migrate scripts (all wired to package.json scripts or documented one-offs), `assets/` + `public/` (referenced by README/layout/sidebar). `tw-animate-css` and `shadcn` look "unused" in TS but are imported in `app/globals.css` — keep. `docs/`, `design-concepts/`, `notebooks/`, `LLM.txt`, `DESIGN.md` are reference material, not runtime weight.

**net: -~1400 lines, -9..10 deps possible.**

### Residual risks
- Vendored-file trims (`prompt-input.tsx`, `message.tsx`) diverge from upstream ai-elements copies — future re-vendor would resurrect the code.
- `sharp` removal needs a quick local prod-image check before dropping.
- Dead-code deletion touches only unused symbols; none of the audited live paths change behavior.