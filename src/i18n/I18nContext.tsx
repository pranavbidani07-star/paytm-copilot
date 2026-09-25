import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { as } from './translations/as';

export type Language = 'en' | 'hi' | 'as';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, any> = { en, hi, as };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('jaldrishti_lang');
    return (saved === 'hi' || saved === 'as' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jaldrishti_lang', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    
    // Primary language lookup
    let value: any = translations[language];
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }

    // Fallback to English lookup if missing in primary language
    if (language !== 'en') {
      let fallbackValue: any = translations.en;
      for (const k of keys) {
        if (fallbackValue === undefined) break;
        fallbackValue = fallbackValue[k];
      }
      if (typeof fallbackValue === 'string' && fallbackValue.trim() !== '') {
        return fallbackValue;
      }
    }

    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
