'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Review } from '@/types';
import StarRating from './StarRating';
import FitBadge from '@/components/product/FitBadge';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const { language, t } = useLanguage();

  return (
    <div
      className={cn(
        'rounded-xl bg-blush dark:bg-secondary p-4',
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-ink dark:text-foreground">
          {t(review.userName)}
        </span>
        <span className="text-xs text-ink/50">
          {formatDate(review.createdAt, language)}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <StarRating rating={review.rating} size={14} />
        <FitBadge fit={review.fit} />
      </div>

      <p className="text-sm leading-relaxed text-ink/80">
        {t(review.text)}
      </p>
    </div>
  );
}
