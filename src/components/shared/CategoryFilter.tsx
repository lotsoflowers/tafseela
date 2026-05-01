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
            aria-pressed={isActive}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap',
              'transition-[background-color,color,border-color] duration-200',
              isActive
                ? 'bg-ink text-white dark:bg-foreground dark:text-background'
                : 'border border-soft/40 bg-white/70 text-ink/65 hover:border-ink/30 hover:text-ink dark:border-border dark:bg-card/70 dark:text-foreground/70 dark:hover:border-foreground/40 dark:hover:text-foreground'
            )}
          >
            {t(category.name)}
          </button>
        );
      })}
    </div>
  );
}
