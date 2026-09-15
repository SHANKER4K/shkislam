import { eq } from "drizzle-orm";

import type { ChatModel } from "@/components/chat";
import { db } from "@/db";
import { providers, providerModels, userProviders } from "@/db/schema";

// The caller's own connections and their enabled models, read straight from
// the DB (the frontend owns this schema and the page is already per-request
// behind `proxy.ts`). No bot secret, no browser → FastAPI call.
//
// `chef` keeps its old meaning: the provider slug the chat request sends as
// `model_provider`. A custom connection has no catalog slug, so its name (or
// id) stands in.
//
// Keyless providers (requires_key = false) are usable *without* a connection:
// the backend resolves them from the catalog when there is no row, exactly
// the old free-provider behaviour. So their catalog models are prepended for
// users who have not added the provider — a new signup can chat with them
// immediately, and connecting later just switches them to per-connection rows.
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

    const fromConnections = connections.flatMap((connection) => {
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

    const keyless = await db.query.providers.findMany({
      where: eq(providers.requiresKey, false),
    });
    const connectedProviderIds = new Set(
      connections.map((c) => c.providerId).filter((id): id is number => id !== null),
    );

    return [
      ...catalogModelsFor(
        keyless as KeylessProvider[],
        connectedProviderIds,
      ),
      ...fromConnections,
    ];
  } catch (error) {
    // Fail soft: a DB hiccup degrades the picker to its empty state instead
    // of crashing the page.
    console.error("loadChatModels failed", error);
    return [];
  }
}

export type CatalogModel = {
  variants?: string[];
  displayName?: string;
};

export type KeylessProvider = {
  id: number;
  slug: string;
  defaultVariants: string[] | null;
  models: unknown;
};

/** Catalog models of keyless providers the user has no connection to. */
export function catalogModelsFor(
  providers: KeylessProvider[],
  connectedProviderIds: ReadonlySet<number>,
): ChatModel[] {
  return providers
    .filter((p) => !connectedProviderIds.has(p.id))
    .flatMap((p) =>
      Object.entries((p.models ?? {}) as Record<string, CatalogModel>).map(
        ([id, cfg]) => ({
          chef: p.slug,
          chefSlug: p.slug,
          id,
          name: cfg.displayName ?? id,
          providers: [p.slug],
          variants: cfg.variants ?? p.defaultVariants ?? ["low"],
        }),
      ),
    );
}