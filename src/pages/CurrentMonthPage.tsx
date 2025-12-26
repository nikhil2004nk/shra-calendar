import React, { useMemo, useState } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import type { Event } from "../utils/types";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { EventDetailsModal } from "../components/events/EventDetailsModal";
import { NoEventsModal } from "../components/events/NoEventsModal";

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
  const [showNoEvents, setShowNoEvents] = useState(false);

  if (!monthMeta) return null;

  const handleDayClick = (date: string, events: Event[]) => {
    if (!events.length) return;
    setSelectedDate(date);
    setSelectedEvents(events);
    setShowNoEvents(false);
  };

  const handleEventClick = (event: Event) => {
    setSelectedDate(event.date);
    setSelectedEvents([event]);
    setShowNoEvents(false);
  };

  const handleTodayClick = (date: string, events: Event[]) => {
    if (events.length > 0) {
      // If there are events, open the modal
      setSelectedDate(date);
      setSelectedEvents(events);
      setShowNoEvents(false);
    } else {
      // If no events, show "no events" message
      setSelectedDate(date);
      setSelectedEvents([]);
      setShowNoEvents(true);
    }
  };



  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
        >
          ← Back to home
        </button>
      </div>

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
        onEventClick={handleEventClick}
        onTodayClick={handleTodayClick}
      />

      

      {selectedDate && selectedEvents.length > 0 && (
        <EventDetailsModal
          date={selectedDate}
          events={selectedEvents}
          onClose={() => {
            setSelectedDate(null);
            setSelectedEvents([]);
            setShowNoEvents(false);
          }}
        />
      )}

      {selectedDate && showNoEvents && (
        <NoEventsModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setShowNoEvents(false);
          }}
        />
      )}
    </main>
  );
};
