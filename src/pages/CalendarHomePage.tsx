import React, { useMemo } from "react";
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

  const { query, setQuery, results } = useSearch(allItems);

  // Pre-calculate count of events per month
  const eventsCountByMonth = useMemo(() => {
    const map: Record<number, number> = {};
    for (const item of allItems) {
      map[item.month] = (map[item.month] || 0) + 1;
    }
    return map;
  }, [allItems]);

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

      <GlobalSearchBar value={query} onChange={setQuery} />

      {query ? (
        <EventList
          events={results}
          title={`Search results (${results.length})`}
        />
      ) : (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-2">
            Select a month
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {months.map((month) => {
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
            })}
          </div>
        </section>
      )}
    </main>
  );
};
