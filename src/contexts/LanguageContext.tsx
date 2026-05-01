'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language, Direction, BilingualText } from '@/types';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar'); // Default Arabic

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('tafseela-language') as Language | null;
    if (saved) setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem('tafseela-language', language);
  }, [language, direction]);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((text: BilingualText): string => {
    return text[language];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
