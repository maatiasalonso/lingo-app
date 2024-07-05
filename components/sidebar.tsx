import { cn } from "@/lib/utils";
import { AvatarHeader, Logo } from "./header-items";
import { SidebarItem } from "./sidebar-item";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session?: any;
  className?: string;
};

export const Sidebar = async ({ session, className }: Props) => {
  const sidebarItems = [
    {
      id: 1,
      label: "Learn",
      href: "/learn",
      iconSrc: "learn.svg",
    },
    {
      id: 2,
      label: "Leaderboard",
      href: "/leaderboard",
      iconSrc: "leaderboard.svg",
    },
    {
      id: 3,
      label: "Quests",
      href: "/quests",
      iconSrc: "quests.svg",
    },
    {
      id: 4,
      label: "Shop",
      href: "/shop",
      iconSrc: "shop.svg",
    },
  ];

  return (
    <div
      className={cn(
        "h-full lg:w-[256px] lg:fixed flex left-0 top-0 px-4 border-r-2 flex-col",
        className,
      )}
    >
      <div className="pt-8 pb-7 flex items-center gap-x-3">
        <Logo />
      </div>
      <div className="flex flex-col gap-y-2 flex-1">
        {sidebarItems.map(({ id, label, href, iconSrc }) => (
          <SidebarItem key={id} label={label} href={href} iconSrc={iconSrc} />
        ))}
      </div>
      <div className="p-4">
        <AvatarHeader
          session={session}
          className="left-0 -translate-y-64 z-[9000]"
        />
      </div>
    </div>
  );
};
