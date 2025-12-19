import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface YearDropdownProps {
  years: number[];
  selectedYear: number | 'all';
  onYearChange: (year: number | 'all') => void;
  className?: string;
}

export const YearDropdown: React.FC<YearDropdownProps> = ({
  years,
  selectedYear,
  onYearChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleYearSelect = (year: number | 'all') => {
    onYearChange(year);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
      >
        <span>{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
        <ChevronDownIcon 
          className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <button
              key="all"
              onClick={() => handleYearSelect('all')}
              className={`w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center justify-between ${
                selectedYear === 'all' ? 'bg-pink-900/50 text-pink-300' : 'text-slate-200'
              }`}
            >
              <span>All Years</span>
              {selectedYear === 'all' && <CheckIcon className="h-4 w-4 text-pink-400" />}
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center justify-between ${
                  selectedYear === year ? 'bg-pink-900/50 text-pink-300' : 'text-slate-200'
                }`}
              >
                <span>{year}</span>
                {selectedYear === year && <CheckIcon className="h-4 w-4 text-pink-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
