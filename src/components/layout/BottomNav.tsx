'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/home', icon: Home, label: { en: 'Home', ar: 'الرئيسية' } },
  { href: '/catalog', icon: LayoutGrid, label: { en: 'Catalog', ar: 'الفئات' } },
  { href: '/wishlist', icon: Heart, label: { en: 'Saved', ar: 'المحفوظات' } },
  { href: '/cart', icon: ShoppingBag, label: { en: 'Bag', ar: 'الحقيبة' } },
  { href: '/profile', icon: User, label: { en: 'Account', ar: 'الحساب' } },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        'border-t border-blush/60 bg-white/95 backdrop-blur-md dark:border-border/60 dark:bg-card/95',
        'pb-[env(safe-area-inset-bottom)]'
      )}
    >
      <div className="flex items-stretch justify-around px-2 pt-2 pb-1">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const isCart = href === '/cart';

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group/tab relative flex min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[10px] font-medium',
                'transition-colors duration-200'
              )}
            >
              <span className="relative">
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -inset-x-3 -inset-y-1.5 -z-10 rounded-full bg-hero/10 dark:bg-hero/20 animate-nav-pill"
                  />
                )}
                <Icon
                  className={cn(
                    'h-[22px] w-[22px] transition-all duration-200',
                    isActive ? 'text-hero scale-105' : 'text-ink/55 dark:text-foreground/55'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                {isCart && itemCount > 0 && (
                  <span
                    className="absolute -end-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-hero px-1 text-[10px] font-bold text-white shadow-pill ring-2 ring-white dark:ring-card animate-pop-in"
                  >
                    {itemCount}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'mt-0.5 leading-none transition-colors duration-200',
                  isActive
                    ? 'font-semibold text-hero'
                    : 'font-medium text-ink/55 dark:text-foreground/55'
                )}
              >
                {t(label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
