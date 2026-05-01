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
        'flex w-full items-center gap-2 rounded-full border border-soft bg-white px-4 py-3 text-start',
        'transition-colors hover:border-hero/40 active:bg-blush/30',
        className
      )}
    >
      <Search className="size-5 shrink-0 text-soft" />
      <span className="text-sm text-soft">
        {t({
          en: 'Search products or stores',
          ar: 'ابحثي عن منتج أو متجر',
        })}
      </span>
    </button>
  );
}
