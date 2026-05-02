'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import StarRating from '@/components/review/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { FitType, BilingualText } from '@/types';

const FIT_OPTIONS: { value: FitType; label: BilingualText }[] = [
  { value: 'runs-small', label: { en: 'Runs small', ar: 'صغير' } },
  { value: 'true-to-size', label: { en: 'True to size', ar: 'مناسب' } },
  { value: 'runs-large', label: { en: 'Runs large', ar: 'كبير' } },
  { value: 'runs-tight', label: { en: 'Runs tight', ar: 'ضيق' } },
  { value: 'runs-loose', label: { en: 'Runs loose', ar: 'واسع' } },
];

export default function WriteReviewPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const { t, direction } = useLanguage();

  const product = products.find((p) => p.id === productId);

  const [rating, setRating] = useState(0);
  const [selectedFit, setSelectedFit] = useState<FitType | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream dark:bg-background flex items-center justify-center">
        <p className="text-ink/60">{t({ en: 'Product not found', ar: 'المنتج غير موجود' })}</p>
      </div>
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.back(), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream dark:bg-background flex flex-col items-center justify-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-hero flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg font-bold text-ink dark:text-foreground">
          {t({ en: 'Review submitted!', ar: 'تم نشر التقييم!' })}
        </p>
        <p className="text-sm text-ink/60 mt-1">
          {t({ en: 'Thank you for your feedback', ar: 'شكراً على رأيج' })}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-card border-b border-blush px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-ink dark:text-foreground">
          <ArrowLeft className={cn('w-5 h-5', direction === 'rtl' && 'rotate-180')} />
        </button>
        <h1 className="font-bold text-ink dark:text-foreground">
          {t({ en: 'Write a review', ar: 'اكتبي تقييمك' })}
        </h1>
      </div>

      <div className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Product info */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-soft/20 flex items-center justify-center">
            <span className="text-xs text-plum dark:text-soft text-center px-1">{t(product.name)}</span>
          </div>
          <p className="font-medium text-ink dark:text-foreground text-sm">{t(product.name)}</p>
        </div>

        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium text-ink dark:text-foreground mb-2">
            {t({ en: 'Your rating', ar: 'تقييمج' })}
          </p>
          <StarRating rating={rating} interactive onRate={setRating} size={32} />
        </div>

        {/* Fit Rating */}
        <div>
          <p className="text-sm font-medium text-ink dark:text-foreground mb-2">
            {t({ en: 'How does it fit?', ar: 'كيف المقاس؟' })}
          </p>
          <div className="flex flex-wrap gap-2">
            {FIT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedFit(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-all',
                  selectedFit === opt.value
                    ? 'bg-hero text-white'
                    : 'bg-white dark:bg-card text-ink dark:text-foreground border border-soft dark:border-border hover:bg-blush'
                )}
              >
                {t(opt.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <p className="text-sm font-medium text-ink dark:text-foreground mb-2">
            {t({ en: 'Share your experience', ar: 'شاركي تجربتج' })}
          </p>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t({ en: 'Write your review here (optional)', ar: 'اكتبي تقييمج هنا (اختياري)' })}
            className="bg-white dark:bg-card border-soft dark:border-border focus:border-hero min-h-[100px] resize-none"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <p className="text-sm font-medium text-ink dark:text-foreground mb-2">
            {t({ en: 'Add a photo', ar: 'أضيفي صورة' })}
          </p>
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-soft dark:border-border flex flex-col items-center justify-center gap-1 hover:bg-blush/30 transition-colors"
              >
                <Camera className="w-5 h-5 text-soft" />
                <span className="text-[10px] text-soft">{t({ en: 'Photo', ar: 'صورة' })}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-hero hover:bg-hero/90 text-white rounded-full py-6 text-base font-bold disabled:opacity-50"
        >
          {t({ en: 'Post review', ar: 'نشر التقييم' })}
        </Button>
      </div>
    </div>
  );
}
