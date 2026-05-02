'use client';

import Link from 'next/link';
import {
  Shirt,
  Layers,
  Footprints,
  Sparkle,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

const iconForCategory: Record<string, LucideIcon> = {
  tops: Shirt,
  dresses: Sparkle,
  skirts: Layers,
  vests: Layers,
  outerwear: Layers,
  evening: Sparkle,
  abayas: Sparkle,
  casual: Shirt,
  coords: Layers,
  all: Footprints,
};

interface CategoryIconTileProps {
  category: Category;
  className?: string;
}

export default function CategoryIconTile({ category, className }: CategoryIconTileProps) {
  const { t } = useLanguage();
  const Icon = iconForCategory[category.id] ?? Layers;

  return (
    <Link
      href={`/search?category=${category.id}`}
      className={cn(
        'group flex flex-col items-center gap-2 rounded-2xl bg-white p-3 dark:bg-card',
        'shadow-[0_1px_2px_rgba(92,10,61,0.04),0_4px_12px_rgba(92,10,61,0.05)]',
        'dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)]',
        'transition-[transform,box-shadow] duration-200 ease-out',
        'hover:-translate-y-0.5 active:scale-95',
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-blush text-plum dark:bg-secondary dark:text-foreground">
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <span className="text-[12px] font-semibold leading-tight text-ink dark:text-foreground">
        {t(category.name)}
      </span>
    </Link>
  );
}
