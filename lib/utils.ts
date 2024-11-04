import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDecimalNumber(num: number | undefined) {
  if (num === undefined) {
    return 0;
  }
  if (num % 1 === 0) {
    return num;
  } else {
    return num.toFixed(2);
  }
}
