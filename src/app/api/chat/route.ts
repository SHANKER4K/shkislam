import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  // gate the inference relay — proxy matcher can't cover /api/* paths
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // ponytail: relays SSE stream from the inference backend
  const url = process.env.NEXT_PUBLIC_API_URL;
  const backend = await fetch(url + "/chat/web/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return new Response(backend.body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
