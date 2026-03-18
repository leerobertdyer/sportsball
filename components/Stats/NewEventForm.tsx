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
import { toast } from "sonner";
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


type FormValues = z.infer<typeof eventSchema>;

export default function NewEventForm({
  handleSetEvent,
  event,
  venue
}: {
  handleSetEvent: (v: NewSportsEvent) => void;
  event: NewSportsEvent | null
  venue: NewSportsVenue
}) {
  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name ?? "",
      details: event?.details ?? "",
      time_start: event?.time_start.split('T')[0] ?? "",
      time_end: event?.time_end.split('T')[0] ?? "",
      activity: event?.activity as Activity ?? "Pickleball", 
      venue
    },
  });

  async function handleSubmit(data: FormValues) {
    toast.success("Event added successfully!");
    handleSetEvent(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <p className="text-red-600 text-xs">{JSON.stringify(form.formState.errors, null, 2)}</p>

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
          name="time_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Start</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
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
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
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
