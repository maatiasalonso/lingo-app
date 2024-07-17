import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Button } from "@/components/ui/button";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
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
