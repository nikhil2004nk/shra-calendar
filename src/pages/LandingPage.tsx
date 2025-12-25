import React from "react";
interface LandingPageProps {
  onGoCurrentMonth: () => void;
  onGoViewCalendar: () => void;
  onGoMonthly: () => void;
  onGoMovies: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoCurrentMonth,
  onGoViewCalendar,
  onGoMonthly,
  onGoMovies
}) => {
  return (
     <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
    <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
       <div className="mb-4 sm:mb-6 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto transform transition-all duration-300 hover:scale-105">
          <img 
            src="/hero-1.png" 
            alt="Shraddha Kapoor" 
            className="w-full h-full object-contain drop-shadow-lg"
            loading="eager"
          />
        </div>
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight mt-8">
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
            View Calendar
          </button>
          <button
            onClick={onGoMonthly}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
          >
            Monthly Navigator
          </button>
        </div>

        <div className="w-full max-w-xl mt-4">
          <button
            onClick={onGoMovies}
            className="w-full rounded-xl bg-purple-900 border border-purple-800 px-4 py-3 text-sm font-semibold text-purple-100 hover:bg-purple-800 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="4" x2="7" y2="24"></line>
              <line x1="17" y1="4" x2="17" y2="24"></line>
              <line x1="2" y1="16" x2="22" y2="16"></line>
              <line x1="2" y1="8" x2="22" y2="8"></line>
            </svg>
            View All Movies
          </button>
        </div>
      </section>
    </main>
  );
};
