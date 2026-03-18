import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getViewableDateTime(supabaseTime: string) {
  const date = parseISO(supabaseTime);
  const formattedDate = format(date, "EEE, do yyyy 'at' ha").toLowerCase();
  console.log(formattedDate);
  return formattedDate;
}

/** US and Canada IANA zone names (suffix after "America/") to include in the dropdown */
const US_CANADA_ZONE_SUFFIXES = new Set([
  "New_York",
  "Chicago",
  "Denver",
  "Los_Angeles",
  "Phoenix",
  "Anchorage",
  "Honolulu",
  "St_Johns",
  "Halifax",
  "Toronto",
  "Winnipeg",
  "Regina",
  "Edmonton",
  "Vancouver",
]);

/**
 * IANA time zones for US and Canada, from the runtime's supported list.
 * Used for the event form timezone dropdown.
 */
export function getUsCanadaTimeZones(): string[] {
  const supported = Intl.supportedValuesOf("timeZone");
  const filtered = supported.filter(
    (tz) => tz.startsWith("America/") && US_CANADA_ZONE_SUFFIXES.has(tz.slice("America/".length)),
  );
  return filtered.sort();
}

/** First zone in the US/Canada list; used as default when editing. */
export const DEFAULT_TIME_ZONE = "America/New_York";

/** Cached US/Canada time zones for the dropdown (from runtime). */
export const US_CANADA_TIME_ZONES = getUsCanadaTimeZones();

export function formatEventTime(
  dateString: string,
  timeZone: string = DEFAULT_TIME_ZONE,
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timeZone,
  }).format(date);
}

export function buildTimestampFromPieces(
  dateStr: string,
  timeStr: string,
  ianaZone: string,
): string {
  const localDateTime = `${dateStr}T${timeStr}:00`;
  const utcDate = toDate(localDateTime, { timeZone: ianaZone });
  return utcDate.toISOString();
}


export function generateDateAndTimeDefaults(
  iso: string,
  ianaZone: string,
): { date: string; time: string } {
  const date = formatInTimeZone(iso, ianaZone, "yyyy-MM-dd");
  const time = formatInTimeZone(iso, ianaZone, "HH:mm");
  return { date, time };
}
