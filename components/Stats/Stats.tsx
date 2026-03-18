"use server";

import NoEventsDisplay from "@/components/Stats/NoEventsDisplay";
import SportsAccordian from "@/components/Stats/SportsAccordian";
import { Card } from "@/components/ui/card";
import { getAllEvents } from "@/lib/supabase/actions";
import { SportsEvent } from "@/lib/types";

export default async function Stats({
  search,
  sport,
}: {
  search?: string;
  sport?: string;
} = {}) {
  const { data, error } = await getAllEvents({ search, sport });
  if (error) {
    return (
      <Card className="p-4 w-full">
        <p className="text-destructive text-sm">Failed to load events. Please try again.</p>
      </Card>
    );
  }
  if (!data) {
    return (
      <Card className="p-4 w-full">
        <p className="text-muted-foreground text-sm">No events to show.</p>
      </Card>
    );
  }
  return (
    <Card className="p-4 w-full">
      {data.length > 0 ? (
        data.map((e: SportsEvent) => <SportsAccordian key={e.id} e={e} />)
      ) : (
        <NoEventsDisplay />
      )}
    </Card>
  );
}
