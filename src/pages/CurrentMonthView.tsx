import React, { useMemo } from "react";
import { getCalendarItemsForYear, months } from "../data";
import { groupEventsByDate } from "../utils/dateUtils";
import { MonthCalendar } from "../components/calendar/MonthCalendar";

interface CurrentMonthViewProps {
  year: number;      // e.g., 2025 or 2026
  monthId: number;   // 1-12
}

export const CurrentMonthView: React.FC<CurrentMonthViewProps> = ({
  year,
  monthId
}) => {
  const monthMeta = months.find((m) => m.id === monthId);
  const allItemsForYear = useMemo(
    () => getCalendarItemsForYear(year),
    [year]
  );
  const eventsForMonth = useMemo(
    () => allItemsForYear.filter((item) => item.month === monthId),
    [allItemsForYear, monthId]
  );
  const eventsByDate = useMemo(
    () => groupEventsByDate(eventsForMonth),
    [eventsForMonth]
  );

  if (!monthMeta) return null;

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold text-slate-100 mb-2">
        {monthMeta.name} {year}
      </h1>
      <MonthCalendar
        year={year}
        monthMeta={monthMeta}
        eventsByDate={eventsByDate}
      />
    </div>
  );
};
