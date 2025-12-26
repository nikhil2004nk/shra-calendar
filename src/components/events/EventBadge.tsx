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
      case "film-event":
        return {
          bg: "bg-red-500/15",
          border: "border-red-500/40",
          text: "text-red-100",
          chipBg: "bg-red-500/80",
          chipText: "text-white",
          label: "Film"
        };
      case "fashion-event":
        return {
          bg: "bg-pink-500/15",
          border: "border-pink-500/40",
          text: "text-pink-100",
          chipBg: "bg-pink-500/80",
          chipText: "text-white",
          label: "Fashion"
        };
      case "cultural-event":
        return {
          bg: "bg-indigo-500/15",
          border: "border-indigo-500/40",
          text: "text-indigo-100",
          chipBg: "bg-indigo-500/80",
          chipText: "text-white",
          label: "Cultural"
        };
      case "social-event":
        return {
          bg: "bg-teal-500/15",
          border: "border-teal-500/40",
          text: "text-teal-100",
          chipBg: "bg-teal-500/80",
          chipText: "text-white",
          label: "Social"
        };
      case "award-event":
        return {
          bg: "bg-yellow-500/15",
          border: "border-yellow-500/40",
          text: "text-yellow-100",
          chipBg: "bg-yellow-500/80",
          chipText: "text-white",
          label: "Award"
        };
      case "international-event":
        return {
          bg: "bg-violet-500/15",
          border: "border-violet-500/40",
          text: "text-violet-100",
          chipBg: "bg-violet-500/80",
          chipText: "text-white",
          label: "International"
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

  const displayTitle = getDisplayTitle();
  const maxChars = 12; // Maximum characters before truncation
  const truncatedTitle = displayTitle.length > maxChars 
    ? `${displayTitle.substring(0, maxChars)}...` 
    : displayTitle;

  return (
    <div
      className={`group relative flex items-start space-x-1 rounded-md p-1 text-left transition-all duration-200 ${cfg.bg} ${cfg.border} ${cfg.text} hover:opacity-100 hover:scale-[1.02] hover:shadow-md cursor-pointer`}
      title={`Click to view details: ${displayTitle}`}
    >
      <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[140px]">
        <div className="flex items-center justify-between">
          <span 
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium ${cfg.chipBg} ${cfg.chipText} whitespace-nowrap`}
            title={cfg.label} // Show full label on hover
          >
            {cfg.label.length > 3 ? `${cfg.label.substring(0, 3)}.` : cfg.label}
          </span>
        </div>
        <p 
          className="mt-0.5 text-[10px] sm:text-xs font-medium leading-tight text-ellipsis overflow-hidden whitespace-nowrap"
          title={displayTitle} // Show full title on hover
        >
          {truncatedTitle}
        </p>
      </div>
    </div>
  );
};
