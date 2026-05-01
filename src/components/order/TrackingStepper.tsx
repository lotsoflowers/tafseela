'use client';

import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import type { OrderStatus, BilingualText } from '@/types';

interface TrackingUpdate {
  status: OrderStatus;
  timestamp: string;
  note: BilingualText;
}

interface TrackingStepperProps {
  currentStatus: OrderStatus;
  trackingUpdates: TrackingUpdate[];
  className?: string;
}

const STEPS: { status: OrderStatus; label: BilingualText }[] = [
  { status: 'confirmed', label: { en: 'Order placed', ar: 'تم الطلب' } },
  { status: 'processing', label: { en: 'Seller packing', ar: 'البائعة تحضر الطلب' } },
  { status: 'shipped', label: { en: 'Ready for pickup', ar: 'جاهز للاستلام' } },
  { status: 'out-for-delivery', label: { en: 'Out for delivery', ar: 'في الطريق إليج' } },
  { status: 'delivered', label: { en: 'Delivered', ar: 'وصل الطلب' } },
];

const STATUS_ORDER: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];

export function TrackingStepper({ currentStatus, trackingUpdates, className }: TrackingStepperProps) {
  const { t, language } = useLanguage();
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const getUpdate = (status: OrderStatus) =>
    trackingUpdates.find((u) => u.status === status);

  return (
    <div className={cn('space-y-0', className)}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const update = getUpdate(step.status);

        return (
          <div key={step.status} className="flex gap-3">
            {/* Line + Circle column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                  isCompleted && 'bg-plum text-white',
                  isActive && 'bg-hero text-white animate-pulse',
                  !isCompleted && !isActive && 'bg-blush text-soft'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              {/* Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-12 my-1',
                    index < currentIndex ? 'bg-plum' : 'bg-soft/50'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1 pb-4">
              <p
                className={cn(
                  'font-medium text-sm',
                  isCompleted && 'text-plum',
                  isActive && 'text-hero font-bold',
                  !isCompleted && !isActive && 'text-ink/40'
                )}
              >
                {t(step.label)}
              </p>
              {update && (isCompleted || isActive) && (
                <p className="text-xs text-ink/50 mt-0.5">
                  {formatDate(update.timestamp, language)}
                </p>
              )}
              {update && (isCompleted || isActive) && (
                <p className="text-xs text-ink/60 mt-0.5">{t(update.note)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
