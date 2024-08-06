"use client";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { confettiSideCannons } from "@/components/magicui/confetti-side-cannons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useExitModal } from "@/store/use-exit-modal";
import {
  IconCircleCheck,
  IconCircleX,
  IconInfinity,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useAudio, useKey, useMedia } from "react-use";
import { toast } from "sonner";
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
  const router = useRouter();
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.mp3" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.mp3",
  });
  const [lessonId] = useState(initialLessonId);
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.isCompleted,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const currentChallenge = challenges[activeIndex];
  const options = currentChallenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const handleSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.isCorrect);

    if (!correctOption) return;

    if (selectedOption === correctOption.id) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("No hearts left");
              return;
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong, please try again"));
      });
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("No hearts left");
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong, please try again"));
      });
    }
  };

  if (!currentChallenge) {
    return (
      <>
        {finishAudio}
        {confettiSideCannons()}
        <section className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src={"/finish.svg"}
            alt="Finished"
            width={100}
            height={100}
            className="hidden lg:block"
          />
          <Image
            src={"/finish.svg"}
            alt="Finished"
            width={50}
            height={50}
            className="block lg:hidden"
          />
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-700">
            Great job! <br />
            <span className="text-zinc-500">You finished the lesson</span>
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </section>
        <Footer
          lessonId={lessonId}
          disabled={pending || !selectedOption}
          status="completed"
          onCheck={() => {
            router.push("/learn");
          }}
        />
      </>
    );
  }

  const title =
    currentChallenge.type === "ASSIST"
      ? "Select the correct meaning"
      : currentChallenge.question;

  return (
    <>
      {correctAudio}
      {incorrectAudio}
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
            {currentChallenge.type === "ASSIST" && (
              <QuestionBubble question={currentChallenge.question} />
            )}
            <Challenge
              options={options}
              onSelect={handleSelect}
              status={status}
              selectedOption={selectedOption}
              disabled={pending}
              type={currentChallenge.type}
            />
          </div>
        </div>
      </section>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
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

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      )}
    >
      {options.map((option, index) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${index + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};

type CardProps = {
  id: number;
  text: string;
  imageSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  audioSrc: string | null;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

const Card = ({
  id,
  text,
  imageSrc,
  shortcut,
  selected = true,
  onClick,
  status,
  audioSrc,
  disabled,
  type,
}: CardProps) => {
  const [audio, _, controls] = useAudio({ src: audioSrc ?? "" });

  const handleClick = useCallback(() => {
    if (disabled) return;

    controls.play();
    onClick();
  }, [onClick, disabled, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      onKeyDown={() => {}}
      onClick={handleClick}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
        selected &&
          status === "correct" &&
          "border-green-300 bg-green-100 hover:bg-green-100",
        selected &&
          status === "wrong" &&
          "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white",
        type === "ASSIST" && "lg:p-3 w-full",
      )}
    >
      {audio}
      {imageSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image src={imageSrc} alt={text} fill />
        </div>
      )}
      <div
        className={cn(
          "flex items-center",
          type === "ASSIST"
            ? "flex-row-reverse justify-between"
            : "justify-between",
        )}
      >
        <p
          className={cn(
            "text-zinc-600 text-sm lg:text-base",
            selected && "text-sky-500",
            selected && status === "correct" && "text-green-500",
            selected && status === "wrong" && "text-rose-500",
          )}
        >
          {text}
        </p>
        <div
          className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-zinc-400 lg:text-[15px] text-xs font-semibold",
            selected && "text-sky-500 border-sky-300",
            selected &&
              status === "correct" &&
              "border-green-500 text-green-500",
            selected && status === "wrong" && "border-rose-500 text-rose-500",
          )}
        >
          {shortcut}
        </div>
      </div>
    </div>
  );
};

type FooterProps = {
  lessonId?: number;
  disabled?: boolean;
  status: "correct" | "wrong" | "none" | "completed";
  onCheck: () => void;
};

const Footer = ({ disabled, status, onCheck, lessonId }: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);

  const isMobile = useMedia("(max-width: 1024px)");

  const statusButtonText = useMemo(() => {
    const statusText = {
      none: "Check",
      correct: "Next",
      wrong: "Try again",
      completed: "Continue",
    };
    return statusText[status];
  }, [status]);

  return (
    <footer
      className={cn(
        "lg:h-[140px] h-[100px] border-t-2",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100",
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
            <IconCircleCheck className="size-6 mr-4 lg:size-10" />
            Nicely done!
          </div>
        )}
        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <IconCircleX className="size-6 mr-4 lg:size-10" />
            Try again!
          </div>
        )}
        {status === "completed" && (
          <Button
            onClick={() => {
              window.location.href = `/lesson/${lessonId}`;
            }}
            className="uppercase font-bold"
            size={isMobile ? "sm" : "lg"}
            variant={"default"}
          >
            Practice again
          </Button>
        )}
        <Button
          disabled={disabled}
          onClick={onCheck}
          className="ml-auto uppercase font-bold"
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
        >
          {statusButtonText}
        </Button>
      </div>
      Footer
    </footer>
  );
};

type ResultCardProps = {
  variant: "points" | "hearts";
  value: number;
};

const ResultCard = ({ variant, value }: ResultCardProps) => {
  const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";
  return (
    <section
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-500 border-rose-500",
      )}
    >
      <div
        className={cn(
          "text-white rounded-t-xl font-bold text-center uppercase text-sm",
          variant === "hearts" && "bg-rose-500",
          variant === "points" && "bg-orange-400",
        )}
      >
        {variant === "hearts" ? "Hearts Left" : "Total XP"}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variant === "hearts" && "text-rose-500",
          variant === "points" && "text-orange-500",
        )}
      >
        <Image
          src={imageSrc}
          alt={variant}
          width={30}
          height={30}
          className="mr-1.5"
        />
        {value}
      </div>
    </section>
  );
};
