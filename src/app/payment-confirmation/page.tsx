'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function PaymentConfirmationPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-cream dark:bg-background flex flex-col items-center justify-center px-4 animate-in fade-in duration-500">
      {/* Animated checkmark */}
      <div className="size-24 rounded-full bg-hero flex items-center justify-center mb-8 animate-in zoom-in duration-500">
        <Check className="size-12 text-white" strokeWidth={3} />
      </div>

      {/* Success message */}
      <h1 className="text-2xl font-bold text-ink dark:text-foreground text-center mb-2">
        {language === 'ar' ? 'تم الطلب بنجاح!' : 'Order placed successfully!'}
      </h1>

      {/* Order number */}
      <p className="text-sm text-muted-foreground mb-2 font-mono">
        #TF-20250501-001
      </p>

      {/* Subtitle */}
      <p className="text-base text-muted-foreground text-center mb-10">
        {language === 'ar'
          ? 'راح يوصلج قريب إن شاء الله'
          : 'It will reach you soon'}
      </p>

      {/* Action buttons */}
      <div className="w-full max-w-xs space-y-3">
        <Link href="/order/mock-order-1" className="block">
          <Button className="w-full bg-hero hover:bg-hero/90 text-white h-12 text-base font-semibold rounded-xl">
            {language === 'ar' ? 'تابعي طلبج' : 'Track order'}
          </Button>
        </Link>
        <Link href="/home" className="block">
          <Button
            variant="outline"
            className="w-full border-plum text-plum dark:text-soft hover:bg-plum/5 h-12 text-base font-semibold rounded-xl"
          >
            {language === 'ar' ? 'كملي التسوق' : 'Continue shopping'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
