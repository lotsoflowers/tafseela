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
        'flex items-center justify-center gap-3 overflow-x-auto py-1 hide-scrollbar',
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
              'shrink-0 rounded-full transition-[background-color,box-shadow,color]',
              size === 'md' ? 'px-5 py-2 text-[14px]' : 'px-3 py-1 text-[12px]',
              isActive
                ? 'bg-white font-bold text-ink shadow-[0_2px_8px_rgba(92,10,61,0.08),0_1px_2px_rgba(92,10,61,0.06)] dark:bg-card dark:text-foreground dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                : 'font-semibold text-ink/70 hover:text-ink dark:text-foreground/65 dark:hover:text-foreground'
            )}
          >
            {isActive ? (
              <span className="inline-flex items-center gap-2">
                <Sparkle className="size-[13px] text-hero" fill="currentColor" strokeWidth={1.5} />
                <span>
                  {labelText}
                  {countText && <span className="font-normal opacity-70">{countText}</span>}
                </span>
                <Sparkle className="size-[13px] text-hero" fill="currentColor" strokeWidth={1.5} />
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
