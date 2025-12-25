import type { CalendarItem, CalendarItemType } from "../utils/types";

type DatedMovie = 
  | { date: string; id: string; title: string; description: string }
  | { release_date: string; id: number | string; title: string; overview: string }
  | { releaseDate: string; id: string; title: string; description: string };

const parseDateParts = (dateStr: string) => {
  if (!dateStr) return { year: 0, month: 0, day: 0 };
  const parts = dateStr.split("-");
  if (parts.length !== 3) return { year: 0, month: 0, day: 0 };
  const [year, month, day] = parts.map(Number);
  return { year, month, day };
};

export const buildDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getMovieAnniversariesForYear = (
  movies: DatedMovie[],
  targetYear: number
): CalendarItem[] => {
  const result: CalendarItem[] = [];

  for (const movie of movies) {
    let dateStr: string | undefined;
    if ('date' in movie) {
      dateStr = movie.date;
    } else if ('release_date' in movie) {
      dateStr = movie.release_date;
    } else if ('releaseDate' in movie) {
      dateStr = movie.releaseDate;
    }
    
    if (!dateStr) continue;
    const description = 'description' in movie ? movie.description : movie.overview;
    const movieId = String(movie.id);
    const { year: releaseYear, month, day } = parseDateParts(dateStr);
    if (!releaseYear || !month || !day) continue;

    if (targetYear <= releaseYear) continue;

    const yearsDiff = targetYear - releaseYear;
    const date = buildDateKey(targetYear, month, day);

    result.push({
      id: `${movieId}-anniv-${targetYear}`,
      title: `${yearsDiff} years of ${movie.title}`,
      date,
      month,
      type: 'movie-anniversary' as CalendarItemType,
      description: description || `Celebrating ${yearsDiff} years since the release of "${movie.title}".`,
      meta: {
        baseMovieId: movieId,
        anniversaryYears: yearsDiff
      }
    });

  }

  return result;
};

export const getAwardAnniversariesForYear = (
  awards: Array<{ id: string; title: string; date: string; description: string }>,
  targetYear: number
): CalendarItem[] => {
  const result: CalendarItem[] = [];

  for (const award of awards) {
    const { year: awardYear, month, day } = parseDateParts(award.date);
    if (!awardYear || !month || !day) continue;
    
    if (targetYear < awardYear) continue; // Skip future years
    
    const yearsAgo = targetYear - awardYear;
    const date = buildDateKey(targetYear, month, day);
    
   // In getAwardAnniversariesForYear function
// In getAwardAnniversariesForYear function
// In getAwardAnniversariesForYear function
result.push({
  id: `${award.id}-${targetYear}`,
  title: award.title,
  date,
  originalDate: award.date, // Preserve original date
  month,
  type: 'function' as const,
  meta: {
    anniversaryYears: yearsAgo > 0 ? yearsAgo : undefined,
    originalDate: award.date // Keep in meta for backward compatibility
  },
  description: award.description,
});
  }

  return result;
};
