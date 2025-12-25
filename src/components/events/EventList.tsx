import React, { useState } from "react";
import { format } from "date-fns";
import type { Event } from "../../utils/types";
import { EventCard } from "./EventCard";

interface EventPopupProps {
  event: Event | null;
  onClose: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 sm:p-6 overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="bg-slate-800/95 rounded-xl w-full max-w-2xl my-8 mx-auto relative shadow-2xl border border-slate-700/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 -m-1 transition-colors rounded-full hover:bg-slate-700/50"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-white break-words pr-2">{event.title}</h2>
            {event.title2 && <p className="text-slate-300 text-sm sm:text-base">{event.title2}</p>}
          </div>
          
          <div className="flex items-center space-x-2 text-slate-300 text-sm sm:text-base bg-slate-900/30 px-3 py-2 rounded-lg border border-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          {event.description && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Description</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {event.description.split('\n').map((paragraph, i) => (
                  <span key={i}>
                    {paragraph}
                    <br className="mb-3" />
                  </span>
                ))}
              </p>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-700/50 mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-900/60 text-blue-100 border border-blue-800/50">
              {event.type.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

interface EventListProps {
  events: Event[];
  title?: string;
  className?: string;
  showTitle?: boolean;
}

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  title, 
  className = '',
  showTitle = true 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (!events.length) return null;

  return (
    <>
      <section className={`mt-4 ${className}`.trim()}>
        {showTitle && title && (
          <h2 className="text-sm font-semibold text-slate-200 mb-2">
            {title}
          </h2>
        )}
        <div className="grid gap-2">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98] transform transition-transform duration-100"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>
      
      <EventPopup 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </>
  );
};
