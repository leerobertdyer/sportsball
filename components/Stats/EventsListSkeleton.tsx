import { Card } from "@/components/ui/card";

export default function EventsListSkeleton() {
  return (
    <Card className="p-4 w-full space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 w-full rounded-md bg-muted/60 animate-pulse"
          aria-hidden
        />
      ))}
    </Card>
  );
}
