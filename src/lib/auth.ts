import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { users, session, account, verification } from "../db/schema";

export const auth = betterAuth({
  user: {
    fields: { name: "displayName" }, // BA requires `name`; reuse existing column
    additionalFields: {
      telegramId: { type: "string", required: false },
      username: { type: "string", required: false },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
    nextCookies(),
  ],
  advanced: {
    database: {
      // ponytail: users.id is uuid, account/session.id are bare text —
      // emit uuids so one generator satisfies both column types
      generateId: () => crypto.randomUUID(),
    },
  },
});
