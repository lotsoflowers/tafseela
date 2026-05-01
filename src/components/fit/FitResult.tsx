'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { FitRecommendation } from '@/types';

interface FitResultProps {
  result: FitRecommendation;
  className?: string;
}

const confidenceLabels: Record<FitRecommendation['confidence'], { en: string; ar: string }> = {
  high: { en: 'High confidence', ar: 'ثقة عالية' },
  medium: { en: 'Medium confidence', ar: 'ثقة متوسطة' },
  low: { en: 'Low confidence', ar: 'ثقة منخفضة' },
};

const confidenceDots: Record<FitRecommendation['confidence'], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function FitResult({ result, className }: FitResultProps) {
  const { language, t } = useLanguage();
  const dots = confidenceDots[result.confidence];

  return (
    <div
      className={cn(
        'animate-in slide-in-from-bottom-4 rounded-xl bg-hero p-4 text-white duration-300',
        className
      )}
    >
      <p className="mb-2 text-base font-bold">
        {language === 'ar'
          ? `ننصحك بمقاس ${result.recommendedSize} في هذا المتجر`
          : `We recommend size ${result.recommendedSize} in this store`}
      </p>

      {/* Confidence indicator */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs text-white/80">
          {t(confidenceLabels[result.confidence])}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={cn(
                'block size-2 rounded-full',
                dot <= dots ? 'bg-white' : 'bg-white/30'
              )}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-white/90">
        {t(result.note)}
      </p>
    </div>
  );
}
