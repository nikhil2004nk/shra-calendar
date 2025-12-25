import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface MovieFilterDropdownProps {
  selectedFilter: 'all' | 'released' | 'upcoming';
  onFilterChange: (filter: 'all' | 'released' | 'upcoming') => void;
  className?: string;
}

export const MovieFilterDropdown: React.FC<MovieFilterDropdownProps> = ({
  selectedFilter,
  onFilterChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or when scrolling outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      // Only close if the scroll event is not inside our dropdown
      if (isOpen && !dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // Use passive: false to be able to check event target
    document.addEventListener('scroll', handleScroll, { capture: true, passive: false });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSelect = (filter: 'all' | 'released' | 'upcoming') => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  const getDisplayText = (filter: string) => {
    switch (filter) {
      case 'all': return 'All Movies';
      case 'released': return 'Released';
      case 'upcoming': return 'Upcoming';
      default: return 'All Movies';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
      >
        <span>{getDisplayText(selectedFilter)}</span>
        <ChevronDownIcon 
          className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {(['all', 'released', 'upcoming'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterSelect(filter)}
                className={`w-full px-4 py-2 text-left hover:bg-slate-700/50 flex items-center justify-between ${
                  selectedFilter === filter ? 'bg-pink-900/50 text-pink-300' : 'text-slate-200'
                }`}
              >
                <span>{getDisplayText(filter)}</span>
                {selectedFilter === filter && <CheckIcon className="h-4 w-4 text-pink-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
