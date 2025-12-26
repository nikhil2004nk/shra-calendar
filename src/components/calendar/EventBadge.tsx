import React from "react";
import type { CalendarItem } from "../../utils/types";

interface EventBadgeProps {
  event: CalendarItem;
}

export const EventBadge: React.FC<EventBadgeProps> = ({ event }) => {
  const getEventColor = () => {
    switch (event.type) {
      case "movie":
        return "bg-purple-100 text-purple-800";
      case "function":
        return "bg-green-100 text-green-800";
      case "movie-anniversary":
        return "bg-amber-100 text-amber-800";
      case "film-event":
        return "bg-red-100 text-red-800";
      case "fashion-event":
        return "bg-pink-100 text-pink-800";
      case "cultural-event":
        return "bg-indigo-100 text-indigo-800";
      case "social-event":
        return "bg-teal-100 text-teal-800";
      case "award-event":
        return "bg-yellow-100 text-yellow-800";
      case "event":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getLabel = () => {
    if (event.type === "movie-anniversary" && event.meta?.anniversaryYears) {
      // Show "4 years" / "5 years" style label
      return `${event.meta.anniversaryYears} year${
        event.meta.anniversaryYears > 1 ? "s" : ""
      } of ${event.title.replace(/^\d+\s+years?\s+of\s+/i, "")}`;
    }
    return event.title;
  };

  return (
    <div
      className={`text-xs px-2 py-1 rounded truncate ${getEventColor()}`}
      title={event.title}
    >
      {getLabel()}
    </div>
  );
};
