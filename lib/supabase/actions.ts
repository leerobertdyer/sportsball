import { createClient } from "@/lib/supabase/server";
import { SportsEvent, SportsVenue } from "@/lib/types";

export async function createSportsEvent(
  eventData: SportsEvent,
  venueData: SportsVenue,
) {
  const supabase = await createClient();

  const { data: newVenue, error: venueError } = await supabase
    .from("venues")
    .insert([
      {
        venue_name: venueData.venueName,
        location: venueData.location,
      },
    ])
    .select()
    .single();

  if (venueError) throw venueError;

  const { data: newEvent, error: eventError } = await supabase
    .from("events")
    .insert([
      {
        name: eventData.name,
        activity: eventData.activity,
        details: eventData.details,
        time_start: eventData.time_start, // Ensure this is ISO string
        time_end: eventData.time_end,
        venue_id: newVenue.id, // The linking piece!
      },
    ])
    .select(
      `
      *,
      venue:venues(*) 
    `,
    )
    .single();

  if (eventError) throw eventError;

  return newEvent;
}

export async function getAllEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select(`
    *,
    venue:venues (
      id,
      venueName: venue_name,
      location
    )
  `);
  console.log(data, error, typeof data);
  return { data, error }
}
