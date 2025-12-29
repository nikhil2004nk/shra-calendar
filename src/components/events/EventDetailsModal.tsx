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

  if (!events.length) return null;

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
      case 'film-event': return 'from-red-500 to-red-600';
      case 'fashion-event': return 'from-pink-500 to-pink-600';
      case 'cultural-event': return 'from-indigo-500 to-indigo-600';
      case 'social-event': return 'from-teal-500 to-teal-600';
      case 'award-event': return 'from-yellow-500 to-yellow-600';
      case 'international-event': return 'from-violet-500 to-violet-600';
      case 'event':
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'movie':
        return {
          label: 'Movie',
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200'
        };
      case 'function':
        return {
          label: 'Function',
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          border: 'border-emerald-200'
        };
      case 'movie-anniversary':
        return {
          label: 'Anniversary',
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'film-event':
        return {
          label: 'Film',
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200'
        };
      case 'fashion-event':
        return {
          label: 'Fashion',
          bg: 'bg-pink-100',
          text: 'text-pink-800',
          border: 'border-pink-200'
        };
      case 'cultural-event':
        return {
          label: 'Cultural',
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          border: 'border-indigo-200'
        };
      case 'social-event':
        return {
          label: 'Social',
          bg: 'bg-teal-100',
          text: 'text-teal-800',
          border: 'border-teal-200'
        };
      case 'award-event':
        return {
          label: 'Award',
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200'
        };
      case 'international-event':
        return {
          label: 'International',
          bg: 'bg-violet-100',
          text: 'text-violet-800',
          border: 'border-violet-200'
        };
      case 'event':
      default:
        return {
          label: 'Event',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200'
        };
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
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug flex-1 min-w-0">
                      {event.title}
                    </h3>

                    {(() => {
                      const typeBadge = getTypeBadge(event.type);
                      return (
                        <span className={`inline-flex items-center shrink-0 w-fit px-2.5 sm:px-3 py-1 ${typeBadge.bg} ${typeBadge.text} text-xs sm:text-sm font-semibold rounded-full border ${typeBadge.border} shadow-sm whitespace-nowrap`}>
                          {typeBadge.label}
                        </span>
                      );
                    })()}
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
                      {event.meta?.place && (
                        <div className="p-2 sm:p-0">
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium text-gray-800">
                            {event.meta.place}
                          </p>
                        </div>
                      )}
                      {event.meta?.anniversaryYears && (
                        <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-400 sm:col-span-2 lg:col-span-1">
                          <p className="text-yellow-700 font-medium text-sm sm:text-base">
                            {event.meta.anniversaryYears} Year{event.meta.anniversaryYears > 1 ? 's' : ''} Anniversary
                          </p>
                          <p className="text-xs text-yellow-600">
                            Since {new Date(event.originalDate || event.date).getFullYear() - (event.meta.anniversaryYears || 0)}
                          </p>
                        </div>
                      )}
                    </div>
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