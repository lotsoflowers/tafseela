'use client';

import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { BilingualText } from '@/types';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

const variantClasses: Record<BannerVariant, { bg: string; title: string; body: string; icon: string }> = {
  info: {
    bg: 'bg-cream dark:bg-secondary',
    title: 'text-plum dark:text-foreground',
    body: 'text-muted-foreground',
    icon: 'text-plum dark:text-foreground',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    title: 'text-emerald-800 dark:text-emerald-300',
    body: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-600',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'text-amber-800 dark:text-amber-300',
    body: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-600',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    title: 'text-red-700 dark:text-red-300',
    body: 'text-red-600 dark:text-red-400',
    icon: 'text-red-500',
  },
};

interface BannerProps {
  variant?: BannerVariant;
  icon?: React.ReactNode;
  title: BilingualText;
  body?: BilingualText;
  action?: { label: BilingualText; onClick?: () => void; href?: string };
  onDismiss?: () => void;
  className?: string;
}

export default function Banner({
  variant = 'info',
  icon,
  title,
  body,
  action,
  onDismiss,
  className,
}: BannerProps) {
  const { t } = useLanguage();
  const v = variantClasses[variant];

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-2xl p-3 animate-fade-in',
        v.bg,
        className
      )}
    >
      {icon && (
        <span className={cn('mt-0.5 shrink-0', v.icon)}>{icon}</span>
      )}
      <div className="min-w-0 flex-1 text-[13px]">
        <p className={cn('font-bold', v.title)}>{t(title)}</p>
        {body && <p className={cn('mt-0.5', v.body)}>{t(body)}</p>}
        {action && (
          action.href ? (
            <a
              href={action.href}
              className={cn('mt-1 inline-block text-[12px] font-bold underline-offset-2 hover:underline', v.title)}
            >
              {t(action.label)}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className={cn('mt-1 inline-block text-[12px] font-bold underline-offset-2 hover:underline active:opacity-70', v.title)}
            >
              {t(action.label)}
            </button>
          )
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t({ en: 'Dismiss', ar: 'إغلاق' })}
          className={cn('-mt-0.5 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] active:scale-90 hover:bg-black/5 dark:hover:bg-white/5', v.icon)}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
