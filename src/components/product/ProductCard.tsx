'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import WishlistButton from '@/components/shared/WishlistButton';
import PriceTag from '@/components/shared/PriceTag';
import FitBadge from '@/components/product/FitBadge';
import { stores } from '@/data/stores';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const categoryColors: Record<string, string> = {
  evening: 'bg-hero/20',
  casual: 'bg-soft/30',
  abayas: 'bg-plum/20',
  tops: 'bg-blush',
  dresses: 'bg-soft/20',
  coords: 'bg-cream',
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLanguage();
  const store = stores.find((s) => s.id === product.storeId);
  const bgColor = categoryColors[product.categoryId] || 'bg-blush';

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'block overflow-hidden rounded-lg bg-white shadow-sm transition-transform active:scale-[0.97]',
        className
      )}
    >
      {/* Image area */}
      <div className="relative">
        <div
          className={cn(
            'flex aspect-[3/4] items-center justify-center p-3',
            bgColor
          )}
        >
          <span className="text-center text-sm font-medium text-ink/70">
            {t(product.name)}
          </span>
        </div>

        {/* Wishlist button */}
        <WishlistButton
          productId={product.id}
          className="absolute end-2 top-2"
        />

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute start-2 top-2 rounded-full bg-hero px-2 py-0.5 text-xs font-medium text-white">
            {t({ en: 'Featured', ar: 'مميز' })}
          </span>
        )}

        {/* Out of stock overlay */}
        {product.isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink">
              {t({ en: 'Out of Stock', ar: 'نفذ المخزون' })}
            </span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="space-y-1 p-3">
        {/* Store name */}
        {store && (
          <p className="text-xs text-soft">
            {t(store.name)}
          </p>
        )}

        {/* Product name */}
        <p className="line-clamp-1 text-sm font-medium text-ink">
          {t(product.name)}
        </p>

        {/* Price */}
        <PriceTag amount={product.price} />

        {/* Fit badge */}
        {product.fit && <FitBadge fit={product.fit} />}
      </div>
    </Link>
  );
}
