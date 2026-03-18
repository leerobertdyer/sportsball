"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Activity,
  NewSportsEvent,
  NewSportsVenue,
  activities,
  eventSchema,
} from "@/components/Stats/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildTimestampFromPieces,
  DEFAULT_TIME_ZONE,
  generateDateAndTimeDefaults,
  US_CANADA_TIME_ZONES,
} from "@/lib/utils";

type FormValues = z.infer<typeof eventSchema>;

export default function NewEventForm({
  handleSetEvent,
  event,
  venue,
}: {
  handleSetEvent: (v: NewSportsEvent) => void;
  event: NewSportsEvent | null;
  venue: NewSportsVenue;
}) {
  const defaultZone = DEFAULT_TIME_ZONE;
  const startDefaults = event
    ? generateDateAndTimeDefaults(event.time_start, defaultZone)
    : { date: "", time: "" };
  const endDefaults = event
    ? generateDateAndTimeDefaults(event.time_end, defaultZone)
    : { date: "", time: "" };

  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name ?? "",
      details: event?.details ?? "",
      time_start: startDefaults.time,
      time_end: endDefaults.time,
      event_date: startDefaults.date,
      time_zone: defaultZone,
      activity: (event?.activity as Activity) ?? "Pickleball",
      venue,
    },
  });

  async function handleSubmit(data: FormValues) {
    const startIso = buildTimestampFromPieces(
      data.event_date,
      data.time_start,
      data.time_zone,
    );
    const endIso = buildTimestampFromPieces(
      data.event_date,
      data.time_end,
      data.time_zone,
    );
    await handleSetEvent({ ...data, time_start: startIso, time_end: endIso });
    form.reset();
  }

  return (
    <Form {...form}>
      {form.formState.errors && (
        <p className="text-red-600 text-xs">
          {JSON.stringify(form.formState.errors, null, 2)}
        </p>
      )}

      <form
        suppressHydrationWarning
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-80 bg-white p-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Big Dolphin Troupe At Lincoln High"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Little League - Final game of season!..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Event</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Start</FormLabel>
              <FormControl>
                <Input {...field} type="time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time End</FormLabel>
              <FormControl>
                <Input {...field} type="time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select A Timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {US_CANADA_TIME_ZONES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activities.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit Event
        </Button>
      </form>
    </Form>
  );
}
