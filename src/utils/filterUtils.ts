import type { CalendarItem } from "./types";

export const filterByMonth = (items: CalendarItem[], month: number) =>
  items.filter((item) => item.month === month);

export const filterByQuery = (items: CalendarItem[], query: string) => {
  if (!query.trim()) return items;
  const q = query.toLowerCase();

  return items.filter((item) => {
    const text =
      `${item.title} ${item.type} ${item.description}`.toLowerCase();
    return text.includes(q);
  });
};
