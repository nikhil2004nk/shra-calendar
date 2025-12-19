import { useMemo, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { CalendarHomePage } from "./pages/CalendarHomePage";
import { MonthlyViewPage } from "./pages/MonthlyViewPage";
import { CurrentMonthPage } from "./pages/CurrentMonthPage";
import { MoviesPage } from "./pages/MoviesPage";
import { months } from "./data";

type View =
  | "landing"
  | "current-month"
  | "calendar-home"
  | "calendar-home-month"
  | "monthly"
  | "movies";

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  return { year, month };
}

function App() {
  const [{ year: currentYear, month: currentMonth }] = useState(
    getCurrentYearMonth
  );

  const [calendarYear] = useState<number>(2026);
  const [view, setView] = useState<View>("landing");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const monthMeta = useMemo(
    () => months.find((m) => m.id === selectedMonth),
    [selectedMonth]
  );
  void monthMeta; // avoid unused warning, used implicitly by pages

  if (view === "landing") {
    return (
      <LandingPage
        onGoCurrentMonth={() => setView("current-month")}
        onGoViewCalendar={() => setView("calendar-home")}
        onGoMonthly={() => setView("monthly")}
        onGoMovies={() => setView("movies")}
      />
    );
  }

  if (view === "current-month") {
    return (
      <CurrentMonthPage
        year={currentYear}
        monthId={currentMonth}
        onBack={() => setView("landing")}
      />
    );
  }

  if (view === "calendar-home") {
    return (
      <CalendarHomePage
        year={calendarYear}
        onBack={() => setView("landing")}
        onSelectMonth={(monthId) => {
          setSelectedMonth(monthId);
          setView("calendar-home-month");
        }}
      />
    );
  }

  if (view === "calendar-home-month") {
    return (
      <MonthlyViewPage
        year={calendarYear}
        monthId={selectedMonth}
        mode="calendar-home"
        onBackToSelection={() => setView("calendar-home")}
        onBackToLanding={() => setView("landing")}
        onMonthChange={(newMonthId) => setSelectedMonth(newMonthId)}
      />
    );
  }

  if (view === "monthly") {
    return (
      <MonthlyViewPage
        year={calendarYear}
        monthId={selectedMonth}
        mode="monthly"
        onBackToSelection={undefined}
        onBackToLanding={() => setView("landing")}
        onMonthChange={(newMonthId) => setSelectedMonth(newMonthId)}
      />
    );
  }

  if (view === "movies") {
    return <MoviesPage onBack={() => setView("landing")} />;
  }

  return null;
}

export default App;
