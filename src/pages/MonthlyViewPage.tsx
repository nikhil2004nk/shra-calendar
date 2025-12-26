import React, { useMemo, useState } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { EventDetailsModal } from "../components/events/EventDetailsModal";
import type { Event } from "../utils/types";

interface MonthlyViewPageProps {
  year: number;
  monthId: number;
  mode: "calendar-home" | "monthly";
  onBackToSelection?: () => void;
  onBackToLanding: () => void;
  onMonthChange: (newMonthId: number) => void;
}

export const MonthlyViewPage: React.FC<MonthlyViewPageProps> = ({
  year,
  monthId,
  mode,
  onBackToSelection,
  onBackToLanding,
  onMonthChange
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

  const handlePrev = () => {
    const prev = monthId === 1 ? 12 : monthId - 1;
    onMonthChange(prev);
  };

  const handleNext = () => {
    const next = monthId === 12 ? 1 : monthId + 1;
    onMonthChange(next);
  };

  const handleDayClick = (date: string, events: Event[]) => {
    if (!events.length) return;
    setSelectedDate(date);
    setSelectedEvents(events);
  };

  const handleEventClick = (event: Event) => {
    setSelectedDate(event.date);
    setSelectedEvents([event]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6 space-y-4">
      {/* Back buttons row */}
      <div className="flex gap-3">
        {mode === "calendar-home" && onBackToSelection && (
          <button
            onClick={onBackToSelection}
            className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
          >
            ← Back to month selection
          </button>
        )}
        <button
          onClick={onBackToLanding}
          className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
        >
          ← Back to home
        </button>
      </div>

      {/* Month navigation row */}
      <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
        <button
          onClick={handlePrev}
          className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          ◀ Previous Month
        </button>
        
        <button
          onClick={handleNext}
          className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          Next Month ▶
        </button>
      </div>

      <MonthCalendar
        year={year}
        monthMeta={monthMeta}
        eventsByDate={eventsByDate}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
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
