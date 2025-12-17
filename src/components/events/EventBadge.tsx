import React from "react";
import type { Event } from "../../utils/types";

interface EventBadgeProps {
  event: Event;
}

export const EventBadge: React.FC<EventBadgeProps> = ({ event }) => {
  const getTypeConfig = () => {
    switch (event.type) {
      case "movie":
        return {
          bg: "bg-purple-500/15",
          border: "border-purple-500/40",
          text: "text-purple-100",
          chipBg: "bg-purple-500/80",
          chipText: "text-white",
          label: "Movie"
        };
      case "function":
        return {
          bg: "bg-emerald-500/15",
          border: "border-emerald-500/40",
          text: "text-emerald-50",
          chipBg: "bg-emerald-500/80",
          chipText: "text-white",
          label: "Function"
        };
      case "movie-anniversary":
        return {
          bg: "bg-amber-500/15",
          border: "border-amber-500/40",
          text: "text-amber-50",
          chipBg: "bg-amber-500/80",
          chipText: "text-white",
          label: "Anniversary"
        };
      case "event":
      default:
        return {
          bg: "bg-sky-500/15",
          border: "border-sky-500/40",
          text: "text-sky-50",
          chipBg: "bg-sky-500/80",
          chipText: "text-white",
          label: "Event"
        };
    }
  };

  const cfg = getTypeConfig();

  const getDisplayTitle = () => {
    if (event.type === "movie-anniversary" && event.meta?.anniversaryYears) {
      const baseTitle = event.title.replace(/^\d+\s+years?\s+of\s+/i, "");
      return `${event.meta.anniversaryYears} yr${
        event.meta.anniversaryYears > 1 ? "s" : ""
      } • ${baseTitle}`;
    }
    return event.title;
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${cfg.bg} ${cfg.border} ${cfg.text}`}
      title={event.title}
    >
      <span
        className={`inline-flex items-center rounded-full px-2 py-[1px] text-[10px] font-semibold ${cfg.chipBg} ${cfg.chipText}`}
      >
        {cfg.label}
      </span>
      <span className="truncate">{getDisplayTitle()}</span>
    </div>
  );
};
