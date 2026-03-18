"use server";

import SportsAccordian from "@/components/Stats/SportsAccordian";
import { Card } from "@/components/ui/card";
import { getAllEvents } from "@/lib/supabase/actions";
import { SportsEvent } from "@/lib/types";

export default async function Stats() {
  const { data, error } = await getAllEvents();
  if (!data) {
   console.log("Error getting event data from Supabase: ", error)
    return;
  }
  return (
    <Card className="p-4 w-full">
      {data.length > 0 &&
        data.map((e: SportsEvent) => <SportsAccordian key={e.id} e={e} />)}
    </Card>
  );
}
