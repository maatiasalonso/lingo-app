"use client";
import { signIn } from "next-auth/react";
import { ZodError, z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function SignIn() {
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      signInSchema.parse(data);
      await signIn("credentials", data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Sign in error:", error);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-[330px]"
      onSubmit={handleSignIn}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}
