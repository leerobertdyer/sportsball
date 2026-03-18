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

export const RestrictedTimeZones = ['America/New_York', 'America/Chicago', 'America/Los_Angeles']
export type RestrictedTz = 'America/New_York' | 'America/Chicago' | 'America/Los_Angeles'

export function formatEventTime(
  dateString: string,
  timeZone: RestrictedTz = "America/New_York",
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timeZone, 
  }).format(date);
}
