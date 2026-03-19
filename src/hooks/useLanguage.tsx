import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, translations, languages } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem('site-language');
  if (stored && languages.some(l => l.code === stored)) {
    return stored as Language;
  }
  const browserLang = navigator.language.split('-')[0] as Language;
  if (languages.some(l => l.code === browserLang)) {
    return browserLang;
  }
  return 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [userId, setUserId] = useState<string | null>(null);

  const currentLang = languages.find(l => l.code === language);
  const dir = currentLang?.dir || 'ltr';

  // Fetch language from database when user logs in (and on initial load if already logged in)
  useEffect(() => {
    const loadUserLanguage = (uid: string) => {
      setTimeout(() => {
        supabase
          .from('profiles')
          .select('language')
          .eq('id', uid)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.language && languages.some((l) => l.code === data.language)) {
              setLanguageState(data.language as Language);
              localStorage.setItem('site-language', data.language);
            }
          });
      }, 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        loadUserLanguage(uid);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        loadUserLanguage(uid);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update localStorage and document when language changes
  useEffect(() => {
    localStorage.setItem('site-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site-language', lang);

    // Save to database if user is logged in
    if (userId) {
      supabase
        .from('profiles')
        .update({ language: lang })
        .eq('id', userId)
        .then(() => {});
    }
  }, [userId]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
