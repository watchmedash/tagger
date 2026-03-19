import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Film, Tv, LayoutGrid, Search as SearchIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import { searchMulti } from "@/lib/tmdb";

type FilterType = "all" | "movie" | "tv";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [filter, setFilter] = useState<FilterType>("all");
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMulti(query),
    enabled: !!query,
  });

  const filteredResults = results?.filter((item) => {
    if (filter === "all") return true;
    return item.media_type === filter;
  });

  const movieCount = results?.filter((r) => r.media_type === "movie").length || 0;
  const tvCount = results?.filter((r) => r.media_type === "tv").length || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12 flex-1">
        <h1 className="text-2xl md:text-4xl font-display tracking-wide text-foreground mb-2">
          Search Results
        </h1>
        {/* Mobile Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search movies and TV shows..."
              className="w-full bg-secondary border border-border rounded-lg pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        <p className="text-muted-foreground mb-6">
          {query ? `Showing results for "${query}"` : "Start typing to search"}
        </p>

        {/* Filter Buttons */}
        {results && results.length > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              All ({results.length})
            </button>
            <button
              onClick={() => setFilter("movie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "movie"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <Film className="w-4 h-4" />
              Movies ({movieCount})
            </button>
            <button
              onClick={() => setFilter("tv")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "tv"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <Tv className="w-4 h-4" />
              TV Shows ({tvCount})
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-card rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : filteredResults && filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title || item.name || "Unknown"}
                posterPath={item.poster_path}
                rating={item.vote_average}
                type={item.media_type}
                year={(item.release_date || item.first_air_date)?.split("-")[0]}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No results found for "{query}"
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Try searching for something else
            </p>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
