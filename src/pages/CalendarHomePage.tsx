import React, { useMemo } from "react";
import { format } from "date-fns";
import { getCalendarItemsForYear, months } from "../data";
import { useSearch } from "../hooks/useSearch";
import { GlobalSearchBar } from "../components/search/GlobalSearchBar";
import { EventList } from "../components/events/EventList";

interface CalendarHomePageProps {
  onBack: () => void;
  onSelectMonth: (monthId: number) => void;
  year: number;
}

export const CalendarHomePage: React.FC<CalendarHomePageProps> = ({
  onBack,
  onSelectMonth,
  year
}) => {
  const allItems = useMemo(
    () => getCalendarItemsForYear(year),
    [year]
  );

  const {
    query,
    setQuery,
    results,
    filters,
    updateFilter,
    resetFilters,
    availableTypes,
    availableYears,
    hasActiveFilters
  } = useSearch(allItems);

  // Pre-calculate count of events per month
  const eventsCountByMonth = useMemo(() => {
    const map: Record<number, number> = {};
    for (const item of allItems) {
      // Only count items that match current filters (except month filter)
      const matchesFilters = 
        (!filters.types?.length || filters.types.includes(item.type)) &&
        (!filters.year || new Date(item.date).getFullYear() === filters.year);
      
      if (matchesFilters) {
        map[item.month] = (map[item.month] || 0) + 1;
      }
    }
    return map;
  }, [allItems, filters.types, filters.year]);

  // Get unique months with events for the current year
  const monthsWithEvents = useMemo(() => {
    return months.filter(month => eventsCountByMonth[month.id] > 0);
  }, [eventsCountByMonth]);

  // Get the month name from a date string
  const getMonthName = (dateString: string) => {
    return format(new Date(dateString), 'MMMM yyyy');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
        >
          ← Back to home
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-2">
        Calendar Home – {year}
      </h1>

      {/* Static Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <button
          onClick={() => {
            if (filters.types?.includes('function')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['function']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('function')
              ? 'from-emerald-700/90 to-emerald-600/80 border-emerald-500/50 hover:border-emerald-400/70 focus:ring-emerald-500'
              : 'from-emerald-900/80 to-emerald-800/60 border-emerald-800/50 hover:border-emerald-400/50 focus:ring-emerald-500'
          }`}
          aria-label={filters.types?.includes('function') ? 'Clear function filter' : 'Filter by Functions'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-emerald-200">Functions</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'function').length}
              </p>
            </div>
            <div className="bg-emerald-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('movie-anniversary')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['movie-anniversary']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('movie-anniversary')
              ? 'from-amber-700/90 to-amber-600/80 border-amber-500/50 hover:border-amber-400/70 focus:ring-amber-500'
              : 'from-amber-900/80 to-amber-800/60 border-amber-800/50 hover:border-amber-400/50 focus:ring-amber-500'
          }`}
          aria-label={filters.types?.includes('movie-anniversary') ? 'Clear movie anniversaries filter' : 'Filter by Movie Anniversaries'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-amber-200">Anniversaries</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'movie-anniversary').length}
              </p>
            </div>
            <div className="bg-amber-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('film-event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['film-event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('film-event')
              ? 'from-red-700/90 to-red-600/80 border-red-500/50 hover:border-red-400/70 focus:ring-red-500'
              : 'from-red-900/80 to-red-800/60 border-red-800/50 hover:border-red-400/50 focus:ring-red-500'
          }`}
          aria-label={filters.types?.includes('film-event') ? 'Clear film events filter' : 'Filter by Film Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-red-200">Film Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'film-event').length}
              </p>
            </div>
            <div className="bg-red-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('fashion-event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['fashion-event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('fashion-event')
              ? 'from-pink-700/90 to-pink-600/80 border-pink-500/50 hover:border-pink-400/70 focus:ring-pink-500'
              : 'from-pink-900/80 to-pink-800/60 border-pink-800/50 hover:border-pink-400/50 focus:ring-pink-500'
          }`}
          aria-label={filters.types?.includes('fashion-event') ? 'Clear fashion events filter' : 'Filter by Fashion Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-pink-200">Fashion Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'fashion-event').length}
              </p>
            </div>
            <div className="bg-pink-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('cultural-event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['cultural-event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('cultural-event')
              ? 'from-indigo-700/90 to-indigo-600/80 border-indigo-500/50 hover:border-indigo-400/70 focus:ring-indigo-500'
              : 'from-indigo-900/80 to-indigo-800/60 border-indigo-800/50 hover:border-indigo-400/50 focus:ring-indigo-500'
          }`}
          aria-label={filters.types?.includes('cultural-event') ? 'Clear cultural events filter' : 'Filter by Cultural Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-indigo-200">Cultural Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'cultural-event').length}
              </p>
            </div>
            <div className="bg-indigo-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('social-event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['social-event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('social-event')
              ? 'from-teal-700/90 to-teal-600/80 border-teal-500/50 hover:border-teal-400/70 focus:ring-teal-500'
              : 'from-teal-900/80 to-teal-800/60 border-teal-800/50 hover:border-teal-400/50 focus:ring-teal-500'
          }`}
          aria-label={filters.types?.includes('social-event') ? 'Clear social events filter' : 'Filter by Social Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-teal-200">Social Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'social-event').length}
              </p>
            </div>
            <div className="bg-teal-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('award-event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['award-event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('award-event')
              ? 'from-yellow-700/90 to-yellow-600/80 border-yellow-500/50 hover:border-yellow-400/70 focus:ring-yellow-500'
              : 'from-yellow-900/80 to-yellow-800/60 border-yellow-800/50 hover:border-yellow-400/50 focus:ring-yellow-500'
          }`}
          aria-label={filters.types?.includes('award-event') ? 'Clear award events filter' : 'Filter by Award Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-yellow-200">Award Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'award-event').length}
              </p>
            </div>
            <div className="bg-yellow-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('event')) {
              updateFilter('types', []);
            } else {
              updateFilter('types', ['event']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-3 md:p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('event')
              ? 'from-blue-700/90 to-blue-600/80 border-blue-500/50 hover:border-blue-400/70 focus:ring-blue-500'
              : 'from-blue-900/80 to-blue-800/60 border-blue-800/50 hover:border-blue-400/50 focus:ring-blue-500'
          }`}
          aria-label={filters.types?.includes('event') ? 'Clear events filter' : 'Filter by Events'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-blue-200">Events</h3>
              <p className="text-xl md:text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'event').length}
              </p>
            </div>
            <div className="bg-blue-700/40 p-2 md:p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <GlobalSearchBar
        query={query}
        filters={filters}
        availableTypes={availableTypes}
        availableYears={availableYears}
        onQueryChange={setQuery}
        onFilterChange={updateFilter}
        onClearFilters={resetFilters}
        className="mb-6"
      />

      {hasActiveFilters ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100">
            {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
          </h2>
          
          {/* Group results by month */}
          {Object.entries(
            results.reduce<Record<string, typeof results>>((acc, event) => {
              const monthYear = getMonthName(event.date);
              if (!acc[monthYear]) {
                acc[monthYear] = [];
              }
              acc[monthYear].push(event);
              return acc;
            }, {})
          ).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="space-y-2">
              <EventList
                events={monthEvents}
                title={monthYear}
                className="mb-6"
                showTitle={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Select a month
            </h2>
            <span className="text-xs text-slate-400">
              {allItems.length} total events
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {monthsWithEvents.length > 0 ? (
              monthsWithEvents.map((month) => {
                const count = eventsCountByMonth[month.id] || 0;
                return (
                  <button
                    key={month.id}
                    onClick={() => onSelectMonth(month.id)}
                    className="relative rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-4 text-left hover:border-pink-500/70 hover:bg-pink-500/10 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-slate-100">
                        {month.name}
                      </div>
                      {count > 0 && (
                        <span className="inline-flex items-center rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
                          {count} event{count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {month.days} days
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400">
                No events found for the selected filters
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};
