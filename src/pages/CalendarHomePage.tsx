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
      <button
        onClick={onBack}
        className="text-xs text-slate-400 hover:text-slate-200 mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">
        Calendar Home – {year}
      </h1>

      {/* Static Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            if (filters.types?.includes('function')) {
              // If already filtered by function, clear the filter
              updateFilter('types', []);
            } else {
              // Otherwise, filter by function
              updateFilter('types', ['function']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('function')
              ? 'from-blue-700/90 to-blue-600/80 border-blue-500/50 hover:border-blue-400/70 focus:ring-blue-500'
              : 'from-blue-900/80 to-blue-800/60 border-blue-800/50 hover:border-blue-400/50 focus:ring-blue-500'
          }`}
          aria-label={filters.types?.includes('function') ? 'Clear function filter' : 'Filter by Functions'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-200">Total Functions</h3>
              <p className="text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'function').length}
              </p>
            </div>
            <div className="bg-blue-700/40 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (filters.types?.includes('movie-anniversary')) {
              // If already filtered by movie-anniversary, clear the filter
              updateFilter('types', []);
            } else {
              // Otherwise, filter by movie-anniversary
              updateFilter('types', ['movie-anniversary']);
            }
          }}
          className={`text-left bg-gradient-to-r rounded-xl p-4 border shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            filters.types?.includes('movie-anniversary')
              ? 'from-pink-700/90 to-pink-600/80 border-pink-500/50 hover:border-pink-400/70 focus:ring-pink-500'
              : 'from-pink-900/80 to-pink-800/60 border-pink-800/50 hover:border-pink-400/50 focus:ring-pink-500'
          }`}
          aria-label={filters.types?.includes('movie-anniversary') ? 'Clear movie anniversaries filter' : 'Filter by Movie Anniversaries'}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-pink-200">Movie Anniversaries</h3>
              <p className="text-2xl font-bold text-white">
                {allItems.filter(item => item.type === 'movie-anniversary').length}
              </p>
            </div>
            <div className="bg-pink-700/40 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
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
              {allItems.length} total events in {year}
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
