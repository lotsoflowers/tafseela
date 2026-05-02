'use client';

import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const steps = [
  { en: 'Delivery', ar: 'التوصيل' },
  { en: 'Payment', ar: 'الدفع' },
  { en: 'Confirm', ar: 'التأكيد' },
];

export default function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  const { t } = useLanguage();

  return (
    <div className={cn('flex items-center justify-center gap-0', className)}>
      {steps.map((step, idx) => {
        const stepNum = (idx + 1) as 1 | 2 | 3;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isUpcoming = stepNum > currentStep;

        return (
          <div key={idx} className="flex items-center">
            {/* Connector line before (except first) */}
            {idx > 0 && (
              <div
                className={cn(
                  'w-8 sm:w-12 h-0.5',
                  isCompleted || isActive ? 'bg-plum' : 'bg-soft/60'
                )}
              />
            )}

            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  isCompleted && 'bg-plum text-white',
                  isActive && 'bg-hero text-white',
                  isUpcoming && 'bg-soft/40 text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="size-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  'text-xs whitespace-nowrap',
                  isActive && 'text-hero font-medium',
                  isCompleted && 'text-plum dark:text-soft font-medium',
                  isUpcoming && 'text-muted-foreground'
                )}
              >
                {t(step)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
