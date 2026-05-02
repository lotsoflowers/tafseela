'use client';

import { Sparkle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

export type SubtabItem<T extends string = string> = {
  id: T;
  label: BilingualText;
  count?: number;
};

interface SegmentedSubtabsProps<T extends string = string> {
  items: SubtabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export default function SegmentedSubtabs<T extends string = string>({
  items,
  active,
  onChange,
  className,
  size = 'md',
}: SegmentedSubtabsProps<T>) {
  const { t } = useLanguage();

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center justify-center gap-1.5 overflow-x-auto px-1 py-1 hide-scrollbar',
        className
      )}
    >
      {items.map(item => {
        const isActive = item.id === active;
        const labelText = t(item.label);
        const countText = item.count !== undefined ? ` ${item.count}` : '';

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              'shrink-0 rounded-full transition-colors',
              size === 'md' ? 'px-4 py-1.5 text-[13px]' : 'px-3 py-1 text-[12px]',
              isActive
                ? 'bg-cream font-bold text-plum dark:bg-secondary dark:text-foreground'
                : 'font-semibold text-muted-foreground hover:text-ink dark:hover:text-foreground'
            )}
          >
            {isActive ? (
              <span className="inline-flex items-center gap-1.5">
                <Sparkle className="size-3 text-hero" fill="currentColor" strokeWidth={1.5} />
                <span>
                  {labelText}
                  {countText && <span className="font-normal opacity-70">{countText}</span>}
                </span>
                <Sparkle className="size-3 text-hero" fill="currentColor" strokeWidth={1.5} />
              </span>
            ) : (
              <span>
                {labelText}
                {countText && <span className="font-normal opacity-70">{countText}</span>}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
