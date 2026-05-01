'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/home', icon: Home, label: { en: 'Home', ar: 'الرئيسية' } },
  { href: '/search', icon: Search, label: { en: 'Search', ar: 'البحث' } },
  { href: '/cart', icon: ShoppingBag, label: { en: 'Cart', ar: 'سلتي' } },
  { href: '/wishlist', icon: Heart, label: { en: 'Wishlist', ar: 'المفضلة' } },
  { href: '/profile', icon: User, label: { en: 'Profile', ar: 'حسابي' } },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-3 inset-x-3 z-50 lg:hidden">
      <div className="glass-strong rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(92,10,61,0.08),0_2px_4px_rgba(92,10,61,0.04)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-1.5 py-1.5">
          {tabs.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            const isCart = href === '/cart';

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group/tab relative flex min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-medium',
                  'transition-[color,background-color] duration-300',
                  isActive
                    ? 'bg-hero/10 text-hero'
                    : 'text-ink/45 hover:text-ink/70 hover:bg-blush/40'
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn(
                      'h-[22px] w-[22px] transition-transform duration-300 ease-out',
                      isActive && 'scale-110'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  {isCart && itemCount > 0 && (
                    <span className="absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-hero to-plum px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white/80 animate-badge-pulse">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'leading-none transition-all duration-300',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {t(label)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
