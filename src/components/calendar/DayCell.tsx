import React from "react";
import type { Event } from "../../utils/types";
import { EventBadge } from "../events/EventBadge";

interface DayCellProps {
  day: number;
  dateKey: string;
  events: Event[];
  onClick?: (events: Event[]) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  events,
  onClick
}) => {
  const hasEvents = events.length > 0;

  const handleClick = () => {
    if (!hasEvents || !onClick) return;
    onClick(events);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-28 flex-col rounded-xl border px-2 py-1.5 text-left text-xs transition ${
        hasEvents
          ? "border-pink-500/60 bg-slate-900/90 hover:bg-slate-900"
          : "border-slate-800 bg-slate-950 hover:bg-slate-900/80"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-200">
          {day}
        </span>
        {hasEvents && (
          <span className="rounded-full bg-pink-500/20 px-2 py-[1px] text-[10px] font-semibold text-pink-300">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        {events.slice(0, 2).map((event) => (
          <EventBadge key={event.id} event={event} />
        ))}
        {events.length > 2 && (
          <div className="text-[10px] text-slate-400">
            +{events.length - 2} more…
          </div>
        )}
      </div>
    </button>
  );
};
