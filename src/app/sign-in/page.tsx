'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');

  const handleEmailContinue = () => {
    if (!email.includes('@')) return;
    router.push(`/sign-in/password?email=${encodeURIComponent(email)}`);
  };

  const handleSocial = (provider: 'apple' | 'google' | 'facebook') => {
    if (provider === 'apple' || provider === 'google') login(provider);
    else login('google');
    router.push('/account');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex justify-end p-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Close', ar: 'إغلاق' })}
          className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        <h1 className="text-[28px] font-bold leading-tight text-ink dark:text-foreground">
          {t({ en: 'Sign in or create an account', ar: 'سجلي دخولك أو أنشئي حساباً' })}
        </h1>

        <label className="mt-8 block">
          <span className="mb-1 block text-[12px] font-semibold text-ink dark:text-foreground">
            {t({ en: 'Email', ar: 'البريد الإلكتروني' })}
          </span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="w-full rounded-2xl border border-soft/40 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
          />
        </label>

        <button
          type="button"
          onClick={handleEmailContinue}
          disabled={!email.includes('@')}
          className={cn(
            'mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-colors',
            email.includes('@')
              ? 'bg-plum text-white shadow-[0_8px_24px_rgba(92,10,61,0.18)] hover:bg-plum/90'
              : 'bg-ink/30 text-white/80 dark:bg-foreground/20'
          )}
        >
          {t({ en: 'Continue', ar: 'متابعة' })}
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-soft/40 dark:bg-border" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t({ en: 'OR', ar: 'أو' })}
          </span>
          <span className="h-px flex-1 bg-soft/40 dark:bg-border" />
        </div>

        <div className="space-y-3">
          <SocialButton
            provider="apple"
            label={{ en: 'Continue with Apple', ar: 'المتابعة مع آبل' }}
            onClick={() => handleSocial('apple')}
            icon={<span className="text-[15px]"></span>}
          />
          <SocialButton
            provider="google"
            label={{ en: 'Continue with Google', ar: 'المتابعة مع جوجل' }}
            onClick={() => handleSocial('google')}
            icon={<span className="text-[14px] font-bold text-blue-500">G</span>}
          />
          <SocialButton
            provider="facebook"
            label={{ en: 'Continue with Facebook', ar: 'المتابعة مع فيسبوك' }}
            onClick={() => handleSocial('facebook')}
            icon={<span className="text-[14px] font-bold text-blue-600">f</span>}
          />
        </div>
      </div>

      <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-8">
        <p className="text-center text-[12px] text-muted-foreground">
          <Link href="#" className="underline-offset-2 hover:underline">
            {t({ en: 'Privacy Notice', ar: 'سياسة الخصوصية' })}
          </Link>
          <span className="mx-2 opacity-50">·</span>
          <Link href="#" className="underline-offset-2 hover:underline">
            {t({ en: 'Legal Notice', ar: 'الشروط' })}
          </Link>
        </p>
      </div>
    </div>
  );
}

function SocialButton({
  label,
  onClick,
  icon,
}: {
  provider: string;
  label: { en: string; ar: string };
  onClick: () => void;
  icon: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-soft/40 bg-white py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-cream dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-secondary"
    >
      <span className="flex size-5 items-center justify-center">{icon}</span>
      {t(label)}
    </button>
  );
}
