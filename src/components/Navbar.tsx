import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, Sun, Moon, LogIn, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageSelector from "@/components/LanguageSelector";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/movies", label: t('nav.movies') },
    { to: "/tv", label: t('nav.tvShows') },
    { to: "/my-list", label: t('nav.myList'), icon: Bookmark },
  ];

  const isActive = (path: string) => location.pathname === path;

  const initials = profile?.display_name
    ? profile.display_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-12 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl lg:text-4xl font-display text-primary tracking-wider">
              Tagger
            </h1>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 hover:text-primary ${
                  isActive(link.to) ? "text-primary" : "text-foreground/90"
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-64 bg-secondary/80 border border-border/50 rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </form>

          <LanguageSelector />

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Auth button / Profile */}
          {!loading && (
            user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 hover:bg-secondary/50 rounded-full transition-colors"
              >
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 p-2 hover:bg-secondary/50 rounded-full transition-colors"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
