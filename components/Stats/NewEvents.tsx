"use client";

import AddEventButton from "@/components/Stats/AddEventButton";
import NewEventForm from "@/components/Stats/NewEventForm";
import NewVenueForm from "@/components/Stats/NewVenueForm";
import { NewSportsEvent, NewSportsVenue } from "@/components/Stats/utils";
import {
  createSportsEvent,
  getAllEvents,
  updateEvent,
} from "@/lib/supabase/actions";
import { SportsEvent, SportsVenue } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

type INewEvents = {
  isEditing: boolean;
  event: SportsEvent | null;
  callback?: () => void;
};
export default function NewEvents({
  isEditing = false,
  event = null,
  callback,
}: INewEvents) {
  const [newVenue, setNewVenue] = useState<NewSportsVenue | null>(
    event?.venue ?? null,
  );
  const [formToShow, setFormToShow] = useState<"venue" | "event" | "none">(
    isEditing ? "venue" : "none",
  );

  function handleAddEvent() {
    setFormToShow("venue");
  }

  function handleSetVenue(v: NewSportsVenue) {
    if (isEditing && event?.venue.id) {
      setNewVenue({
        ...v,
        id: event.venue.id,
      } as SportsVenue);
    } else {
      setNewVenue(v);
    }
    setFormToShow("event");
  }

  async function handleSetEvent(e: NewSportsEvent) {
    if (!e || !newVenue) return;
    if (isEditing) {
      const venuewWithId = newVenue as SportsVenue;
      updateEvent({
        eventId: event!.id,
        venueId: venuewWithId.id,
        event: e,
        venue: newVenue,
      });
    } else {
      createSportsEvent({ event: e, venue: newVenue });
    }
    setFormToShow("none");
    toast("Event Added!");
    if (callback) callback();
    await getAllEvents();
  }

  if (formToShow === "venue")
    return (
      <NewVenueForm
        handleSetVenue={handleSetVenue}
        venue={newVenue ?? undefined}
      />
    );
  if (formToShow === "event" && newVenue)
    return (
      <NewEventForm
        handleSetEvent={handleSetEvent}
        venue={newVenue ?? undefined}
        event={event}
      />
    );
  return <AddEventButton handleAddEvent={handleAddEvent} />;
}
