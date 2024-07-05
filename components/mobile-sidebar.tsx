import { IconMenu2 } from "@tabler/icons-react";
import { Sidebar } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session?: any;
};

export const MobileSidebar = ({ session }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <IconMenu2 size={24} className="text-white" />
      </SheetTrigger>
      <SheetContent className="p-0 z-[100]" side={"left"}>
        <Sidebar session={session} />
      </SheetContent>
    </Sheet>
  );
};
