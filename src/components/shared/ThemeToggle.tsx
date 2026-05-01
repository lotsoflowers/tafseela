'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — theme isn't known on the server.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={
        language === 'ar'
          ? isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'
          : isDark ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className={cn(
        'relative inline-flex size-9 items-center justify-center rounded-full text-ink/60 dark:text-foreground/70',
        'transition-colors hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10',
        className
      )}
    >
      {/* Render both icons; toggle visibility so SSR HTML matches initial client render. */}
      <Sun className={cn('size-4 transition-all', isDark ? 'scale-0 -rotate-90' : 'scale-100 rotate-0')} />
      <Moon className={cn('absolute size-4 transition-all', isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90')} />
    </button>
  );
}
