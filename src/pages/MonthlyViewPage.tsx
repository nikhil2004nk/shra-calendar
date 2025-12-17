import React, { useMemo, useState } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import type { Event } from "../utils/types";
import { EventList } from "../components/events/EventList";

interface MonthlyViewPageProps {
  year: number;
  monthId: number;
  onBack: () => void;
}

export const MonthlyViewPage: React.FC<MonthlyViewPageProps> = ({
  year,
  monthId,
  onBack
}) => {
  const monthMeta = months.find((m) => m.id === monthId);
  const allItems = useMemo(
    () => getCalendarItemsForYear(year),
    [year]
  );
  const eventsForMonth = useMemo(
    () => allItems.filter((item) => item.month === monthId),
    [allItems, monthId]
  );
  const eventsByDate = useMemo(
    () => groupEventsByDate(eventsForMonth),
    [eventsForMonth]
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  if (!monthMeta) return null;

  const handleDayClick = (date: string, events: Event[]) => {
    setSelectedDate(date);
    setSelectedEvents(events);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <button
        onClick={onBack}
        className="text-xs text-slate-400 hover:text-slate-200 mb-4"
      >
        ← Back to calendar
      </button>
      <h1 className="text-2xl font-semibold mb-2">
        {monthMeta.name} {year}
      </h1>

      <MonthCalendar
        year={year}
        monthMeta={monthMeta}
        eventsByDate={eventsByDate}
        onDayClick={handleDayClick}
      />

      {selectedDate && selectedEvents.length > 0 && (
        <EventList
          events={selectedEvents}
          title={`Events on ${selectedDate}`}
        />
      )}
    </main>
  );
};
