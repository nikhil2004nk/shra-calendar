import monthsJson from "./months.json";
import eventTypesJson from "./eventTypes.json";
import { movies } from "./movies";
import { events, functionsData } from "./events";
import type { CalendarItem, EventTypeMeta, MonthMeta } from "../utils/types";
import { getMovieAnniversariesForYear } from "../lib/dateUtils";

export const months = monthsJson as MonthMeta[];
export const eventTypes = eventTypesJson as EventTypeMeta[];

/**
 * Build all calendar items for a given year
 * (static events/functions + movie anniversaries).
 */
export const getCalendarItemsForYear = (year: number): CalendarItem[] => {
  const anniversaries = getMovieAnniversariesForYear(movies, year);
  return [...events, ...functionsData, ...anniversaries];
};
