import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Calendar, Download, Plus, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeSelector from "@/components/EpisodeSelector";
import ContentCard from "@/components/ContentCard";
import CastSection from "@/components/CastSection";
import ReviewsSection from "@/components/ReviewsSection";
import ServerSelector from "@/components/ServerSelector";
import TrailerButton from "@/components/TrailerButton";
import { getTVShowDetails, getBackdropUrl, getSimilarTVShows, getTVCredits, getTVReviews } from "@/lib/tmdb";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useLanguage } from "@/hooks/useLanguage";
import { useMyList } from "@/hooks/useMyList";
import { Button } from "@/components/ui/button";

const tvServers = [
  { name: "Server 1", getUrl: (id: number, s: number, e: number) => `https://vidsrcme.su/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  { name: "Server 2", getUrl: (id: number, s: number, e: number) => `https://zxcstream.xyz/player/tv/${id}/${s}/${e}` },
  { name: "Server 3", getUrl: (id: number, s: number, e: number) => `https://moviesapi.to/tv/${id}-${s}-${e}` },
  { name: "Server 4", getUrl: (id: number, s: number, e: number) => `https://vidsrc.vip/embed/tv/${id}/${s}/${e}` },
  { name: "Server 5", getUrl: (id: number, s: number, e: number) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  { name: "Server 6", getUrl: (id: number, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
];

const TVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { addToHistory } = useWatchHistory();
  const { t } = useLanguage();
  const { isInList, toggleItem } = useMyList();
  const [selectedServer, setSelectedServer] = useState(0);

  const initialSeason = Number(searchParams.get("season")) || 1;
  const initialEpisode = Number(searchParams.get("episode")) || 1;

  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

  const { data: tvShow, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVShowDetails(Number(id)),
    enabled: !!id,
  });

  const { data: similarShows } = useQuery({
    queryKey: ["similarTVShows", id],
    queryFn: () => getSimilarTVShows(Number(id)),
    enabled: !!id,
  });

  const { data: credits } = useQuery({
    queryKey: ["tvCredits", id],
    queryFn: () => getTVCredits(Number(id)),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["tvReviews", id],
    queryFn: () => getTVReviews(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (tvShow) {
      addToHistory({
        id: tvShow.id,
        type: "tv",
        title: tvShow.name,
        posterPath: tvShow.poster_path,
        backdropPath: tvShow.backdrop_path,
        rating: tvShow.vote_average,
        year: tvShow.first_air_date?.split("-")[0],
        season: currentSeason,
        episode: currentEpisode,
      });
    }
  }, [tvShow, currentSeason, currentEpisode, addToHistory]);

  const handleEpisodeSelect = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 px-4 md:px-12">
          <div className="h-8 w-32 bg-card rounded animate-pulse mb-8" />
          <div className="aspect-video bg-card rounded-lg animate-pulse mb-8" />
          <div className="h-12 w-96 bg-card rounded animate-pulse mb-4" />
          <div className="h-24 w-full max-w-2xl bg-card rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('detail.tvNotFound')}</p>
      </div>
    );
  }

  const embedUrl = tvServers[selectedServer].getUrl(tvShow.id, currentSeason, currentEpisode);
  const year = tvShow.first_air_date?.split("-")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img
          src={getBackdropUrl(tvShow.backdrop_path)}
          alt={tvShow.name}
          className="w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 pt-20 px-4 md:px-12 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('content.backToBrowse')}</span>
        </Link>

        <div className="max-w-6xl mx-auto">
          <ServerSelector
            servers={tvServers}
            selectedIndex={selectedServer}
            onSelect={setSelectedServer}
          />
          <VideoPlayer embedUrl={embedUrl} title={`${tvShow.name} S${currentSeason}E${currentEpisode}`} />

          <div className="mt-8">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-display tracking-wide text-foreground">
                {tvShow.name}
              </h1>
              <span className="text-lg text-muted-foreground font-body">
                S{currentSeason} E{currentEpisode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{tvShow.vote_average.toFixed(1)}</span>
              </div>
              {year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              )}
              {tvShow.number_of_seasons && (
                <span>{tvShow.number_of_seasons} {t('common.seasons')}</span>
              )}
              {tvShow.genres && (
                <div className="flex items-center gap-2">
                  {tvShow.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 bg-secondary rounded-full text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <TrailerButton id={tvShow.id} type="tv" title={tvShow.name} />
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(`https://dl.vidsrc.vip/tv/${tvShow.id}/${currentSeason}/${currentEpisode}`, '_blank')}
              >
                <Download className="w-4 h-4" />
                {t('detail.download')}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toggleItem({
                  id: tvShow.id,
                  title: tvShow.name,
                  posterPath: tvShow.poster_path,
                  rating: tvShow.vote_average,
                  type: "tv",
                })}
              >
                {isInList(tvShow.id, "tv") ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isInList(tvShow.id, "tv") ? t('myList.inMyList') : t('myList.addToList')}
              </Button>
            </div>

            <p className="text-foreground/80 max-w-3xl leading-relaxed mt-4 mb-8">
              {tvShow.overview}
            </p>

            {credits && <CastSection credits={credits} />}

            {reviews && <ReviewsSection reviews={reviews} />}

            {tvShow.seasons && (
              <EpisodeSelector
                tvId={tvShow.id}
                seasons={tvShow.seasons}
                currentSeason={currentSeason}
                currentEpisode={currentEpisode}
                onSelect={handleEpisodeSelect}
              />
            )}
          </div>

          {/* Similar TV Shows */}
          {similarShows && similarShows.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-display tracking-wide text-foreground">
                  {t('content.moreLikeThis')}
                </h2>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10" />
                <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 pt-2 px-2 -mx-2">
                  {similarShows.slice(0, 12).map((similar, index) => (
                    <div
                      key={similar.id}
                      className="flex-shrink-0 w-[160px] md:w-[200px] transform transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ContentCard
                        id={similar.id}
                        title={similar.name}
                        posterPath={similar.poster_path}
                        rating={similar.vote_average}
                        type="tv"
                        year={similar.first_air_date?.split("-")[0]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TVDetail;
