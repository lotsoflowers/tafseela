'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  className,
}: CategoryFilterProps) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto hide-scrollbar',
        className
      )}
    >
      {categories.map((category) => {
        const isActive = category.id === selectedId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-hero text-white'
                : 'border border-soft bg-white text-ink hover:bg-blush/30'
            )}
          >
            {t(category.name)}
          </button>
        );
      })}
    </div>
  );
}
