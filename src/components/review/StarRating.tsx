'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  interactive = false,
  onRate,
  size = 16,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            className={cn(
              'shrink-0 transition-colors',
              interactive
                ? 'cursor-pointer hover:scale-110'
                : 'cursor-default'
            )}
          >
            <Star
              size={size}
              className={cn(
                filled
                  ? 'fill-hero text-hero'
                  : 'fill-soft/40 text-soft'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
