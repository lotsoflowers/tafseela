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
        'flex gap-2 overflow-x-auto hide-scrollbar py-0.5',
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
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium',
              'transition-all duration-300 ease-out',
              isActive
                ? 'bg-gradient-to-r from-hero to-plum text-white shadow-md shadow-hero/20 scale-[1.02]'
                : 'border border-soft/50 bg-white text-ink/70 hover:border-hero/30 hover:bg-blush/30 hover:text-ink'
            )}
          >
            {t(category.name)}
          </button>
        );
      })}
    </div>
  );
}
