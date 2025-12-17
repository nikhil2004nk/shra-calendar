import React from "react";
import type { Event } from "../../utils/types";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: Event[];
  title?: string;
}

export const EventList: React.FC<EventListProps> = ({ events, title }) => {
  if (!events.length) return null;

  return (
    <section className="mt-4">
      {title && (
        <h2 className="text-sm font-semibold text-slate-200 mb-2">
          {title}
        </h2>
      )}
      <div className="grid gap-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};
