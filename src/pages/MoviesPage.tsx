import React, { useState } from "react";
import { movies } from "../data/movies";
import { format, parseISO } from "date-fns";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, FilmIcon, CalendarIcon, ClockIcon, UserGroupIcon, StarIcon } from "@heroicons/react/24/outline";
import { YearDropdown } from "../components/YearDropdown";
import { MovieFilterDropdown } from "../components/MovieFilterDropdown";
import "../styles/dropdown-styles.css";


interface MoviesPageProps {
  onBack: () => void;
}


interface Movie {
  id: string;
  title: string;
  date: string;
  type: "movie" | "upcoming";
  description: string;
  imageUrl?: string;
  director?: string;
  cast?: string[];
  character_name?: string;
  box_office?: string;
  duration?: number;
  isMovie?: boolean;
  original_language?: string;
  _date?: Date;
  year?: number;
}


type ProcessedMovie = Movie & {
  _date: Date;
  year: number;
  month: string;
};


export const MoviesPage: React.FC<MoviesPageProps> = ({ onBack }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [releaseFilter, setReleaseFilter] = useState<'all' | 'released' | 'upcoming'>('all');
  const currentDate = new Date();

  // Click outside handler removed as it's now handled by the MovieFilterDropdown component
  
  // Helper function to safely parse and format dates
  const processMovieDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return {
        _date: date,
        year: date.getFullYear(),
        month: format(date, 'MMMM').toLowerCase()
      };
    } catch (error) {
      // Fallback to current date if parsing fails
      const fallbackDate = new Date();
      return {
        _date: fallbackDate,
        year: fallbackDate.getFullYear(),
        month: format(fallbackDate, 'MMMM').toLowerCase()
      };
    }
  };


  // Process and sort all movies
  const processedMovies = React.useMemo<ProcessedMovie[]>(() => {
    return movies
      .map(movie => {
        try {
          const { _date, year, month } = processMovieDate(movie.date);
          return {
            ...movie,
            _date,
            year,
            month
          } as ProcessedMovie & { month: string };
        } catch (error) {
          console.error(`Error processing movie ${movie.title}:`, error);
          return null;
        }
      })
      .filter((movie): movie is ProcessedMovie & { month: string } => movie !== null);
  }, []);


  // Filter movies based on search query and filters
  const filterMovies = (movieList: ProcessedMovie[]) => {
    let filtered = [...movieList];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(movie => {
        // Search in title
        if (movie.title.toLowerCase().includes(query)) return true;
        
        // Search in character name
        if (movie.character_name?.toLowerCase().includes(query)) return true;
        
        // Search in cast
        if (movie.cast?.some(actor => actor.toLowerCase().includes(query))) return true;
        
        // Search in month
        if (movie.month.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }
    
    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(movie => movie.year === selectedYear);
    }
    
    // Apply release status filter
  // Update the filterMovies function's release status filter section:
if (releaseFilter === 'released') {
  filtered = filtered.filter(movie => 
    movie._date <= currentDate && 
    movie.date && 
    movie.date.toUpperCase() !== 'TBA' &&
    movie.type !== 'upcoming'
  );
} else if (releaseFilter === 'upcoming') {
  filtered = filtered.filter(movie => 
    movie._date > currentDate || 
    !movie.date || 
    movie.date.toUpperCase() === 'TBA' || 
    movie.type === 'upcoming'
  );
}
    
    return filtered;
  };

  // Get unique years for filter dropdown based on current filtered movies
  const availableYears = React.useMemo(() => {
    const years = new Set<number>();
    
    // If we have an active search or filters, get years from filtered movies
    const moviesToProcess = (searchQuery.trim() || selectedYear !== 'all' || releaseFilter !== 'all')
      ? filterMovies(processedMovies)
      : processedMovies;
    
    moviesToProcess.forEach(movie => {
      if (movie.year && !isNaN(movie.year)) {
        years.add(movie.year);
      }
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [processedMovies, searchQuery, selectedYear, releaseFilter]);
  
  // Group movies by year
  const moviesByYear = React.useMemo(() => {
    const groups: Record<number, ProcessedMovie[]> = {};
    
    processedMovies.forEach(movie => {
      if (movie.year !== undefined) {
        if (!groups[movie.year]) {
          groups[movie.year] = [];
        }
        groups[movie.year].push(movie);
      }
    });
    
    return Object.entries(groups)
      .map(([year, movies]) => ({
        year: parseInt(year),
        movies: [...movies].sort((a, b) => a._date.getTime() - b._date.getTime())
      }))
      .sort((a, b) => b.year - a.year);
  }, [processedMovies]);

  // Get upcoming movies - includes movies with future dates, type 'upcoming', or TBA dates
  const upcomingMovies = React.useMemo(() => {
    return filterMovies(processedMovies)
      .filter(movie => {
        // Include if it's explicitly marked as upcoming
        if (movie.type === 'upcoming') return true;
        
        // Include if the date is in the future
        if (movie._date && movie._date > currentDate) return true;
        
        // Include if the date is TBA or invalid
        if (!movie.date || movie.date.toUpperCase() === 'TBA') return true;
        
        return false;
      })
      .sort((a, b) => {
        // Sort TBA dates to the end
        if (!a.date || a.date.toUpperCase() === 'TBA') return 1;
        if (!b.date || b.date.toUpperCase() === 'TBA') return -1;
        
        // Sort by date for dated movies
        return (a._date as Date).getTime() - (b._date as Date).getTime();
      });
  }, [processedMovies, currentDate]);
  
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  
  const closeModal = () => {
    setSelectedMovie(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
          >
            ← Back to home
          </button>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
            Shraddha Kapoor
          </h1>
          <p className="text-slate-400">Filmography & Upcoming Projects</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-3">
          {/* Search Bar - Full Width */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-slate-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title, cast, character, or month..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3">
            {/* Year Filter */}
            <div className="flex-1 min-w-[120px]">
              <YearDropdown
                years={availableYears}
                selectedYear={selectedYear}
                onYearChange={(year) => setSelectedYear(year)}
              />
            </div>

            {/* Release Status Filter */}
            <div className="flex-1 min-w-[140px]">
              <MovieFilterDropdown
                selectedFilter={releaseFilter}
                onFilterChange={setReleaseFilter}
              />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedYear !== 'all' || releaseFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {selectedYear !== 'all' && (
                <div className="flex items-center bg-pink-900/30 text-pink-300 text-sm px-3 py-1.5 rounded-full">
                  <span>Year: {selectedYear}</span>
                  <button 
                    onClick={() => setSelectedYear('all')}
                    className="ml-2 text-pink-400 hover:text-white"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              {releaseFilter === 'upcoming' && (
                <div className="flex items-center bg-pink-900/30 text-pink-300 text-sm px-3 py-1.5 rounded-full">
                  <span>Upcoming</span>
                  <button 
                    onClick={() => setReleaseFilter('all')}
                    className="ml-2 text-pink-400 hover:text-white"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              {releaseFilter === 'released' && (
                <div className="flex items-center bg-pink-900/30 text-pink-300 text-sm px-3 py-1.5 rounded-full">
                  <span>Released</span>
                  <button 
                    onClick={() => setReleaseFilter('all')}
                    className="ml-2 text-pink-400 hover:text-white"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Movies Section */}
        {releaseFilter !== 'released' && upcomingMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-pink-400 border-b border-pink-900 pb-2">
              Upcoming Movies • {upcomingMovies.length}
            </h2>
            <div className="space-y-1 bg-slate-900/50 rounded-xl p-1">
              {upcomingMovies.map((movie) => (
                <MovieListItem 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => handleMovieClick(movie)} 
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Already Released Movies Section */}
        {releaseFilter === 'released' && filterMovies(processedMovies).filter(movie => movie._date <= currentDate).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400 border-b border-emerald-900 pb-2">
              Already Released • {filterMovies(processedMovies).filter(movie => movie._date <= currentDate).length}
            </h2>
            <div className="space-y-1 bg-slate-900/50 rounded-xl p-1">
              {filterMovies(processedMovies)
                .filter(movie => movie._date <= currentDate)
                .map((movie) => (
                <MovieListItem 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => handleMovieClick(movie)} 
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Movies by Year (only show when no specific filter is active) */}
        <div className="space-y-8">
          {releaseFilter === 'all' && moviesByYear
            .map(({ year, movies }) => ({
              year,
              movies: filterMovies(movies)
            }))
            .filter(({ movies }) => movies.length > 0)
            .map(({ year, movies }) => (
            <section key={year}>
              <h2 className="text-xl font-bold mb-3 text-pink-400">
                {year} • {movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}
              </h2>
              <div className="space-y-1 bg-slate-900/50 rounded-xl p-1">
                {movies.map((movie) => (
                  <MovieListItem 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => handleMovieClick(movie)} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal 
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={closeModal} 
      />
    </div>
  );
};


// Movie List Item Component
interface MovieListItemProps {
  movie: Movie & ProcessedMovie;
  onClick: () => void;
}


const MovieListItem = ({ movie, onClick }: MovieListItemProps) => {
  const getFormattedDate = (dateString: string, isUpcoming: boolean = false) => {
    try {
      if (!dateString || dateString.toUpperCase() === 'TBA') {
        return { date: 'TBA', isTBA: true, isUpcoming: true };
      }
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return { date: 'TBA', isTBA: true, isUpcoming: true };
      return {
        date: format(date, 'MMM d, yyyy'),
        isTBA: false,
        isUpcoming: isUpcoming || date > new Date()
      };
    } catch (e) {
      console.error('Error formatting date:', e);
      return { date: 'TBA', isTBA: true };
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  const isUpcoming = movie._date > new Date();


  return (
    <div 
      onClick={onClick}
      className="group flex items-center p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border border-slate-800 hover:border-pink-900/50 hover:shadow-lg hover:shadow-pink-900/10"
    >
      <div className="flex-shrink-0 w-14 h-20 bg-slate-800 rounded-lg overflow-hidden shadow-md group-hover:shadow-pink-900/20 transition-transform">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center';
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                icon.setAttribute('class', 'w-6 h-6 text-slate-600');
                icon.setAttribute('fill', 'none');
                icon.setAttribute('viewBox', '0 0 24 24');
                icon.setAttribute('stroke', 'currentColor');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />';
                fallback.appendChild(icon);
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <FilmIcon className="w-6 h-6 text-slate-600" />
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors truncate">
            {movie.title}
          </h3>
          {movie.type === 'upcoming' && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-pink-900/30 text-pink-300">
              Upcoming
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center mt-1 text-sm text-slate-400">
          <div className="flex items-center">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-pink-400/80" />
            <span className="mr-1">{getFormattedDate(movie.date, isUpcoming).date}</span>
            {isUpcoming && (
              <span className="text-xs bg-pink-900/30 text-pink-300 px-1.5 py-0.5 rounded-full">
                Expected
              </span>
            )}
          </div>
          
          {!isUpcoming && movie.duration && (
            <>
              <span className="mx-2 text-slate-600">•</span>
              <div className="flex items-center">
                <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-pink-400/80" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
            </>
          )}
          
          {movie.character_name && (
            <>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-pink-300/80">as {movie.character_name}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="text-slate-500 group-hover:text-pink-400 ml-2 transition-colors">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transform transition-transform group-hover:translate-x-1"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  );
};


// Movie Detail Modal Component
const MovieDetailModal: React.FC<{ movie: Movie | null; isOpen: boolean; onClose: () => void }> = ({ movie, isOpen, onClose }) => {
  const getFormattedDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'Release date not available';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Release date not available';
    }
  };


  const formatDuration = (minutes?: number, isUpcoming: boolean = false) => {
    if (!minutes || isUpcoming) return 'TBA';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };


  if (!movie) return null;
  
  return (
    <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-slate-900 text-left align-middle shadow-xl transition-all">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="relative w-full overflow-hidden bg-slate-800">
                <div className="w-full h-96 sm:h-[32rem] md:h-[36rem]">
                  {movie.imageUrl ? (
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="h-full w-full object-contain object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop if the fallback also fails
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.image-fallback');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className={`image-fallback absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 ${movie.imageUrl ? 'hidden' : 'flex'}`}>
                    <div className="text-center p-4">
                      <FilmIcon className="mx-auto mb-3 h-16 w-16 text-pink-500/30" />
                      <p className="text-sm text-slate-400">No image available</p>
                      <p className="mt-1 text-xs text-slate-600">{movie.title}</p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="p-6">
                {movie.character_name && (
                  <p className="text-pink-400 text-lg font-medium mb-4">as {movie.character_name}</p>
                )}
                <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-pink-500" />
                    <span>{getFormattedDate(movie.date)}</span>
                  </div>
                  {movie.duration && (
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-pink-500" />
                      <span>{formatDuration(movie.duration, movie?._date && movie._date > new Date())}</span>
                    </div>
                  )}
                  {movie.director && (
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5 text-pink-500" />
                      <span>Dir. {movie.director}</span>
                    </div>
                  )}
                  {movie.box_office && (
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-pink-500" />
                      <span>Box Office: {movie.box_office}</span>
                    </div>
                  )}
                </div>


                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-white">Overview</h4>
                    <p className="text-slate-300">{movie.description}</p>
                  </div>


                  {movie.cast && movie.cast.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-lg font-semibold text-white">Cast</h4>
                      <div className="flex flex-wrap gap-2">
                        {movie.cast.map((actor, index) => (
                          <span 
                            key={index}
                            className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};


export default MoviesPage;
