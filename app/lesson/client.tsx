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

  return (
    <div>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
    </div>
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
