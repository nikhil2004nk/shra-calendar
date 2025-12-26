import type { CalendarItem, CalendarItemType } from "../../utils/types";
import { buildDateKey } from "../../lib/dateUtils";
import pastEventsData from "./pastEvents.json";

interface PastEventData {
  id: number;
  title: string;
  date: string;
  type: "Film" | "Fashion" | "Cultural" | "Social" | "Awards" | "Event" | "International Event";
  description: string;
  place: string;
}

// Map original types to calendar item types
const typeMapping: Record<string, CalendarItemType> = {
  "Film": "film-event",
  "Fashion": "fashion-event",
  "Cultural": "cultural-event",
  "Social": "social-event",
  "Awards": "award-event",
  "Event": "event",
  "International Event": "international-event"
};

// Helper function to parse date parts
const parseDateParts = (dateStr: string) => {
  if (!dateStr) return { year: 0, month: 0, day: 0 };
  const parts = dateStr.split("-");
  if (parts.length !== 3) return { year: 0, month: 0, day: 0 };
  const [year, month, day] = parts.map(Number);
  return { year, month, day };
};

/**
 * Generate reminders for past events in a target year
 * Similar to how awards and movie anniversaries work
 */
export const getPastEventsForYear = (year: number): CalendarItem[] => {
  const result: CalendarItem[] = [];

  for (const event of pastEventsData as PastEventData[]) {
    const { year: eventYear, month, day } = parseDateParts(event.date);
    if (!eventYear || !month || !day) continue;
    
    // Skip if the event is in the future relative to target year
    if (year < eventYear) continue;
    
    const yearsAgo = year - eventYear;
    const date = buildDateKey(year, month, day);
    const mappedType = typeMapping[event.type] || "event";
    
    result.push({
      id: `past-event-${event.id}-${year}`,
      title: event.title,
      date,
      originalDate: event.date,
      month,
      type: mappedType,
      description: event.description,
      meta: {
        anniversaryYears: yearsAgo > 0 ? yearsAgo : undefined,
        originalDate: event.date,
        place: event.place
      }
    });
  }

  return result;
};
