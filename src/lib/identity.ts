import { createHmac } from "node:crypto";

// The one place the web identity signature is produced. The formula must stay
// byte-identical to `backend/identity.py:sign()`:
//   hex(hmac_sha256(USER_SHARED_SECRET, `${user_id}:${timestamp}`))
// Never spread client headers into this object — identity is derived
// server-side from the Better Auth session and nothing else.
export function identityHeaders(
  userId: string,
  when: number = Math.floor(Date.now() / 1000),
): Record<string, string> | null {
  const secret = process.env.USER_SHARED_SECRET;
  if (!secret) return null;
  const timestamp = when.toString();
  const signature = createHmac("sha256", secret)
    .update(`${userId}:${timestamp}`)
    .digest("hex");
  return {
    "X-User-Id": userId,
    "X-User-Timestamp": timestamp,
    "X-User-Signature": signature,
  };
}
