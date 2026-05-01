'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import WishlistButton from '@/components/shared/WishlistButton';
import PriceTag from '@/components/shared/PriceTag';
import FitBadge from '@/components/product/FitBadge';
import { stores } from '@/data/stores';

function isExternalImage(src: string | undefined): src is string {
  return !!src && /^https?:\/\//.test(src);
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const categoryGradients: Record<string, string> = {
  evening: 'from-hero via-plum to-hero/80',
  casual: 'from-soft via-blush to-soft/80',
  abayas: 'from-plum via-hero/60 to-plum/90',
  tops: 'from-blush via-soft/60 to-cream',
  dresses: 'from-soft/80 via-hero/40 to-blush',
  coords: 'from-cream via-blush to-soft/60',
};

const categoryMotifs: Record<string, string> = {
  evening: '✦',
  casual: '✶',
  abayas: '♢',
  tops: '♡',
  dresses: '✧',
  coords: '◇',
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLanguage();
  const store = stores.find((s) => s.id === product.storeId);
  const gradient = categoryGradients[product.categoryId] || 'from-blush via-soft to-cream';
  const motif = categoryMotifs[product.categoryId] || '✦';

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-white dark:bg-card',
        // Layered, soft brand-tinted shadow — modern fashion-app feel
        'shadow-[0_1px_2px_rgba(92,10,61,0.04),0_4px_16px_rgba(92,10,61,0.06)]',
        'dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.4)]',
        'transition-[transform,box-shadow,border-color] duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(191,6,106,0.06),0_12px_28px_rgba(191,6,106,0.10)]',
        'dark:hover:shadow-[0_2px_4px_rgba(237,147,177,0.12),0_12px_28px_rgba(237,147,177,0.18)]',
        'border border-transparent hover:border-hero/15',
        'animate-fade-in-up',
        className
      )}
    >
      {/* Image area — real photo when an external URL is provided, gradient otherwise */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            'flex aspect-[3/4] items-center justify-center relative',
            isExternalImage(product.images[0]) ? 'bg-blush/40' : ['bg-gradient-to-br', gradient]
          )}
        >
          {isExternalImage(product.images[0]) ? (
            <Image
              src={product.images[0]}
              alt={t(product.name)}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Pattern overlay */}
              <div className="pattern-dots absolute inset-0" />
              <div className="pattern-diagonal absolute inset-0" />

              {/* Decorative motifs */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <span className="absolute top-3 start-3 text-white/10 text-2xl">{motif}</span>
                <span className="absolute bottom-4 end-4 text-white/10 text-3xl rotate-12">{motif}</span>
                <span className="absolute top-1/3 end-6 text-white/[0.07] text-xl -rotate-12">{motif}</span>
              </div>

              {/* Product name display */}
              <div className="relative z-10 px-4 text-center">
                <span className="text-base font-semibold text-white/90 leading-snug drop-shadow-sm">
                  {t(product.name)}
                </span>
              </div>
            </>
          )}

          {/* Hover shine effect */}
          <div
            className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100 z-10 pointer-events-none',
              'bg-gradient-to-r from-transparent via-white/20 to-transparent',
              'translate-x-[-100%] group-hover:translate-x-[100%]',
              'transition-all duration-700 ease-in-out'
            )}
          />
        </div>

        {/* Wishlist button */}
        <WishlistButton
          productId={product.id}
          className="absolute end-2 top-2 z-20"
        />

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute start-2 top-2 z-20 rounded-full bg-gradient-to-r from-hero to-plum px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            {t({ en: 'Featured', ar: 'مميز' })}
          </span>
        )}

        {/* Out of stock overlay */}
        {product.isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-ink shadow-lg">
              {t({ en: 'Out of Stock', ar: 'نفد المخزون' })}
            </span>
          </div>
        )}
      </div>

      {/* Info area — refined editorial type hierarchy */}
      <div className="space-y-1.5 p-3.5">
        {/* Store name — uppercase tracking, sparser */}
        {store && (
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-hero/80">
            {t(store.name)}
          </p>
        )}

        {/* Product name — tighter line height, bolder */}
        <p className="line-clamp-2 min-h-[2.4em] text-sm font-semibold leading-[1.2] text-ink dark:text-foreground">
          {t(product.name)}
        </p>

        {/* Price + fit row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <PriceTag
            amount={product.price}
            className="[&>span:first-child]:text-hero [&>span:first-child]:text-base [&>span:first-child]:font-bold"
          />
          {product.fit && <FitBadge fit={product.fit} className="shrink-0" />}
        </div>
      </div>
    </Link>
  );
}
