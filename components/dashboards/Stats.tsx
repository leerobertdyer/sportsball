"use server";

import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { SportsEvent } from "@/lib/types";

export default async function Stats() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Events").select("*");
  console.log(data, error, typeof data);
  if (!data) return;
  return (
    <Card className="p-4">
        {data.length > 0 &&
          data.map((e: SportsEvent) => {
            return <div key={e.id}>
                {e.activity}
            </div>;
          })}
    </Card>
  );
}
