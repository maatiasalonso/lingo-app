import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
// biome-ignore lint/style/noNonNullAssertion: This is a serverless function, so we can safely assume that the environment variable is set
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;
