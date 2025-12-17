import type { BaseMovie, CalendarItem } from "../utils/types";

const parseDateParts = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
};

export const buildDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getMovieAnniversariesForYear = (
  movies: BaseMovie[],
  targetYear: number
): CalendarItem[] => {
  const result: CalendarItem[] = [];

  for (const movie of movies) {
    const { year: releaseYear, month, day } = parseDateParts(movie.date);
    if (!releaseYear || !month || !day) continue;

    if (targetYear <= releaseYear) continue;

    const yearsDiff = targetYear - releaseYear;
    const date = buildDateKey(targetYear, month, day);

   result.push({
  id: `${movie.id}-anniv-${targetYear}`,
  title: `${yearsDiff} years of ${movie.title}`,
  date,
  month,
  type: "movie-anniversary",
  description: `Celebrating ${yearsDiff} years since the release of "${movie.title}".`,
  meta: {
    baseMovieId: movie.id,
    anniversaryYears: yearsDiff
  }
});

  }

  return result;
};
