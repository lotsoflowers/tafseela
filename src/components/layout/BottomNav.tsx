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
      <div className="glass-strong rounded-2xl shadow-lg border border-white/40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            const isCart = href === '/cart';

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-all duration-200',
                  isActive ? 'text-hero' : 'text-ink/50 hover:text-ink/70'
                )}
              >
                {/* Active dot indicator */}
                <span
                  className={cn(
                    'mb-0.5 h-0.5 w-4 rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-hero opacity-100'
                      : 'bg-transparent opacity-0'
                  )}
                />
                <span className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  {isCart && itemCount > 0 && (
                    <span className="absolute -top-1.5 -end-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-hero to-plum px-0.5 text-[8px] font-bold text-white shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className={cn('transition-all duration-200', isActive && 'font-semibold')}>
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
