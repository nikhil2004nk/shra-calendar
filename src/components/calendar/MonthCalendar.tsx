import React, { useMemo } from "react";
import type { Event, MonthMeta } from "../../utils/types";
import { buildDateKey, cn } from "../../utils";
import { DayCell } from "./DayCell";
import { format } from "date-fns";

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'movie':
      return {
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/40',
        text: 'text-purple-100',
        label: 'Movie'
      };
    case 'function':
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-50',
        label: 'Function'
      };
    case 'movie-anniversary':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-50',
        label: 'Anniversary'
      };
    case 'event':
    default:
      return {
        bg: 'bg-sky-500/15',
        border: 'border-sky-500/40',
        text: 'text-sky-50',
        label: 'Event'
      };
  }
};

interface MonthlySummaryProps {
  eventsByDate: Record<string, Event[]>;
  onEventClick?: (event: Event) => void;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ eventsByDate, onEventClick }) => {
  const currentDate = new Date();
  const allEvents = Object.values(eventsByDate).flat();
  const totalEvents = allEvents.length;

  if (totalEvents === 0) {
    return (
      <div className="mt-6 rounded-lg bg-slate-800/50 p-4 text-center text-slate-400">
        No events scheduled for this month.
      </div>
    );
  }

  // Get month and year from the first event
  const firstEventDate = allEvents[0].date;
  const date = new Date(firstEventDate);
  const monthName = date.toLocaleString('default', { month: 'long' });
  const yearNum = date.getFullYear();

  // Calculate summary statistics
  const summary = useMemo(() => {
    const eventsByType: Record<string, number> = {};
    const eventsByWeekday: Record<string, number> = {};
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => eventsByWeekday[day] = 0);
    
    allEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      const dayOfWeek = new Date(event.date).getDay();
      eventsByWeekday[weekdays[dayOfWeek]]++;
    });

    return {
      totalEvents,
      eventsByType,
      eventsByWeekday,
      weekdays: weekdays.map(day => ({
        day,
        count: eventsByWeekday[day],
        percentage: Math.round((eventsByWeekday[day] / totalEvents) * 100) || 0
      }))
    };
  }, [allEvents, totalEvents]);

  return (
    <div className="space-y-6">
      {/* Previous Summary Section */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="mb-4 text-xl font-semibold text-white">
          {monthName} {yearNum} Overview
          {currentDate.getMonth() === date.getMonth() && currentDate.getFullYear() === yearNum && (
            <span className="ml-2 text-sm font-normal text-slate-400">(Current Month)</span>
          )}
        </h3>
        
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Total Events</span>
            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
              {summary.totalEvents} {summary.totalEvents === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>

        {Object.keys(summary.eventsByType).length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-slate-300">Events by Type</h4>
            <div className="space-y-2">
              {Object.entries(summary.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{type}</span>
                  <span className="text-sm font-medium text-slate-200">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2">
          <h4 className="mb-3 text-sm font-medium text-slate-300">Events by Day</h4>
          <div className="grid grid-cols-7 gap-2 text-center">
            {summary.weekdays.map(({ day, count, percentage }) => {
              const isToday = 
                currentDate.getDate() === parseInt(day, 10) && 
                currentDate.getMonth() + 1 === date.getMonth() + 1 && 
                currentDate.getFullYear() === yearNum;
                
              return (
                <div key={day} className="flex flex-col items-center">
                  <div className="text-xs text-slate-400">{day[0]}</div>
                  <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    {isToday && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full pointer-events-none" />
                    )}
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-300">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

     {/* Event List Section */}
<div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
  <h3 className="mb-6 text-xl font-semibold text-white">
    All events in {monthName} {yearNum} ({totalEvents})
  </h3>
  
  <div className="space-y-4">
    {Object.entries(eventsByDate)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, events]) => (
        <div key={date} className="space-y-3">
          {events.map((event, index) => (
            <div 
              key={`${date}-${index}`} 
              className="rounded-lg bg-slate-800/50 p-5 hover:bg-slate-800/70 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => onEventClick?.(event)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEventClick?.(event);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${event.title}`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {(() => {
                  const config = getTypeConfig(event.type);
                  return (
                    <span 
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.border} ${config.text}`}
                    >
                      {config.label}
                    </span>
                  );
                })()}
                <span className="text-xs text-slate-400">
                  {new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-white">{event.title}</h4>
              
              {event.title2 && (
                <p className="mt-1 text-sm text-slate-300">{event.title2}</p>
              )}
              
              {event.description && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-sm text-slate-300">{event.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
  </div>
</div>
    </div>
  );
};

interface MonthCalendarProps {
  year: number;
  monthMeta: MonthMeta;
  eventsByDate: Record<string, Event[]>;
  onDayClick?: (date: string, events: Event[]) => void;
  onTodayClick?: () => void;
  className?: string;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  monthMeta,
  eventsByDate,
  onDayClick,
  onTodayClick,
  className,
}) => {
  const handleEventClick = (event: Event) => {
    if (onDayClick) {
      onDayClick(event.date, [event]);
    }
  };
  const { days, firstWeekday, id: month } = monthMeta;
  
  // Memoize the weeks calculation
  const weeks = useMemo(() => {
    const leadingEmpty = (firstWeekday + 6) % 7;
    const totalCells = Math.ceil((leadingEmpty + days) / 7) * 7; // Ensure full weeks
    const weeks: (number | null)[][] = [];
    let currentDay = 1;

    for (let i = 0; i < totalCells; i++) {
      const weekIndex = Math.floor(i / 7);
      if (!weeks[weekIndex]) weeks[weekIndex] = [];
      if (i < leadingEmpty || currentDay > days) {
        weeks[weekIndex].push(null);
      } else {
        weeks[weekIndex].push(currentDay++);
      }
    }
    return weeks;
  }, [firstWeekday, days]);

  const monthName = format(new Date(year, month - 1, 1), 'MMMM yyyy');
  const currentDate = new Date();
  const isCurrentMonth = currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;

  return (
    <div className={className}>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <h2 className="text-xl font-bold text-white">
          {monthName}
          {isCurrentMonth && (
            <span className="ml-2 text-sm font-normal text-slate-400">(Current Month)</span>
          )}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onTodayClick}
            disabled={!onTodayClick}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              onTodayClick 
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                : "bg-slate-700/50 text-slate-400 cursor-not-allowed",
              "group relative overflow-hidden"
            )}
            title="Go to today"
          >
            <span className="relative z-10 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-1.5 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <span>Today</span>
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/90 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 sm:py-4">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-800 p-px">
          {weeks.flat().map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-[4rem] bg-slate-900/50 sm:min-h-[6rem]" />;
            }

            const dateKey = buildDateKey(year, month, day);
            const eventsForDay = eventsByDate[dateKey] || [];
            const isToday = 
              day === currentDate.getDate() && 
              month - 1 === currentDate.getMonth() && 
              year === currentDate.getFullYear();

            return (
              <div 
                key={dateKey} 
                className={cn(
                  "group relative min-h-[4rem] bg-slate-900/50 transition-all duration-200 sm:min-h-[7rem] hover:bg-slate-800/50",
                  eventsForDay.length > 0 ? "cursor-pointer hover:bg-slate-800/50" : ""
                )}
                onClick={() => eventsForDay.length > 0 && onDayClick?.(dateKey, eventsForDay)}
              >
                <DayCell
                  day={day}
                  isToday={isToday}
                  isCurrentMonth={true}
                  events={eventsForDay}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Monthly Summary Section */}
      <MonthlySummary 
        eventsByDate={eventsByDate} 
        onEventClick={handleEventClick}
      />
    </div>
  );
};
