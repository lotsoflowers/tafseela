'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import OTPInput from '@/components/auth/OTPInput';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const { language, direction } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'methods' | 'otp'>('methods');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.replace('/home');
    return null;
  }

  const handleLogin = (method: 'google' | 'apple' | 'otp') => {
    login(method);
    router.push('/home');
  };

  const handleSendOTP = () => {
    if (phoneNumber.length >= 8) {
      setStep('otp');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOTPComplete = (code: string) => {
    handleLogin('otp');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-card">
      {/* Top bar */}
      <div className="flex items-center px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full bg-cream dark:bg-background"
        >
          <ArrowLeft
            className={cn(
              'size-5 text-ink dark:text-foreground',
              direction === 'rtl' && 'rotate-180'
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="text-center">
            <h1 className="mb-1 text-3xl font-bold text-hero">
              {language === 'ar' ? 'تفصيلة' : 'Tafseela'}
            </h1>
            <p className="text-base font-medium text-ink dark:text-foreground">
              {language === 'ar' ? 'سجلي دخولك' : 'Sign in to continue'}
            </p>
            <p className="mt-1 text-sm text-ink/50">
              {language === 'ar'
                ? 'عشان تكملي شرائج'
                : 'To complete your purchase'}
            </p>
          </div>

          {step === 'methods' ? (
            <div className="space-y-3">
              {/* Google */}
              <Button
                onClick={() => handleLogin('google')}
                className="h-12 w-full border border-gray-200 bg-white dark:bg-card text-ink dark:text-foreground hover:bg-gray-50"
              >
                <span className="me-2 text-base font-bold text-blue-500">G</span>
                {language === 'ar'
                  ? 'المتابعة مع Google'
                  : 'Continue with Google'}
              </Button>

              {/* Apple */}
              <Button
                onClick={() => handleLogin('apple')}
                className="h-12 w-full bg-ink text-white hover:bg-ink/90"
              >
                <span className="me-2 text-lg font-bold"></span>
                {language === 'ar'
                  ? 'المتابعة مع Apple'
                  : 'Continue with Apple'}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-sm text-ink/40">
                  {language === 'ar' ? 'أو' : 'or'}
                </span>
                <Separator className="flex-1" />
              </div>

              {/* Phone */}
              <div className="flex gap-2" dir="ltr">
                <div className="flex h-12 items-center rounded-lg border border-soft dark:border-border bg-cream/50 px-3 text-sm font-medium text-ink dark:text-foreground">
                  +965
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="9999 1234"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))
                  }
                  className="flex-1 rounded-lg border border-soft dark:border-border bg-white dark:bg-card px-3 py-2 text-sm text-ink dark:text-foreground placeholder:text-ink/30 focus:border-hero focus:outline-none"
                />
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={phoneNumber.length < 8}
                className="h-12 w-full bg-hero text-white hover:bg-hero/90 disabled:opacity-50"
              >
                <Phone className="me-2 size-4" />
                {language === 'ar' ? 'أرسلي الرمز' : 'Send OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-ink/60">
                {language === 'ar'
                  ? `أرسلنا رمز التحقق إلى +965 ${phoneNumber}`
                  : `We sent a verification code to +965 ${phoneNumber}`}
              </p>
              <OTPInput onComplete={handleOTPComplete} />
              <button
                type="button"
                onClick={() => setStep('methods')}
                className="block w-full text-center text-sm text-hero underline"
              >
                {language === 'ar' ? 'رجوع' : 'Go back'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
