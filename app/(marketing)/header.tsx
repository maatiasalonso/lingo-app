import { auth } from "@/auth";
import { AvatarHeader, LoginButton, Logo } from "@/components/header-items";

export const Header = async () => {
  const session = await auth();
  return (
    <header className="h-20 w-full border-b-2 border-zinc-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Logo />
        </div>
        {session?.user ? <AvatarHeader session={session} /> : <LoginButton />}
      </div>
    </header>
  );
};
