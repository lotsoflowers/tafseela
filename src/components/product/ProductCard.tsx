'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import WishlistButton from '@/components/shared/WishlistButton';
import PriceTag from '@/components/shared/PriceTag';
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
  casual:  'from-soft via-blush to-soft/80',
  abayas:  'from-plum via-hero/60 to-plum/90',
  tops:    'from-blush via-soft/60 to-cream',
  dresses: 'from-soft/80 via-hero/40 to-blush',
  coords:  'from-cream via-blush to-soft/60',
  skirts:  'from-blush via-soft/40 to-cream',
  vests:   'from-plum/80 via-hero/40 to-soft/60',
  outerwear: 'from-soft/70 via-blush to-cream',
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLanguage();
  const store = stores.find((s) => s.id === product.storeId);
  const gradient = categoryGradients[product.categoryId] ?? 'from-blush via-soft to-cream';
  const hasPhoto = isExternalImage(product.images[0]);

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'group block overflow-hidden rounded-3xl bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] animate-fade-in-up dark:bg-card',
        className
      )}
    >
      {/* Image stage — image-dominant, full-bleed inside the card. The
          stage itself uses an inner rounded-3xl so the photo's own corners
          read as "inset" relative to the surrounding card padding. */}
      <div className="relative p-2 pb-0">
        <div
          className={cn(
            'relative overflow-hidden rounded-[20px] aspect-[4/5]',
            hasPhoto ? 'bg-blush/40 dark:bg-secondary/40' : ['bg-gradient-to-br', gradient]
          )}
        >
          {hasPhoto ? (
            <Image
              src={product.images[0]}
              alt={t(product.name)}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="pattern-dots absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <span className="text-base font-semibold text-white/90 leading-snug drop-shadow-sm">
                  {t(product.name)}
                </span>
              </div>
            </>
          )}

          {/* Top-leading: small featured chip — only when featured */}
          {product.isFeatured && (
            <span
              className={cn(
                'absolute top-3 start-3',
                'flex size-9 items-center justify-center rounded-full',
                'bg-white/85 dark:bg-card/85 backdrop-blur-md',
                'shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
              )}
              aria-label="Featured"
            >
              <Sparkles className="size-[16px] text-hero" fill="currentColor" />
            </span>
          )}

          {/* Top-trailing: wishlist heart */}
          <WishlistButton
            productId={product.id}
            className="absolute end-3 top-3"
          />

          {/* Out-of-stock overlay */}
          {product.isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
              <span className="rounded-full bg-white/95 px-4 py-1.5 text-[13px] font-bold text-ink shadow-lg">
                {t({ en: 'Out of Stock', ar: 'نفد المخزون' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info — name + price on one row, store subtitle below */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold leading-tight text-ink dark:text-foreground">
            {t(product.name)}
          </h3>
          <PriceTag
            amount={product.price}
            className={cn(
              'shrink-0 whitespace-nowrap',
              '[&>span:first-child]:text-[15px]',
              '[&>span:first-child]:font-bold',
              '[&>span:first-child]:text-ink',
              'dark:[&>span:first-child]:text-foreground'
            )}
          />
        </div>
        {store && (
          <p className="mt-1 truncate text-[12px] leading-snug text-ink/45 dark:text-foreground/50">
            {t(store.name)}
          </p>
        )}
      </div>
    </Link>
  );
}
