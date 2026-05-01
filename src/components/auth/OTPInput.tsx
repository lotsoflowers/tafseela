'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  onComplete: (code: string) => void;
  className?: string;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPInput({ onComplete, className }: OTPInputProps) {
  const { language } = useLanguage();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only accept single digits
      const digit = value.replace(/\D/g, '').slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);

      // Auto-advance
      if (digit && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      // Auto-submit when all filled
      if (newDigits.every((d) => d !== '')) {
        onComplete(newDigits.join(''));
      }
    },
    [digits, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handleResend = () => {
    setDigits(Array(OTP_LENGTH).fill(''));
    setTimer(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* OTP boxes */}
      <div className="flex items-center justify-center gap-2" dir="ltr">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="flex size-12 items-center justify-center rounded-lg border-2 border-soft bg-white text-center text-xl font-bold text-ink transition-colors focus:border-hero focus:outline-none"
          />
        ))}
      </div>

      {/* Resend */}
      <div className="text-center">
        {timer > 0 ? (
          <span className="text-sm text-ink/50">
            {language === 'ar'
              ? `إعادة الإرسال خلال ${timer} ثانية`
              : `Resend in ${timer}s`}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-hero underline"
          >
            {language === 'ar' ? 'أعيدي الإرسال' : 'Resend code'}
          </button>
        )}
      </div>
    </div>
  );
}
