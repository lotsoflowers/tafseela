import type { FitProfile, FitRecommendation, FitType, ProductSize } from '@/types';

const SIZE_ORDER: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function sizeToIndex(size: ProductSize): number {
  return SIZE_ORDER.indexOf(size);
}

function indexToSize(index: number): ProductSize {
  const clamped = Math.max(0, Math.min(index, SIZE_ORDER.length - 1));
  return SIZE_ORDER[clamped];
}

function clampIndex(index: number): number {
  return Math.max(0, Math.min(index, SIZE_ORDER.length - 1));
}

function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// Derive a base size from BMI with a small correction for very tall/short frames.
// Bands tuned for women's regional/EU fashion sizing — XS at very low BMI,
// XXL at high BMI, L sitting around the upper-normal range many shoppers fall in.
function deriveSizeFromBody(heightCm: number, weightKg: number): ProductSize {
  const bmi = calculateBMI(heightCm, weightKg);

  let index: number;
  if (bmi < 17.5) index = 0;       // XS — very thin
  else if (bmi < 19.5) index = 1;  // S
  else if (bmi < 22.5) index = 2;  // M
  else if (bmi < 25.5) index = 3;  // L
  else if (bmi < 28.5) index = 4;  // XL
  else index = 5;                  // XXL

  // Frame correction: very tall women often need an extra size for length,
  // very short women often size down. Skip when already at the extremes.
  if (heightCm >= 175 && index < SIZE_ORDER.length - 1) index += 1;
  else if (heightCm <= 152 && index > 0) index -= 1;

  return SIZE_ORDER[index];
}

export function getRecommendation(
  profile: FitProfile,
  productFit: FitType
): FitRecommendation {
  // Step 1 — base size. Prefer the user's declared usual size; otherwise derive
  // from height + weight. Track which signal we used so we can score confidence.
  const derivedSize = deriveSizeFromBody(profile.height, profile.weight);
  const usingDerivedSize = !profile.usualSize;
  const baseSize = profile.usualSize ?? derivedSize;

  let index = sizeToIndex(baseSize);

  // Cross-check: when the user gave their usual size AND it diverges from
  // body-derived by 2+ steps, we'll dock confidence later. The two signals
  // typically agree within one size for accurate self-reports.
  const conflictGap = profile.usualSize
    ? Math.abs(sizeToIndex(profile.usualSize) - sizeToIndex(derivedSize))
    : 0;

  // Step 2 — adjust for how this product fits.
  let adjustments = 0;
  if (productFit === 'runs-small' || productFit === 'runs-tight') {
    index += 1;
    adjustments += 1;
  } else if (productFit === 'runs-large' || productFit === 'runs-loose') {
    index -= 1;
    adjustments += 1;
  }

  // Step 3 — adjust for the user's preferred silhouette.
  const preferredFit = profile.preferredFit ?? 'regular';
  if (preferredFit === 'loose') {
    index += 1;
    adjustments += 1;
  } else if (preferredFit === 'fitted') {
    index -= 1;
    adjustments += 1;
  }

  index = clampIndex(index);
  const recommendedSize = indexToSize(index);

  // Confidence:
  //   - usualSize provided + body-derived agrees + ≤1 adjustment → high
  //   - usualSize provided, but body conflict OR 2 adjustments → medium
  //   - body-derived only + ≤1 adjustment → medium
  //   - body-derived only + 2 adjustments, or usualSize with body conflict ≥ 2 → low
  let confidence: FitRecommendation['confidence'];
  if (!usingDerivedSize && conflictGap < 2 && adjustments <= 1) {
    confidence = 'high';
  } else if (!usingDerivedSize && conflictGap >= 2) {
    confidence = 'low';
  } else if (usingDerivedSize && adjustments >= 2) {
    confidence = 'low';
  } else {
    confidence = 'medium';
  }

  const note = buildNote(
    recommendedSize,
    profile,
    productFit,
    confidence,
    usingDerivedSize,
    conflictGap
  );

  return { recommendedSize, confidence, note };
}

const FIT_LABEL: Record<FitType, BilingualPair> = {
  'true-to-size': { en: 'true to size', ar: 'مطابق للمقاس' },
  'runs-small': { en: 'runs small', ar: 'أصغر من المقاس' },
  'runs-large': { en: 'runs large', ar: 'أكبر من المقاس' },
  'runs-tight': { en: 'runs tight', ar: 'ضيق' },
  'runs-loose': { en: 'runs loose', ar: 'واسع' },
};

type BilingualPair = { en: string; ar: string };

function buildNote(
  recommended: ProductSize,
  profile: FitProfile,
  productFit: FitType,
  confidence: FitRecommendation['confidence'],
  usingDerivedSize: boolean,
  conflictGap: number
): BilingualPair {
  const fit = FIT_LABEL[productFit];

  // Body-derived recommendation — call out that we're working from BMI alone
  // so the user knows confidence is naturally lower than a self-reported size.
  if (usingDerivedSize) {
    if (productFit === 'true-to-size') {
      return {
        en: `Based on your height & weight, size ${recommended} should fit. For better accuracy, tell us your usual size.`,
        ar: `بناءً على طولك ووزنك، مقاس ${recommended} يناسبك. للحصول على دقة أعلى، أخبرينا بمقاسك المعتاد.`,
      };
    }
    return {
      en: `Based on your height & weight, we suggest size ${recommended}. This piece ${fit.en}, so we adjusted for that.`,
      ar: `بناءً على طولك ووزنك، نقترح مقاس ${recommended}. هذا المنتج ${fit.ar}، عدّلنا المقاس بناءً على ذلك.`,
    };
  }

  // User-provided usual size, but body says something quite different.
  if (conflictGap >= 2) {
    return {
      en: `Size ${recommended} based on your usual size — but your height & weight suggest a different range. If unsure, check the size chart or message the store.`,
      ar: `مقاس ${recommended} بناءً على مقاسك المعتاد — لكن طولك ووزنك يشيران إلى نطاق مختلف. إذا لم تكوني متأكدة، راجعي جدول المقاسات أو تواصلي مع المتجر.`,
    };
  }

  // Confident path — usual size + reasonable body match + few adjustments.
  if (confidence === 'high') {
    if (productFit === 'true-to-size') {
      return {
        en: `Size ${recommended} should be a perfect fit for you.`,
        ar: `مقاس ${recommended} سيكون مناسب لك تماماً.`,
      };
    }
    return {
      en: `Size ${recommended} for you — this piece ${fit.en}, and we matched your usual size.`,
      ar: `مقاس ${recommended} لك — هذا المنتج ${fit.ar}، وقد طابقنا مقاسك المعتاد.`,
    };
  }

  if (confidence === 'medium') {
    return {
      en: `We recommend size ${recommended}. This piece ${fit.en}, adjusted for your fit preference.`,
      ar: `ننصحك بمقاس ${recommended}. هذا المنتج ${fit.ar}، عدّلنا حسب تفضيلك للقصة.`,
    };
  }

  return {
    en: `Size ${recommended} is our best estimate. This piece ${fit.en} and we adjusted for your preferred fit. Check the size chart if you want to be sure.`,
    ar: `مقاس ${recommended} هو أفضل تقدير لنا. هذا المنتج ${fit.ar} وقد عدّلنا بناءً على تفضيلك للقصة. راجعي جدول المقاسات للتأكد.`,
  };
}
