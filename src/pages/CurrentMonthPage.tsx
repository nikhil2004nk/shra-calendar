import React, { useMemo, useState } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import type { Event } from "../utils/types";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
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

  const handleEventClick = (event: Event) => {
    setSelectedDate(event.date);
    setSelectedEvents([event]);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // 1-12
    
    // If we're not already on the current month, navigate to it
    if (todayYear !== year || todayMonth !== monthId) {
      // In a real app, you would update the URL or trigger a navigation
      // For now, we'll just log it since this is a simplified example
      console.log(`Navigating to current month: ${todayMonth}/${todayYear}`);
      // In a real implementation, you would update the route or state here
    }
    
    // Close any open modals when going to today
    setSelectedDate(null);
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
          }}
        />
      )}
    </main>
  );
};
