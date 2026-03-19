import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { getBackdropUrl, SearchResult } from "@/lib/tmdb";
import { useLanguage } from "@/hooks/useLanguage";

interface HeroBannerProps {
  item: SearchResult;
}

const HeroBanner = ({ item }: HeroBannerProps) => {
  const { t } = useLanguage();
  const title = item.title || item.name || "Unknown";
  const linkTo = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <div className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(item.backdrop_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 lg:px-12">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-display tracking-wider text-foreground text-shadow mb-4">
            {title}
          </h1>
          <p className="text-sm lg:text-base text-foreground/90 line-clamp-3 mb-6 max-w-lg text-shadow">
            {item.overview}
          </p>
          <div className="flex items-center gap-3">
            <Link to={linkTo} className="btn-primary flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              <span className="font-body">{t('hero.play')}</span>
            </Link>
            <Link to={linkTo} className="btn-secondary flex items-center gap-2">
              <Info className="w-5 h-5" />
              <span className="font-body">{t('hero.moreInfo')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
