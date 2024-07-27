"use client";

import { IconCheck, IconCrown, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: LessonButtonProps) => {
  const calculateIndentationLevel = (cycleIndex: number): number => {
    if (cycleIndex <= 2) return cycleIndex;
    if (cycleIndex <= 6) return 4 - cycleIndex;
    return cycleIndex - 8;
  };

  const cycleLength = 8;
  const cycleIndex = index % cycleLength;
  const indentationLevel = calculateIndentationLevel(cycleIndex);

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const Icon = isCompleted ? IconCheck : isLast ? IconCrown : IconStar;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
              Start
              <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1.5" />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "#4ade80" },
                trail: { stroke: "#e5e7eb" },
              }}
            >
              <Button
                variant={locked ? "locked" : "secondary"}
                className="h-[70px] w-[70px] border-b-8 rounded-full"
              >
                <Icon
                  className={cn(
                    "h-10 w-10",
                    locked
                      ? "fill-zinc-400 text-zinc-400 stroke-zinc-400"
                      : "fill-primary-foreground text-primary-foreground",
                    isCompleted && "fill-none stroke-[4]",
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            variant={locked ? "locked" : "secondary"}
            className="h-[70px] w-[70px] border-b-8 rounded-full"
          >
            <Icon
              className={cn(
                "h-10 w-10",
                locked
                  ? "fill-zinc-400 text-zinc-400 stroke-zinc-400"
                  : "fill-primary-foreground text-primary-foreground",
                isCompleted && "fill-none stroke-[4]",
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
