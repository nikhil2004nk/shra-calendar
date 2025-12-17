import rawEvents from "./events/events-2026.json";
import rawFunctions from "./functions/functions-2026.json";
import type { CalendarItem } from "../utils/types";

const withMonth = (item: any): CalendarItem => {
  const [year, month] = item.date.split("-").map(Number);
  return {
    ...item,
    month
  } as CalendarItem;
};

export const events: CalendarItem[] = rawEvents.map(withMonth);
export const functionsData: CalendarItem[] = rawFunctions.map(withMonth);
