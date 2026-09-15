import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { identityHeaders } from "@/lib/identity";

// Only these backend routers may be reached: an open catch-all would be a new
// unauthenticated proxy to FastAPI.
const ALLOWED = new Set(["keys", "messages", "sessions"]);

async function proxy(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  if (!ALLOWED.has(path[0])) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const identity = identityHeaders(session.user.id);
  if (!base || !identity) {
    return Response.json(
      { message: "backend proxy is not configured" },
      { status: 500 },
    );
  }

  // ponytail: the browser never supplies its own id — `/keys/me` is rewritten
  // to the session user, so the upstream path still reads `/keys/{user_id}`.
  const upstreamPath =
    path[0] === "keys" && path[1] === "me"
      ? ["keys", session.user.id, ...path.slice(2)]
      : path;

  const body = await request.text();
  const { search } = new URL(request.url);

  const upstream = await fetch(
    `${base.replace(/\/$/, "")}/${upstreamPath.join("/")}${search}`,
    {
      method: request.method,
      headers: {
        ...identity,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body || undefined,
      cache: "no-store",
    },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
