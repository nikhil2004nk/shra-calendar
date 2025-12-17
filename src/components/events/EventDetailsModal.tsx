import React, { useMemo } from "react";
import type { Event } from "../../utils/types";
import { getMovieById } from "../../data/movies";

interface EventDetailsModalProps {
  date: string;
  events: Event[];
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  date,
  events,
  onClose
}) => {
  if (!events.length) return null;

  // Pre-resolve movie metadata for events that have baseMovieId
  const eventsWithMovie = useMemo(
    () =>
      events.map((event) => {
        const baseMovieId = event.meta?.baseMovieId;
        const movie = baseMovieId ? getMovieById(baseMovieId) : undefined;
        return { event, movie };
      }),
    [events]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Events on
            </p>
            <h2 className="text-sm font-semibold text-slate-100">
              {date}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 py-3 text-sm">
          {eventsWithMovie.map(({ event, movie }) => (
            <div
              key={event.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
            >
              {/* Title + type */}
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-100">
                  {event.title}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-[1px] text-[10px] uppercase tracking-wide text-slate-300">
                  {event.type.replace("-", " ")}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                {event.date}
              </p>

              {/* If linked to a movie, show rich movie section */}
              {movie ? (
  <div className="space-y-2">
    {/* Movie core info */}
    <div className="flex gap-3">
      {movie.imageUrl && (
        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs text-slate-200">{movie.description}</p>

        {/* Release + anniversary date */}
        <p className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            Release date:
          </span>{" "}
          {movie.date}
        </p>
        <p className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            Anniversary date:
          </span>{" "}
          {event.date}
          {event.meta?.anniversaryYears
            ? ` • ${event.meta.anniversaryYears} year${
                event.meta.anniversaryYears > 1 ? "s" : ""
              }`
            : ""}
        </p>

        {movie.director && (
          <p className="text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">
              Director:
            </span>{" "}
            {movie.director}
          </p>
        )}
        {movie.cast && movie.cast.length > 0 && (
          <p className="text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">
              Cast:
            </span>{" "}
            {movie.cast.join(", ")}
          </p>
        )}
        {typeof movie.duration === "number" && (
          <p className="text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">
              Duration:
            </span>{" "}
            {movie.duration} min
          </p>
        )}
      </div>
    </div>
  </div>
) : (
  <p className="text-xs text-slate-200">{event.description}</p>
)}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
