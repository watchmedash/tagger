import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { languages } from '@/i18n/translations';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 hover:bg-secondary/50 rounded-full transition-colors flex items-center gap-1"
          aria-label="Select language"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs uppercase">{language}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background border border-border z-50 min-w-[160px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => setLanguage(lang.code)}
            className={`cursor-pointer flex items-center justify-between ${
              language === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <span>{lang.nativeName}</span>
            <span className="text-xs text-muted-foreground">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
