'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

/**
 * Floating action on top of the home hero photo — just the cart.
 * Search lives on the bottom nav, language + theme live in
 * Profile → Preferences.
 */
export default function HeroOverlayActions({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <div className={cn('flex items-center', className)}>
      <Link
        href="/cart"
        aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
        className={cn(
          'relative inline-flex size-10 items-center justify-center rounded-full',
          'text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
          'transition-colors hover:bg-white/15'
        )}
      >
        <ShoppingBag className="size-5" strokeWidth={2} />
        {itemCount > 0 && (
          <span
            className={cn(
              'absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center px-1',
              'rounded-full bg-hero text-[9px] font-bold text-white',
              'ring-2 ring-plum/80',
              'animate-badge-pulse'
            )}
          >
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  );
}
