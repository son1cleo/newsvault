import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

let cached: DbClient | null = null;

// Lazy on purpose: Next.js evaluates route modules during the build's
// "Collecting page data" step, before deployment env vars are necessarily
// visible. Connecting eagerly at import time turns a missing/late env var
// into a hard build failure for routes that only need the DB at request
// time. Deferring the connection until the first real query keeps the
// build resilient and still fails loudly (with this exact message) the
// moment a request actually needs a database that isn't configured.
function getDb(): DbClient {
  if (cached) return cached;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  cached = drizzle(sql, { schema });
  return cached;
}

export const db = new Proxy({} as DbClient, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    // Drizzle's query builder methods close over internal state via `this`;
    // binding to the real instance keeps that working when accessed through
    // the proxy (e.g. `db.select()`, or a destructured reference to it).
    return typeof value === "function" ? value.bind(real) : value;
  },
});
