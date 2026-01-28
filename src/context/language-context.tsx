'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Translations } from '@/lib/data';

type Language = 'en' | 'ru' | 'uz';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: {[key: string]: string | number}) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz');
  const [theme, setThemeState] = useState('dark');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'ru', 'uz'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
    
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setThemeState(storedTheme);
    
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-golden-goal');
    if (storedTheme === 'light') {
      // is light
    } else if (storedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('dark', storedTheme);
    }

    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setTheme = (themeName: string) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-golden-goal');
    if (themeName === 'light') {
      // is light
    } else if (themeName === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('dark', themeName);
    }
    setThemeState(themeName);
    localStorage.setItem('theme', themeName);
  }

  const t = (key: string, params?: {[key: string]: string | number}): string => {
    const langTranslations = translations[language] || translations.uz;
    let translation = langTranslations[key] || key;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }

    // Handle basic pluralization for attemptsLeft
    if (key === 'stat.attemptsLeft' && params && typeof params.attempts === 'number') {
        const count = params.attempts;
        if (language === 'ru') {
            if (count === 1) {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попытка');
            } else if (count > 1 && count < 5) {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попытки');
            } else {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попыток');
            }
        } else { // English and Uzbek simple plural
             translation = translation.replace('{attempts, plural, one {attempt} other {attempts}}', count === 1 ? 'attempt' : 'attempts');
        }
    }


    return translation;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
