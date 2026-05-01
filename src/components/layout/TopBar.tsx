'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/shared/LanguageToggle';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

export default function TopBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, direction } = useLanguage();
  const { itemCount } = useCart();

  // /home is the only screen where the wordmark stays — every other route
  // gets a back arrow in the wordmark slot, since users actually arrive at
  // those routes via navigation and need a way out.
  const isHome = pathname === '/home';
  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-4 py-3',
        'glass-strong',
        'border-b border-soft/15 dark:border-foreground/[0.06]',
        className
      )}
    >
      {/* Leading slot — back arrow on inner pages, wordmark on /home */}
      {isHome ? (
        <Link href="/home" className="group inline-flex items-center gap-2">
          <span
            aria-hidden
            className="size-2 rounded-full bg-gradient-to-br from-hero to-plum opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="gradient-text text-[19px] font-extrabold tracking-tight">
            {t({ en: 'Tafseela', ar: 'تفصيلة' })}
          </span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Go back', ar: 'رجوع' })}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-full',
            'text-ink/70 dark:text-foreground/75 transition-colors',
            'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10'
          )}
        >
          <BackIcon className="size-[18px]" strokeWidth={2.25} />
        </button>
      )}

      {/* Action cluster — same shape, color treatment, and tap target across all four */}
      <div className="flex items-center gap-0.5">
        <ThemeToggle />
        <LanguageToggle />

        <Link
          href="/search"
          aria-label={t({ en: 'Search', ar: 'البحث' })}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-full',
            'text-ink/70 dark:text-foreground/75 transition-colors',
            'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10'
          )}
        >
          <Search className="size-[18px]" strokeWidth={2} />
        </Link>

        <Link
          href="/cart"
          aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
          className={cn(
            'relative inline-flex size-9 items-center justify-center rounded-full',
            'text-ink/70 dark:text-foreground/75 transition-colors',
            'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10'
          )}
        >
          <ShoppingBag className="size-[18px]" strokeWidth={2} />
          {itemCount > 0 && (
            <span
              className={cn(
                'absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center px-1',
                'rounded-full bg-hero text-[9px] font-bold text-white',
                'ring-2 ring-background',
                'animate-badge-pulse'
              )}
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
