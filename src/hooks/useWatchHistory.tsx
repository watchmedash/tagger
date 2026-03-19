import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WatchHistoryItem {
  id: number;
  type: "movie" | "tv";
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  year?: string;
  season?: number;
  episode?: number;
  watchedAt: number;
}

interface WatchHistoryContextType {
  watchHistory: WatchHistoryItem[];
  addToHistory: (item: Omit<WatchHistoryItem, "watchedAt">) => void;
  removeFromHistory: (id: number, type: "movie" | "tv") => void;
  getLastWatched: (id: number, type: "movie" | "tv") => WatchHistoryItem | undefined;
  clearHistory: () => void;
  loading: boolean;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export const WatchHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch watch history from database when user is authenticated
  useEffect(() => {
    if (user) {
      fetchWatchHistory();
    } else {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem("dashflix-watch-history");
      setWatchHistory(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const fetchWatchHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_watch_history")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const items: WatchHistoryItem[] = (data || []).map((item) => ({
        id: item.content_id,
        type: item.content_type as "movie" | "tv",
        title: item.title,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        rating: Number(item.rating) || 0,
        year: item.year || undefined,
        season: item.season || undefined,
        episode: item.episode || undefined,
        watchedAt: new Date(item.watched_at).getTime(),
      }));

      setWatchHistory(items);
    } catch (error) {
      console.error("Error fetching watch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = useCallback(async (item: Omit<WatchHistoryItem, "watchedAt">) => {
    const newItem: WatchHistoryItem = { ...item, watchedAt: Date.now() };

    // Optimistic update - remove existing and add to beginning
    setWatchHistory((prev) => {
      const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));
      return [newItem, ...filtered].slice(0, 20);
    });

    if (user) {
      try {
        // Upsert to handle duplicates
        const { error } = await supabase.from("user_watch_history").upsert(
          {
            user_id: user.id,
            content_id: item.id,
            content_type: item.type,
            title: item.title,
            poster_path: item.posterPath,
            backdrop_path: item.backdropPath,
            rating: item.rating,
            year: item.year,
            season: item.season,
            episode: item.episode,
            watched_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,content_id,content_type",
          }
        );

        if (error) throw error;
      } catch (error) {
        console.error("Error adding to watch history:", error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      const filtered = watchHistory.filter((i) => !(i.id === item.id && i.type === item.type));
      const updated = [newItem, ...filtered].slice(0, 20);
      localStorage.setItem("dashflix-watch-history", JSON.stringify(updated));
    }
  }, [user, watchHistory]);

  const removeFromHistory = useCallback(async (id: number, type: "movie" | "tv") => {
    const itemToRemove = watchHistory.find((i) => i.id === id && i.type === type);

    // Optimistic update
    setWatchHistory((prev) => prev.filter((i) => !(i.id === id && i.type === type)));

    if (user) {
      try {
        const { error } = await supabase
          .from("user_watch_history")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", id)
          .eq("content_type", type);

        if (error) throw error;
      } catch (error) {
        console.error("Error removing from watch history:", error);
        // Revert on error
        if (itemToRemove) {
          setWatchHistory((prev) => [itemToRemove, ...prev]);
        }
      }
    } else {
      // Save to localStorage for non-authenticated users
      const updated = watchHistory.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem("dashflix-watch-history", JSON.stringify(updated));
    }
  }, [user, watchHistory]);

  const getLastWatched = useCallback((id: number, type: "movie" | "tv") => {
    return watchHistory.find((i) => i.id === id && i.type === type);
  }, [watchHistory]);

  const clearHistory = useCallback(async () => {
    setWatchHistory([]);

    if (user) {
      try {
        const { error } = await supabase
          .from("user_watch_history")
          .delete()
          .eq("user_id", user.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error clearing watch history:", error);
      }
    } else {
      localStorage.setItem("dashflix-watch-history", JSON.stringify([]));
    }
  }, [user]);

  return (
    <WatchHistoryContext.Provider
      value={{ watchHistory, addToHistory, removeFromHistory, getLastWatched, clearHistory, loading }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
};

export const useWatchHistory = () => {
  const context = useContext(WatchHistoryContext);
  if (!context) throw new Error("useWatchHistory must be used within WatchHistoryProvider");
  return context;
};
