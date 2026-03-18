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
import { NewSportsVenue, venueSchema } from "@/components/Stats/utils";

type FormValues = z.infer<typeof venueSchema>;

export default function NewVenueForm({
  handleSetVenue,
}: {
  handleSetVenue: (v: NewSportsVenue) => void;
}) {
  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(venueSchema),
    defaultValues: { venueName: "", location: "" },
  });

  async function handleSubmit(data: FormValues) {
    toast.success("Venue added successfully!");
    handleSetVenue(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        suppressHydrationWarning
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-80 bg-white p-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mars Stadium" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="123 railroad st, Engadine, MI 12345"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit Venue
        </Button>
      </form>
    </Form>
  );
}
