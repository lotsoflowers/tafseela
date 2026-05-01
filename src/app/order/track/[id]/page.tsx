'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockOrder } from '@/data/orders';
const orders = [mockOrder];
import { TrackingStepper } from '@/components/order/TrackingStepper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, direction } = useLanguage();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream dark:bg-background flex items-center justify-center">
        <p className="text-ink/60">{t({ en: 'Order not found', ar: 'الطلب غير موجود' })}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-card border-b border-blush px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-ink dark:text-foreground">
          <ArrowLeft className={cn('w-5 h-5', direction === 'rtl' && 'rotate-180')} />
        </button>
        <h1 className="font-bold text-ink dark:text-foreground">
          {t({ en: 'Track Order', ar: 'تتبع الطلب' })}
        </h1>
      </div>

      <div className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Order number */}
        <div className="bg-white dark:bg-card rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-ink/50 mb-1">
            {t({ en: 'Order number', ar: 'رقم الطلب' })}
          </p>
          <p className="text-lg font-bold text-ink dark:text-foreground">#{order.id}</p>
        </div>

        {/* Tracking Stepper */}
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm">
          <TrackingStepper
            currentStatus={order.status}
            trackingUpdates={order.trackingUpdates}
          />
        </div>

        {/* Map placeholder (for out-for-delivery) */}
        {(order.status === 'out-for-delivery' || order.status === 'shipped') && (
          <div className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-blush dark:bg-secondary flex flex-col items-center justify-center gap-2">
              <MapPin className="w-8 h-8 text-soft" />
              <p className="text-sm text-plum dark:text-soft font-medium">
                {t({ en: 'Delivery Map', ar: 'خريطة التوصيل' })}
              </p>
              <p className="text-xs text-ink/40">
                {t({ en: 'Live tracking coming soon', ar: 'التتبع المباشر قريباً' })}
              </p>
            </div>
          </div>
        )}

        {/* Contact button */}
        <a href="https://wa.me/96599991234" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-full border-plum text-plum dark:text-soft hover:bg-plum hover:text-white rounded-full py-6 text-base font-medium"
          >
            <MessageCircle className="w-5 h-5 me-2" />
            {t({ en: 'Contact us', ar: 'تواصلي معنا' })}
          </Button>
        </a>
      </div>
    </div>
  );
}
