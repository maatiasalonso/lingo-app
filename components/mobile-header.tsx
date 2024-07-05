import { MobileSidebar } from "./mobile-sidebar";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session?: any;
};

export const MobileHeader = ({ session }: Props) => {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center bg-green-600 border-b fixed top-0 w-full z-50">
      <MobileSidebar session={session} />
    </nav>
  );
};
