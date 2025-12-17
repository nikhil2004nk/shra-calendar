import React from "react";
import type { Event } from "../../utils/types";
import { EventBadge } from "./EventBadge";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm">
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="font-semibold text-slate-100 truncate">
          {event.title}
        </span>
        <EventBadge event={event} />
      </div>
      <p className="text-xs text-slate-400">{event.date}</p>
      <p className="mt-1 text-xs text-slate-300 line-clamp-2">
        {event.description}
      </p>
    </div>
  );
};
