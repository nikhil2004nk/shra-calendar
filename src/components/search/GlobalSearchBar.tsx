import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { FilterOptions } from '../../utils/filterUtils';

interface GlobalSearchBarProps {
  query: string;
  filters: Omit<FilterOptions, 'query'>;
  availableTypes: string[];
  availableYears: number[];
  onQueryChange: (query: string) => void;
  onFilterChange: <K extends keyof Omit<FilterOptions, 'query'>>(
    key: K, 
    value: Omit<FilterOptions, 'query'>[K]
  ) => void;
  onClearFilters: () => void;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  query,
  filters,
  availableTypes,
  availableYears,
  onQueryChange,
  onFilterChange,
  onClearFilters,
  className = ''
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside or scrolling
  useEffect(() => {
    if (!isFilterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    const handleScroll = () => {
      setIsFilterOpen(false);
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isFilterOpen]); // Only re-run if isFilterOpen changes

  const toggleType = (type: string) => {
    const newTypes = filters.types?.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...(filters.types || []), type];
    onFilterChange('types', newTypes);
  };

  const toggleYear = (year: number) => {
    onFilterChange('year', filters.year === year ? undefined : year);
  };

  const toggleSort = (sortBy: 'date' | 'title' | 'type') => {
    if (filters.sortBy === sortBy) {
      // Toggle sort order if clicking the same sort option
      onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field with default ascending order
      onFilterChange('sortBy', sortBy);
      onFilterChange('sortOrder', 'asc');
    }
  };

  const hasActiveFilters = Boolean(
    query || 
    (filters.types && filters.types.length > 0) ||
    filters.year ||
    filters.sortBy
  );

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by movie, event, or type..."
            className="block w-full pl-10 pr-12 py-2.5 border border-slate-700 rounded-full bg-slate-900/70 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
                className="p-1 text-xs text-slate-400 hover:text-white focus:outline-none"
                title="Clear all filters"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-1.5 rounded-full ${hasActiveFilters ? 'text-pink-500' : 'text-slate-500'} hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500`}
              aria-label="Filter options"
            >
              <FiFilter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div 
            ref={filterRef}
            className="absolute z-10 mt-2 w-full bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-2">Filter by Type</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1 text-xs rounded-full border ${
                        filters.types?.includes(type)
                          ? 'bg-pink-600/20 border-pink-500 text-pink-400'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-2">Filter by Year</h3>
                <div className="flex flex-wrap gap-2">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => toggleYear(year)}
                      className={`px-3 py-1 text-xs rounded-full border ${
                        filters.year === year
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-2">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'date', label: 'Date' },
                    { id: 'title', label: 'Title' },
                    { id: 'type', label: 'Type' },
                  ].map(({ id, label }) => {
                    const isActive = filters.sortBy === id;
                    const isAsc = filters.sortOrder === 'asc';
                    
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleSort(id as 'date' | 'title' | 'type')}
                        className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1 ${
                          isActive
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                            : 'border-slate-700 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        {label}
                        {isActive && (
                          isAsc ? (
                            <FiChevronUp className="h-3 w-3" />
                          ) : (
                            <FiChevronDown className="h-3 w-3" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(filters.types?.length || filters.year || filters.sortBy) && (
                <div className="pt-2 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <FiX className="h-3.5 w-3.5" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {query && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-900/50 text-pink-300">
              Search: {query}
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-pink-800/50 hover:bg-pink-700/50 focus:outline-none"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          
          {filters.types?.map((type) => (
            <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-900/50 text-pink-300">
              {type}
              <button
                type="button"
                onClick={() => {
                  const newTypes = filters.types?.filter(t => t !== type) || [];
                  onFilterChange('types', newTypes);
                }}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-pink-800/50 hover:bg-pink-700/50 focus:outline-none"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          
          {filters.year && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
              Year: {filters.year}
              <button
                type="button"
                onClick={() => onFilterChange('year', undefined)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-800/50 hover:bg-blue-700/50 focus:outline-none"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          
          {filters.sortBy && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
              Sorted by: {filters.sortBy} ({filters.sortOrder})
              <button
                type="button"
                onClick={() => {
                  onFilterChange('sortBy', undefined);
                  onFilterChange('sortOrder', 'asc');
                }}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-800/50 hover:bg-blue-700/50 focus:outline-none"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
