'use client';

import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/shared/LanguageToggle';
import { cn } from '@/lib/utils';

export default function TopBar({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100',
        className
      )}
    >
      {/* Logo */}
      <Link href="/home" className="font-bold text-xl text-plum">
        {t({ en: 'Tafseela', ar: 'تفصيلة' })}
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <LanguageToggle />

        <Link
          href="/search"
          className="p-2 text-ink/70 hover:text-ink transition-colors"
          aria-label={t({ en: 'Search', ar: 'البحث' })}
        >
          <Search className="h-5 w-5" />
        </Link>

        <Link
          href="/cart"
          className="relative p-2 text-ink/70 hover:text-ink transition-colors"
          aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hero px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
