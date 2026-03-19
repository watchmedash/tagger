import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.movies')}</Link></li>
              <li><Link to="/tv" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.tvShows')}</Link></li>
              <li><Link to="/my-list" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.myList')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><a href="mailto:support@n4ked.top" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.contactUs')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.termsOfUse')}</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><a href="mailto:support@n4ked.top" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-2xl font-display text-primary mb-1">N4KED</p>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} N4ked. {t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
