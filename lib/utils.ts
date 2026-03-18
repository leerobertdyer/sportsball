import { SportsEvent } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getViewableDateTime(supabaseTime: string) {
  const date = parseISO(supabaseTime);
  const formattedDate = format(date, "EEE, do yyyy 'at' ha").toLowerCase();
  console.log(formattedDate);
  return formattedDate;
}
