'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import OTPInput from './OTPInput';

export default function AuthModal() {
  const { showAuthModal, closeAuthModal, login } = useAuth();
  const { language } = useLanguage();
  const [step, setStep] = useState<'methods' | 'otp'>('methods');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.length >= 8) {
      setStep('otp');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOTPComplete = (code: string) => {
    login('otp');
    setStep('methods');
    setPhoneNumber('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      setStep('methods');
      setPhoneNumber('');
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Logo */}
          <div className="mb-2 text-2xl font-bold text-hero">
            {language === 'ar' ? 'تفصيلة' : 'Tafseela'}
          </div>
          <DialogTitle className="text-lg">
            {language === 'ar' ? 'سجلي دخولك' : 'Sign in to continue'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar'
              ? 'عشان تكملي شرائج'
              : 'To complete your purchase'}
          </DialogDescription>
        </DialogHeader>

        {step === 'methods' ? (
          <div className="space-y-3">
            {/* Google */}
            <Button
              onClick={() => login('google')}
              className="w-full border border-gray-200 bg-white dark:bg-card text-ink dark:text-foreground hover:bg-gray-50"
            >
              <span className="me-2 text-base font-bold text-blue-500">G</span>
              {language === 'ar' ? 'المتابعة مع Google' : 'Continue with Google'}
            </Button>

            {/* Apple */}
            <Button
              onClick={() => login('apple')}
              className="w-full bg-ink text-white hover:bg-ink/90"
            >
              <span className="me-2 text-lg font-bold"></span>
              {language === 'ar' ? 'المتابعة مع Apple' : 'Continue with Apple'}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-sm text-ink/40">
                {language === 'ar' ? 'أو' : 'or'}
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Phone input */}
            <div className="flex gap-2" dir="ltr">
              <div className="flex h-9 items-center rounded-lg border border-soft dark:border-border bg-cream/50 px-3 text-sm font-medium text-ink dark:text-foreground">
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
              className="w-full bg-hero text-white hover:bg-hero/90 disabled:opacity-50"
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
      </DialogContent>
    </Dialog>
  );
}
