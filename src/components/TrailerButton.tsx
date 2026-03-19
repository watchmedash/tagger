import { useState } from "react";
import { Play, X, Volume2, VolumeX } from "lucide-react";
import { getTrailer } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface TrailerButtonProps {
  id: number;
  type: "movie" | "tv";
  title: string;
}

const TrailerButton = ({ id, type, title }: TrailerButtonProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handlePlayTrailer = async () => {
    if (!trailerKey) {
      setIsLoading(true);
      try {
        const key = await getTrailer(id, type);
        if (key) {
          setTrailerKey(key);
          setShowTrailer(true);
        }
      } catch {
        // Silently fail
      }
      setIsLoading(false);
    } else {
      setShowTrailer(true);
    }
  };

  const handleClose = () => {
    setShowTrailer(false);
  };

  return (
    <>
      <Button
        onClick={handlePlayTrailer}
        disabled={isLoading}
        variant="outline"
        className="gap-2"
      >
        <Play className="w-4 h-4 fill-current" />
        {isLoading ? t('trailer.loading') : t('trailer.playTrailer')}
      </Button>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0`}
              title={`${title} Trailer`}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={handleClose}
          />
        </div>
      )}
    </>
  );
};

export default TrailerButton;
