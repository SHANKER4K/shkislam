import type { ChatModel } from "@/components/chat";

type RawProviders = {
  providers: Record<
    string,
    { url: string; models: Record<string, { variants: string[] }> }
  >;
};

// ponytail: backend returns providers keyed by chef; flatten to one entry
// per (chef, model) so the UI can group/filter as it likes.
export async function loadChatModels(): Promise<ChatModel[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const r = await fetch(`${url}/providers`, {
    headers: { "X-Bot-Secret": "shk245" },
    cache: "no-store",
  });
  if (!r.ok) return [];
  const raw = (await r.json()) as RawProviders;
  return Object.entries(raw.providers).flatMap(([provider, p]) =>
    Object.entries(p.models).map(([model, m]) => ({
      chef: provider,
      chefSlug: provider,
      id: model,
      name: model,
      providers: [provider],
      variants: m.variants,
    })),
  );
}
