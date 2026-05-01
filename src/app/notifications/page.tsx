'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

interface NotificationSetting {
  id: string;
  label: BilingualText;
  description: BilingualText;
  defaultOn: boolean;
}

interface NotificationGroup {
  header: BilingualText;
  footer?: BilingualText;
  items: NotificationSetting[];
}

const NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    header: { en: 'Order Updates', ar: 'تحديثات الطلب' },
    footer: {
      en: 'Get notified about your order status and delivery progress.',
      ar: 'استلمي إشعارات عن حالة طلبج وتقدم التوصيل.',
    },
    items: [
      {
        id: 'order-confirmed',
        label: { en: 'Order confirmed', ar: 'تأكيد الطلب' },
        description: { en: 'When your order is placed', ar: 'عند تأكيد طلبج' },
        defaultOn: true,
      },
      {
        id: 'shipping-updates',
        label: { en: 'Shipping updates', ar: 'تحديثات الشحن' },
        description: { en: 'Track your delivery status', ar: 'تتبعي حالة التوصيل' },
        defaultOn: true,
      },
    ],
  },
  {
    header: { en: 'Shopping', ar: 'التسوق' },
    items: [
      {
        id: 'abandoned-cart',
        label: { en: 'Cart reminders', ar: 'تذكير السلة' },
        description: { en: 'Reminder about items in your cart', ar: 'تذكير بالمنتجات في سلتج' },
        defaultOn: true,
      },
      {
        id: 'back-in-stock',
        label: { en: 'Back in stock', ar: 'رجوع المنتج' },
        description: { en: 'When wishlisted items return', ar: 'عند رجوع منتجات المفضلة' },
        defaultOn: true,
      },
    ],
  },
  {
    header: { en: 'Marketing', ar: 'العروض' },
    footer: {
      en: 'Turn these off if you only want order-related notifications.',
      ar: 'اغلقي هذه الخيارات إذا كنتي ترغبين فقط بإشعارات الطلبات.',
    },
    items: [
      {
        id: 'promotions',
        label: { en: 'Promotions & offers', ar: 'عروض وتخفيضات' },
        description: { en: 'Sales and special deals', ar: 'خصومات وعروض خاصة' },
        defaultOn: true,
      },
      {
        id: 'new-drops',
        label: { en: 'New drops', ar: 'منتجات جديدة' },
        description: { en: 'New arrivals from favorite stores', ar: 'وصول جديد من متاجرج المفضلة' },
        defaultOn: true,
      },
    ],
  },
];

export default function NotificationsPage() {
  const { t } = useLanguage();

  const allItems = NOTIFICATION_GROUPS.flatMap((g) => g.items);
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(allItems.map((s) => [s.id, s.defaultOn]))
  );

  const toggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-cream dark:bg-background pb-8 animate-fade-in">
        <LargeTitle title={{ en: 'Notifications', ar: 'الإشعارات' }} />

        <div className="space-y-6 px-4">
          {NOTIFICATION_GROUPS.map((group, gi) => (
            <section key={gi}>
              {/* Section header — small uppercase tracked, iOS pattern */}
              <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45 dark:text-foreground/45">
                {t(group.header)}
              </p>

              {/* Inset-grouped list card */}
              <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-[0_1px_2px_rgba(92,10,61,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                {group.items.map((item, idx) => {
                  const isLast = idx === group.items.length - 1;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3',
                        // Hairline separator that doesn't extend under the toggle column
                        !isLast && 'border-b border-ink/[0.06] dark:border-foreground/[0.08]'
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-ink dark:text-foreground">
                          {t(item.label)}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-snug text-ink/55 dark:text-foreground/55">
                          {t(item.description)}
                        </p>
                      </div>
                      <Switch
                        checked={settings[item.id]}
                        onCheckedChange={() => toggle(item.id)}
                        className="shrink-0 data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Section footer — explanatory caption, iOS pattern */}
              {group.footer && (
                <p className="px-4 pt-1.5 text-[12px] leading-snug text-ink/50 dark:text-foreground/45">
                  {t(group.footer)}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
