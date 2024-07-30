import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./client";

export default async function LessonPage() {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();

  const [lesson, userProgress] = await Promise.all([
    lessonData,
    userProgressData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.isCompleted,
  );
  const totalChallenges = lesson.challenges.length;
  const initialPercentage = completedChallenges.length / totalChallenges;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={null}
    />
  );
}
