"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Button
      variant={"ghost"}
      className={`${active && "bg-blue-100 hover:bg-blue-100/80 text-blue-500 hover:text-blue-500 border border-blue-300"} justify-start h-[52px] uppercase font-bold`}
      asChild
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
