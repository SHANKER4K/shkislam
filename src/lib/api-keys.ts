// Thin client for the FastAPI key-management endpoints, relayed through
// `/api/backend` so the Next server signs the caller's identity. The browser
// never sends a user id, and the Next.js app NEVER decrypts keys — that
// happens server-side in Python.

export type KeyMeta = {
  id: string;
  user_id: string;
  provider: string;
  created_at: string;
  updated_at: string;
};

export async function listKeyProviders(): Promise<string[]> {
  const r = await fetch("/api/backend/keys/me", { cache: "no-store" });
  if (!r.ok) throw new Error("list keys failed");
  return ((await r.json()) as KeyMeta[]).map((k) => k.provider);
}

export async function hasKey(provider: string): Promise<boolean> {
  const r = await fetch(`/api/backend/keys/me/${provider}/exists`, {
    cache: "no-store",
  });
  if (!r.ok) return false;
  return ((await r.json()) as { has_key: boolean }).has_key;
}

export async function addKey(
  provider: string,
  apiKey: string,
): Promise<KeyMeta> {
  const r = await fetch("/api/backend/keys/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, api_key: apiKey }),
  });
  if (!r.ok) throw new Error("add key failed");
  return r.json();
}

export async function updateKey(
  provider: string,
  apiKey: string,
): Promise<KeyMeta> {
  const r = await fetch("/api/backend/keys/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, api_key: apiKey }),
  });
  if (r.status === 404) throw new Error("NOT_FOUND");
  if (!r.ok) throw new Error("update key failed");
  return r.json();
}
