import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { identityHeaders } from "@/lib/identity";

export async function POST(req: Request) {
  // gate the inference relay — proxy matcher can't cover /api/* paths
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  // ponytail: strip any client-sent api_key — FastAPI fetches the key
  // itself via get_decrypted_key(request.state.user_id, model_provider).
  // user_id is stripped too: identity is signed below, never taken from
  // the body.
  const { api_key: _unused, user_id: _alsoUnused, ...forward } = body;
  void _unused;
  void _alsoUnused;

  const identity = identityHeaders(session.user.id);
  if (!identity) {
    return Response.json(
      { message: "USER_SHARED_SECRET is not configured" },
      { status: 500 },
    );
  }

  // ponytail: relays SSE stream from the inference backend
  const url = process.env.NEXT_PUBLIC_API_URL;
  const backend = await fetch(url + "/chat/web", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...identity },
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
