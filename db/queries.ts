import { auth } from "@/auth";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { courses, userProgress } from "./schema";

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getUserProgress = cache(async () => {
  const session = await auth();

  if (!session?.user) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, session?.user?.id ?? ""),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  return data;
});
