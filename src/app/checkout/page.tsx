'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import StepIndicator from '@/components/checkout/StepIndicator';
import DeliveryStep from '@/components/checkout/DeliveryStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ConfirmStep from '@/components/checkout/ConfirmStep';
import type { DeliveryAddress } from '@/types';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  const handleBack = () => {
    if (step === 1) {
      router.push('/cart');
    } else {
      setStep((s) => (s - 1) as 1 | 2 | 3);
    }
  };

  const handleDeliveryNext = (addr: DeliveryAddress) => {
    setAddress(addr);
    setStep(2);
  };

  const handlePaymentNext = (method: string) => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleConfirm = () => {
    clearCart();
    router.push('/payment-confirmation');
  };

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm border-b border-blush/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-9"
            onClick={handleBack}
          >
            <BackArrow className="size-5" />
          </Button>
          <h1 className="text-lg font-bold text-ink dark:text-foreground flex-1">
            {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Step indicator */}
        <StepIndicator currentStep={step} className="mb-8" />

        {/* Steps */}
        {step === 1 && <DeliveryStep onNext={handleDeliveryNext} />}
        {step === 2 && <PaymentStep onNext={handlePaymentNext} />}
        {step === 3 && (
          <ConfirmStep
            address={address}
            paymentMethod={paymentMethod}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}
