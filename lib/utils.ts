import { type ClassValue, clsx } from "clsx";
import { revalidatePath } from "next/cache";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const revalidatePaths = (paths: string[]) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  paths.forEach((path) => {
    revalidatePath(path);
  });
};
