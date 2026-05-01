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
              'flex h-10 min-w-[3rem] items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors',
              isSelected
                ? 'bg-hero text-white'
                : isAvailable
                  ? 'border border-soft bg-white text-ink hover:border-hero/50'
                  : 'bg-gray-100 text-gray-400 line-through'
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
