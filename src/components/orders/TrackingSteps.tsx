'use client';

import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus, BilingualText } from '@/types';

const STEPS: { status: OrderStatus; label: BilingualText }[] = [
  { status: 'confirmed', label: { en: 'Placed', ar: 'تم التأكيد' } },
  { status: 'processing', label: { en: 'Packed', ar: 'تم التغليف' } },
  { status: 'shipped', label: { en: 'Shipped', ar: 'تم الشحن' } },
  { status: 'delivered', label: { en: 'Delivered', ar: 'تم التوصيل' } },
];

const ORDER_INDEX: Record<OrderStatus, number> = {
  confirmed: 0,
  processing: 1,
  shipped: 2,
  'out-for-delivery': 2,
  delivered: 3,
};

interface TrackingStepsProps {
  order: Order;
}

export default function TrackingSteps({ order }: TrackingStepsProps) {
  const { t, language } = useLanguage();
  const currentIndex = ORDER_INDEX[order.status];

  const dateForStep = (i: number): string | undefined => {
    const status = STEPS[i].status;
    const update = order.trackingUpdates.find(u => u.status === status);
    if (!update) return undefined;
    const d = new Date(update.timestamp);
    return d.toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  return (
    <ol className="space-y-3">
      {STEPS.map((s, i) => {
        const reached = i <= currentIndex;
        const date = dateForStep(i);
        const estimated = i === STEPS.length - 1 && !reached;
        const eta = estimated && order.estimatedDelivery
          ? new Date(order.estimatedDelivery).toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
              day: 'numeric',
              month: 'short',
              year: '2-digit',
            })
          : undefined;

        return (
          <li key={s.status} className="flex items-center gap-3">
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                reached
                  ? 'border-hero bg-hero text-white'
                  : 'border-soft/50 bg-white dark:border-border dark:bg-card'
              )}
            >
              {reached && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className="flex-1">
              <span
                className={cn(
                  'text-[14px] font-semibold',
                  reached ? 'text-ink dark:text-foreground' : 'text-muted-foreground'
                )}
              >
                {t(s.label)}
              </span>
              {(date || eta) && (
                <span className="ms-2 text-[12px] text-muted-foreground">
                  {date ?? eta}
                </span>
              )}
              {estimated && (
                <span className="ms-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t({ en: 'Estimated', ar: 'متوقّع' })}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
