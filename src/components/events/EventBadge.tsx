import React from "react";
import type { Event } from "../../utils/types";

interface EventBadgeProps {
  event: Event;
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
      case "event":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getLabel = () => {
    if (event.type === "movie-anniversary" && event.meta?.anniversaryYears) {
      const baseTitle = event.title.replace(/^\d+\s+years?\s+of\s+/i, "");
      return `${event.meta.anniversaryYears} year${
        event.meta.anniversaryYears > 1 ? "s" : ""
      } of ${baseTitle}`;
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
