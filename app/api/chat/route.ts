export async function POST(req: Request) {
  const body = await req.json();

  // ponytail: relays SSE stream from the inference backend
  const backend = await fetch("http://localhost:8000/chat/web/", {
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
