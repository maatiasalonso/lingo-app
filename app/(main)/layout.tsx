import { auth } from "@/auth";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const session = await auth();
  return (
    <>
      <MobileHeader session={session} />
      <Sidebar className="hidden lg:flex" session={session} />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">{children}</div>
      </main>
    </>
  );
}
