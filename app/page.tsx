import HomePage, { type ChatModel } from "@/src/components/chat";

type RawProviders = {
  providers: Record<
    string,
    { url: string; models: Record<string, { variants: string[] }> }
  >;
};

export default async function Page() {
  const backend_url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(backend_url + "/providers", {
    headers: {
      "X-Bot-Secret": "shk245",
    },
  });
  const raw = (await response.json()) as RawProviders;

  // Flatten providers → models in the shape chat.tsx expects
  const models: ChatModel[] = Object.entries(raw.providers).flatMap(
    ([provider, p]) =>
      Object.entries(p.models).map(([model, m]) => ({
        chef: provider,
        chefSlug: provider,
        id: model,
        name: model,
        providers: [provider],
        variants: m.variants,
      })),
  );

  return (
    <main>
      <HomePage models={models} />
    </main>
  );
}
