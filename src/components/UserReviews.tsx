import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
}

const fakeReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 5,
    review: "Tagger has completely changed how I watch movies! The streaming quality is incredible and the selection is unmatched. Best decision I ever made.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "James Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    rating: 5,
    review: "I've tried many streaming services, but Tagger stands out with its intuitive interface and vast library. The recommendations are always spot on!",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Emily Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    rating: 4,
    review: "Love the variety of international content available. I can watch shows from all over the world. The subtitle options are fantastic too!",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    rating: 5,
    review: "The HD streaming quality is phenomenal. No buffering issues even on my slower connection. Customer support is also very responsive.",
    date: "3 weeks ago",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    rating: 5,
    review: "My whole family uses Tagger and we all find something to enjoy. From kids' shows to documentaries, there's something for everyone.",
    date: "1 month ago",
  },
  {
    id: 6,
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    rating: 4,
    review: "Great platform, I can download shows for my commute and watch offline. Very convenient!",
    date: "1 month ago",
  },
];

const UserReviews = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 md:px-12 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display tracking-wider text-foreground mb-3">
          {t('reviews.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See what our community is saying about Tagger
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fakeReviews.map((review) => (
          <div
            key={review.id}
            className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <Quote className="w-8 h-8 text-primary/30 mb-4" />

            <p className="text-foreground/90 mb-6 line-clamp-3">
              "{review.review}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full bg-secondary"
                loading="lazy"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{review.name}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-display text-primary">4.8</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-display text-primary">2M+</div>
          <div className="text-sm text-muted-foreground">Happy Users</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-display text-primary">1M+</div>
          <div className="text-sm text-muted-foreground">Titles Available</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-display text-primary">190+</div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </div>
      </div>
    </section>
  );
};

export default UserReviews;
