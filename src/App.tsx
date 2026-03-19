import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MyListProvider } from "@/hooks/useMyList";
import { WatchHistoryProvider } from "@/hooks/useWatchHistory";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import CookieConsent from "@/components/CookieConsent";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MyListProvider>
            <WatchHistoryProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path="/tv/:id" element={<TVDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/tv" element={<TVShows />} />
                    <Route path="/my-list" element={<MyList />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                  <CookieConsent />
                </BrowserRouter>
              </TooltipProvider>
            </WatchHistoryProvider>
          </MyListProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
