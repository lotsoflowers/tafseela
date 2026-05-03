'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchField } from '@/components/glass';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  onClick?: () => void;
}

export default function SearchBar({ className, onClick }: SearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleFocus = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/search');
    }
  };

  return (
    <div className={cn('w-full', className)} onClickCapture={handleFocus}>
      <SearchField
        placeholder={t({
          en: 'Search products or stores',
          ar: 'ابحثي عن منتج أو متجر',
        })}
      />
    </div>
  );
}
