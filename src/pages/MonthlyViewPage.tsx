import React, { useMemo, useState, useEffect } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { EventDetailsModal } from "../components/events/EventDetailsModal";
import { NoEventsModal } from "../components/events/NoEventsModal";
import type { Event } from "../utils/types";

interface MonthlyViewPageProps {
  year: number;
  monthId: number;
  mode: "calendar-home" | "monthly";
  onBackToSelection?: () => void;
  onBackToLanding: () => void;
  onMonthChange: (newMonthId: number) => void;
  initialDate?: string | null; // Date to open modal for when component mounts
  onInitialDateHandled?: () => void; // Callback to clear initialDate after modal opens
}

export const MonthlyViewPage: React.FC<MonthlyViewPageProps> = ({
  year,
  monthId,
  mode,
  onBackToSelection,
  onBackToLanding,
  onMonthChange,
  initialDate,
  onInitialDateHandled
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

  // Auto-open modal for initialDate when component mounts or initialDate changes
  useEffect(() => {
    if (initialDate) {
      // Check if we have events for this date in the current month
      if (eventsByDate[initialDate]) {
        const eventsForDate = eventsByDate[initialDate];
        if (eventsForDate && eventsForDate.length > 0) {
          setSelectedDate(initialDate);
          setSelectedEvents(eventsForDate);
          setShowNoEvents(false);
        } else {
          setSelectedDate(initialDate);
          setSelectedEvents([]);
          setShowNoEvents(true);
        }
      } else {
        // Date might be in a different month, try to get events from all items
        const allEventsForDate = allItems.filter((item) => item.date === initialDate);
        if (allEventsForDate.length > 0) {
          setSelectedDate(initialDate);
          setSelectedEvents(allEventsForDate);
          setShowNoEvents(false);
        } else {
          setSelectedDate(initialDate);
          setSelectedEvents([]);
          setShowNoEvents(true);
        }
      }
      // Notify parent that we've handled the initial date
      if (onInitialDateHandled) {
        onInitialDateHandled();
      }
    }
  }, [initialDate, eventsByDate, allItems, onInitialDateHandled]);

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
    setShowNoEvents(false);
  };

  const handleEventClick = (event: Event) => {
    setSelectedDate(event.date);
    setSelectedEvents([event]);
    setShowNoEvents(false);
  };

  const handleTodayClick = (todayDateKey: string, todayEvents: Event[]) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // 1-12
    
    // If viewing a different year than current year, get events for current year
    const currentYearItems = year !== todayYear 
      ? getCalendarItemsForYear(todayYear)
      : allItems;
    
    // If we're not on the current month, navigate to it first
    if (todayMonth !== monthId) {
      onMonthChange(todayMonth);
      // Get events from current year's items (not calendar year if different)
      const todayEventsFromAll = currentYearItems.filter((item: Event) => item.date === todayDateKey);
      
      if (todayEventsFromAll.length > 0) {
        setSelectedDate(todayDateKey);
        setSelectedEvents(todayEventsFromAll);
        setShowNoEvents(false);
      } else {
        setSelectedDate(todayDateKey);
        setSelectedEvents([]);
        setShowNoEvents(true);
      }
    } else {
      // We're already on the current month
      // If viewing current year, use events from MonthCalendar
      // If viewing different year, get events from current year's data
      if (year === todayYear) {
        if (todayEvents.length > 0) {
          setSelectedDate(todayDateKey);
          setSelectedEvents(todayEvents);
          setShowNoEvents(false);
        } else {
          setSelectedDate(todayDateKey);
          setSelectedEvents([]);
          setShowNoEvents(true);
        }
      } else {
        // Viewing different year, get events from current year
        const todayEventsFromCurrentYear = currentYearItems.filter((item: Event) => item.date === todayDateKey);
        if (todayEventsFromCurrentYear.length > 0) {
          setSelectedDate(todayDateKey);
          setSelectedEvents(todayEventsFromCurrentYear);
          setShowNoEvents(false);
        } else {
          setSelectedDate(todayDateKey);
          setSelectedEvents([]);
          setShowNoEvents(true);
        }
      }
    }
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
