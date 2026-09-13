// Display labels + docs URLs for the chef slugs returned by the
// FastAPI `/provider` endpoint. Storage key in `api_keys.provider`
// is the chef string itself (raw, including punctuation).
export const PROVIDERS = {
  opencode: {
    label: "OpenCode Zen",
    docsUrl: "https://opencode.ai/auth",
    requiresKey: true,
  },
  dahl: {
    label: "Dahl",
    docsUrl: "https://inference.dahl.global/#api-key",
    requiresKey: true,
  },
  "hermes(nousresearch)": {
    label: "Hermes (Nous Research)",
    // TODO: paste real dashboard URL when available
    docsUrl: "https://portal.nousresearch.com",
    requiresKey: true,
  },
  free: {
    label: "Free (محلي)",
    docsUrl: null,
    requiresKey: false,
  },
} as const;

export type Chef = keyof typeof PROVIDERS;

export function providerLabel(chef: string): string {
  return (PROVIDERS as Record<string, { label: string }>)[chef]?.label ?? chef;
}

export function requiresKey(chef: string): boolean {
  return (PROVIDERS as Record<string, { requiresKey?: boolean }>)[chef]
    ?.requiresKey ?? true;
}
