'use client';

import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
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
        'group block overflow-hidden rounded-2xl bg-white shadow-md',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:-translate-y-1',
        'border border-transparent hover:border-hero/20',
        className
      )}
    >
      {/* Banner with gradient + pattern */}
      <div className="relative">
        <div className="relative flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-plum via-hero/80 to-plum overflow-hidden">
          {/* Pattern overlay */}
          <div className="pattern-dots absolute inset-0" />
          <div className="pattern-diagonal absolute inset-0" />

          {/* Store name watermark */}
          <span className="text-lg font-bold text-white/15 tracking-widest uppercase select-none">
            {t(store.name)}
          </span>

          {/* Hover shine */}
          <div
            className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100',
              'bg-gradient-to-r from-transparent via-white/15 to-transparent',
              'translate-x-[-100%] group-hover:translate-x-[100%]',
              'transition-all duration-700 ease-in-out'
            )}
          />
        </div>

        {/* Store logo with ring effect */}
        <div className="absolute -bottom-7 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-hero/20 blur-md scale-110 group-hover:bg-hero/30 transition-colors" />
            {/* Logo circle */}
            <div className="relative flex size-14 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-hero to-plum text-xl font-bold text-white shadow-lg ring-2 ring-hero/20 group-hover:ring-hero/40 transition-all">
              {initial}
            </div>
          </div>
        </div>
      </div>

      {/* Info area with glass effect */}
      <div className="px-4 pb-5 pt-10 text-center">
        <h3 className="text-lg font-bold text-ink group-hover:text-hero transition-colors">
          {t(store.name)}
        </h3>
        <p className="mt-1.5 text-sm text-ink/60 line-clamp-2 leading-relaxed">
          {t(store.description)}
        </p>

        {/* Stats as pills */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-blush/60 px-3 py-1 text-xs font-medium text-plum">
            <ShoppingBag className="size-3" />
            {store.productCount} {t({ en: 'products', ar: 'منتج' })}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink/70">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {store.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
