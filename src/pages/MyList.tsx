import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentCard from "@/components/ContentCard";
import { useMyList } from "@/hooks/useMyList";
import { Bookmark } from "lucide-react";

const MyList = () => {
  const { myList } = useMyList();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-20 px-4 md:px-12 pb-12 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-8">My List</h1>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your list is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add movies and TV shows to your list by clicking the bookmark icon
            </p>
            <Link
              to="/"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myList.map((item) => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                title={item.title}
                posterPath={item.posterPath}
                rating={item.rating}
                type={item.type}
                year={item.year}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyList;
