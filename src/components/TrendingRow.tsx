import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/lib/tmdb";
import { useMyList } from "@/hooks/useMyList";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  media_type?: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
}

interface TrendingRowProps {
  title: string;
  items: TrendingItem[];
}

const TrendingRow = ({ title, items }: TrendingRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getYear = (item: TrendingItem) => {
    const date = item.release_date || item.first_air_date;
    return date ? date.split("-")[0] : undefined;
  };

  return (
    <div className="relative group/row py-4">
      <h2 className="text-xl lg:text-2xl font-display tracking-wide text-foreground px-4 lg:px-12 mb-3">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-4 z-10 w-12 bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8 text-foreground" />
        </button>
        <div ref={rowRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 px-4 lg:px-12">
          {(items || []).slice(0, 10).map((item, index) => (
            <TrendingCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || "Unknown"}
              posterPath={item.poster_path}
              type={item.media_type || "movie"}
              rank={index + 1}
            />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-4 z-10 w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8 text-foreground" />
        </button>
      </div>
    </div>
  );
};

interface TrendingCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  type: "movie" | "tv";
  rank: number;
}

const TrendingCard = ({ id, title, posterPath, type, rank }: TrendingCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const linkTo = type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const { isInList, toggleItem } = useMyList();
  const inList = isInList(id, type);

  const handleToggleList = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleItem({ id, title, posterPath, type });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          to={linkTo}
          className="content-card group flex-shrink-0 relative"
        >
          <div className="flex items-end">
            {/* Netflix-style rank number */}
            <span
              className="relative z-10 font-bold text-[44px] lg:text-[56px] leading-none select-none pointer-events-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px hsl(var(--muted-foreground))",
                fontFamily: "Arial Black, sans-serif",
              }}
            >
              {rank}
            </span>

            <div className="relative -ml-3 w-[90px] lg:w-[110px] aspect-[2/3] bg-card rounded-md overflow-hidden" style={{ zIndex: 0 }}>
              {/* Loading spinner */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-card">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Poster Image */}
              <img
                src={imageError ? "/placeholder.svg" : getImageUrl(posterPath)}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
              />

              {/* Add button - always visible */}
              <button
                onClick={handleToggleList}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-all z-10 ${
                  inList
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/70 text-foreground"
                }`}
              >
                {inList ? (
                  <Trash2 className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </button>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

              {/* Play button - only on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-4 h-4 text-primary-foreground fill-current" />
                </div>
              </div>

            </div>
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleToggleList()}>
          {inList ? (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove from Watchlist
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Watchlist
            </>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TrendingRow;
