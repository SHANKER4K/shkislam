import { headers } from "next/headers";

import HomePage from "@/components/chat";
import { auth } from "@/lib/auth";
import { loadChatModels } from "@/lib/chat-models";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const models = session ? await loadChatModels(session.user.id) : [];
  return (
    <main>
      <HomePage models={models} sessionId={uuid} />
    </main>
  );
}
