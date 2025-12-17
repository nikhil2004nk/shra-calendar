import React from "react";

interface LandingPageProps {
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
          Shraddha Kapoor Calendar 2026
        </h1>
        <p className="max-w-xl text-slate-300 mb-6 text-sm sm:text-base">
          Explore all movie releases, public events, functions, and special
          appearances of Shraddha Kapoor throughout 2026 in a beautiful,
          fan-friendly calendar.
        </p>
        <button
          onClick={onExplore}
          className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600 transition"
        >
          Explore Calendar
        </button>
      </section>
    </main>
  );
};
