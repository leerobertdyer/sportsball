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
  
  revalidatePath('/')
  return newEvent;
}

export async function deleteSportsEvent(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/');
}

export async function getAllEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

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
