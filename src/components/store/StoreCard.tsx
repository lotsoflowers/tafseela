'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Store } from '@/types';

interface StoreCardProps {
  store: Store;
  className?: string;
}

export default function StoreCard({ store, className }: StoreCardProps) {
  const { t } = useLanguage();

  const initial = t(store.name).charAt(0).toUpperCase();

  return (
    <Link
      href={`/store/${store.id}`}
      className={cn(
        'block overflow-hidden rounded-lg bg-white shadow-sm transition-transform active:scale-[0.98]',
        className
      )}
    >
      {/* Banner */}
      <div className="relative">
        <div className="flex aspect-[16/7] items-center justify-center bg-plum">
          <span className="text-lg font-bold text-white/30">
            {t(store.name)}
          </span>
        </div>

        {/* Store logo */}
        <div className="absolute -bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-white bg-hero text-xl font-bold text-white shadow-md">
            {initial}
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="px-4 pb-4 pt-8 text-center">
        <h3 className="text-lg font-bold text-ink">{t(store.name)}</h3>
        <p className="mt-1 text-sm text-soft">{t(store.description)}</p>

        {/* Stats row */}
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-ink/70">
          <span>
            {store.productCount}{' '}
            {t({ en: 'products', ar: 'منتج' })}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {store.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
