'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium',
        'bg-blush text-ink transition-colors hover:bg-soft',
        className
      )}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {language === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
