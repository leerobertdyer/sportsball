"use client";

import AddEventButton from "@/components/Stats/AddEventButton";
import NewEventForm from "@/components/Stats/NewEventForm";
import NewVenueForm from "@/components/Stats/NewVenueForm";
import { NewSportsEvent, NewSportsVenue } from "@/components/Stats/utils";
import { createSportsEvent, getAllEvents } from "@/lib/supabase/actions";
import { useState } from "react";
import { toast } from "sonner";

export default function NewEvents() {
  const [newVenue, setNewVenue] = useState<NewSportsVenue | null>(null);
  const [formToShow, setFormToShow] = useState<"venue" | "event" | "none">(
    "none",
  );

  function handleAddEvent() {
    setFormToShow("venue");
  }

  function handleSetVenue(v: NewSportsVenue) {
    setNewVenue(v);
    setFormToShow("event");
  }

  async function handleSetEvent(e: NewSportsEvent) {
    if (!e || !newVenue) return;
    createSportsEvent({ event: e, venue: newVenue });
    setFormToShow("none");
    toast("Event Added!");
    await getAllEvents();
  }

  if (formToShow === "venue")
    return <NewVenueForm handleSetVenue={handleSetVenue} />;
  if (formToShow === "event" && newVenue)
    return <NewEventForm handleSetEvent={handleSetEvent} venue={newVenue} />;
  return <AddEventButton handleAddEvent={handleAddEvent} />;
}
