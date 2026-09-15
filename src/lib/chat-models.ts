import { eq } from "drizzle-orm";

import type { ChatModel } from "@/components/chat";
import { db } from "@/db";
import { userProviders, providerModels } from "@/db/schema";

// The caller's own connections and their enabled models, read straight from
// the DB (the frontend owns this schema and the page is already per-request
// behind `proxy.ts`). No bot secret, no browser → FastAPI call.
//
// `chef` keeps its old meaning: the provider slug the chat request sends as
// `model_provider`. A custom connection has no catalog slug, so its name (or
// id) stands in.
export async function loadChatModels(userId: string): Promise<ChatModel[]> {
  if (!userId) return [];
  try {
    const connections = await db.query.userProviders.findMany({
      where: eq(userProviders.userId, userId),
      with: {
        provider: true,
        models: {
          where: eq(providerModels.enabled, true),
          orderBy: (models, { asc }) => [asc(models.modelId)],
        },
      },
    });

    return connections.flatMap((connection) => {
      const chef =
        connection.provider?.slug ?? connection.customName ?? connection.id;
      return connection.models.map((model) => ({
        chef,
        chefSlug: chef,
        id: model.modelId,
        name: model.displayName ?? model.modelId,
        providers: [chef],
        variants: model.variants,
      }));
    });
  } catch (error) {
    // Fail soft: a DB hiccup degrades the picker to its empty state instead
    // of crashing the page.
    console.error("loadChatModels failed", error);
    return [];
  }
}
