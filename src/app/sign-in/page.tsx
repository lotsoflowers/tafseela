'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button, IconButton, TextField } from '@/components/glass';
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
        <IconButton
          icon={<X size={20} />}
          ariaLabel={t({ en: 'Close', ar: 'إغلاق' })}
          onClick={() => router.back()}
        />
      </div>

      <div className="flex-1 px-6 pt-8">
        <h1 className="text-[28px] font-bold leading-tight text-ink dark:text-foreground">
          {t({ en: 'Sign in or create an account', ar: 'سجلي دخولك أو أنشئي حساباً' })}
        </h1>

        <div className="mt-8">
          <TextField
            label={t({ en: 'Email', ar: 'البريد الإلكتروني' })}
            type="email"
            value={email}
            placeholder="you@example.com"
            leading={<Mail size={18} />}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            full
            disabled={!email.includes('@')}
            onClick={handleEmailContinue}
          >
            {t({ en: 'Continue', ar: 'متابعة' })}
          </Button>
        </div>

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
    <Button
      variant="secondary"
      size="md"
      full
      icon={<span className="flex size-5 items-center justify-center">{icon}</span>}
      onClick={onClick}
    >
      {t(label)}
    </Button>
  );
}
