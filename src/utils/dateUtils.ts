import type { CalendarItem, MonthMeta } from "./types";
import { months } from "../data";

export interface MonthMeta {
  id: number;
  name: string;
  shortName: string;
  days: number;
  firstWeekday: number; // 1-7, 1 = Monday
}

export const getMonthMeta = (monthId: number): MonthMeta | undefined =>
  (months as MonthMeta[]).find((m) => m.id === monthId);

export const groupEventsByDate = (items: CalendarItem[]) =>
  items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

export const buildDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
