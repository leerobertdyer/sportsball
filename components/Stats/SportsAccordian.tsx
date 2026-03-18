"use client";
import IconWrapper from "@/components/Stats/IconWrapper";
import NewEvents from "@/components/Stats/NewEvents";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { deleteSportsEvent } from "@/lib/supabase/actions";
import { SportsEvent } from "@/lib/types";
import { getViewableDateTime } from "@/lib/utils";
import { useState } from "react";
import { FaMapPin } from "react-icons/fa6";
import { toast } from "sonner";

export default function SportsAccordian({ e }: { e: SportsEvent }) {
  const [showEditForm, setShowEditForm] = useState(false);

  const eventLocation = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.venue.location)}`;

  async function handleDeleteEvent() {
    const promise = deleteSportsEvent(e.id);

    toast.promise(promise, {
      loading: "Deleting event...",
      success: "Event deleted!",
      error: "Could not delete event.",
    });
  }

  function handleEditEvent() {
    setShowEditForm(true)
  }

  if (showEditForm)
    return (
      <div className="absolute inset-0 bg-white flex flex-col justify-center items-center">
        <h1>Edit Event</h1>
        <NewEvents isEditing={true} event={e} callback={() => setShowEditForm(false)}/>
      </div>
    );

  return (
    <Accordion type="multiple" suppressHydrationWarning>
      <AccordionItem value={e.id} className="border-none w-full">
        <AccordionTrigger className="hover:no-underline py-2 px-0 cursor-pointer w-full">
          <Card className="w-full p-4 hover:bg-slate-50 transition-colors">
            <div className="text-sm w-full flex justify-between items-center">
              <div className="font-bold text-left flex-1">{e.name}</div>
              <div className="text-center bg-my-yellow-light px-2 py-0.5 rounded text-xs">
                {e.venue.venueName}
              </div>
              <div className="text-muted-foreground text-right flex-1">
                {getViewableDateTime(e.time_start)}
              </div>
            </div>
          </Card>
        </AccordionTrigger>

        <AccordionContent className="pt-2 pb-4 px-4">
          <div className="bg-slate-100 p-4 rounded-md">
            <p className="text-sm font-semibold">Event Details:</p>
            <div className="text-xs text-gray-600 flex flex-col items-center">
              <p className="w-full max-w-120 text-start mt-2">{e.details}</p>
              <a
                href={eventLocation}
                target="_blank"
                className="flex justify-between items-center gap-2 text-blue-800 mt-4"
              >
                <FaMapPin />
                Location
              </a>
            </div>
          </div>
          <div className="w-full flex justify-center gap-7 text-xs text-black my-2">
            <IconWrapper kind="trash" onClick={handleDeleteEvent} />
            <IconWrapper kind="edit" onClick={handleEditEvent} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
