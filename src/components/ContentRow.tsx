import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  media_type?: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  type?: "movie" | "tv";
}

const ContentRow = ({ title, items, type }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getYear = (item: ContentItem) => {
    const date = item.release_date || item.first_air_date;
    return date ? date.split("-")[0] : undefined;
  };

  return (
    <div className="relative group/row py-4">
      <h2 className="text-xl lg:text-2xl font-display tracking-wide text-foreground px-4 lg:px-12 mb-3">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-4 z-10 w-12 bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8 text-foreground" />
        </button>
        <div ref={rowRef} className="content-row">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || "Unknown"}
              posterPath={item.poster_path}
              rating={item.vote_average}
              type={item.media_type || type || "movie"}
              year={getYear(item)}
            />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-4 z-10 w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
