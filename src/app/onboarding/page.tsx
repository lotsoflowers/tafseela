'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, Sparkle, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/glass';
import { cn } from '@/lib/utils';
import type { Language } from '@/types';

type Step = 'language' | 'notifications';

export default function OnboardingPage() {
  const router = useRouter();
  const { t, language: currentLang, setLanguage } = useLanguage();
  const { completeOnboarding } = useOnboarding();
  const [step, setStep] = useState<Step>('language');
  const [picked, setPicked] = useState<Language>(currentLang);

  const handleLanguageContinue = () => {
    setLanguage(picked);
    setStep('notifications');
  };

  const handleNotifications = (allowed: boolean) => {
    completeOnboarding(picked, allowed);
    router.replace('/home');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Sparkle className="absolute start-8 top-16 size-6 text-soft/50" fill="currentColor" />
        <Sparkle className="absolute end-12 top-32 size-4 text-hero/30" fill="currentColor" />
        <Sparkle className="absolute start-1/2 top-72 size-5 text-plum/30" fill="currentColor" />
      </div>

      {step === 'language' && (
        <LanguageStep
          picked={picked}
          onPick={setPicked}
          onContinue={handleLanguageContinue}
        />
      )}
      {step === 'notifications' && (
        <NotificationsStep onAnswer={handleNotifications} />
      )}
    </div>
  );
}

function LanguageStep({
  picked,
  onPick,
  onContinue,
}: {
  picked: Language;
  onPick: (l: Language) => void;
  onContinue: () => void;
}) {
  const { t } = useLanguage();

  const options: { id: Language; label: { en: string; ar: string }; native: string }[] = [
    { id: 'en', label: { en: 'English', ar: 'الإنجليزية' }, native: 'English' },
    { id: 'ar', label: { en: 'Arabic', ar: 'العربية' }, native: 'العربية' },
  ];

  return (
    <>
      <div className="flex-1 px-6 pt-20">
        <h1 className="text-[28px] font-bold leading-tight text-ink dark:text-foreground">
          {t({ en: 'Choose your language', ar: 'اختاري لغتك' })}
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          {t({
            en: 'You can change this later from Account > Preferences.',
            ar: 'يمكنك تغيير ذلك لاحقاً من الحساب > التفضيلات.',
          })}
        </p>

        <div className="mt-8 space-y-3">
          {options.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPick(opt.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-start transition-colors',
                picked === opt.id
                  ? 'border-hero bg-cream dark:bg-secondary'
                  : 'border-soft/40 bg-white dark:border-border dark:bg-card'
              )}
            >
              <span>
                <span className="block text-[16px] font-bold text-ink dark:text-foreground">
                  {opt.native}
                </span>
                <span className="block text-[12px] text-muted-foreground">
                  {t(opt.label)}
                </span>
              </span>
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border',
                  picked === opt.id
                    ? 'border-hero bg-hero'
                    : 'border-soft/60 dark:border-border'
                )}
              >
                {picked === opt.id && <Check className="size-3.5 text-white" strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <Button variant="primary" size="lg" full onClick={onContinue}>
          {t({ en: 'Continue', ar: 'متابعة' })}
        </Button>
      </div>
    </>
  );
}

function NotificationsStep({ onAnswer }: { onAnswer: (allowed: boolean) => void }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="flex-1 px-6 pt-20">
        <span className="flex size-20 items-center justify-center rounded-full bg-cream dark:bg-secondary">
          <Bell className="size-9 text-hero" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 text-[28px] font-bold leading-tight text-ink dark:text-foreground">
          {t({ en: 'Stay in the loop', ar: 'كوني على اطلاع' })}
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          {t({
            en: 'Allow notifications to hear about new arrivals from your followed brands and restock alerts on items you saved.',
            ar: 'اسمحي بالإشعارات لتعرفي عن وصول الجديد من الماركات التي تتابعينها وتنبيهات عودة المخزون للقطع المحفوظة.',
          })}
        </p>
      </div>

      <div className="space-y-3 px-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <Button variant="primary" size="lg" full icon={<Bell size={18} />} onClick={() => onAnswer(true)}>
          {t({ en: 'Allow', ar: 'السماح' })}
        </Button>
        <Button variant="secondary" size="lg" full icon={<BellOff size={18} />} onClick={() => onAnswer(false)}>
          {t({ en: 'Do not allow', ar: 'عدم السماح' })}
        </Button>
      </div>
    </>
  );
}
