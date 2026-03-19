import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ListItem {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  type: "movie" | "tv";
  year?: string;
}

interface MyListContextType {
  myList: ListItem[];
  addToList: (item: ListItem) => void;
  removeFromList: (id: number, type: "movie" | "tv") => void;
  isInList: (id: number, type: "movie" | "tv") => boolean;
  toggleItem: (item: ListItem) => void;
  loading: boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [myList, setMyList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch watchlist from database when user is authenticated
  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem("dashflix-my-list");
      setMyList(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const items: ListItem[] = (data || []).map((item) => ({
        id: item.content_id,
        title: item.title,
        posterPath: item.poster_path,
        rating: Number(item.rating) || 0,
        type: item.content_type as "movie" | "tv",
        year: item.year || undefined,
      }));

      setMyList(items);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToList = useCallback(async (item: ListItem) => {
    setMyList((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) return prev;
      const updated = [...prev, item];
      if (!user) {
        localStorage.setItem("dashflix-my-list", JSON.stringify(updated));
      }
      return updated;
    });

    if (user) {
      try {
        const { error } = await supabase.from("user_watchlist").insert({
          user_id: user.id,
          content_id: item.id,
          content_type: item.type,
          title: item.title,
          poster_path: item.posterPath,
          rating: item.rating,
          year: item.year,
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error adding to watchlist:", error);
        // Revert on error
        setMyList((prev) => {
          const reverted = prev.filter((i) => !(i.id === item.id && i.type === item.type));
          if (!user) {
            localStorage.setItem("dashflix-my-list", JSON.stringify(reverted));
          }
          return reverted;
        });
      }
    }
  }, [user]);

  const removeFromList = useCallback(async (id: number, type: "movie" | "tv") => {
    let itemToRemove: ListItem | undefined;

    setMyList((prev) => {
      itemToRemove = prev.find((i) => i.id === id && i.type === type);
      const updated = prev.filter((i) => !(i.id === id && i.type === type));
      if (!user) {
        localStorage.setItem("dashflix-my-list", JSON.stringify(updated));
      }
      return updated;
    });

    if (user) {
      try {
        const { error } = await supabase
          .from("user_watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", id)
          .eq("content_type", type);

        if (error) throw error;
      } catch (error) {
        console.error("Error removing from watchlist:", error);
        // Revert on error
        if (itemToRemove) {
          setMyList((prev) => {
            const reverted = [...prev, itemToRemove!];
            if (!user) {
              localStorage.setItem("dashflix-my-list", JSON.stringify(reverted));
            }
            return reverted;
          });
        }
      }
    }
  }, [user]);

  const isInList = useCallback((id: number, type: "movie" | "tv") => {
    return myList.some((i) => i.id === id && i.type === type);
  }, [myList]);

  const toggleItem = useCallback((item: ListItem) => {
    if (isInList(item.id, item.type)) {
      removeFromList(item.id, item.type);
    } else {
      addToList(item);
    }
  }, [isInList, removeFromList, addToList]);

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList, toggleItem, loading }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) throw new Error("useMyList must be used within MyListProvider");
  return context;
};
