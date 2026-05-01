'use client';

import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  amount: number;
  originalPrice?: number;
  className?: string;
}

export default function PriceTag({ amount, originalPrice, className }: PriceTagProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-bold text-ink dark:text-foreground">{formatPrice(amount)}</span>
      {originalPrice !== undefined && originalPrice > amount && (
        <span className="text-sm text-soft line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
