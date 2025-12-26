import React from "react";
import type { CalendarItem } from "../../utils/types";
import { EventBadge } from "../events/EventBadge";
import { cn } from "../../utils";

interface DayCellProps {
  day: number;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  events: CalendarItem[];
  onClick?: (e: React.MouseEvent) => void;
  onEventClick?: (event: CalendarItem, e: React.MouseEvent) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  isCurrentMonth = true,
  isToday = false,
  events = [],
  onClick,
  onEventClick
}) => {
  const hasEvents = events.length > 0;
  const visibleEvents = events; // Show all events
  const hasMore = false; // No longer needed since we show all events
  
  const dayNumberClasses = cn(
    "flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer",
    isToday 
      ? "bg-blue-600 text-white hover:bg-blue-700" 
      : isCurrentMonth 
        ? "text-white hover:bg-slate-700/50" 
        : "text-gray-500 hover:bg-slate-800/30"
  );

  const cellClasses = cn(
    "group flex flex-col rounded-lg p-1 text-xs transition-all duration-200 ease-in-out",
    "border hover:shadow-md overflow-hidden h-20 sm:h-32",
    hasEvents
      ? "border-pink-500/40 bg-slate-900/70 hover:bg-slate-800/60"
      : "border-transparent bg-slate-900/40 hover:bg-slate-800/40",
    !isCurrentMonth && "opacity-60"
  );

  const handleCellClick = (e: React.MouseEvent) => {
    // Only trigger day click if clicking on the cell itself, not on events
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.day-number')) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const handleEventClick = (event: CalendarItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event, e);
  };

  return (
    <div 
      className={cellClasses}
      onClick={handleCellClick}
      role="button"
      aria-label={`${isToday ? 'Today, ' : ''}${day}${!isCurrentMonth ? ' (not in current month)' : ''}${hasEvents ? `, ${events.length} events` : ''}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span 
          className={cn(dayNumberClasses, "day-number")}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
        >
          {day}
        </span>
        {hasEvents && (
          <span 
            className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/90 text-[11px] font-bold text-white shadow-sm cursor-pointer hover:bg-pink-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(e);
            }}
            title={`Click to view all ${events.length} events`}
          >
            {events.length}
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar -mx-0.5">
        <div className="space-y-0.5">
          {visibleEvents.map((event) => (
            <div 
              key={event.id}
              onClick={(e) => handleEventClick(event, e)}
              className="cursor-pointer"
            >
              <EventBadge event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
