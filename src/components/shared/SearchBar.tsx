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
        'flex w-full items-center gap-2.5 rounded-2xl px-4 py-3.5 text-start',
        'glass border border-soft/40 shadow-sm',
        'transition-all duration-300',
        'hover:border-hero/30 hover:shadow-md hover:shadow-hero/5',
        'active:scale-[0.99]',
        'focus:outline-none focus:ring-2 focus:ring-hero/30 focus:border-hero/40',
        className
      )}
    >
      <Search className="size-5 shrink-0 text-hero/50" />
      <span className="text-sm text-ink/40">
        {t({
          en: 'Search products or stores...',
          ar: 'ابحثي عن منتج أو متجر...',
        })}
      </span>
    </button>
  );
}
