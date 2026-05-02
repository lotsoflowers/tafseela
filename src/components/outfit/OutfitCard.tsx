'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { stores } from '@/data/stores';
import { getOutfitTotalPrice } from '@/data/outfits';
import { cn, isLoadableImage } from '@/lib/utils';
import type { Outfit } from '@/types';
import WishlistButton from '@/components/shared/WishlistButton';

interface OutfitCardProps {
  outfit: Outfit;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeAspect = {
  sm: 'aspect-[3/4]',
  md: 'aspect-[4/5]',
  lg: 'aspect-[3/4]',
};

export default function OutfitCard({ outfit, className, size = 'md' }: OutfitCardProps) {
  const { t, language } = useLanguage();
  const store = outfit.brand ? stores.find(s => s.id === outfit.brand) : undefined;
  const total = getOutfitTotalPrice(outfit);
  const itemsLabel = t({
    en: `${outfit.items.length} items`,
    ar: `${outfit.items.length} قطع`,
  });
  const currency = language === 'ar' ? 'د.ك' : 'KD';

  return (
    <Link
      href={`/outfit/${outfit.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-3xl bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] animate-fade-in-up dark:bg-card',
        className
      )}
    >
      <div className={cn('relative w-full overflow-hidden bg-gradient-to-br from-blush via-soft/60 to-cream', sizeAspect[size])}>
        {isLoadableImage(outfit.lifestylePhoto) && (
          <Image
            src={outfit.lifestylePhoto}
            alt={t(outfit.name)}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Gradient scrim at the bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {outfit.isFeatured && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-hero px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            <Sparkle className="size-3" fill="currentColor" strokeWidth={1.5} />
            {t({ en: 'New', ar: 'جديد' })}
          </span>
        )}

        <WishlistButton productId={`outfit:${outfit.id}`} className="absolute end-3 top-3" />

        {/* Bottom info on photo */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90">
            {itemsLabel}
            <span className="mx-1.5 opacity-70">·</span>
            <span>
              {currency} {total.toFixed(total % 1 === 0 ? 0 : 3)}
            </span>
          </p>
          <p className="mt-1 truncate text-[15px] font-bold leading-tight">
            {t(outfit.name)}
          </p>
          {store && (
            <p className="mt-0.5 truncate text-[11px] opacity-85">{t(store.name)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
