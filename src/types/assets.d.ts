// next-env.d.ts is gitignored and only written by `next dev`/`next build`, so a
// clean checkout has no static-asset module declarations and `tsc --noEmit`
// fails on `import Logo from "@/assets/logo.png"`. Pull Next's own declarations
// in explicitly so `bun run typecheck` works without a build first.
/// <reference types="next/image-types/global" />
