import type { FitProfile, FitRecommendation, FitType, ProductSize } from '@/types';

const SIZE_ORDER: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function sizeToIndex(size: ProductSize): number {
  return SIZE_ORDER.indexOf(size);
}

function indexToSize(index: number): ProductSize {
  const clamped = Math.max(0, Math.min(index, SIZE_ORDER.length - 1));
  return SIZE_ORDER[clamped];
}

export function getRecommendation(
  profile: FitProfile,
  productFit: FitType
): FitRecommendation {
  let index = sizeToIndex(profile.usualSize);
  let adjustments = 0;

  // Adjust for product fit
  if (productFit === 'runs-small' || productFit === 'runs-tight') {
    index += 1;
    adjustments += 1;
  } else if (productFit === 'runs-large' || productFit === 'runs-loose') {
    index -= 1;
    adjustments += 1;
  }

  // Adjust for preferred fit
  if (profile.preferredFit === 'loose') {
    index += 1;
    adjustments += 1;
  } else if (profile.preferredFit === 'fitted') {
    index -= 1;
    adjustments += 1;
  }

  // Clamp to valid range
  index = Math.max(0, Math.min(index, SIZE_ORDER.length - 1));

  const recommendedSize = indexToSize(index);

  const confidence: FitRecommendation['confidence'] =
    adjustments === 0 ? 'high' : adjustments === 1 ? 'medium' : 'low';

  const note = buildNote(recommendedSize, profile, productFit, confidence);

  return {
    recommendedSize,
    confidence,
    note,
  };
}

function buildNote(
  recommended: ProductSize,
  profile: FitProfile,
  productFit: FitType,
  confidence: FitRecommendation['confidence']
): { en: string; ar: string } {
  if (confidence === 'high') {
    return {
      en: `Size ${recommended} should be a perfect fit for you.`,
      ar: `مقاس ${recommended} سيكون مناسب لك تماماً.`,
    };
  }

  const fitLabel: Record<FitType, { en: string; ar: string }> = {
    'true-to-size': { en: 'true to size', ar: 'مطابق للمقاس' },
    'runs-small': { en: 'runs small', ar: 'أصغر من المقاس' },
    'runs-large': { en: 'runs large', ar: 'أكبر من المقاس' },
    'runs-tight': { en: 'runs tight', ar: 'ضيق' },
    'runs-loose': { en: 'runs loose', ar: 'واسع' },
  };

  if (confidence === 'medium') {
    return {
      en: `We recommend size ${recommended}. This item ${fitLabel[productFit].en}.`,
      ar: `ننصحك بمقاس ${recommended}. هذا المنتج ${fitLabel[productFit].ar}.`,
    };
  }

  return {
    en: `Size ${recommended} is our best guess. This item ${fitLabel[productFit].en} and we've adjusted for your ${profile.preferredFit} fit preference.`,
    ar: `مقاس ${recommended} هو أفضل توقع لدينا. هذا المنتج ${fitLabel[productFit].ar} وقد عدّلنا بناءً على تفضيلك للقصة ${profile.preferredFit === 'loose' ? 'الواسعة' : 'الضيقة'}.`,
  };
}
