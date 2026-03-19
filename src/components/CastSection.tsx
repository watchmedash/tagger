import { getImageUrl, Credits } from "@/lib/tmdb";
import { User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface CastSectionProps {
  credits: Credits;
}

const CastSection = ({ credits }: CastSectionProps) => {
  const { t } = useLanguage();

  if (!credits.cast.length && !credits.crew.length) return null;

  return (
    <div className="mt-8">
      {/* Cast */}
      {credits.cast.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">{t('cast.title')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {credits.cast.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-24 text-center">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-secondary mb-2">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-1">{person.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew */}
      {credits.crew.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">{t('cast.crew')}</h3>
          <div className="flex flex-wrap gap-4">
            {credits.crew.map((person, index) => (
              <div key={`${person.id}-${index}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.job}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CastSection;
