export type SportsEvent = {
  created_at: string;
  id: string;
  name: string;
  details: string;
  venue: SportsVenue;
  time_end: string;
  time_start: string;
  activity: string;
  userId: string;
};

export type SportsVenue = {
  id: string;
  venueName: string;
  location: string;
  created_at: string;
  userId: string;
};
