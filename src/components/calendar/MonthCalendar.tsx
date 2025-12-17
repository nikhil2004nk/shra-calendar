import React from "react";
import type { Event } from "../../utils/types";
import type { MonthMeta } from "../../utils/dateUtils";
import { buildDateKey } from "../../utils/dateUtils";
import { DayCell } from "./DayCell";

interface MonthCalendarProps {
  year: number;
  monthMeta: MonthMeta;
  eventsByDate: Record<string, Event[]>;
  onDayClick?: (date: string, events: Event[]) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  monthMeta,
  eventsByDate,
  onDayClick
}) => {
  const { days, firstWeekday, id: month } = monthMeta;

  const leadingEmpty = (firstWeekday + 6) % 7;
  const totalCells = leadingEmpty + days;
  const weeks: (number | null)[][] = [];
  let currentDay = 1;

  for (let i = 0; i < totalCells; i++) {
    const weekIndex = Math.floor(i / 7);
    if (!weeks[weekIndex]) weeks[weekIndex] = [];
    if (i < leadingEmpty) {
      weeks[weekIndex].push(null);
    } else {
      weeks[weekIndex].push(currentDay++);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {weeks.flat().map((day, idx) => {
          if (!day) return <div key={idx} className="h-16" />;

          const dateKey = buildDateKey(year, month, day);
          const eventsForDay = eventsByDate[dateKey] ?? [];

          return (
            <DayCell
              key={dateKey}
              day={day}
              dateKey={dateKey}
              events={eventsForDay}
              onClick={() => onDayClick?.(dateKey, eventsForDay)}
            />
          );
        })}
      </div>
    </div>
  );
};
