import { describe, it, expect, afterEach } from "vitest";
import {
  getViewableDateTime,
  getUsCanadaTimeZones,
  formatEventTime,
  buildTimestampFromPieces,
  generateDateAndTimeDefaults,
  DEFAULT_TIME_ZONE,
} from "./utils";


describe("getViewableDateTime", () => {
  const originalTz = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTz;
  });

  it("formats ISO string to readable lowercase date and time", () => {
    process.env.TZ = "UTC";
    const result = getViewableDateTime("2025-01-15T12:00:00.000Z");
    expect(result).toBe("wed, 15th 2025 at 12pm");
  });

  it("handles midnight", () => {
    process.env.TZ = "UTC";
    const result = getViewableDateTime("2025-06-01T00:00:00.000Z");
    expect(result).toBe("sun, 1st 2025 at 12am");
  });

  it("handles afternoon time", () => {
    process.env.TZ = "UTC";
    const result = getViewableDateTime("2025-03-18T19:30:00.000Z");
    expect(result).toBe("tue, 18th 2025 at 7pm");
  });

  it("returns lowercase with day, ordinal date, year and time", () => {
    const result = getViewableDateTime("2025-01-15T12:00:00.000Z");
    expect(result).toEqual(expect.stringMatching(/^[a-z]{3}, \d{1,2}(st|nd|rd|th) \d{4} at \d{1,2}(am|pm)$/));
    expect(result).toBe(result.toLowerCase());
  });
});

describe("getUsCanadaTimeZones", () => {
  it("returns non-empty array", () => {
    const zones = getUsCanadaTimeZones();
    expect(Array.isArray(zones)).toBe(true);
    expect(zones.length).toBeGreaterThan(0);
  });

  it("includes default America/New_York", () => {
    const zones = getUsCanadaTimeZones();
    expect(zones).toContain("America/New_York");
  });

  it("only includes America/ prefixed zones", () => {
    const zones = getUsCanadaTimeZones();
    zones.forEach((tz) => {
      expect(tz).toMatch(/^America\//);
    });
  });

  it("returns sorted list", () => {
    const zones = getUsCanadaTimeZones();
    const sorted = [...zones].sort();
    expect(zones).toEqual(sorted);
  });
});

describe("formatEventTime", () => {
  it("formats ISO date string in default timezone", () => {
    const result = formatEventTime("2025-01-15T17:00:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    // Medium date + short time in en-US
    expect(result).toMatch(/Jan 15, 2025/);
    expect(result).toMatch(/\d{1,2}:\d{2}\s*[AP]M/);
  });

  it("uses provided timezone", () => {
    const utc = formatEventTime("2025-01-15T17:00:00.000Z", "UTC");
    const eastern = formatEventTime("2025-01-15T17:00:00.000Z", "America/New_York");
    expect(utc).toContain("5:00"); // 17:00 UTC = 5:00 PM in UTC
    expect(eastern).toContain("12:00"); // 17:00 UTC = 12:00 PM Eastern
  });

  it("defaults to DEFAULT_TIME_ZONE when not passed", () => {
    const result = formatEventTime("2025-06-15T18:00:00.000Z");
    expect(result).toBeTruthy();
  });
});

describe("buildTimestampFromPieces", () => {
  it("builds valid ISO string from date, time, and IANA zone", () => {
    const iso = buildTimestampFromPieces("2025-01-15", "12:00", "America/New_York");
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    const date = new Date(iso);
    expect(date.toISOString()).toBe(iso);
  });

  it("interprets time in given zone (Eastern: 12:00 local = 17:00 UTC in winter)", () => {
    const iso = buildTimestampFromPieces("2025-01-15", "12:00", "America/New_York");
    const date = new Date(iso);
    expect(date.getUTCHours()).toBe(17);
    expect(date.getUTCMinutes()).toBe(0);
  });

  it("round-trips with generateDateAndTimeDefaults", () => {
    const dateStr = "2025-03-18";
    const timeStr = "14:30";
    const zone = "America/New_York";
    const iso = buildTimestampFromPieces(dateStr, timeStr, zone);
    const { date, time } = generateDateAndTimeDefaults(iso, zone);
    expect(date).toBe(dateStr);
    expect(time).toBe(timeStr);
  });
});

describe("generateDateAndTimeDefaults", () => {
  it("extracts date and time in given timezone from ISO", () => {
    // 2025-01-15T17:00:00.000Z = 12:00 noon Eastern
    const result = generateDateAndTimeDefaults(
      "2025-01-15T17:00:00.000Z",
      "America/New_York",
    );
    expect(result).toEqual({ date: "2025-01-15", time: "12:00" });
  });

  it("handles midnight in New York", () => {
    // 2025-01-15T05:00:00.000Z = 00:00 (midnight) Jan 15 Eastern
    const result = generateDateAndTimeDefaults(
      "2025-01-15T05:00:00.000Z",
      "America/New_York",
    );
    expect(result.date).toBe("2025-01-15");
    expect(result.time).toBe("00:00");
  });

  it("handles Los Angeles timezone", () => {
    // 2025-01-15T20:00:00.000Z = 12:00 noon Pacific
    const result = generateDateAndTimeDefaults(
      "2025-01-15T20:00:00.000Z",
      "America/Los_Angeles",
    );
    expect(result).toEqual({ date: "2025-01-15", time: "12:00" });
  });
});

describe("DEFAULT_TIME_ZONE", () => {
  it("is America/New_York", () => {
    expect(DEFAULT_TIME_ZONE).toBe("America/New_York");
  });
});
