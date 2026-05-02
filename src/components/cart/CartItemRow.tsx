'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { stores } from '@/data/stores';
import { formatPrice } from '@/lib/format';
import { cn, isLoadableImage } from '@/lib/utils';
import type { Product, CartItem } from '@/types';

type Variant = 'normal' | 'action-needed' | 'unavailable';

interface CartItemRowProps {
  product: Product;
  cartItem: CartItem;
  variant?: Variant;
}

export default function CartItemRow({ product, cartItem, variant = 'normal' }: CartItemRowProps) {
  const { t } = useLanguage();
  const { updateQuantity, removeItem } = useCart();
  const store = stores.find(s => s.id === product.storeId);
  const hasPhoto = isLoadableImage(product.images[0]);
  const grayscale = variant === 'unavailable';

  const incQty = () => updateQuantity(product.id, cartItem.size, cartItem.quantity + 1);
  const decQty = () => updateQuantity(product.id, cartItem.size, cartItem.quantity - 1);
  const remove = () => removeItem(product.id, cartItem.size);

  return (
    <div className="flex items-start gap-3 p-4">
      <Link
        href={`/product/${product.id}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-blush/40"
      >
        {hasPhoto && (
          <Image
            src={product.images[0]}
            alt={t(product.name)}
            fill
            sizes="80px"
            className={cn('object-cover', grayscale && 'grayscale')}
          />
        )}
        {variant === 'unavailable' && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/40 text-[10px] font-bold uppercase text-ink">
            {t({ en: 'Out of stock', ar: 'نفد' })}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <Link href={`/product/${product.id}`} className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold leading-tight text-ink dark:text-foreground">
              {t(product.name)}
            </p>
            <p className="mt-0.5 text-[14px] font-bold text-ink dark:text-foreground">
              {formatPrice(product.price)}
            </p>
            {store && (
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {t(store.name)}
              </p>
            )}
          </Link>
          <button
            type="button"
            onClick={remove}
            aria-label={t({ en: 'Remove', ar: 'إزالة' })}
            className="-mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[background-color,transform] hover:bg-cream active:scale-90 dark:hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <Link
            href={`/product/${product.id}`}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
              variant === 'action-needed'
                ? 'border border-red-400 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-400'
                : 'bg-cream text-plum dark:bg-secondary dark:text-foreground'
            )}
          >
            <span>{cartItem.size}</span>
            <RefreshCw className="size-3" strokeWidth={2} />
          </Link>

          {variant === 'unavailable' ? (
            <span className="text-[12px] font-semibold text-hero">
              {t({ en: 'Notify me', ar: 'أشعريني' })}
            </span>
          ) : variant === 'action-needed' ? (
            <span className="text-[12px] font-semibold text-red-500">
              {t({ en: 'Pick a size', ar: 'اختاري مقاس' })}
            </span>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-soft/40 bg-white px-1.5 py-1 dark:border-border dark:bg-card">
              <button
                type="button"
                onClick={decQty}
                aria-label={t({ en: 'Decrease', ar: 'إنقاص' })}
                disabled={cartItem.quantity <= 1}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-[background-color,transform] hover:bg-cream active:scale-90 disabled:opacity-30 dark:text-foreground dark:hover:bg-secondary"
              >
                <Minus className="size-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-5 text-center text-[14px] font-bold tabular-nums text-ink dark:text-foreground">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={incQty}
                aria-label={t({ en: 'Increase', ar: 'زيادة' })}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-[background-color,transform] hover:bg-cream active:scale-90 dark:text-foreground dark:hover:bg-secondary"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
