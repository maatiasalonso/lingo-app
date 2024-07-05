import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        let user = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        user = {
          name: "John Doe",
          email: "johndow@mail.com",
          password: "password",
          image: "https://www.gravatar.com/avatar/",
        };

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
    }),
  ],
});
