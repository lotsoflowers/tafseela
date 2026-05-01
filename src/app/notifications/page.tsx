'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageShell from '@/components/layout/PageShell';
import { Switch } from '@/components/ui/switch';
import type { BilingualText } from '@/types';

interface NotificationSetting {
  id: string;
  label: BilingualText;
  description: BilingualText;
  defaultOn: boolean;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'order-confirmed',
    label: { en: 'Order confirmed', ar: 'تأكيد الطلب' },
    description: { en: 'When your order is confirmed', ar: 'عند تأكيد طلبج' },
    defaultOn: true,
  },
  {
    id: 'shipping-updates',
    label: { en: 'Shipping updates', ar: 'تحديثات الشحن' },
    description: { en: 'Track your delivery status', ar: 'تتبعي حالة التوصيل' },
    defaultOn: true,
  },
  {
    id: 'abandoned-cart',
    label: { en: 'Abandoned cart reminder', ar: 'السلة المتروكة' },
    description: { en: 'Reminder about items in your cart', ar: 'تذكير بالمنتجات في سلتج' },
    defaultOn: true,
  },
  {
    id: 'back-in-stock',
    label: { en: 'Back in stock', ar: 'رجوع المنتج' },
    description: { en: 'When wishlisted items are back', ar: 'عند رجوع منتجات المفضلة' },
    defaultOn: true,
  },
  {
    id: 'promotions',
    label: { en: 'Promotions & offers', ar: 'عروض وتخفيضات' },
    description: { en: 'Sales and special deals', ar: 'خصومات وعروض خاصة' },
    defaultOn: true,
  },
  {
    id: 'new-drops',
    label: { en: 'New drops', ar: 'منتجات جديدة' },
    description: { en: 'New arrivals from your favorite stores', ar: 'وصول منتجات جديدة من متاجرج المفضلة' },
    defaultOn: true,
  },
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn]))
  );

  const toggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-cream dark:bg-background px-4 pt-4 pb-6 animate-fade-in">
        <h1 className="text-xl font-bold text-ink dark:text-foreground mb-4">
          {t({ en: 'Notification Settings', ar: 'إعدادات الإشعارات' })}
        </h1>

        <div className="space-y-2">
          {NOTIFICATION_SETTINGS.map((setting) => (
            <div
              key={setting.id}
              className="bg-white dark:bg-card rounded-xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex-1 me-4">
                <p className="text-sm font-medium text-ink dark:text-foreground">{t(setting.label)}</p>
                <p className="text-xs text-ink/50 mt-0.5">{t(setting.description)}</p>
              </div>
              <Switch
                checked={settings[setting.id]}
                onCheckedChange={() => toggle(setting.id)}
                className="data-[state=checked]:bg-hero"
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
