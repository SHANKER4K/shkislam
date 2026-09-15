// Fetches the persisted message history of a chat thread from the Python
// backend. Used to hydrate the chat UI when the user lands on /[uuid]
// directly (e.g. shared link, page reload).

export type HistoryMessage = {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string | null;
  sequence: number;
  created_at: string;
};

export async function fetchHistory(uuid: string): Promise<HistoryMessage[]> {
  const r = await fetch(`/api/backend/messages/${uuid}`, {
    cache: "no-store",
  });
  if (!r.ok) return [];
  return (await r.json()) as HistoryMessage[];
}
