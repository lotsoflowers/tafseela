'use client';

import { useState } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentStepProps {
  onNext: (method: string) => void;
  className?: string;
}

const paymentMethods = [
  {
    id: 'knet',
    label: { en: 'KNET', ar: 'كي نت' },
    desc: { en: 'Pay via KNET debit card', ar: 'الدفع عبر بطاقة كي نت' },
    icon: Banknote,
  },
  {
    id: 'apple-pay',
    label: { en: 'Apple Pay', ar: 'Apple Pay' },
    desc: { en: 'Quick payment with Apple Pay', ar: 'دفع سريع عبر Apple Pay' },
    icon: Smartphone,
  },
  {
    id: 'visa',
    label: { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' },
    desc: { en: 'Visa, Mastercard, etc.', ar: 'فيزا، ماستركارد، إلخ' },
    icon: CreditCard,
  },
  {
    id: 'cod',
    label: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
    desc: { en: 'Pay when you receive', ar: 'ادفعي عند استلام الطلب' },
    icon: Banknote,
  },
];

export default function PaymentStep({ onNext, className }: PaymentStepProps) {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  // Card fields (only shown when visa selected)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const isValid =
    selected !== null &&
    (selected !== 'visa' || (cardNumber.length >= 16 && expiry.length >= 4 && cvv.length >= 3));

  return (
    <div className={cn('space-y-4', className)}>
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelected(method.id)}
            className={cn(
              'w-full rounded-xl border-2 p-4 text-start transition-colors',
              isSelected
                ? 'border-hero bg-blush/30'
                : 'border-transparent bg-white dark:bg-card hover:border-soft/50'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Radio circle */}
              <div
                className={cn(
                  'size-5 rounded-full border-2 shrink-0 flex items-center justify-center',
                  isSelected ? 'border-hero' : 'border-muted-foreground/40'
                )}
              >
                {isSelected && <div className="size-2.5 rounded-full bg-hero" />}
              </div>
              <Icon className="size-5 text-ink dark:text-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink dark:text-foreground text-sm">{t(method.label)}</p>
                <p className="text-xs text-muted-foreground">{t(method.desc)}</p>
              </div>
            </div>

            {/* Credit card fields */}
            {method.id === 'visa' && isSelected && (
              <div
                className="mt-4 space-y-3 ps-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1.5">
                  <Label>{language === 'ar' ? 'رقم البطاقة' : 'Card number'}</Label>
                  <Input
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))
                    }
                    placeholder="4111 1111 1111 1111"
                    type="text"
                    inputMode="numeric"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}</Label>
                    <Input
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="MM/YY"
                      type="text"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CVV</Label>
                    <Input
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="123"
                      type="text"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            )}
          </button>
        );
      })}

      {/* Next button */}
      <Button
        className="w-full bg-hero hover:bg-hero/90 text-white h-12 text-base font-semibold rounded-xl mt-2"
        onClick={() => selected && onNext(selected)}
        disabled={!isValid}
      >
        {language === 'ar' ? 'التالي' : 'Next'}
      </Button>
    </div>
  );
}
