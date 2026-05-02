import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SparkleStarProps = {
  filled?: boolean;
  className?: string;
};

export function SparkleStar({ filled = false, className }: SparkleStarProps) {
  return (
    <Sparkle
      className={cn('size-4', className)}
      strokeWidth={1.75}
      fill={filled ? 'currentColor' : 'none'}
    />
  );
}

type SparkleRatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClass = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export function SparkleRating({ value, max = 5, size = 'md', className }: SparkleRatingProps) {
  const ratios = Array.from({ length: max }, (_, i) =>
    Math.max(0, Math.min(1, value - i))
  );

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${value} of ${max} stars`}
      role="img"
    >
      {ratios.map((ratio, i) => (
        <span key={i} className={cn('relative inline-flex', sizeClass[size])}>
          <Sparkle
            className={cn(sizeClass[size], 'absolute inset-0 text-hero/30')}
            strokeWidth={1.75}
            fill="none"
          />
          {ratio > 0 && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${ratio * 100}%` }}
            >
              <Sparkle
                className={cn(sizeClass[size], 'text-hero')}
                strokeWidth={1.75}
                fill="currentColor"
              />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
