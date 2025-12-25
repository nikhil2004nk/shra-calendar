import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, getYear } from 'date-fns';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { allEvents, getEventsByMonth, months } from '../data';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Home } from 'lucide-react';

export const MonthSelectionView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(getYear(new Date()));
  const [view, setView] = useState<'selection' | 'calendar'>('selection');

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setView('calendar');
  };

  const handleBackToMonths = () => {
    setView('selection');
  };

  const navigateToNextYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const navigateToPrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  if (view === 'calendar' && selectedMonth !== null) {
    const monthDate = new Date(currentYear, selectedMonth, 1);
    const monthEvents = useMemo(() => 
      getEventsByMonth(currentYear, selectedMonth), 
      [currentYear, selectedMonth]
    );
    
    const monthName = format(monthDate, 'MMMM yyyy');

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToMonths}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Months
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {monthName}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
                const newYear = selectedMonth === 0 ? currentYear - 1 : currentYear;
                setSelectedMonth(newMonth);
                setCurrentYear(newYear);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
                const newYear = selectedMonth === 11 ? currentYear + 1 : currentYear;
                setSelectedMonth(newMonth);
                setCurrentYear(newYear);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <MonthGrid
            month={selectedMonth}
            year={currentYear}
            events={monthEvents}
            onDateSelect={(date) => {
              // Handle date selection if needed
              console.log('Date selected:', date);
            }}
            highlightToday={true}
          />
        </div>
      </div>
    );
  }

  // Get events count for each month
  const monthEventsCount = useMemo(() => {
    const counts = new Array(12).fill(0);
    const currentYearEvents = allEvents.filter(event => 
      new Date(event.date).getFullYear() === currentYear
    );
    
    currentYearEvents.forEach(event => {
      const month = new Date(event.date).getMonth();
      counts[month]++;
    });
    
    return counts;
  }, [currentYear]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Select a Month</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
            title="Back to Home"
          >
            <Home className="w-4 h-4 mr-1.5" />
            Back to home
          </button>
          <button
            onClick={navigateToPrevYear}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-semibold">{currentYear}</span>
          <button
            onClick={navigateToNextYear}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((month, index) => {
          const eventCount = monthEventsCount[index];
          const hasEvents = eventCount > 0;
          
          return (
            <button
              key={month.name}
              onClick={() => handleMonthSelect(index)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
                ${hasEvents 
                  ? 'border-blue-200 hover:border-blue-500 bg-white hover:bg-blue-50' 
                  : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
            >
              <CalendarIcon 
                className={`w-8 h-8 mb-2 ${hasEvents ? 'text-blue-500' : 'text-gray-400'}`} 
              />
              <span className="text-lg font-medium text-gray-900">{month.name}</span>
              {hasEvents && (
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {eventCount} {eventCount === 1 ? 'event' : 'events'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};