import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import ContentFilters from "@/components/ContentFilters";
import { getTVGenres, discoverTVShows } from "@/lib/tmdb";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

const TVShows = () => {
  const { t } = useLanguage();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: genres = [] } = useQuery({
    queryKey: ["tvGenres"],
    queryFn: getTVGenres,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["discoverTVShows", selectedGenre, sortBy, selectedYear, selectedRating],
    queryFn: ({ pageParam = 1 }) => discoverTVShows({
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

  const shows = data?.pages.flatMap(page => page.results) ?? [];

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
          {t('nav.tvShows')}
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
              {shows.map((show, index) => (
                <ContentCard
                  key={`${show.id}-${index}`}
                  id={show.id}
                  title={show.name}
                  posterPath={show.poster_path}
                  rating={show.vote_average}
                  type="tv"
                  year={show.first_air_date?.split("-")[0]}
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

export default TVShows;
