import React from "react";

interface LandingPageProps {
  onGoCurrentMonth: () => void;
  onGoViewCalendar: () => void;
  onGoMonthly: () => void;
}


export const LandingPage: React.FC<LandingPageProps> = ({
  onGoCurrentMonth,
  onGoViewCalendar,
  onGoMonthly
}) => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
          Shraddha Kapoor Calendar 2026
        </h1>
        <p className="max-w-xl text-slate-300 mb-8 text-sm sm:text-base">
          Browse all movie releases, public events, functions, and special
          appearances across months, or jump straight to the current month.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xl">
          <button
            onClick={onGoCurrentMonth}
            className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600 transition"
          >
            Current Month
          </button>
          <button
            onClick={onGoViewCalendar}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
          >
            View Calendar (Jan–Dec)
          </button>
          <button
            onClick={onGoMonthly}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
          >
            Monthly Navigator
          </button>
        </div>
      </section>
    </main>
  );
};
