"use server";
import { NewSportsEvent, NewSportsVenue } from "@/components/Stats/utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSportsEvent({
  event,
  venue,
}: {
  venue: NewSportsVenue;
  event: NewSportsEvent;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: newVenue, error: venueError } = await supabase
    .from("venues")
    .insert([
      {
        venue_name: venue.venueName,
        location: venue.location,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (venueError) {
    console.error("venueError:", venueError);
    throw venueError;
  }

  const { data: newEvent, error: eventError } = await supabase
    .from("events")
    .insert([
      {
        name: event.name,
        activity: event.activity,
        details: event.details,
        time_start: new Date(event.time_start).toISOString(),
        time_end: new Date(event.time_end).toISOString(),
        venue_id: newVenue.id,
        user_id: user.id,
      },
    ])
    .select(
      `
      *,
      venue:venues(*) 
    `,
    )
    .single();

  if (eventError) {
    console.error("eventError:", eventError);
    throw eventError;
  }

  revalidatePath("/");
  return newEvent;
}

export async function updateEvent({
  eventId,
  venueId,
  event,
  venue,
}: {
  eventId: string;
  venueId: string;
  venue: NewSportsVenue;
  event: NewSportsEvent;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: venueError } = await supabase
    .from("venues")
    .update({
      venue_name: venue.venueName,
      location: venue.location,
    })
    .eq("id", venueId)
    .eq("user_id", user.id); // Security: ensure user owns this venue

  if (venueError) {
    console.error("venueUpdateError:", venueError);
    throw venueError;
  }

  const { data: updatedEvent, error: eventError } = await supabase
    .from("events")
    .update({
      name: event.name,
      activity: event.activity,
      details: event.details,
      time_start: new Date(event.time_start).toISOString(),
      time_end: new Date(event.time_end).toISOString(),
      // venue_id remains the same, so no need to update it
    })
    .eq("id", eventId)
    .eq("user_id", user.id) // Security: ensure user owns this event
    .select(`*, venue:venues(*)`)
    .single();

  if (eventError) {
    console.error("eventUpdateError:", eventError);
    throw eventError;
  }

  // 3. Refresh the UI
  revalidatePath("/");

  return updatedEvent;
}

export async function deleteSportsEvent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/");
}

export async function getAllEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: [], error: "No user session found" };
  }

  const { data, error } = await supabase.from("events").select(`
    *,
    venue:venues (
      id,
      venueName: venue_name,
      location
    )
  `);
  console.log(data, error, typeof data);
  return { data, error };
}
