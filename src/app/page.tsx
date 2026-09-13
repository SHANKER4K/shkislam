import HomePage from "@/components/chat";
import { loadChatModels } from "@/lib/chat-models";

export default async function Page() {
  const models = await loadChatModels();
  return (
    <main>
      <HomePage models={models} />
    </main>
  );
}
