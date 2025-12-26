import monthsJson from "./months.json";
import eventTypesJson from "./eventTypes.json";
import { movies } from "./movies";
import { events, functionsData } from "./events";
import type { CalendarItem, EventTypeMeta, MonthMeta } from "../utils/types";
import { getMovieAnniversariesForYear } from "../lib/dateUtils";
import { getAwardsForYear } from "./awards/transformAwards";
import { getPastEventsForYear } from "./pastEvents/transformPastEvents";

// Export types
export type { CalendarItem, EventTypeMeta, MonthMeta } from "../utils/types";

export const months = monthsJson as MonthMeta[];
export const eventTypes = eventTypesJson as unknown as EventTypeMeta[];

// Export all data for the current year
export const allEvents = [...events, ...functionsData, ...getAwardsForYear(new Date().getFullYear())];

// Export function to get events by month
export const getEventsByMonth = (year: number, month: number) => {
  return getCalendarItemsForYear(year).filter(
    (event) => new Date(event.date).getMonth() + 1 === month
  );
};

/**
 * Build all calendar items for a given year:
 * - Static events/functions whose date year === year
 * - Movie anniversaries generated for that year
 * - Past events reminders (film, fashion, cultural, social, award events)
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

  const awardsForYear = getAwardsForYear(year);
  const anniversaries = getMovieAnniversariesForYear(movies, year);
  const pastEventsForYear = getPastEventsForYear(year);

  return [...eventsForYear, ...functionsForYear, ...awardsForYear, ...anniversaries, ...pastEventsForYear];
};
