import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db/drizzle";
import { users } from "./db/schema";
import { signInSchema } from "./lib/zod";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        // biome-ignore lint/suspicious/noExplicitAny: any is used here to avoid circular dependencies
        const user: any = (await db.query.users.findFirst({
          where: eq(users.email, email),
        })) as User | null | undefined;

        if (!user) {
          throw new Error("User not found.");
        }

        if (!(await bcrypt.compare(password, user.password))) {
          throw new Error("Username/Password does not match.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = (token.id as string).toString();
      return session;
    },
  },
});
