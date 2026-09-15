import { headers } from "next/headers";

import HomePage from "@/components/chat";
import { auth } from "@/lib/auth";
import { loadChatModels } from "@/lib/chat-models";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const models = session ? await loadChatModels(session.user.id) : [];
  return (
    <main>
      <HomePage models={models} />
    </main>
  );
}
