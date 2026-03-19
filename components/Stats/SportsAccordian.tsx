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
      <div className="fixed inset-0 z-10 overflow-y-auto bg-white p-4 sm:p-6 flex flex-col items-center">
        <h1 className="text-lg sm:text-xl font-bold mb-2">Edit Event</h1>
        <NewEvents isEditing={true} event={e} callback={() => setShowEditForm(false)} />
      </div>
    );

  return (
    <Accordion type="multiple" suppressHydrationWarning>
      <AccordionItem value={e.id} className="border-none w-full">
        <AccordionTrigger className="hover:no-underline py-2 px-0 cursor-pointer w-full [&>svg]:shrink-0">
          <Card className="w-full p-3 sm:p-4 hover:bg-slate-50 transition-colors text-left">
            {/* Mobile: stack name, then venue + time. Desktop: single row */}
            <div className="w-full flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:items-center sm:gap-2">
              <div className="font-bold text-[.7rem] sm:text-base min-w-0 flex-1">
                {e.name}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
                <span className="bg-my-yellow-light px-2 py-1 rounded text-xs shrink-0">
                  {e.venue.venueName}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm shrink-0">
                  {getViewableDateTime(e.time_start)}
                </span>
              </div>
            </div>
          </Card>
        </AccordionTrigger>

        <AccordionContent className="pt-2 pb-4 px-2 sm:px-4">
          <div className="bg-slate-100 p-3 sm:p-4 rounded-md">
            <p className="text-sm font-semibold">Event Details</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 break-words">{e.details}</p>
            <a
              href={eventLocation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-800 mt-4 min-h-[44px] min-w-[44px] -ml-2 pl-2 rounded touch-manipulation"
            >
              <FaMapPin className="size-4 shrink-0" />
              <span>Location</span>
            </a>
          </div>
          <div className="w-full flex justify-center gap-6 sm:gap-7 text-xs text-black mt-3 sm:mt-2">
            <IconWrapper kind="trash" onClick={handleDeleteEvent} />
            <IconWrapper kind="edit" onClick={handleEditEvent} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
