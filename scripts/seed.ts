import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import bcrypt from "bcryptjs";
import * as schema from "../db/schema";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database...");

    await db.delete(schema.courses);
    await db.delete(schema.users);
    await db.delete(schema.userProgress);

    console.log("Inserting courses...");
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Spanish",
        language: "ES",
      },
      {
        id: 2,
        title: "French",
        language: "FR",
      },
      {
        id: 3,
        title: "German",
        language: "DE",
      },
      {
        id: 4,
        title: "Italian",
        language: "IT",
      },
    ]);

    console.log("Inserting users...");
    await db.insert(schema.users).values([
      {
        id: 1,
        name: "Test user",
        email: "test@test.com",
        password: bcrypt.hashSync("password", 10),
        image: "https://randomuser.me/api/portraits",
      },
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};
main();
