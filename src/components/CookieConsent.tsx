import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dashflix_cookie_consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dashflix_cookie_consent", "accepted");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("dashflix_cookie_consent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-foreground font-semibold mb-1">We use cookies</h3>
            <p className="text-sm text-muted-foreground">
              We use local storage to save your watchlist and continue watching progress. 
              No personal data is collected or shared with third parties.
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="border-border hover:bg-secondary"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
