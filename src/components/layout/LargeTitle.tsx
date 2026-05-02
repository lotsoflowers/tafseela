'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

interface LargeTitleProps {
  title: BilingualText;
  subtitle?: BilingualText;
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * iOS Large Title pattern — sits at the top of an inner page, gets
 * tagged with data-large-title so TopBar can fade its own centered
 * title in only once the user has scrolled past this one (the iconic
 * UINavigationController prefersLargeTitles transition).
 */
export default function LargeTitle({
  title,
  subtitle,
  trailing,
  className,
}: LargeTitleProps) {
  const { t } = useLanguage();
  return (
    <div
      data-large-title=""
      className={cn(
        'flex items-end justify-between gap-3 px-4 pt-2 pb-3',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-ink dark:text-foreground">
          {t(title)}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[15px] leading-snug text-ink/55 dark:text-foreground/55">
            {t(subtitle)}
          </p>
        )}
      </div>
      {trailing && <div className="shrink-0 self-end pb-1">{trailing}</div>}
    </div>
  );
}
