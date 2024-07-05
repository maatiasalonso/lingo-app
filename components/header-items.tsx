"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const LoginButton = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/learn");
  };

  return (
    <Button
      size="lg"
      variant="ghost"
      onClick={() => handleLogin()}
      className="uppercase font-bold"
    >
      Login
    </Button>
  );
};

export const Logo = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/")}
      variant={"link"}
      className="hover:no-underline flex items-center gap-x-3 hover:opacity-85 transition"
    >
      <Image src={"mascot.svg"} alt="Mascot Logo" height={40} width={40} />
      <h1 className="text-2xl font-extrabold text-green-600 tracking-wide hover:cursor-pointer">
        Lingo
      </h1>
    </Button>
  );
};

type AvatarProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session: any;
  className?: string;
};

export const AvatarHeader = ({ session, className }: AvatarProps) => {
  const avatarActions = [
    {
      id: 1,
      label: "Profile",
      action: () => console.log("Profile"),
    },
    {
      id: 2,
      label: "Billing",
      action: () => console.log("Billing"),
    },
    {
      id: 3,
      label: "Team",
      action: () => console.log("Team"),
    },
    {
      id: 4,
      label: "Subscription",
      action: () => console.log("Subscription"),
    },
    {
      id: 5,
      label: "Logout",
      className: "text-red-500",
      action: async () => await signOut({ redirect: true, callbackUrl: "/" }),
    },
  ];

  return (
    <div className="flex items-center gap-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:opacity-85">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {session?.user.name
                .split(" ")
                .map((name: string) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("right-0 -mr-5 absolute", className)}
        >
          <DropdownMenuLabel className="font-bold uppercase">
            {session?.user.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {avatarActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={action.action}
              className={`${action?.className} font-bold uppercase hover:cursor-pointer`}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
