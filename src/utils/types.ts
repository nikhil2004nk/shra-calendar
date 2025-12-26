export type CalendarItemType =
  | "movie"
  | "event"
  | "function"
  | "movie-anniversary"
  | "award"
  | "film-event"
  | "fashion-event"
  | "cultural-event"
  | "social-event"
  | "award-event"
  | "international-event";

export interface MonthMeta {
  id: number;
  name: string;
  shortName: string;
  days: number;
  firstWeekday: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface EventTypeMeta {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface BaseMovie {
  id: string;
  title: string;
  date: string; // original release date YYYY-MM-DD
  type: "movie";
  description: string;
  imageUrl?: string;
  director?: string;
  cast?: string[];
  duration?: number;
  isMovie?: boolean;
}

export interface CalendarItem {
  id: string;
  title: string;
  title2?: string;
  date: string; // YYYY-MM-DD for that year
  originalDate?: string; // Original date for anniversary events
  month: number; // 1-12
  type: CalendarItemType;
  description: string;
  meta?: {
    baseMovieId?: string;
    anniversaryYears?: number;
    originalDate?: string; // Keep for backward compatibility
    place?: string;
  };
}

export type Event = CalendarItem;
export type MovieEvent = CalendarItem & { type: "movie" };
export type FunctionEvent = CalendarItem & { type: "function" };
export type MovieAnniversaryEvent = CalendarItem & {
  type: "movie-anniversary";
};
