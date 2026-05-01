'use client';

import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/shared/LanguageToggle';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

/**
 * Floating action cluster designed to sit on top of the home hero photo.
 * Fully transparent backgrounds — the icons reverse out of the photo with
 * a subtle drop-shadow + glass-on-hover. No surrounding "header" feel.
 */
export default function HeroOverlayActions({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  const buttonClass = cn(
    'inline-flex size-10 items-center justify-center rounded-full',
    'text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
    'transition-colors',
    'hover:bg-white/15'
  );

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <ThemeToggle className="text-white/95 hover:bg-white/15 dark:hover:bg-white/15 size-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
      <LanguageToggle className="text-white/95 hover:bg-white/15 dark:hover:bg-white/15 size-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />

      <Link
        href="/search"
        aria-label={t({ en: 'Search', ar: 'البحث' })}
        className={buttonClass}
      >
        <Search className="size-5" strokeWidth={2} />
      </Link>

      <Link
        href="/cart"
        aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
        className={cn(buttonClass, 'relative')}
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
