const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="h-[70vh] md:h-[85vh] bg-card animate-pulse" />
      
      {/* Content Rows Skeleton */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="py-4">
          <div className="h-8 w-48 bg-card rounded mx-4 md:mx-12 mb-3 animate-pulse" />
          <div className="flex gap-2 px-4 md:px-12 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="flex-shrink-0 w-[140px] md:w-[180px] aspect-[2/3] bg-card rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
