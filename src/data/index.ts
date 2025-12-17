import monthsJson from "./months.json";
import eventTypesJson from "./eventTypes.json";
import { movies } from "./movies";
import { events, functionsData } from "./events";
import type { CalendarItem, EventTypeMeta, MonthMeta } from "../utils/types";
import { getMovieAnniversariesForYear } from "../lib/dateUtils";

export const months = monthsJson as MonthMeta[];
export const eventTypes = eventTypesJson as EventTypeMeta[];

/**
 * Build all calendar items for a given year:
 * - Static events/functions whose date year === year
 * - Movie anniversaries generated for that year
 */
export const getCalendarItemsForYear = (year: number): CalendarItem[] => {
  const eventsForYear = events.filter((item) => {
    const itemYear = Number(item.date.split("-")[0]);
    return itemYear === year;
  });

  const functionsForYear = functionsData.filter((item) => {
    const itemYear = Number(item.date.split("-")[0]);
    return itemYear === year;
  });

  const anniversaries = getMovieAnniversariesForYear(movies, year);

  return [...eventsForYear, ...functionsForYear, ...anniversaries];
};
