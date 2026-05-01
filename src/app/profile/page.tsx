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
import { Separator } from '@/components/ui/separator';
import type { BilingualText } from '@/types';

interface MenuItem {
  icon: React.ReactNode;
  label: BilingualText;
  href?: string;
  action?: () => void;
  external?: boolean;
}

export default function ProfilePage() {
  const { t, language, direction, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const menuItems: MenuItem[] = [
    {
      icon: <Package className="w-5 h-5" />,
      label: { en: 'My orders', ar: 'طلباتي' },
      href: '/order/mock-order-1',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: { en: 'My addresses', ar: 'عناويني' },
      href: '#',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: { en: 'Wishlist', ar: 'المفضلة' },
      href: '/wishlist',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: { en: 'Notification settings', ar: 'إعدادات الإشعارات' },
      href: '/notifications',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: { en: 'Language', ar: 'اللغة' },
      action: toggleLanguage,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: { en: 'Returns & Refunds', ar: 'سياسة الإرجاع' },
      href: '/returns',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: { en: 'Contact us', ar: 'تواصلي معنا' },
      href: 'https://wa.me/96599991234',
      external: true,
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: { en: 'Sign out', ar: 'تسجيل الخروج' },
      action: logout,
    },
  ];

  return (
    <PageShell>
      <div className="min-h-screen bg-cream px-4 pt-4 pb-6 animate-fade-in">
        <h1 className="text-xl font-bold text-ink mb-6">
          {t({ en: 'My Profile', ar: 'حسابي' })}
        </h1>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-soft" />
            </div>
            <p className="text-ink font-medium text-lg mb-2">
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
                <p className="text-lg font-bold text-ink">{user?.name}</p>
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
                <div key={stat.label.en} className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-xl font-bold text-hero">{stat.value}</p>
                  <p className="text-xs text-ink/60">{t(stat.label)}</p>
                </div>
              ))}
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {menuItems.map((item, index) => {
                const content = (
                  <div className="flex items-center justify-between px-4 py-3.5 hover:bg-blush/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 text-ink">
                      <span className="text-soft">{item.icon}</span>
                      <span className="text-sm font-medium">{t(item.label)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.label.en === 'Language' && (
                        <span className="text-xs text-ink/50 bg-blush px-2 py-0.5 rounded">
                          {language === 'ar' ? 'العربية' : 'English'}
                        </span>
                      )}
                      <Chevron className="w-4 h-4 text-ink/30" />
                    </div>
                  </div>
                );

                return (
                  <div key={item.label.en}>
                    {item.href && !item.external ? (
                      <Link href={item.href}>{content}</Link>
                    ) : item.href && item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
                    ) : item.action ? (
                      <button className="w-full text-start" onClick={item.action}>{content}</button>
                    ) : (
                      content
                    )}
                    {index < menuItems.length - 1 && <Separator className="bg-cream" />}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
