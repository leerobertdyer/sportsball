import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { SportsEvent } from "@/lib/types";
import { getViewableDateTime } from "@/lib/utils";
import { Edit, Trash } from "lucide-react";
import { FaMapPin } from "react-icons/fa6";

export default function SportsAccordian({ e }: { e: SportsEvent }) {
  const eventLocation = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.venue.location)}`;

  return (
    <Accordion type="multiple">
      <AccordionItem value={e.id} className="border-none w-full">
        <AccordionTrigger className="hover:no-underline py-2 px-0 cursor-pointer w-full">
          <Card className="w-full p-4 hover:bg-slate-50 transition-colors">
            <div className="text-sm w-full flex justify-between items-center">
              <div className="font-bold text-left">{e.name}</div>
              <div className="text-center bg-my-yellow-light px-2 py-0.5 rounded text-xs">
                {e.venue.venueName}
              </div>
              <div className="text-muted-foreground text-right">
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
          <div className="w-full flex justify-around text-xs text-black">
            <Trash fill="red" className="cursor-pointer" />{" "}
            <Edit fill="gold" className="cursor-pointer" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
