import { SportsEvent, SportsVenue } from "@/lib/types";
import { z } from "zod";

export type NewSportsVenue = Omit<SportsVenue, "id" | "created_at" | "userId">;
export type NewSportsEvent = Omit<SportsEvent, "id" | "created_at" | "venue"| "userId">;

export const venueSchema = z.object({
  venueName: z.string().min(1, "Venue name is required"),
  location: z.string().min(5, "Please enter a full address"),
});

export const activities = ["Soccer", "Tennis", "Basketball", "Pickleball"] as const;
export type Activity = "Soccer" | "Tennis" | "Basketball" | "Pickleball"

export const eventSchema = z.object({
  name: z.string(),
  details: z.string(),
  venue: venueSchema,
  time_end: z.string(),
  time_start: z.string(),
  activity: z.enum(activities),
});
