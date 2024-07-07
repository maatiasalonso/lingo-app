"use client";

import { upsertUserProgress } from "@/actions/user-progress";
// biome-ignore lint/style/useImportType: <explanation>
import { courses, userProgress } from "@/db/schema";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "sonner";

type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn/");
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <section className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-full,minmax(210,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          language={course.language}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </section>
  );
};

type CardProps = {
  title: string;
  id: number;
  language: string;
  onClick: (id: number) => void;
  disabled: boolean;
  active?: boolean;
};

const Card = ({
  title,
  id,
  language,
  onClick,
  disabled,
  active,
}: CardProps) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <section
      onClick={() => onClick(id)}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col justify-between p-3 pb-6 items-center min-h-[217px] min-w-[200px]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="min-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
            <IconCheck className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <ReactCountryFlag
        svg
        countryCode={language}
        style={{
          width: "7em",
          height: "7em",
          borderRadius: "20%",
          filter:
            "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
        }}
      />
      <span className="text-zinc-700 text-center font-bold mt-3">{title}</span>
    </section>
  );
};
