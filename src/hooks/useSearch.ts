import { useMemo, useState, useCallback } from "react";
import type { CalendarItem } from "../utils/types";
import { filterItems, getAvailableFilters } from "../utils/filterUtils";
import type { FilterOptions } from "../utils/filterUtils";

type UseSearchOptions = Omit<FilterOptions, 'query'>;

export const useSearch = (items: CalendarItem[], initialOptions: UseSearchOptions = {}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<UseSearchOptions>(initialOptions);

  const updateFilter = useCallback(<K extends keyof UseSearchOptions>(
    key: K,
    value: UseSearchOptions[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setFilters(initialOptions);
  }, [initialOptions]);

  const results = useMemo(() => {
    return filterItems(items, { ...filters, query });
  }, [items, query, filters]);

  const { types, years } = useMemo(() => {
    return getAvailableFilters(items);
  }, [items]);

  return {
    // Search state
    query,
    setQuery,
    results,
    
    // Filters state
    filters,
    updateFilter,
    resetFilters,
    
    // Available filter options
    availableTypes: types,
    availableYears: years,
    
    // Helper methods
    hasActiveFilters: Boolean(
      query || 
      (filters.types && filters.types.length > 0) ||
      (filters.months && filters.months.length > 0) ||
      filters.year
    ),
  };
};
