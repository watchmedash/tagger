import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Clock, Calendar, Download, Plus, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ContentCard from "@/components/ContentCard";
import CastSection from "@/components/CastSection";
import ReviewsSection from "@/components/ReviewsSection";
import ServerSelector from "@/components/ServerSelector";
import TrailerButton from "@/components/TrailerButton";
import { getMovieDetails, getBackdropUrl, getSimilarMovies, getMovieCredits, getMovieReviews } from "@/lib/tmdb";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useLanguage } from "@/hooks/useLanguage";
import { useMyList } from "@/hooks/useMyList";
import { Button } from "@/components/ui/button";

const movieServers = [
  { name: "Server 1", getUrl: (id: number) => `https://vsembed.su/embed/movie/${id}` },
  { name: "Server 2", getUrl: (id: number) => `https://zxcstream.xyz/player/movie/${id}` },
  { name: "Server 3", getUrl: (id: number) => `https://moviesapi.to/movie/${id}` },
  { name: "Server 4", getUrl: (id: number) => `https://vidsrc.vip/embed/movie/${id}` },
  { name: "Server 5", getUrl: (id: number) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { name: "Server 6", getUrl: (id: number) => `https://vidlink.pro/movie/${id}` },
  { name: "Server 7", getUrl: (id: number) => `https://player.videasy.net/movie/${id}` },
  { name: "Server 8", getUrl: (id: number) => `https://vidfast.pro/movie/${id}?autoPlay=true` },
  { name: "Server 9", getUrl: (id: number) => `https://player.vidzee.wtf/embed/movie/${id}?server=1` },
  { name: "Server 10", getUrl: (id: number) => `https://player.vidsrc.co/embed/movie/${id}` },
];

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToHistory } = useWatchHistory();
  const { t } = useLanguage();
  const { isInList, toggleItem } = useMyList();
  const [selectedServer, setSelectedServer] = useState(0);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(Number(id)),
    enabled: !!id,
  });

  const { data: similarMovies } = useQuery({
    queryKey: ["similarMovies", id],
    queryFn: () => getSimilarMovies(Number(id)),
    enabled: !!id,
  });

  const { data: credits } = useQuery({
    queryKey: ["movieCredits", id],
    queryFn: () => getMovieCredits(Number(id)),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["movieReviews", id],
    queryFn: () => getMovieReviews(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (movie) {
      addToHistory({
        id: movie.id,
        type: "movie",
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        rating: movie.vote_average,
        year: movie.release_date?.split("-")[0],
      });
    }
  }, [movie, addToHistory]);

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

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('detail.movieNotFound')}</p>
      </div>
    );
  }

  const embedUrl = movieServers[selectedServer].getUrl(movie.id);
  const year = movie.release_date?.split("-")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
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
            servers={movieServers}
            selectedIndex={selectedServer}
            onSelect={setSelectedServer}
          />
          <VideoPlayer embedUrl={embedUrl} title={movie.title} />

          <div className="mt-8">
            <h1 className="text-3xl md:text-5xl font-display tracking-wide text-foreground mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              {year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.runtime} {t('common.min')}</span>
                </div>
              )}
              {movie.genres && (
                <div className="flex items-center gap-2">
                  {movie.genres.map((genre) => (
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
              <TrailerButton id={movie.id} type="movie" title={movie.title} />
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(`https://dl.vidsrc.vip/movie/${movie.id}`, '_blank')}
              >
                <Download className="w-4 h-4" />
                {t('detail.download')}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toggleItem({
                  id: movie.id,
                  title: movie.title,
                  posterPath: movie.poster_path,
                  rating: movie.vote_average,
                  type: "movie",
                })}
              >
                {isInList(movie.id, "movie") ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isInList(movie.id, "movie") ? t('myList.inMyList') : t('myList.addToList')}
              </Button>
            </div>

            <p className="text-foreground/80 max-w-3xl leading-relaxed mt-4">
              {movie.overview}
            </p>

            {credits && <CastSection credits={credits} />}

            {reviews && <ReviewsSection reviews={reviews} />}
          </div>

          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
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
                  {similarMovies.slice(0, 12).map((similar, index) => (
                    <div
                      key={similar.id}
                      className="flex-shrink-0 w-[160px] md:w-[200px] transform transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ContentCard
                        id={similar.id}
                        title={similar.title}
                        posterPath={similar.poster_path}
                        rating={similar.vote_average}
                        type="movie"
                        year={similar.release_date?.split("-")[0]}
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

export default MovieDetail;
