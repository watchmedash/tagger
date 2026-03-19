import { useState, useEffect } from "react";
import { ChevronDown, Play } from "lucide-react";
import { getSeasonDetails, getImageUrl, Episode, Season } from "@/lib/tmdb";
import { useLanguage } from "@/hooks/useLanguage";

interface EpisodeSelectorProps {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onSelect: (season: number, episode: number) => void;
}

const EpisodeSelector = ({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
  onSelect,
}: EpisodeSelectorProps) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const { t } = useLanguage();

  // Filter out season 0 (specials)
  const validSeasons = seasons.filter((s) => s.season_number > 0);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const data = await getSeasonDetails(tvId, currentSeason);
        // Filter out unreleased episodes
        const today = new Date().toISOString().split("T")[0];
        const releasedEpisodes = data.episodes.filter(
          (ep) => ep.air_date && ep.air_date <= today
        );
        setEpisodes(releasedEpisodes);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
      setLoading(false);
    };
    fetchEpisodes();
  }, [tvId, currentSeason]);

  return (
    <div className="space-y-4">
      {/* Season Selector */}
      <div className="relative">
        <button
          onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
          className="flex items-center justify-between w-full md:w-64 bg-secondary border border-border rounded-md px-4 py-3 text-foreground hover:bg-muted transition-colors"
        >
          <span className="font-medium">{t('common.season')} {currentSeason}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              seasonDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {seasonDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-card border border-border rounded-md shadow-xl z-20 max-h-64 overflow-y-auto">
            {validSeasons.map((season) => (
              <button
                key={season.id}
                onClick={() => {
                  onSelect(season.season_number, 1);
                  setSeasonDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                  season.season_number === currentSeason
                    ? "bg-primary/20 text-primary"
                    : "text-foreground"
                }`}
              >
                <div className="font-medium">{season.name}</div>
                <div className="text-sm text-muted-foreground">
                  {season.episode_count} {t('detail.episodes')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episodes List */}
      <div className="space-y-2">
        <h3 className="text-lg font-display tracking-wide text-foreground">
          {t('detail.episodes')}
        </h3>
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-card rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {episodes.map((episode) => (
              <button
                key={episode.id}
                onClick={() => onSelect(currentSeason, episode.episode_number)}
                className={`flex gap-4 p-3 rounded-md transition-all text-left group ${
                  episode.episode_number === currentEpisode
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <div className="relative flex-shrink-0 w-32 aspect-video bg-muted rounded overflow-hidden">
                  {episode.still_path ? (
                    <img
                      src={getImageUrl(episode.still_path, "w300")}
                      alt={episode.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  {episode.episode_number === currentEpisode && (
                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary-foreground fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {episode.episode_number}.
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {episode.name}
                    </span>
                  </div>
                  {episode.runtime && (
                    <span className="text-xs text-muted-foreground">
                      {episode.runtime}{t('common.min')}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {episode.overview || t('detail.noDescription')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeSelector;
