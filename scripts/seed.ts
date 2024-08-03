import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import bcrypt from "bcryptjs";
import * as schema from "../db/schema";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const IDS = {
  SPANISH: 1,
  FRENCH: 2,
  GERMAN: 3,
  ITALIAN: 4,
};

const insertUsers = async () => {
  const users = [
    {
      id: 1,
      name: "Test user",
      email: "test@test.com",
      password: bcrypt.hashSync("password", 10),
      image: "https://randomuser.me/api/portraits",
    },
    {
      id: 2,
      name: "Test user 2",
      email: "mail@mail.com",
      password: bcrypt.hashSync("password", 10),
      image: "https://randomuser.me/api/portraits",
    },
  ];

  await db.insert(schema.users).values(users);
};

const insertCourses = async () => {
  const courses = [
    {
      id: IDS.SPANISH,
      title: "Spanish",
      language: "ES",
    },
    {
      id: IDS.FRENCH,
      title: "French",
      language: "FR",
    },
    {
      id: IDS.GERMAN,
      title: "German",
      language: "DE",
    },
    {
      id: IDS.ITALIAN,
      title: "Italian",
      language: "IT",
    },
  ];

  await db.insert(schema.courses).values(courses);
};

const insertUnits = async () => {
  const units = [
    {
      id: 1,
      courseId: IDS.SPANISH,
      title: "Unit 1",
      description: "Learn the basics of Spanish",
      order: 1,
    },
  ];
  await db.insert(schema.units).values(units);
};

const insertLessons = async () => {
  const lessons = [
    {
      id: 1,
      unitId: 1,
      title: "Nouns",
      order: 1,
    },
    {
      id: 2,
      unitId: 1,
      title: "Verbs",
      order: 2,
    },
    {
      id: 3,
      unitId: 1,
      title: "Adjectives",
      order: 3,
    },
    {
      id: 4,
      unitId: 1,
      title: "Phrases",
      order: 4,
    },
    {
      id: 5,
      unitId: 1,
      title: "Sentences",
      order: 5,
    },
  ];

  await db.insert(schema.lessons).values(lessons);
};

const insertChallenges = async () => {
  const challenges = [
    {
      id: 1,
      lessonId: 1,
      type: "SELECT" as const,
      order: 1,
      question: `Which one of these is "the man"?`,
    },
  ];

  await db.insert(schema.challenges).values(challenges);
};

const insertChallengeOptions = async () => {
  const challengeOptions = [
    {
      id: 1,
      challengeId: 1,
      imageSrc: "/man.png",
      isCorrect: true,
      text: "El hombre",
      audioSrc: "/es_man.mp3",
    },
    {
      id: 2,
      challengeId: 1,
      imageSrc: "/woman.png",
      isCorrect: false,
      text: "La mujer",
      audioSrc: "/es_woman.mp3",
    },
    {
      id: 3,
      challengeId: 1,
      imageSrc: "/robot.png",
      isCorrect: false,
      text: "El robot",
      audioSrc: "/es_robot.mp3",
    },
  ];

  await db.insert(schema.challengeOptions).values(challengeOptions);
};

const deleteExistingData = async () => {
  await db.delete(schema.courses);
  await db.delete(schema.userProgress);
  await db.delete(schema.units);
  await db.delete(schema.lessons);
  await db.delete(schema.challenges);
  await db.delete(schema.challengeProgress);
  await db.delete(schema.challengeOptions);
  await db.delete(schema.users);
};

const main = async () => {
  try {
    console.log("Seeding database...");

    console.log("Deleting existing data...");
    await deleteExistingData();

    console.log("Inserting users...");
    await insertUsers();

    console.log("Inserting courses...");
    await insertCourses();

    console.log("Inserting units...");
    await insertUnits();

    console.log("Inserting lessons...");
    await insertLessons();

    console.log("Inserting challenges...");
    await insertChallenges();

    console.log("Inserting challenge options...");
    await insertChallengeOptions();

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
