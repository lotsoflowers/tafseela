'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { FitType, BilingualText } from '@/types';

interface FitBadgeProps {
  fit: FitType;
  className?: string;
}

const fitLabels: Record<FitType, BilingualText> = {
  'true-to-size': { en: 'True to size', ar: 'يناسب المقاس' },
  'runs-small': { en: 'Runs small', ar: 'مقاسه صغير' },
  'runs-large': { en: 'Runs large', ar: 'مقاسه كبير' },
  'runs-tight': { en: 'Runs tight', ar: 'ضيق' },
  'runs-loose': { en: 'Runs loose', ar: 'واسع' },
};

export default function FitBadge({ fit, className }: FitBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        'inline-block rounded-full bg-soft/30 px-2 py-0.5 text-xs font-medium text-plum',
        className
      )}
    >
      {t(fitLabels[fit])}
    </span>
  );
}
