import React from "react";
import type { Event } from "../../utils/types";
import { EventBadge } from "./EventBadge";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      className="w-full rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm cursor-pointer hover:bg-slate-800/70 transition-colors overflow-hidden active:scale-[0.98]" 
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-start w-full">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 text-base sm:text-sm break-words">
            {event.title}
          </h3>
          {event.title2 && (
            <p className="text-sm sm:text-xs text-slate-300 mt-0.5 break-words">
              {event.title2}
            </p>
          )}
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
          <EventBadge event={event} />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 sm:mt-1.5 break-words">
        {new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </p>
      {event.description && (
        <p className="mt-2 text-xs text-slate-300 line-clamp-2 break-words leading-relaxed">
          {event.description}
        </p>
      )}
    </div>
  );
};
