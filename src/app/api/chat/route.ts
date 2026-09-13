import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  // gate the inference relay — proxy matcher can't cover /api/* paths
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  // ponytail: strip any client-sent api_key — FastAPI fetches the key
  // itself via get_decrypted_key(user_id, model_provider). We forward
  // user_id + session_id; the key never crosses this boundary.
  const { api_key: _unused, ...forward } = body;
  void _unused;

  // ponytail: relays SSE stream from the inference backend
  const url = process.env.NEXT_PUBLIC_API_URL;
  const backend = await fetch(url + "/chat/web/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(forward),
  });

  return new Response(backend.body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
