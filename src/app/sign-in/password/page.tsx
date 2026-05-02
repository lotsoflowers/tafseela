'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

function SetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const { t } = useLanguage();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = password.length >= 8 && password === confirm;

  const handleContinue = () => {
    if (!valid) return;
    login('otp');
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
          {t({ en: 'Set a new password', ar: 'عيّني كلمة مرور جديدة' })}
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {t({ en: 'Create new password for this email:', ar: 'أنشئي كلمة مرور لهذا البريد:' })}
          <br />
          <span className="font-semibold text-ink dark:text-foreground">{email}</span>
        </p>

        <PasswordField
          label={{ en: 'Password', ar: 'كلمة المرور' }}
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggleShow={() => setShowPassword(v => !v)}
          hint={
            tooShort
              ? { en: 'Use at least 8 characters', ar: 'استخدمي 8 أحرف على الأقل' }
              : { en: 'Use at least 8 characters', ar: 'استخدمي 8 أحرف على الأقل' }
          }
          error={tooShort}
          className="mt-6"
        />

        <PasswordField
          label={{ en: 'Confirm Password', ar: 'تأكيد كلمة المرور' }}
          value={confirm}
          onChange={setConfirm}
          show={showConfirm}
          onToggleShow={() => setShowConfirm(v => !v)}
          hint={mismatch ? { en: "Passwords don't match", ar: 'كلمتا المرور غير متطابقتين' } : undefined}
          error={mismatch}
          className="mt-4"
        />
      </div>

      <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-8">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!valid}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-colors',
            valid
              ? 'bg-plum text-white shadow-[0_8px_24px_rgba(92,10,61,0.18)] hover:bg-plum/90'
              : 'bg-ink/30 text-white/80 dark:bg-foreground/20'
          )}
        >
          {t({ en: 'Continue', ar: 'متابعة' })}
        </button>
        <p className="mt-3 text-center text-[12px] text-muted-foreground">
          <span className="underline-offset-2">
            {t({ en: 'Privacy Notice', ar: 'سياسة الخصوصية' })}
          </span>
          <span className="mx-2 opacity-50">·</span>
          <span className="underline-offset-2">
            {t({ en: 'Legal Notice', ar: 'الشروط' })}
          </span>
        </p>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  hint,
  error,
  className,
}: {
  label: { en: string; ar: string };
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  hint?: { en: string; ar: string };
  error?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <label className={cn('block', className)}>
      <span className={cn('mb-1 block text-[12px] font-semibold', error ? 'text-red-500' : 'text-ink dark:text-foreground')}>
        {t(label)}
      </span>
      <div
        className={cn(
          'flex items-center rounded-2xl border bg-white px-3 dark:bg-card',
          error ? 'border-red-400' : 'border-soft/40 focus-within:border-hero/60 dark:border-border'
        )}
      >
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent py-2.5 text-[14px] outline-none dark:text-foreground"
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? t({ en: 'Hide', ar: 'إخفاء' }) : t({ en: 'Show', ar: 'إظهار' })}
          className="text-muted-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && (
        <span className={cn('mt-1 block text-[11px]', error ? 'text-red-500' : 'text-muted-foreground')}>
          {t(hint)}
        </span>
      )}
    </label>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPasswordContent />
    </Suspense>
  );
}
