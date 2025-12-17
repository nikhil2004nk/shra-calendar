export type CalendarItemType =
  | "movie"
  | "event"
  | "function"
  | "movie-anniversary";

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
  date: string; // YYYY-MM-DD for that year
  month: number; // 1-12
  type: CalendarItemType;
  description: string;
  meta?: {
    baseMovieId?: string;
    anniversaryYears?: number;
  };
}

export type Event = CalendarItem;
export type MovieEvent = CalendarItem & { type: "movie" };
export type FunctionEvent = CalendarItem & { type: "function" };
export type MovieAnniversaryEvent = CalendarItem & {
  type: "movie-anniversary";
};
