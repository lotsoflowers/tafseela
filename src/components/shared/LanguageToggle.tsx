'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  // Show the OPPOSITE language as the call to action — what you'll switch INTO.
  const next = language === 'ar' ? 'EN' : 'ع';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full',
        'text-[12px] font-bold tracking-wide',
        'text-ink/70 dark:text-foreground/75',
        'transition-colors',
        'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10',
        className
      )}
    >
      {next}
    </button>
  );
}
