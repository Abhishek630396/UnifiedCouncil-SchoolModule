import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const OPTIONS_URL = "https://register.unifiedcouncil.com/options";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
