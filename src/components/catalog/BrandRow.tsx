'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBrandFollow } from '@/contexts/BrandFollowContext';
import { cn, isLoadableImage } from '@/lib/utils';
import type { Store } from '@/types';

interface BrandRowProps {
  store: Store;
  className?: string;
}

export default function BrandRow({ store, className }: BrandRowProps) {
  const { t, direction } = useLanguage();
  const { isFollowing, toggleFollow } = useBrandFollow();
  const followed = isFollowing(store.id);
  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const hasLogo = isLoadableImage(store.logo);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        className
      )}
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blush/60 text-[13px] font-bold text-plum">
        {hasLogo ? (
          <Image src={store.logo} alt={t(store.name)} fill className="object-cover" />
        ) : (
          t(store.name).charAt(0)
        )}
      </span>

      <Link
        href={`/store/${store.id}`}
        className="min-w-0 flex-1"
      >
        <p className="truncate text-[15px] font-semibold leading-tight text-ink dark:text-foreground">
          {t(store.name)}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
          {t({
            en: `${store.productCount} products`,
            ar: `${store.productCount} منتج`,
          })}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => toggleFollow(store.id)}
        className={cn(
          'shrink-0 rounded-full px-4 min-h-[36px] py-2 text-[13px] font-semibold transition-[background-color,transform] active:scale-95',
          followed
            ? 'border border-soft/60 bg-transparent text-ink dark:border-foreground/20 dark:text-foreground'
            : 'bg-hero text-white shadow-pill hover:bg-hero/90'
        )}
      >
        {followed
          ? t({ en: 'Following', ar: 'متابعة' })
          : t({ en: 'Follow', ar: 'متابعة' })}
      </button>

      <Link
        href={`/store/${store.id}`}
        className="shrink-0 text-muted-foreground"
        aria-label={t({ en: 'Open brand', ar: 'افتح الماركة' })}
      >
        <Chevron className="size-5" strokeWidth={1.75} />
      </Link>
    </div>
  );
}
