'use client';

import { cn } from '@/lib/utils';
import type { ProductSize } from '@/types';

interface SizeSelectorProps {
  sizes: ProductSize[];
  availableSizes: ProductSize[];
  selectedSize: ProductSize | null;
  onSelect: (size: ProductSize) => void;
  className?: string;
}

export default function SizeSelector({
  sizes,
  availableSizes,
  selectedSize,
  onSelect,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {sizes.map((size) => {
        const isAvailable = availableSizes.includes(size);
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelect(size)}
            className={cn(
              'flex size-10 items-center justify-center rounded-full text-[13px] font-semibold transition-all',
              'active:scale-[0.94]',
              isSelected
                ? 'bg-ink text-white dark:bg-foreground dark:text-background'
                : isAvailable
                  ? 'border border-soft/60 dark:border-border bg-white dark:bg-card text-ink dark:text-foreground hover:border-ink/50'
                  : 'bg-soft/20 dark:bg-secondary text-ink/30 dark:text-foreground/30 line-through cursor-not-allowed'
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
