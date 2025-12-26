import React, { useMemo, useState } from "react";
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
    case 'film-event':
      return {
        bg: 'bg-red-500/15',
        border: 'border-red-500/40',
        text: 'text-red-100',
        label: 'Film'
      };
    case 'fashion-event':
      return {
        bg: 'bg-pink-500/15',
        border: 'border-pink-500/40',
        text: 'text-pink-100',
        label: 'Fashion'
      };
    case 'cultural-event':
      return {
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/40',
        text: 'text-indigo-100',
        label: 'Cultural'
      };
    case 'social-event':
      return {
        bg: 'bg-teal-500/15',
        border: 'border-teal-500/40',
        text: 'text-teal-100',
        label: 'Social'
      };
    case 'award-event':
      return {
        bg: 'bg-yellow-500/15',
        border: 'border-yellow-500/40',
        text: 'text-yellow-100',
        label: 'Award'
      };
    case 'international-event':
      return {
        bg: 'bg-violet-500/15',
        border: 'border-violet-500/40',
        text: 'text-violet-100',
        label: 'International'
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
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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

  // Get unique event types (merge event and international-event)
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    allEvents.forEach(event => {
      // Merge international-event into event for display
      const displayType = event.type === 'international-event' ? 'event' : event.type;
      types.add(displayType);
    });
    return Array.from(types).sort();
  }, [allEvents]);

  // Filter events by selected type
  const filteredEventsByDate = useMemo(() => {
    if (!selectedFilter) return eventsByDate;
    
    const filtered: Record<string, Event[]> = {};
    Object.entries(eventsByDate).forEach(([date, events]) => {
      // When filtering by "event", include both "event" and "international-event"
      const filteredEvents = events.filter(event => {
        if (selectedFilter === 'event') {
          // Include both regular events and international events
          return event.type === 'event' || event.type === 'international-event';
        }
        return event.type === selectedFilter;
      });
      if (filteredEvents.length > 0) {
        filtered[date] = filteredEvents;
      }
    });
    return filtered;
  }, [eventsByDate, selectedFilter]);

  const filteredTotalEvents = Object.values(filteredEventsByDate).flat().length;

  // Helper function to format type name for display
  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'movie': return 'Movie';
      case 'function': return 'Function';
      case 'movie-anniversary': return 'Movie Anniversary';
      case 'film-event': return 'Film Event';
      case 'fashion-event': return 'Fashion Event';
      case 'cultural-event': return 'Cultural Event';
      case 'social-event': return 'Social Event';
      case 'award-event': return 'Award Event';
      case 'international-event':
      case 'event': return 'Event';
      default: return type;
    }
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const eventsByType: Record<string, number> = {};
    const eventsByWeekday: Record<string, number> = {};
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => eventsByWeekday[day] = 0);
    
    allEvents.forEach(event => {
      // Merge "event" and "international-event" into a single "Event" category
      const displayType = event.type === 'international-event' ? 'event' : event.type;
      eventsByType[displayType] = (eventsByType[displayType] || 0) + 1;
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
              {Object.entries(summary.eventsByType)
                .sort(([a], [b]) => {
                  // Sort "Event" to appear after other types
                  if (a === 'event') return 1;
                  if (b === 'event') return -1;
                  return a.localeCompare(b);
                })
                .map(([type, count]) => (
                <div 
                  key={type} 
                  onClick={() => setSelectedFilter(type)}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <span className="text-sm text-slate-400 hover:text-slate-200">{getTypeDisplayName(type)}</span>
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
  <h3 className="mb-4 text-xl font-semibold text-white">
    All events in {monthName} {yearNum} ({filteredTotalEvents})
  </h3>
  
  {/* Filter Tabs */}
  <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-700/50 pb-4">
    <button
      onClick={() => setSelectedFilter(null)}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        !selectedFilter
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
      )}
    >
      All ({totalEvents})
    </button>
    {eventTypes.map((type) => {
      const config = getTypeConfig(type);
      // When counting "event", include both "event" and "international-event"
      const count = type === 'event' 
        ? allEvents.filter(e => e.type === 'event' || e.type === 'international-event').length
        : allEvents.filter(e => e.type === type).length;
      return (
        <button
          key={type}
          onClick={() => setSelectedFilter(type)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
            selectedFilter === type
              ? `${config.bg} ${config.border} ${config.text} shadow-lg`
              : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600"
          )}
        >
          {config.label} ({count})
        </button>
      );
    })}
  </div>
  
  <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
    <div className="space-y-6">
    {Object.entries(filteredEventsByDate)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, events]) => {
        const eventDate = new Date(date);
        const isToday = 
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
        const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dateFormatted = eventDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        
        return (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className={`flex items-center gap-3 pb-2 border-b ${isToday ? 'border-blue-500/50' : 'border-slate-700/50'}`}>
              <div className={`flex items-center gap-2 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span className="font-semibold text-sm">{dayName}</span>
                <span className="text-sm">{dateFormatted}</span>
                {isToday && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    Today
                  </span>
                )}
              </div>
              <div className="flex-1"></div>
              <span className="text-xs text-slate-500 font-medium">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            
            {/* Events for this date */}
            <div className="space-y-2 pl-2">
              {events.map((event, index) => {
                const config = getTypeConfig(event.type);
                return (
                  <div 
                    key={`${date}-${index}`} 
                    className={`group rounded-lg border ${config.border} ${config.bg} p-4 hover:${config.border.replace('/40', '/60')} hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
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
                    <div className="flex items-start gap-3">
                      {/* Event Type Badge */}
                      <div className="flex-shrink-0">
                        <span 
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.border} ${config.text}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-semibold ${config.text} group-hover:text-white transition-colors`}>
                          {event.title}
                        </h4>
                        
                        {event.title2 && (
                          <p className="mt-1 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                            {event.title2}
                          </p>
                        )}
                        
                        {event.description && (
                          <p className="mt-2 text-sm text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors">
                            {event.description}
                          </p>
                        )}
                        
                        {event.meta?.place && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                            <span>{event.meta.place}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Click indicator */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg 
                          className="w-5 h-5 text-slate-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
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
  onEventClick?: (event: Event) => void;
  onTodayClick?: (date: string, events: Event[]) => void;
  className?: string;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  monthMeta,
  eventsByDate,
  onDayClick,
  onEventClick,
  onTodayClick,
  className,
}) => {
  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    } else if (onDayClick) {
      // Fallback to day click if no event click handler
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
  
  // Get today's date key and events
  // Always use the actual current date for "today"
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  
  // Build today's date key using the actual current date
  // For CurrentMonthPage, year === currentYear, so eventsByDate will have events for currentYear
  // For other pages viewing a different year, we still use current date but may not find events
  const todayDateKey = buildDateKey(currentYear, currentMonthNum, currentDay);
  // Look up events in eventsByDate - if viewing current year, this will work
  // If viewing a different year, we need to check if year matches currentYear
  const todayEvents = (year === currentYear) ? (eventsByDate[todayDateKey] || []) : [];

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
            onClick={() => onTodayClick?.(todayDateKey, todayEvents)}
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
                  "group relative min-h-[4rem] bg-slate-900/50 transition-all duration-200 sm:min-h-[7rem]",
                  eventsForDay.length > 0 ? "hover:bg-slate-800/50" : ""
                )}
              >
                <DayCell
                  day={day}
                  isToday={isToday}
                  isCurrentMonth={true}
                  events={eventsForDay}
                  onClick={() => eventsForDay.length > 0 && onDayClick?.(dateKey, eventsForDay)}
                  onEventClick={(event) => handleEventClick(event)}
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
