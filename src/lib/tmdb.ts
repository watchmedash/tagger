const API_KEY = "4f599baa15d072c9de346b2816a131b8";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null) => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/original${path}`;
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch from TMDB");
  return response.json();
};

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

// Filter out unreleased content
const filterReleased = <T extends { release_date?: string; first_air_date?: string }>(items: unknown): T[] => {
  const list = asArray<T>(items);
  const today = new Date().toISOString().split("T")[0];
  return list.filter((item) => {
    const date = item.release_date || item.first_air_date;
    return date && date <= today;
  });
};

export const getTrending = async (): Promise<SearchResult[]> => {
  const data = await fetchTMDB("/trending/all/week");
  return filterReleased<SearchResult>(data?.results);
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const data = await fetchTMDB("/movie/popular");
  return filterReleased<Movie>(data?.results);
};

export const getPopularTVShows = async (): Promise<TVShow[]> => {
  const data = await fetchTMDB("/tv/popular");
  return filterReleased<TVShow>(data?.results);
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const data = await fetchTMDB("/movie/top_rated");
  return filterReleased<Movie>(data?.results);
};

export const getTopRatedTVShows = async (): Promise<TVShow[]> => {
  const data = await fetchTMDB("/tv/top_rated");
  return filterReleased<TVShow>(data?.results);
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  return fetchTMDB(`/movie/${id}`);
};

export const getTVShowDetails = async (id: number): Promise<TVShow> => {
  return fetchTMDB(`/tv/${id}`);
};

export const getSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<{ episodes: Episode[] }> => {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
};

export const searchMulti = async (query: string): Promise<SearchResult[]> => {
  const data = await fetchTMDB("/search/multi", { query });
  const results = asArray<SearchResult>(data?.results).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );
  return filterReleased<SearchResult>(results);
};

export const getMovieGenres = async (): Promise<Genre[]> => {
  const data = await fetchTMDB("/genre/movie/list");
  return asArray<Genre>(data?.genres);
};

export const getTVGenres = async (): Promise<Genre[]> => {
  const data = await fetchTMDB("/genre/tv/list");
  return asArray<Genre>(data?.genres);
};

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const discoverMovies = async (params: {
  genre?: number;
  sortBy?: string;
  page?: number;
  year?: number;
  rating?: number;
}): Promise<PaginatedResponse<Movie>> => {
  const queryParams: Record<string, string> = {
    "vote_count.gte": "50",
    "release_date.lte": new Date().toISOString().split("T")[0],
  };
  if (params.genre) queryParams.with_genres = params.genre.toString();
  if (params.sortBy) queryParams.sort_by = params.sortBy;
  if (params.page) queryParams.page = params.page.toString();
  if (params.year) queryParams.primary_release_year = params.year.toString();
  if (params.rating) queryParams["vote_average.gte"] = params.rating.toString();

  const data = await fetchTMDB("/discover/movie", queryParams);
  return {
    results: filterReleased(data.results),
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

export const discoverTVShows = async (params: {
  genre?: number;
  sortBy?: string;
  page?: number;
  year?: number;
  rating?: number;
}): Promise<PaginatedResponse<TVShow>> => {
  const queryParams: Record<string, string> = {
    "vote_count.gte": "50",
    "first_air_date.lte": new Date().toISOString().split("T")[0],
  };
  if (params.genre) queryParams.with_genres = params.genre.toString();
  if (params.sortBy) queryParams.sort_by = params.sortBy;
  if (params.page) queryParams.page = params.page.toString();
  if (params.year) queryParams.first_air_date_year = params.year.toString();
  if (params.rating) queryParams["vote_average.gte"] = params.rating.toString();

  const data = await fetchTMDB("/discover/tv", queryParams);
  return {
    results: filterReleased(data.results),
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

export const getMovieEmbedUrl = (tmdbId: number): string => {
  return `https://vidsrc-embed.ru/embed/movie/${tmdbId}`;
};

export const getTVEmbedUrl = (tmdbId: number, season: number, episode: number): string => {
  return `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
};

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const getTrailer = async (id: number, type: "movie" | "tv"): Promise<string | null> => {
  const endpoint = type === "movie" ? `/movie/${id}/videos` : `/tv/${id}/videos`;
  const data = await fetchTMDB(endpoint);
  const videos = asArray<Video>(data?.results);

  // Prioritize official trailers from YouTube
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
    videos.find((v) => v.site === "YouTube");

  return trailer ? trailer.key : null;
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
  const data = await fetchTMDB(`/movie/${id}/similar`);
  return filterReleased<Movie>(data?.results).slice(0, 12);
};

export const getSimilarTVShows = async (id: number): Promise<TVShow[]> => {
  const data = await fetchTMDB(`/tv/${id}/similar`);
  return filterReleased<TVShow>(data?.results).slice(0, 12);
};

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export const getMovieCredits = async (id: number): Promise<Credits> => {
  const data = await fetchTMDB(`/movie/${id}/credits`);
  const cast = asArray<CastMember>(data?.cast).slice(0, 10);
  const crew = asArray<CrewMember>(data?.crew)
    .filter((c) => c.job === "Director" || c.job === "Producer" || c.job === "Writer")
    .slice(0, 5);
  return { cast, crew };
};

export const getTVCredits = async (id: number): Promise<Credits> => {
  const data = await fetchTMDB(`/tv/${id}/credits`);
  const cast = asArray<CastMember>(data?.cast).slice(0, 10);
  const crew = asArray<CrewMember>(data?.crew)
    .filter((c) => c.job === "Executive Producer" || c.job === "Creator" || c.department === "Writing")
    .slice(0, 5);
  return { cast, crew };
};

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
}

const normalizeReviews = (value: unknown): Review[] => {
  const results = asArray<any>(value).slice(0, 5);
  return results.map((r) => ({
    id: String(r?.id ?? ""),
    author: r?.author ?? "Anonymous",
    author_details: {
      name: r?.author_details?.name ?? "",
      username: r?.author_details?.username ?? "",
      avatar_path: r?.author_details?.avatar_path ?? null,
      rating: r?.author_details?.rating ?? null,
    },
    content: typeof r?.content === "string" ? r.content : "",
    created_at: r?.created_at ?? new Date().toISOString(),
  }));
};

export const getMovieReviews = async (id: number): Promise<Review[]> => {
  const data = await fetchTMDB(`/movie/${id}/reviews`);
  return normalizeReviews(data?.results);
};

export const getTVReviews = async (id: number): Promise<Review[]> => {
  const data = await fetchTMDB(`/tv/${id}/reviews`);
  return normalizeReviews(data?.results);
};
