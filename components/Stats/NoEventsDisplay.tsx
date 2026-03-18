"use client";

import { CalendarX2 } from "lucide-react";

export default function NoEventsDisplay() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-muted-foreground">
      <CalendarX2 className="size-12 text-muted-foreground/70" aria-hidden />
      <div className="space-y-1 text-center">
        <p className="font-medium text-foreground">No events yet</p>
        <p className="text-sm">Add your first event below to get started.</p>
      </div>
    </div>
  );
}
