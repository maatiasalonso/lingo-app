import { Button } from "@/components/ui/button";
import type { courses } from "@/db/schema";
import { IconInfinity } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
  const { title, language } = activeCourse;
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href={"/courses"}>
        <Button variant={"ghost"} className="flex gap-x-2 items-center">
          <ReactCountryFlag
            svg
            countryCode={language}
            style={{
              width: "2em",
              height: "2em",
              borderRadius: "33%",
            }}
          />
        </Button>
      </Link>
      <Link href={"/shop"}>
        <Button
          variant={"ghost"}
          className="text-orange-500 flex gap-x-2 items-center"
        >
          <Image src={"/points.svg"} alt="Points" width={28} height={28} />
          {points}
        </Button>
      </Link>
      <Link href={"/shop"}>
        <Button
          variant={"ghost"}
          className="text-rose-500 flex gap-x-2 items-center"
        >
          <Image src={"/heart.svg"} alt="Hearts" width={22} height={22} />
          {hasActiveSubscription ? (
            <IconInfinity className="h-4 w-4 stroke-3" />
          ) : (
            hearts
          )}
        </Button>
      </Link>
    </div>
  );
};
