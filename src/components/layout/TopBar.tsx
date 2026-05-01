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
        'glass-strong border-b border-white/30',
        className
      )}
    >
      {/* Logo with gradient text */}
      <Link href="/home" className="gradient-text text-xl font-extrabold tracking-tight">
        {t({ en: 'Tafseela', ar: 'تفصيلة' })}
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <LanguageToggle />

        <Link
          href="/search"
          className="rounded-full p-2 text-ink/60 hover:text-hero hover:bg-hero/10 transition-all duration-200 dark:text-foreground/70 dark:hover:bg-foreground/10"
          aria-label={t({ en: 'Search', ar: 'البحث' })}
        >
          <Search className="h-5 w-5" />
        </Link>

        <Link
          href="/cart"
          className="relative rounded-full p-2 text-ink/60 hover:text-hero hover:bg-hero/10 transition-all duration-200 dark:text-foreground/70 dark:hover:bg-foreground/10"
          aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -end-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-hero to-plum px-1 text-[10px] font-bold text-white shadow-sm animate-badge-pulse">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
