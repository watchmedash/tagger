import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import TrendingRow from "@/components/TrendingRow";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UserReviews from "@/components/UserReviews";
import { useLanguage } from "@/hooks/useLanguage";
import {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getTopRatedMovies,
  getTopRatedTVShows,
} from "@/lib/tmdb";

const Index = () => {
  const { t } = useLanguage();

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  const { data: popularMovies, isLoading: moviesLoading } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
  });

  const { data: popularTVShows, isLoading: tvLoading } = useQuery({
    queryKey: ["popularTVShows"],
    queryFn: getPopularTVShows,
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRatedMovies,
  });

  const { data: topRatedTVShows } = useQuery({
    queryKey: ["topRatedTVShows"],
    queryFn: getTopRatedTVShows,
  });

  const isLoading = trendingLoading || moviesLoading || tvLoading;

  if (isLoading || !trending) {
    return <LoadingSkeleton />;
  }

  const heroItem = trending[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {heroItem && <HeroBanner item={heroItem} />}

      <div className="-mt-32 relative z-10 pb-12 flex-1">
        <ContinueWatchingRow />

        {trending && trending.length > 0 && (
          <TrendingRow title={t('content.trending')} items={trending} />
        )}

        {popularMovies && popularMovies.length > 0 && (
          <ContentRow title={t('content.popularMovies')} items={popularMovies} type="movie" />
        )}

        {popularTVShows && popularTVShows.length > 0 && (
          <ContentRow title={t('content.popularTVShows')} items={popularTVShows} type="tv" />
        )}

        {topRatedMovies && topRatedMovies.length > 0 && (
          <ContentRow title={t('content.topRatedMovies')} items={topRatedMovies} type="movie" />
        )}

        {topRatedTVShows && topRatedTVShows.length > 0 && (
          <ContentRow title={t('content.topRatedTVShows')} items={topRatedTVShows} type="tv" />
        )}

        <UserReviews />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
