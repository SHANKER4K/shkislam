import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// ponytail: globalThis singleton avoids pool leak on HMR in dev
const globalForPool = globalThis as unknown as { __pgPool?: Pool };
const pool =
  globalForPool.__pgPool ??
  (globalForPool.__pgPool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }));

export const db = drizzle(pool, { schema });
