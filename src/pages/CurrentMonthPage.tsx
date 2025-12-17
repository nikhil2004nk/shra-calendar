import React, { useMemo, useState } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import type { Event } from "../utils/types";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { EventList } from "../components/events/EventList";
import { EventDetailsModal } from "../components/events/EventDetailsModal";

interface CurrentMonthPageProps {
  year: number;    // real current year
  monthId: number; // real current month 1–12
  onBack: () => void;
}

export const CurrentMonthPage: React.FC<CurrentMonthPageProps> = ({
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
    if (!events.length) return;
    setSelectedDate(date);
    setSelectedEvents(events);
  };

  const summaryEvents: Event[] = eventsForMonth;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <button
        onClick={onBack}
        className="text-xs text-slate-400 hover:text-slate-200 mb-4"
      >
        ← Back to home
      </button>

      <h1 className="text-2xl font-semibold mb-2">
        Current Month – {monthMeta.name} {year}
      </h1>
      <p className="text-xs text-slate-400 mb-4">
        This view shows the current month calendar and a summary of all events in this month.
      </p>

      <MonthCalendar
        year={year}
        monthMeta={monthMeta}
        eventsByDate={eventsByDate}
        onDayClick={handleDayClick}
      />

      <EventList
        events={summaryEvents}
        title={`All events in ${monthMeta.name} ${year} (${summaryEvents.length})`}
      />

      {selectedDate && selectedEvents.length > 0 && (
        <EventDetailsModal
          date={selectedDate}
          events={selectedEvents}
          onClose={() => {
            setSelectedDate(null);
            setSelectedEvents([]);
          }}
        />
      )}
    </main>
  );
};
