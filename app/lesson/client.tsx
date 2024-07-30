"use client";

import { Progress } from "@/components/ui/progress";
import type { challenges } from "@/db/schema";
import { useExitModal } from "@/store/use-exit-modal";
import { IconInfinity, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import type { challengeOptions } from "../../db/schema";

type Props = {
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    isCompleted: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialPercentage: number;
  initialHearts: number;
  userSubscription: any;
};

export const Quiz = ({
  initialLessonId,
  initialLessonChallenges,
  initialPercentage,
  initialHearts,
  userSubscription,
}: Props) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.isCompleted,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const challenge = challenges[activeIndex];
  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <section className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-zinc-700">
              {title}
            </h1>
            {challenge.type === "ASSIST" && (
              <QuestionBubble question={challenge.question} />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

type HeaderProps = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

const Header = ({ hearts, percentage, hasActiveSubscription }: HeaderProps) => {
  const { open } = useExitModal();
  return (
    <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      Header
      <IconX
        onClick={open}
        className="cursor-pointer hover:opacity-75 text-zinc-500 transition"
      />
      <Progress value={percentage} />
      <div className="text-rose-500 flex items-center font-bold">
        <Image
          src="/heart.svg"
          alt="heart"
          width={28}
          height={28}
          className="mr-2"
        />
        {hasActiveSubscription ? (
          <IconInfinity className="h-6 w-6 stroke-[3]" />
        ) : (
          <span className="text-rose-500">{hearts}</span>
        )}
      </div>
    </header>
  );
};

type QuestionBubbleProps = {
  question: string;
};

const QuestionBubble = ({ question }: QuestionBubbleProps) => {
  return (
    <div className="flex items-center gap-x-4 mb-6">
      <Image
        src="/mascot.svg"
        alt="Mascot"
        width={60}
        height={60}
        className="hidden lg:block"
      />
      <Image
        src="/mascot.svg"
        alt="Mascot"
        width={40}
        height={40}
        className="block lg:hidden"
      />
      <div className="text-zinc-500 font-semibold relative py-2 px-4 rounded-xl text-sm lg:text-base border-2">
        {question}
        <div className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90" />
      </div>
    </div>
  );
};
