import { auth } from "@/auth";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { cache } from "react";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
} from "./schema";

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

export const getUnits = cache(async () => {
  const session = await auth();
  const userProgress = await getUserProgress();

  if (!session?.user?.id || !userProgress?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, session?.user?.id),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (!lesson.challenges.length) {
        return { ...lesson, isCompleted: false };
      }

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress?.length &&
          challenge.challengeProgress.every((progress) => progress.isCompleted)
        );
      });

      return {
        ...lesson,
        isCompleted: allCompletedChallenges,
      };
    });

    return {
      ...unit,
      lessons: lessonsWithCompletedStatus,
    };
  });

  return normalizedData;
});

export const getCourseProgress = cache(async () => {
  const session = await auth();
  const userProgress = await getUserProgress();

  if (!session?.user?.id || !userProgress?.activeCourseId) return null;

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, session?.user?.id),
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      //TODO: check last if statement on crash
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => !progress.isCompleted)
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const session = await auth();

  if (!session?.user?.id) return null;
  const courseProgress = await getCourseProgress();

  const lessonId = id ?? courseProgress?.activeLessonId;

  if (!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      unit: true,
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, session?.user?.id),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const isCompleted = challenge?.challengeProgress?.every(
      (progress) => progress.isCompleted,
    );

    return { ...challenge, isCompleted };
  });

  return {
    ...data,
    challenges: normalizedChallenges,
  };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLesson) return 0;

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.isCompleted,
  );

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});
