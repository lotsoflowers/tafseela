'use client';

import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/shared/LanguageToggle';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

export default function TopBar({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-4 py-3',
        'glass-strong',
        // Subtle hairline only — no heavy bottom border. Plum-tinted in dark.
        'border-b border-soft/15 dark:border-foreground/[0.06]',
        className
      )}
    >
      {/* Logo — gradient wordmark, slightly tighter tracking, with a small soft dot accent */}
      <Link
        href="/home"
        className="group inline-flex items-center gap-2"
      >
        <span
          aria-hidden
          className="size-2 rounded-full bg-gradient-to-br from-hero to-plum opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span className="gradient-text text-[19px] font-extrabold tracking-tight">
          {t({ en: 'Tafseela', ar: 'تفصيلة' })}
        </span>
      </Link>

      {/* Action cluster — every button shares the same shape, color treatment, and tap target */}
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
                // Ring picks up the page bg so the badge "floats" cleanly in both themes.
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
