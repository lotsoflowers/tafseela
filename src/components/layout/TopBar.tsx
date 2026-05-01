'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/shared/LanguageToggle';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

// Centered nav-bar title per route — iOS UINavigationBar pattern.
// Dynamic routes (/product/[id], /store/[id]) get a static placeholder
// since the actual product/store name is rendered by the page itself.
const ROUTE_TITLES: Record<string, BilingualText> = {
  '/cart':                  { en: 'My Cart',         ar: 'سلتي' },
  '/checkout':              { en: 'Checkout',        ar: 'إتمام الطلب' },
  '/wishlist':              { en: 'Wishlist',        ar: 'المفضلة' },
  '/profile':               { en: 'Profile',         ar: 'حسابي' },
  '/search':                { en: 'Search',          ar: 'البحث' },
  '/auth':                  { en: 'Sign in',         ar: 'تسجيل الدخول' },
  '/notifications':         { en: 'Notifications',   ar: 'الإشعارات' },
  '/returns':               { en: 'Returns',         ar: 'الإرجاع' },
  '/payment-confirmation':  { en: 'Order placed',    ar: 'تم الطلب' },
};

function titleFor(pathname: string): BilingualText | null {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.startsWith('/product/'))      return { en: 'Product',  ar: 'المنتج' };
  if (pathname.startsWith('/store/'))        return { en: 'Store',    ar: 'المتجر' };
  if (pathname.startsWith('/order/track/'))  return { en: 'Tracking', ar: 'تتبع الطلب' };
  if (pathname.startsWith('/order/'))        return { en: 'Order',    ar: 'الطلب' };
  if (pathname.startsWith('/review/'))       return { en: 'Review',   ar: 'تقييم' };
  return null;
}

export default function TopBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, direction } = useLanguage();
  const { itemCount } = useCart();

  const isHome = pathname === '/home';
  const ChevronBack = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const title = !isHome ? titleFor(pathname) : null;

  // iOS Large Title transition: when a <LargeTitle> exists on the page,
  // hide our centered bar title until the user has scrolled it off-screen.
  // When no <LargeTitle> is present (cart/wishlist/etc. before they're
  // converted), fall back to always-visible.
  const [showBarTitle, setShowBarTitle] = useState(true);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const largeTitle = document.querySelector('[data-large-title]');
    if (!largeTitle) {
      setShowBarTitle(true);
      return;
    }
    setShowBarTitle(false); // start hidden when a LargeTitle is present
    const observer = new IntersectionObserver(
      ([entry]) => setShowBarTitle(!entry.isIntersecting),
      { rootMargin: '-44px 0px 0px 0px' }
    );
    observer.observe(largeTitle);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      className={cn(
        // Three-column grid lets the title stay centered regardless of how
        // many actions sit on the trailing side. Slim vertical padding so
        // the bar reads as a slice of nav, not a full panel.
        'sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-2',
        'px-3 py-2',
        'glass-strong',
        className
      )}
    >
      {/* Leading slot — wordmark on /home, chevron on inner pages */}
      <div className="flex items-center justify-start min-w-9">
        {isHome ? (
          <Link href="/home" className="group inline-flex items-center gap-2 ps-1">
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
              'inline-flex h-9 items-center justify-center rounded-full',
              'pe-2 ps-1 -ms-1',
              'text-hero dark:text-soft transition-colors',
              'hover:bg-hero/10 dark:hover:bg-foreground/10',
              'active:scale-[0.96]'
            )}
          >
            <ChevronBack className="size-6" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Centered title — iOS UINavigationBar. Fades in only after the
          page-level LargeTitle scrolls off, mirroring UIKit's
          prefersLargeTitles transition. */}
      <div className="flex justify-center">
        {title && (
          <h1
            className={cn(
              'truncate text-[16px] font-semibold tracking-tight text-ink dark:text-foreground',
              'transition-opacity duration-200 ease-out',
              showBarTitle ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t(title)}
          </h1>
        )}
      </div>

      {/* Trailing actions — packed tight, no internal padding between */}
      <div className="flex items-center justify-end -me-1">
        <LanguageToggle />

        <Link
          href="/search"
          aria-label={t({ en: 'Search', ar: 'البحث' })}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-full',
            'text-ink/75 dark:text-foreground/75 transition-colors',
            'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10',
            'active:scale-[0.96]'
          )}
        >
          <Search className="size-[18px]" strokeWidth={2} />
        </Link>

        <Link
          href="/cart"
          aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
          className={cn(
            'relative inline-flex size-9 items-center justify-center rounded-full',
            'text-ink/75 dark:text-foreground/75 transition-colors',
            'hover:bg-hero/10 hover:text-hero dark:hover:bg-foreground/10',
            'active:scale-[0.96]'
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
