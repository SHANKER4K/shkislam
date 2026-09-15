// Typed client for the FastAPI `/me/providers` surface, relayed through
// `/api/backend` so the Next server signs the caller's identity. The browser
// never sends a user id and never talks to FastAPI directly — provider API
// keys travel only over this same-origin route.

export type ProviderApiStyle = "openai_compatible" | "anthropic_compatible";

export type CatalogProvider = {
  id: number;
  slug: string;
  name: string;
  apiStyle: ProviderApiStyle;
  defaultBaseUrl: string;
  defaultVariants: string[];
  requiresKey: boolean;
  logoUrl: string | null;
  docsUrl: string | null;
  models: Record<string, { variants?: string[] }>;
};

export type ProviderModel = {
  modelId: string;
  displayName: string | null;
  variants: string[];
  isCustom: boolean;
  enabled: boolean;
  contextWindow: number | null;
  supportsTools: boolean | null;
  supportsVision: boolean | null;
  lastSyncedAt: string | null;
};

export type ProviderConnection = {
  id: string;
  providerId: number | null;
  slug: string | null;
  name: string;
  isCustom: boolean;
  baseUrl: string;
  apiStyle: ProviderApiStyle;
  hasKey: boolean;
  requiresKey: boolean;
  extraHeaders: Record<string, string>;
  lastValidatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  models: ProviderModel[];
};

export type MyProviders = {
  catalog: CatalogProvider[];
  connections: ProviderConnection[];
};

const BASE = "/api/backend/me/providers";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!r.ok) {
    const detail = await r.json().catch(() => null);
    throw new Error(
      (detail as { detail?: string } | null)?.detail ??
        `provider request failed (${r.status})`,
    );
  }
  return (await r.json()) as T;
}

export function listMyProviders(): Promise<MyProviders> {
  return request("");
}

export function connectProvider(input: {
  providerId: number;
  apiKey?: string;
  baseUrl?: string;
  extraHeaders?: Record<string, string>;
}): Promise<ProviderConnection> {
  return request("", {
    method: "POST",
    body: JSON.stringify({
      provider_id: input.providerId,
      api_key: input.apiKey || null,
      base_url: input.baseUrl || null,
      extra_headers: input.extraHeaders ?? null,
    }),
  });
}

export function addCustomProvider(input: {
  name: string;
  baseUrl: string;
  apiStyle: ProviderApiStyle;
  apiKey?: string;
  extraHeaders?: Record<string, string>;
}): Promise<ProviderConnection> {
  return request("/custom", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      base_url: input.baseUrl,
      api_style: input.apiStyle,
      api_key: input.apiKey || null,
      extra_headers: input.extraHeaders ?? null,
    }),
  });
}

export function updateConnection(
  id: string,
  patch: {
    baseUrl?: string;
    apiKey?: string;
    extraHeaders?: Record<string, string>;
    customName?: string;
  },
): Promise<ProviderConnection> {
  const body: Record<string, unknown> = {};
  if (patch.baseUrl !== undefined) body.base_url = patch.baseUrl;
  if (patch.apiKey !== undefined) body.api_key = patch.apiKey;
  if (patch.extraHeaders !== undefined) body.extra_headers = patch.extraHeaders;
  if (patch.customName !== undefined) body.custom_name = patch.customName;
  return request(`/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function deleteConnection(id: string): Promise<void> {
  return request(`/${id}`, { method: "DELETE" });
}

export function syncConnection(id: string): Promise<{
  models: ProviderModel[];
  discovery_supported: boolean;
}> {
  return request(`/${id}/sync`, { method: "POST" });
}

export function addModel(
  id: string,
  modelId: string,
  variants?: string[],
): Promise<ProviderModel> {
  return request(`/${id}/models`, {
    method: "POST",
    body: JSON.stringify({ model_id: modelId, variants: variants ?? null }),
  });
}

export function updateModel(
  id: string,
  modelId: string,
  patch: { enabled?: boolean; variants?: string[] },
): Promise<ProviderModel> {
  return request(`/${id}/models/${encodeURIComponent(modelId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteModel(id: string, modelId: string): Promise<void> {
  return request(`/${id}/models/${encodeURIComponent(modelId)}`, {
    method: "DELETE",
  });
}
