import { Review } from "@/lib/tmdb";
import { Star, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
  const { t } = useLanguage();

  if (!reviews.length) return null;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        {t('reviews.title')} ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  const content = typeof review?.content === "string" ? review.content : "";
  const avatarPath = review?.author_details?.avatar_path ?? null;
  const isLong = content.length > 400;
  const displayContent = expanded ? content : content.slice(0, 400);

  const avatarUrl = avatarPath
    ? avatarPath.startsWith("/https")
      ? avatarPath.slice(1)
      : `https://image.tmdb.org/t/p/w45${avatarPath}`
    : null;

  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{review.author}</span>
            {review.author_details.rating && (
              <div className="flex items-center gap-1 bg-primary/20 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-foreground">
                  {review.author_details.rating}/10
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(review.created_at), "MMM d, yyyy")}
          </span>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
        {displayContent}
        {isLong && !expanded && "..."}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
        >
          {expanded ? (
            <>
              {t('reviews.showLess')} <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t('reviews.readMore')} <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;
