import rawMovies from "./movies/movies-2026.json";
import type { BaseMovie } from "../utils/types";

export const movies: BaseMovie[] = rawMovies;

export const getMovieById = (id: string): BaseMovie | undefined =>
  movies.find((m) => m.id === id);
