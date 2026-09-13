import HomePage from "@/components/chat";
import { loadChatModels } from "@/lib/chat-models";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const models = await loadChatModels();
  return (
    <main>
      <HomePage models={models} sessionId={uuid} />
    </main>
  );
}
