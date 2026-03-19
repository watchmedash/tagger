import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, Bookmark, Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { to: "/", labelKey: "nav.home", icon: Home },
    { to: "/movies", labelKey: "nav.movies", icon: Film },
    { to: "/tv", labelKey: "nav.tvShows", icon: Tv },
    { to: "/search", labelKey: "nav.search", icon: Search },
    { to: "/my-list", labelKey: "nav.myList", icon: Bookmark },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.to)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.to) ? "scale-110" : ""} transition-transform`} />
            <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
