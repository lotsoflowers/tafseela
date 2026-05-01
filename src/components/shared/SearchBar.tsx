'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  onClick?: () => void;
}

export default function SearchBar({ className, onClick }: SearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/search');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-full px-4 py-3 text-start',
        'bg-white/80 dark:bg-card/80 backdrop-blur-md border border-soft/40 dark:border-border shadow-[0_2px_12px_rgba(92,10,61,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]',
        'transition-[border-color,box-shadow,transform] duration-300',
        'hover:border-hero/40 hover:shadow-[0_4px_18px_rgba(191,6,106,0.10)]',
        'active:scale-[0.99]',
        'focus:outline-none focus:ring-2 focus:ring-hero/30 focus:border-hero/50',
        className
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hero/10 to-soft/20 dark:from-hero/20 dark:to-soft/15 text-hero transition-colors group-hover:from-hero/20 group-hover:to-soft/30">
        <Search className="size-4" strokeWidth={2.5} />
      </span>
      <span className="flex-1 truncate text-sm font-medium text-ink/40 dark:text-foreground/40">
        {t({
          en: 'Search products or stores',
          ar: 'ابحثي عن منتج أو متجر',
        })}
      </span>
    </button>
  );
}
