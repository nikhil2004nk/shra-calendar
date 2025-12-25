import type { CalendarItem } from "./types";

export type FilterOptions = {
  query?: string;
  types?: string[];
  months?: number[];
  year?: number;
  sortBy?: 'date' | 'title' | 'type';
  sortOrder?: 'asc' | 'desc';
};

export const filterByMonth = (items: CalendarItem[], month: number) =>
  items.filter((item) => item.month === month);

export const filterItems = (items: CalendarItem[], options: FilterOptions = {}): CalendarItem[] => {
  const {
    query = '',
    types = [],
    months = [],
    year,
    sortBy = 'date',
    sortOrder = 'asc'
  } = options;

  let filtered = [...items];
  const searchQuery = query.trim().toLowerCase();

  // Apply search query filter
  if (searchQuery) {
    filtered = filtered.filter((item) => {
      // Search in all relevant fields
      const searchText = [
        item.title,
        item.title2,
        item.type,
        item.description,
        item.meta?.baseMovieId || '',
        item.meta?.originalDate || ''
      ].join(' ').toLowerCase();

      // Split query into terms and check if all terms match
      const searchTerms = searchQuery.split(/\s+/);
      return searchTerms.every(term => searchText.includes(term));
    });
  }

  // Filter by type
  if (types.length > 0) {
    filtered = filtered.filter(item => types.includes(item.type));
  }

  // Filter by month
  if (months.length > 0) {
    filtered = filtered.filter(item => months.includes(item.month));
  }

  // Filter by year (if item has a date)
  if (year) {
    filtered = filtered.filter(item => {
      const itemYear = new Date(item.date).getFullYear();
      return itemYear === year;
    });
  }

  // Sort the results
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'date':
      default: {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        comparison = dateA - dateB;
        break;
      }
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

// For backward compatibility
export const filterByQuery = (items: CalendarItem[], query: string) => 
  filterItems(items, { query });

export const getAvailableFilters = (items: CalendarItem[]) => {
  const types = new Set<string>();
  const years = new Set<number>();

  items.forEach(item => {
    types.add(item.type);
    const year = new Date(item.date).getFullYear();
    years.add(year);
  });

  return {
    types: Array.from(types).sort(),
    years: Array.from(years).sort((a, b) => b - a) // Most recent first
  };
};
