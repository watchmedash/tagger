import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentFilters from "@/components/ContentFilters";
import { getMovieGenres, discoverMovies } from "@/lib/tmdb";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

const Movies = () => {
  const { t } = useLanguage();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: genres = [] } = useQuery({
    queryKey: ["movieGenres"],
    queryFn: getMovieGenres,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["discoverMovies", selectedGenre, sortBy, selectedYear, selectedRating],
    queryFn: ({ pageParam = 1 }) => discoverMovies({
      genre: selectedGenre || undefined,
      sortBy,
      year: selectedYear || undefined,
      rating: selectedRating || undefined,
      page: pageParam,
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 20) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const movies = data?.pages.flatMap(page => page.results) ?? [];

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12 flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-display tracking-wide text-foreground mb-4 md:mb-6">
          {t('nav.movies')}
        </h1>

        <ContentFilters
          genres={genres}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          selectedYear={selectedYear}
          selectedRating={selectedRating}
          onGenreChange={setSelectedGenre}
          onSortChange={setSortBy}
          onYearChange={setSelectedYear}
          onRatingChange={setSelectedRating}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-card rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {movies.map((movie, index) => (
                <ContentCard
                  key={`${movie.id}-${index}`}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  rating={movie.vote_average}
                  type="movie"
                  year={movie.release_date?.split("-")[0]}
                />
              ))}
            </div>

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Loading more...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
