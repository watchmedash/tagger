import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Star, Loader2, Plus, Trash2 } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { useMyList } from "@/hooks/useMyList";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ContentCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  type: "movie" | "tv";
  year?: string;
}

const ContentCard = ({ id, title, posterPath, rating, type, year }: ContentCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const linkTo = type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const { isInList, toggleItem } = useMyList();
  const inList = isInList(id, type);

  const handleToggleList = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleItem({ id, title, posterPath, rating, type, year });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          to={linkTo}
          className="content-card group flex-shrink-0 w-[140px] lg:w-[180px]"
        >
          <div className="relative aspect-[2/3] bg-card rounded-md overflow-hidden">
            {/* Loading spinner */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-card">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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

            {/* Add/Remove button - always visible */}
            <button
              onClick={handleToggleList}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all z-10 ${
                inList
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/70 text-foreground"
              }`}
            >
              {inList ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>

            {/* Overlay gradient - always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

            {/* Play button - only on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-primary rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 text-primary-foreground fill-current" />
              </div>
            </div>

            {/* Title - only on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs lg:text-sm font-medium text-foreground line-clamp-2 text-shadow">
                {title}
              </p>
            </div>

            {/* Rating and year - always visible */}
            <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3 group-hover:opacity-0 transition-opacity duration-300">
              <div className="flex items-center gap-1 lg:gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-muted-foreground">{rating?.toFixed(1) ?? 'N/A'}</span>
                {year && <span className="text-xs text-muted-foreground">• {year}</span>}
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

export default ContentCard;
