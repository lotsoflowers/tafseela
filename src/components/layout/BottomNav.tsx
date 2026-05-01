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
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const isCart = href === '/cart';

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-hero' : 'text-ink/60'
              )}
            >
              <span className="relative">
                <Icon
                  className="h-5 w-5"
                  fill={isActive ? 'currentColor' : 'none'}
                />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -end-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-hero px-0.5 text-[8px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              <span>{t(label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
