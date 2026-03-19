import { Genre } from "@/lib/tmdb";
import { ChevronDown, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface ContentFiltersProps {
  genres: Genre[];
  selectedGenre: number | null;
  sortBy: string;
  selectedYear: number | null;
  selectedRating: number | null;
  onGenreChange: (genre: number | null) => void;
  onSortChange: (sort: string) => void;
  onYearChange: (year: number | null) => void;
  onRatingChange: (rating: number | null) => void;
}

// Generate years from current year down to 1950
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

const ContentFilters = ({
  genres,
  selectedGenre,
  sortBy,
  selectedYear,
  selectedRating,
  onGenreChange,
  onSortChange,
  onYearChange,
  onRatingChange,
}: ContentFiltersProps) => {
  const { t } = useLanguage();
  const [genreOpen, setGenreOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const genreRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "popularity.desc", label: t('filters.mostPopular') },
    { value: "vote_average.desc", label: t('filters.highestRated') },
    { value: "release_date.desc", label: t('filters.newestFirst') },
    { value: "release_date.asc", label: t('filters.oldestFirst') },
  ];

  const ratingOptions = [
    { value: 9, label: `9+ ${t('filters.excellent')}` },
    { value: 8, label: `8+ ${t('filters.great')}` },
    { value: 7, label: `7+ ${t('filters.good')}` },
    { value: 6, label: `6+ ${t('filters.aboveAverage')}` },
    { value: 5, label: `5+ ${t('filters.average')}` },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setGenreOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setYearOpen(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(e.target as Node)) {
        setRatingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllDropdowns = () => {
    setGenreOpen(false);
    setSortOpen(false);
    setYearOpen(false);
    setRatingOpen(false);
  };

  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name || t('filters.allGenres');
  const selectedSortLabel = sortOptions.find((s) => s.value === sortBy)?.label || t('filters.mostPopular');
  const selectedYearLabel = selectedYear ? selectedYear.toString() : t('filters.allYears');
  const selectedRatingLabel = ratingOptions.find((r) => r.value === selectedRating)?.label || t('filters.allRatings');

  const activeFiltersCount = [selectedGenre, selectedYear, selectedRating].filter(Boolean).length;

  const FilterDropdown = ({
    label,
    isOpen,
    setIsOpen,
    dropdownRef,
    children
  }: {
    label: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
  }) => (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          closeAllDropdowns();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 bg-secondary border border-border rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors w-full md:w-auto justify-between md:justify-start"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && children}
    </div>
  );

  const FiltersContent = () => (
    <>
      {/* Genre Dropdown */}
      <FilterDropdown
        label={selectedGenreName}
        isOpen={genreOpen}
        setIsOpen={setGenreOpen}
        dropdownRef={genreRef}
      >
        <div className="absolute top-full left-0 mt-1 w-full md:w-48 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <button
            onClick={() => {
              onGenreChange(null);
              setGenreOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
              selectedGenre === null ? "text-primary font-medium" : "text-foreground"
            }`}
          >
            {t('filters.allGenres')}
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                onGenreChange(genre.id);
                setGenreOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedGenre === genre.id ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* Year Dropdown */}
      <FilterDropdown
        label={selectedYearLabel}
        isOpen={yearOpen}
        setIsOpen={setYearOpen}
        dropdownRef={yearRef}
      >
        <div className="absolute top-full left-0 mt-1 w-full md:w-36 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <button
            onClick={() => {
              onYearChange(null);
              setYearOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
              selectedYear === null ? "text-primary font-medium" : "text-foreground"
            }`}
          >
            {t('filters.allYears')}
          </button>
          {yearOptions.map((year) => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                setYearOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedYear === year ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* Rating Dropdown */}
      <FilterDropdown
        label={selectedRatingLabel}
        isOpen={ratingOpen}
        setIsOpen={setRatingOpen}
        dropdownRef={ratingRef}
      >
        <div className="absolute top-full left-0 mt-1 w-full md:w-48 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <button
            onClick={() => {
              onRatingChange(null);
              setRatingOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
              selectedRating === null ? "text-primary font-medium" : "text-foreground"
            }`}
          >
            {t('filters.allRatings')}
          </button>
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onRatingChange(option.value);
                setRatingOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedRating === option.value ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* Sort Dropdown */}
      <FilterDropdown
        label={selectedSortLabel}
        isOpen={sortOpen}
        setIsOpen={setSortOpen}
        dropdownRef={sortRef}
      >
        <div className="absolute top-full left-0 mt-1 w-full md:w-48 bg-card border border-border rounded-md shadow-lg z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setSortOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                sortBy === option.value ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterDropdown>
    </>
  );

  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 bg-secondary border border-border rounded-md px-4 py-2 text-sm font-medium text-foreground w-full justify-center"
        >
          <Filter className="w-4 h-4" />
          {t('filters.title')}
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {mobileFiltersOpen && (
          <div className="mt-3 flex flex-col gap-3 p-4 bg-card border border-border rounded-md">
            <FiltersContent />
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap gap-3">
        <FiltersContent />
      </div>
    </div>
  );
};

export default ContentFilters;
