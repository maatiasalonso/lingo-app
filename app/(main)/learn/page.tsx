import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Button } from "@/components/ui/button";
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";
import type { lessons, units as unitsSchema } from "@/db/schema";
import { IconArrowLeft, IconNotebook } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LessonButton } from "./client";

export default async function LearnPage() {
  const unitsData = getUnits();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const userProgressData = getUserProgress();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
}

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="sticky top-0 bg-white lg:pt-[28px] lg:mt-[-28px] pb-3 flex items-center border-b-2 mb-5 text-zinc-400 lg:z-50">
      <Link href={"/courses"}>
        <Button variant={"ghost"} size={"sm"}>
          <IconArrowLeft className="h-5 w-5 stroke-2 text-zinc-400" />
        </Button>
      </Link>
      <div className="flex-grow flex justify-center">
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </div>
  );
};

type UnitProps = {
  id: number;
  order: number;
  description: string;
  title: string;
  lessons: (typeof lessons.$inferSelect & {
    isCompleted: boolean;
  })[];
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof unitsSchema.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
};

const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: UnitProps) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = activeLesson?.id === lesson.id;
          const isLocked = !lesson.isCompleted && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              locked={isLocked}
              current={isCurrent}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};

type UnitBannerProps = {
  title: string;
  description: string;
};

const UnitBanner = ({ title, description }: UnitBannerProps) => {
  return (
    <section className="w-full rounded-xl bg-green-500 p-5 text-white flex items-center justify-between">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-lg">{description}</p>
      </div>
      <Link href={"/lesson"}>
        <Button
          className="uppercase font-semibold hidden xl:flex border-2 border-b-4 active:border-b-2"
          variant={"ghost"}
          size={"lg"}
        >
          <IconNotebook className="mr-2 h-5 w-5" /> Continue
        </Button>
      </Link>
    </section>
  );
};
