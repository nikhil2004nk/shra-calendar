import rawEvents from "./events/events-2026.json";
import rawFunctions from "./functions/functions-2026.json";
import type { CalendarItem } from "../utils/types";

const withDateParts = (item: any): CalendarItem => {
  const [year, month] = item.date.split("-").map(Number);
  return {
    ...item,
    month,
    // keep full date; year stays inside date string
  } as CalendarItem;
};

export const events: CalendarItem[] = rawEvents.map(withDateParts);
export const functionsData: CalendarItem[] = rawFunctions.map(withDateParts);
