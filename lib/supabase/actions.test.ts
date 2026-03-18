import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSportsEvent,
  updateEvent,
  deleteSportsEvent,
  getAllEvents,
} from "./actions";
import type { NewSportsEvent, NewSportsVenue } from "@/components/Stats/utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

function createMockSupabase(overrides: {
  user?: { id: string } | null;
  venueInsert?: { data: unknown; error: unknown };
  eventInsert?: { data: unknown; error: unknown };
  venueUpdate?: { error: unknown };
  eventUpdate?: { data: unknown; error: unknown };
  eventDelete?: { error: unknown };
  eventsSelect?: { data: unknown; error: unknown };
} = {}) {
  const {
    user = { id: "user-123" },
    venueInsert = { data: { id: "venue-1", venue_name: "V", location: "L" }, error: null },
    eventInsert = { data: { id: "event-1", name: "E", venue: {} }, error: null },
    venueUpdate = { error: null },
    eventUpdate = { data: { id: "event-1", name: "E" }, error: null },
    eventDelete = { error: null },
    eventsSelect = { data: [], error: null },
  } = overrides;

  const chain = {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  const mockInstance: {
    auth: { getUser: ReturnType<typeof vi.fn> };
    from: ReturnType<typeof vi.fn>;
    _chain: typeof chain;
    _eventsChain?: ReturnType<typeof createEventsChain>;
  } = {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from: vi.fn(),
    _chain: chain,
  };

  function createEventsChain() {
    return {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue(eventInsert),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue(eventUpdate),
            }),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue(eventDelete),
      }),
      select: vi.fn().mockImplementation((query?: string) =>
        query ? Promise.resolve(eventsSelect) : chain,
      ),
    };
  }

  mockInstance.from.mockImplementation((table: string) => {
    if (table === "venues") {
      chain.single.mockResolvedValueOnce(venueInsert);
      chain.eq.mockImplementation((key: string) =>
        key === "user_id" ? Promise.resolve(venueUpdate) : chain,
      );
      return chain;
    }
    if (table === "events") {
      const eventsChain = createEventsChain();
      mockInstance._eventsChain = eventsChain;
      return eventsChain;
    }
    return chain;
  });

  return mockInstance;
}

const mockVenue: NewSportsVenue = {
  venueName: "Central Park",
  location: "123 Main St, City",
};

const mockEvent: NewSportsEvent = {
  name: "Pickup Game",
  details: "Friendly match",
  time_start: "2025-06-15T14:00:00.000Z",
  time_end: "2025-06-15T15:30:00.000Z",
  activity: "Soccer",
};

describe("createSportsEvent", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
    vi.mocked(revalidatePath).mockReset();
  });

  it("throws when not authenticated", async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      createSportsEvent({ venue: mockVenue, event: mockEvent }),
    ).rejects.toThrow("Not authenticated");

    expect(mock.from).not.toHaveBeenCalled();
  });

  it("inserts venue then event and returns new event", async () => {
    const newVenue = { id: "v-1", venue_name: "Park", location: "Addr" };
    const newEvent = { id: "e-1", name: "Game", venue: newVenue };
    const mock = createMockSupabase({
      venueInsert: { data: newVenue, error: null },
      eventInsert: { data: newEvent, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const result = await createSportsEvent({ venue: mockVenue, event: mockEvent });

    expect(result).toEqual(newEvent);
    expect(mock.from).toHaveBeenCalledWith("venues");
    expect(mock.from).toHaveBeenCalledWith("events");
    expect(mock._chain.insert).toHaveBeenCalledWith([
      {
        venue_name: mockVenue.venueName,
        location: mockVenue.location,
        user_id: "user-123",
      },
    ]);
    expect(mock._eventsChain!.insert).toHaveBeenCalledWith([
      {
        name: mockEvent.name,
        activity: mockEvent.activity,
        details: mockEvent.details,
        time_start: mockEvent.time_start,
        time_end: mockEvent.time_end,
        venue_id: "v-1",
        user_id: "user-123",
      },
    ]);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws on venue insert error", async () => {
    const venueError = new Error("venue fail");
    const mock = createMockSupabase({
      venueInsert: { data: null, error: venueError },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      createSportsEvent({ venue: mockVenue, event: mockEvent }),
    ).rejects.toThrow(venueError);
  });

  it("throws on event insert error", async () => {
    const eventError = new Error("event fail");
    const mock = createMockSupabase({
      venueInsert: { data: { id: "v-1" }, error: null },
      eventInsert: { data: null, error: eventError },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      createSportsEvent({ venue: mockVenue, event: mockEvent }),
    ).rejects.toThrow(eventError);
  });
});

describe("updateEvent", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
    vi.mocked(revalidatePath).mockReset();
  });

  it("throws when not authenticated", async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      updateEvent({
        eventId: "e-1",
        venueId: "v-1",
        venue: mockVenue,
        event: mockEvent,
      }),
    ).rejects.toThrow("Not authenticated");
  });

  it("updates venue and event and returns updated event", async () => {
    const updated = { id: "e-1", name: "Updated", venue: { id: "v-1" } };
    const mock = createMockSupabase({
      venueUpdate: { error: null },
      eventUpdate: { data: updated, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const result = await updateEvent({
      eventId: "e-1",
      venueId: "v-1",
      venue: mockVenue,
      event: mockEvent,
    });

    expect(result).toEqual(updated);
    expect(mock._chain.update).toHaveBeenCalledWith({
      venue_name: mockVenue.venueName,
      location: mockVenue.location,
    });
    expect(mock._eventsChain!.update).toHaveBeenCalledWith({
      name: mockEvent.name,
      activity: mockEvent.activity,
      details: mockEvent.details,
      time_start: mockEvent.time_start,
      time_end: mockEvent.time_end,
    });
    expect(mock._chain.eq).toHaveBeenCalledWith("id", "v-1");
    expect(mock._chain.eq).toHaveBeenCalledWith("user_id", "user-123");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws on venue update error", async () => {
    const err = new Error("venue update fail");
    const mock = createMockSupabase({ venueUpdate: { error: err } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      updateEvent({
        eventId: "e-1",
        venueId: "v-1",
        venue: mockVenue,
        event: mockEvent,
      }),
    ).rejects.toThrow(err);
  });

  it("throws on event update error", async () => {
    const err = new Error("event update fail");
    const mock = createMockSupabase({
      venueUpdate: { error: null },
      eventUpdate: { data: null, error: err },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(
      updateEvent({
        eventId: "e-1",
        venueId: "v-1",
        venue: mockVenue,
        event: mockEvent,
      }),
    ).rejects.toThrow(err);
  });
});

describe("deleteSportsEvent", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
    vi.mocked(revalidatePath).mockReset();
  });

  it("deletes event and revalidates", async () => {
    const mock = createMockSupabase({ eventDelete: { error: null } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await deleteSportsEvent("event-123");

    expect(mock.from).toHaveBeenCalledWith("events");
    expect(mock._eventsChain!.delete).toHaveBeenCalled();
    expect(mock._eventsChain!.delete().eq).toHaveBeenCalledWith("id", "event-123");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws on delete error", async () => {
    const err = new Error("delete fail");
    const mock = createMockSupabase({ eventDelete: { error: err } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await expect(deleteSportsEvent("event-123")).rejects.toThrow(err);
  });
});

describe("getAllEvents", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
  });

  it("returns empty data and error when no user", async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const result = await getAllEvents();

    expect(result).toEqual({ data: [], error: "No user session found" });
    expect(mock.from).not.toHaveBeenCalled();
  });

  it("returns events from select when user exists", async () => {
    const events = [{ id: "e-1", name: "Game", venue: {} }];
    const mock = createMockSupabase({ eventsSelect: { data: events, error: null } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const result = await getAllEvents();

    expect(result.data).toEqual(events);
    expect(result.error).toBeNull();
    expect(mock.from).toHaveBeenCalledWith("events");
  });

  it("returns error from select when query fails", async () => {
    const dbError = new Error("db fail");
    const mock = createMockSupabase({ eventsSelect: { data: null, error: dbError } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const result = await getAllEvents();

    expect(result.error).toBe(dbError);
  });
});
