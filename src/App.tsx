import React, { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { CalendarHomePage } from "./pages/CalendarHomePage";
import { MonthlyViewPage } from "./pages/MonthlyViewPage";

type View = "landing" | "calendar-home" | "month";

function App() {
  const [view, setView] = useState<View>("landing");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Change this to 2025 to see anniversaries like "4 years of The Last Adventure"
  const [year] = useState<number>(2026);

  if (view === "landing") {
    return (
      <LandingPage onExplore={() => setView("calendar-home")} />
    );
  }

  if (view === "calendar-home") {
    return (
      <CalendarHomePage
        year={year}
        onBack={() => setView("landing")}
        onSelectMonth={(monthId) => {
          setSelectedMonth(monthId);
          setView("month");
        }}
      />
    );
  }

  if (view === "month" && selectedMonth != null) {
    return (
      <MonthlyViewPage
        year={year}
        monthId={selectedMonth}
        onBack={() => setView("calendar-home")}
      />
    );
  }

  return null;
}

export default App;
