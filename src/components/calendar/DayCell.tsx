import React from "react";
import type { Event } from "../../utils/types";
import { EventBadge } from "../events/EventBadge";

interface DayCellProps {
  day: number;
  dateKey: string;
  events: Event[];
  onClick?: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  events,
  onClick
}) => {
  const hasEvents = events.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-20 rounded-lg border px-1 py-1 text-left transition ${
        hasEvents
          ? "border-pink-500/70 bg-pink-500/10 hover:bg-pink-500/20"
          : "border-slate-800 bg-slate-900 hover:bg-slate-800/80"
      }`}
    >
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{day}</span>
        {hasEvents && (
          <span className="text-[10px] font-semibold text-pink-400">
            {events.length} event{events.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="mt-1 space-y-0.5">
        {events.slice(0, 2).map((event) => (
          <EventBadge key={event.id} event={event} />
        ))}
        {events.length > 2 && (
          <div className="text-[10px] text-slate-400">
            +{events.length - 2} more
          </div>
        )}
      </div>
    </button>
  );
};
