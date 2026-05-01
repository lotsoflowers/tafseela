'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRecommendation } from '@/lib/fit-logic';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FitType, FitProfile, FitRecommendation, ProductSize } from '@/types';

interface FitQuestionnaireProps {
  productFit: FitType;
  onResult: (result: FitRecommendation) => void;
  className?: string;
}

const USUAL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];

const FIT_PREFERENCES: { value: FitProfile['preferredFit']; label: { en: string; ar: string } }[] = [
  { value: 'fitted', label: { en: 'Fitted', ar: 'مضبوط' } },
  { value: 'regular', label: { en: 'Regular', ar: 'عادي' } },
  { value: 'loose', label: { en: 'Loose', ar: 'واسع' } },
];

export default function FitQuestionnaire({
  productFit,
  onResult,
  className,
}: FitQuestionnaireProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [usualSize, setUsualSize] = useState<ProductSize | ''>('');
  const [preferredFit, setPreferredFit] = useState<FitProfile['preferredFit']>('regular');

  const handleSubmit = () => {
    const profile: FitProfile = {
      height,
      weight,
      usualSize: usualSize || undefined,
      preferredFit,
    };

    const result = getRecommendation(profile, productFit);
    onResult(result);
  };

  return (
    <div className={cn('rounded-xl border border-soft/50 bg-cream/50', className)}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="font-semibold text-plum">
          {language === 'ar' ? 'مو متأكدة من مقاسك؟' : 'Not sure about your size?'}
        </span>
        <ChevronDown
          className={cn(
            'size-5 text-plum transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="space-y-5 px-4 pb-4">
          {/* Height slider */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-sm font-medium text-ink">
                {language === 'ar' ? 'الطول' : 'Height'}
              </Label>
              <span className="text-sm font-semibold text-hero">
                {height} cm
              </span>
            </div>
            <input
              type="range"
              min={150}
              max={185}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-hero"
            />
            <div className="flex justify-between text-xs text-ink/40">
              <span>150 cm</span>
              <span>185 cm</span>
            </div>
          </div>

          {/* Weight slider */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-sm font-medium text-ink">
                {language === 'ar' ? 'الوزن' : 'Weight'}
              </Label>
              <span className="text-sm font-semibold text-hero">
                {weight} kg
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={120}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-hero"
            />
            <div className="flex justify-between text-xs text-ink/40">
              <span>40 kg</span>
              <span>120 kg</span>
            </div>
          </div>

          {/* Usual size (optional) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="block text-sm font-medium text-ink">
                {language === 'ar' ? 'مقاسك المعتاد' : 'Your usual size'}
              </Label>
              <span className="text-xs text-ink/40">
                {language === 'ar' ? 'اختياري — للدقة' : 'Optional — for accuracy'}
              </span>
            </div>
            <RadioGroup
              value={usualSize}
              onValueChange={(val) => setUsualSize(val as ProductSize)}
              className="flex flex-wrap gap-3"
            >
              {USUAL_SIZES.map((size) => (
                <div key={size} className="flex items-center gap-1.5">
                  <RadioGroupItem value={size} id={`size-${size}`} />
                  <Label htmlFor={`size-${size}`} className="text-sm text-ink">
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Fit preference */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-ink">
              {language === 'ar' ? 'تفضيلك للقصة' : 'Fit preference'}
            </Label>
            <RadioGroup
              value={preferredFit}
              onValueChange={(val) => setPreferredFit(val as FitProfile['preferredFit'])}
              className="flex flex-wrap gap-3"
            >
              {FIT_PREFERENCES.map((pref) => (
                <div key={pref.value} className="flex items-center gap-1.5">
                  <RadioGroupItem value={pref.value} id={`fit-${pref.value}`} />
                  <Label htmlFor={`fit-${pref.value}`} className="text-sm text-ink">
                    {t(pref.label)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-hero text-white hover:bg-hero/90"
          >
            {language === 'ar' ? 'احسبي مقاسك' : 'Get my size'}
          </Button>
        </div>
      )}
    </div>
  );
}
