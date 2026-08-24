export async function POST(req: Request) {
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
