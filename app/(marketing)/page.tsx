import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <section className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-4">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src={"hero.svg"} fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <MainDescription session={session} />
      </div>
    </section>
  );
}

type MainDescriptionProps = {
  // biome-ignore lint/suspicious/noExplicitAny: any is used here to avoid circular dependencies
  session: any;
};

const MainDescription = ({ session }: MainDescriptionProps) => {
  return (
    <>
      <h1 className="text-xl lg:text-3xl font-bold text-zinc-500 max-w-[480px] text-center">
        Learn, practice, and master new languages with Lingo
      </h1>
      <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
        {session?.user ? (
          <Button
            className="w-full uppercase font-bold"
            size={"lg"}
            variant={"secondary"}
            asChild
          >
            <Link href={"/learn"}>Continue Learning</Link>
          </Button>
        ) : (
          <>
            <Button
              className="w-full uppercase font-bold"
              size={"lg"}
              variant={"secondary"}
            >
              Get Started
              <IconArrowRight className="ml-2 font-bold" />
            </Button>
            <Button
              className="w-full uppercase font-bold"
              size={"lg"}
              variant={"primaryOutline"}
            >
              I already have an account
            </Button>
          </>
        )}
        <SignIn />
      </div>
    </>
  );
};
