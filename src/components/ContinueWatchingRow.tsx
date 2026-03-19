import { Link } from "react-router-dom";
import { Play, Star, X } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchHistory, WatchHistoryItem } from "@/hooks/useWatchHistory";
import { useLanguage } from "@/hooks/useLanguage";

const ContinueWatchingRow = () => {
  const { watchHistory, removeFromHistory } = useWatchHistory();
  const { t } = useLanguage();

  if (watchHistory.length === 0) return null;

  return (
    <div className="px-4 lg:px-12 mb-8 mt-6">
      <h2 className="text-xl lg:text-2xl font-display tracking-wide text-foreground mb-4">
        {t('content.continueWatching')}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {watchHistory
          .filter((item) => item && item.title)
          .map((item) => (
            <ContinueWatchingCard
              key={`${item.type}-${item.id}`}
              item={item}
              onRemove={() => removeFromHistory(item.id, item.type)}
            />
          ))}
      </div>
    </div>
  );
};

interface CardProps {
  item: WatchHistoryItem;
  onRemove: () => void;
}

const ContinueWatchingCard = ({ item, onRemove }: CardProps) => {
  const linkTo =
    item.type === "movie"
      ? `/movie/${item.id}`
      : `/tv/${item.id}?season=${item.season || 1}&episode=${item.episode || 1}`;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <Link
      to={linkTo}
      className="group flex-shrink-0 w-[280px] lg:w-[320px] relative"
    >
      <div className="relative aspect-video bg-card rounded-md overflow-hidden">
        <img
          src={getImageUrl(item.backdropPath || item.posterPath, "w780")}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/70 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary/90 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-8 h-8 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {item.title || "Unknown"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-muted-foreground">{(item.rating ?? 0).toFixed(1)}</span>
            {item.type === "tv" && item.season && item.episode && (
              <span className="text-xs text-primary font-medium">
                S{item.season} E{item.episode}
              </span>
            )}
            {item.type === "movie" && item.year && (
              <span className="text-xs text-muted-foreground">• {item.year}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContinueWatchingRow;
