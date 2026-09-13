// Fetches the persisted message history of a chat thread from the Python
// backend. Used to hydrate the chat UI when the user lands on /[uuid]
// directly (e.g. shared link, page reload).

const base = process.env.NEXT_PUBLIC_API_URL;

export type HistoryMessage = {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string | null;
  sequence: number;
  created_at: string;
};

export async function fetchHistory(uuid: string): Promise<HistoryMessage[]> {
  const r = await fetch(`${base}/messages/${uuid}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!r.ok) return [];
  return (await r.json()) as HistoryMessage[];
}
