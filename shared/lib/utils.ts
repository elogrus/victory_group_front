import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type AbstractReturn<T> = Promise<T> | T;

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
