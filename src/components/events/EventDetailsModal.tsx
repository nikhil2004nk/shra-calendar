// src/components/events/EventDetailsModal.tsx

import React, { useMemo } from "react";
import type { Event } from "../../utils/types";
import { getMovieById } from "../../data/movies";
import type { ShraddhaMovie } from "./ShraddhaMovieDetails";
import ShraddhaMovieDetails from "./ShraddhaMovieDetails";

interface EventDetailsModalProps {
  date: string;
  events: Event[];
  onClose: () => void;
}

interface EventWithMovie {
  event: Event;
  movie?: ShraddhaMovie;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  date,
  events,
  onClose
}) => {
  if (!events.length) return null;

  // Pre-resolve movie metadata for events that have baseMovieId
  const eventsWithMovie = useMemo<EventWithMovie[]>(
    () =>
      events.map((event: Event) => {
        const baseMovieId = event.meta?.baseMovieId;
        const movie = baseMovieId ? getMovieById(baseMovieId) as unknown as ShraddhaMovie : undefined;
        return { event, movie };
      }),
    [events]
  );

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'from-purple-600 to-purple-700';
      case 'function': return 'from-emerald-500 to-emerald-600';
      case 'movie-anniversary': return 'from-amber-500 to-amber-600';
      case 'event':
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/60 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl lg:max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r px-6 py-4 border-b border-slate-700 ${getTypeColor(events[0]?.type || 'event')}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Event Details</h2>
              <p className="text-sm text-white/90">{formatDisplayDate(date)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] sm:max-h-[80vh] overflow-y-auto">
          {eventsWithMovie.map(({ event, movie }) => (
            <div key={event.id} className="p-6">
              {movie ? (
                <ShraddhaMovieDetails movie={movie} />
              ) : event.type === 'function' ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">
    {event.title}
  </h3>

  {event.meta?.anniversaryYears && (
    <span
      className="
        self-start sm:self-auto
        shrink-0
        px-2.5 sm:px-3
        py-1
        bg-yellow-100
        text-yellow-800
        text-xs sm:text-sm
        font-semibold
        rounded-full
        border border-yellow-200
        shadow-sm
        whitespace-nowrap
      "
    >
      {event.meta.anniversaryYears} year
      {event.meta.anniversaryYears > 1 ? 's' : ''} ago
    </span>
  )}
</div>

                  <div className="space-y-4">
                    {event.description && (
                      <p className="text-gray-700">{event.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div className="p-2 sm:p-0">
                        <p className="text-gray-500">Event Date</p>
                        <p className="font-medium text-gray-800">
                          {formatDisplayDate(event.originalDate || event.date)}
                        </p>
                      </div>
                      {event.meta?.anniversaryYears && (
                        <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-400 sm:col-span-2 lg:col-span-1">
                          <p className="text-yellow-700 font-medium text-sm sm:text-base">
                            {event.meta.anniversaryYears} Year{event.meta.anniversaryYears > 1 ? 's' : ''} Anniversary
                          </p>
                          <p className="text-xs text-yellow-600">
                            Since {new Date(event.originalDate || event.date).getFullYear()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    {event.meta?.anniversaryYears && (
                      <span className="whitespace-nowrap px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold rounded-full border border-yellow-200 shadow-sm">
                        {event.meta.anniversaryYears} year{event.meta.anniversaryYears > 1 ? 's' : ''} ago
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-gray-700 mb-4">{event.description}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="p-2 sm:p-0">
                      <p className="text-gray-500">Event Date</p>
                      <p className="font-medium text-gray-800">
                        {formatDisplayDate(event.originalDate || event.date)}
                      </p>
                    </div>
                    {event.meta?.anniversaryYears && (
                      <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-400 sm:col-span-2 lg:col-span-1">
                        <p className="text-yellow-700 font-medium text-sm sm:text-base">
                          {event.meta.anniversaryYears} Year{event.meta.anniversaryYears > 1 ? 's' : ''} Anniversary
                        </p>
                        <p className="text-xs text-yellow-600">
                          Since {new Date(event.originalDate || event.date).getFullYear() - event.meta.anniversaryYears}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};