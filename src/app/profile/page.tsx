'use client';

import Link from 'next/link';
import {
  Package, MapPin, Heart, Bell, Globe, FileText,
  MessageCircle, LogOut, ChevronRight, ChevronLeft, User,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import PageShell from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

type IconTint = 'hero' | 'plum' | 'soft' | 'amber' | 'green' | 'red' | 'blue';

interface MenuItem {
  icon: React.ReactNode;
  iconTint: IconTint;
  label: BilingualText;
  href?: string;
  action?: () => void;
  external?: boolean;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

interface MenuSection {
  header?: BilingualText;
  items: MenuItem[];
}

// iOS-style tinted icon background — colored fill + white icon, rounded square.
const tintBg: Record<IconTint, string> = {
  hero:  'bg-hero',
  plum:  'bg-plum',
  soft:  'bg-soft',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  red:   'bg-red-500',
  blue:  'bg-sky-500',
};

export default function ProfilePage() {
  const { t, language, direction, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const menuSections: MenuSection[] = [
    {
      header: { en: 'Shopping', ar: 'تسوق' },
      items: [
        {
          icon: <Package className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'hero',
          label: { en: 'My orders', ar: 'طلباتي' },
          href: '/order/mock-order-1',
        },
        {
          icon: <Heart className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'red',
          label: { en: 'Wishlist', ar: 'المفضلة' },
          href: '/wishlist',
        },
        {
          icon: <MapPin className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'green',
          label: { en: 'My addresses', ar: 'عناويني' },
          href: '#',
        },
      ],
    },
    {
      header: { en: 'Preferences', ar: 'التفضيلات' },
      items: [
        {
          icon: <Bell className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'amber',
          label: { en: 'Notifications', ar: 'الإشعارات' },
          href: '/notifications',
        },
        {
          icon: <Globe className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'blue',
          label: { en: 'Language', ar: 'اللغة' },
          action: toggleLanguage,
          trailing: (
            <span className="text-[13px] text-ink/45 dark:text-foreground/45">
              {language === 'ar' ? 'العربية' : 'English'}
            </span>
          ),
        },
      ],
    },
    {
      header: { en: 'Support', ar: 'الدعم' },
      items: [
        {
          icon: <FileText className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'plum',
          label: { en: 'Returns & Refunds', ar: 'سياسة الإرجاع' },
          href: '/returns',
        },
        {
          icon: <MessageCircle className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'green',
          label: { en: 'Contact us', ar: 'تواصلي معنا' },
          href: 'https://wa.me/96599991234',
          external: true,
        },
      ],
    },
    {
      items: [
        {
          icon: <LogOut className="size-[18px]" strokeWidth={2.25} />,
          iconTint: 'red',
          label: { en: 'Sign out', ar: 'تسجيل الخروج' },
          action: logout,
          destructive: true,
        },
      ],
    },
  ];

  return (
    <PageShell>
      <div className="min-h-screen bg-cream dark:bg-background px-4 pt-2 pb-6 animate-fade-in">
        {/* iOS large title */}
        <h1 className="text-[28px] font-bold tracking-tight text-ink dark:text-foreground mb-5">
          {t({ en: 'Profile', ar: 'حسابي' })}
        </h1>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blush dark:bg-secondary flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-soft" />
            </div>
            <p className="text-ink dark:text-foreground font-medium text-lg mb-2">
              {t({ en: 'Sign in to your account', ar: 'سجلي دخولج' })}
            </p>
            <p className="text-ink/50 text-sm mb-6">
              {t({ en: 'Track orders, save addresses, and more', ar: 'تتبعي طلباتج وحفظي عناوينج وأكثر' })}
            </p>
            <Link href="/auth">
              <Button className="bg-hero hover:bg-hero/90 text-white rounded-full px-8">
                {t({ en: 'Sign in', ar: 'تسجيل الدخول' })}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-hero flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-lg font-bold text-ink dark:text-foreground">{user?.name}</p>
                <p className="text-sm text-ink/60">{user?.phone}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: { en: 'Orders', ar: 'طلبات' }, value: '1' },
                { label: { en: 'Reviews', ar: 'تقييمات' }, value: '0' },
                { label: { en: 'Wishlist', ar: 'المفضلة' }, value: String(wishlistItems.length) },
              ].map((stat) => (
                <div key={stat.label.en} className="bg-white dark:bg-card rounded-lg p-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-hero">{stat.value}</p>
                  <p className="text-xs text-ink/60">{t(stat.label)}</p>
                </div>
              ))}
            </div>

            {/* iOS-style grouped settings list */}
            <div className="space-y-6">
              {menuSections.map((section, si) => (
                <div key={si}>
                  {section.header && (
                    <p className="px-4 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45 dark:text-foreground/45">
                      {t(section.header)}
                    </p>
                  )}
                  <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-[0_1px_2px_rgba(92,10,61,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {section.items.map((item, idx) => {
                      const isLast = idx === section.items.length - 1;
                      const content = (
                        <div className={cn(
                          'flex items-center gap-3 px-3.5 py-2.5 transition-colors',
                          'active:bg-ink/[0.04] dark:active:bg-foreground/[0.06]'
                        )}>
                          {/* Tinted icon square */}
                          <span className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-[7px] text-white',
                            tintBg[item.iconTint]
                          )}>
                            {item.icon}
                          </span>
                          <span className={cn(
                            'flex-1 text-[15px] font-medium',
                            item.destructive
                              ? 'text-red-500'
                              : 'text-ink dark:text-foreground'
                          )}>
                            {t(item.label)}
                          </span>
                          {item.trailing && (
                            <span className="shrink-0">{item.trailing}</span>
                          )}
                          {!item.destructive && (
                            <Chevron className="size-4 shrink-0 text-ink/30 dark:text-foreground/30" strokeWidth={2.5} />
                          )}
                        </div>
                      );

                      const wrapperClass = cn(
                        'block w-full text-start',
                        // Hairline separator between rows, indented to align with the text (not the icon)
                        !isLast && 'border-b border-ink/[0.06] dark:border-foreground/[0.06] [&>div]:[mask-image:linear-gradient(to_right,transparent_3rem,black_3rem)]'
                      );

                      if (item.href && !item.external) {
                        return <Link key={item.label.en} href={item.href} className={wrapperClass}>{content}</Link>;
                      }
                      if (item.href && item.external) {
                        return (
                          <a key={item.label.en} href={item.href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
                            {content}
                          </a>
                        );
                      }
                      if (item.action) {
                        return (
                          <button key={item.label.en} type="button" onClick={item.action} className={wrapperClass}>
                            {content}
                          </button>
                        );
                      }
                      return <div key={item.label.en} className={wrapperClass}>{content}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
