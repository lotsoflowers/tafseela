'use client';

import { use, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, Plus, Sparkle } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

const MAX_PHOTOS = 10;
const MAX_BODY = 500;

function WriteReviewContent({ id }: { id: string }) {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { addReview } = useReviews();
  const product = products.find(p => p.id === id);

  if (!product) notFound();

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const valid = rating > 0;
  const hasPhoto = /^https?:\/\//.test(product.images[0] ?? '');

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - photos.length;
    const accepted = files.slice(0, remaining);
    const dataUrls = accepted.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...dataUrls]);
    e.target.value = '';
  };

  const removePhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitting(true);
    addReview({
      productId: product.id,
      userName: { en: 'You', ar: 'أنت' },
      rating,
      text: { en: body.trim(), ar: body.trim() },
      fit: product.fit,
      images: photos.length > 0 ? photos : undefined,
    });
    router.push(`/product/${product.id}/reviews?just=submitted`);
  };

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </button>
        <h1 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Leave a review', ar: 'اتركي تقييماً' })}
        </h1>
      </div>

      <div className="mx-auto max-w-lg px-4 pb-32 pt-4">
        {/* Item card */}
        <div className="flex items-center gap-3 rounded-3xl bg-white p-3 dark:bg-card">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-blush/40">
            {hasPhoto && (
              <Image src={product.images[0]} alt={t(product.name)} fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-ink dark:text-foreground">
              {t(product.name)}
            </p>
          </div>
        </div>

        {/* Overall rating */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Overall rating', ar: 'التقييم العام' })}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-red-500">
              {t({ en: 'required', ar: 'مطلوب' })}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {t({ en: 'Tap to rate', ar: 'اضغطي للتقييم' })}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                className="transition-transform active:scale-90"
              >
                <Sparkle
                  className={cn('size-9', n <= rating ? 'text-hero' : 'text-soft/40')}
                  fill={n <= rating ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review body */}
        <div className="mt-6">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
            {t({ en: 'Review', ar: 'التقييم' })}
          </span>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value.slice(0, MAX_BODY))}
            rows={6}
            placeholder={t({
              en: 'How does it fit? How does the fabric feel? Anything you want shoppers to know.',
              ar: 'كيف هو المقاس؟ كيف ملمس القماش؟ أي شيء تودين إخبار المتسوقين به.',
            })}
            className="mt-2 w-full rounded-2xl border border-soft/40 bg-white p-3 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
          />
          <p className="mt-1 text-end text-[11px] text-muted-foreground">
            {body.length} / {MAX_BODY}
          </p>
        </div>

        {/* Add photos */}
        <div className="mt-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
            {t({ en: 'Add photos', ar: 'إضافة صور' })}
            <span className="ms-1 font-normal text-muted-foreground">{photos.length} / {MAX_PHOTOS}</span>
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <label
              className={cn(
                'flex size-20 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-soft/60 bg-white text-soft transition-colors hover:border-hero/40 hover:text-hero dark:border-border dark:bg-card',
                photos.length >= MAX_PHOTOS && 'pointer-events-none opacity-40'
              )}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoPick}
                disabled={photos.length >= MAX_PHOTOS}
              />
              <Plus className="size-6" strokeWidth={2} />
            </label>
            {photos.map((src, i) => (
              <div key={i} className="relative size-20 overflow-hidden rounded-2xl">
                <Image src={src} alt={`Photo ${i + 1}`} fill sizes="80px" className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={t({ en: 'Remove photo', ar: 'إزالة الصورة' })}
                  className="absolute end-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/95 text-ink shadow-md"
                >
                  <X className="size-3.5" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blush/40 bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-colors',
            valid
              ? 'bg-plum text-white hover:bg-plum/90'
              : 'bg-ink/30 text-white/80 dark:bg-foreground/20'
          )}
        >
          {t({ en: 'Submit', ar: 'إرسال' })}
        </button>
      </div>
    </PageShell>
  );
}

export default function WriteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <WriteReviewContent id={id} />
    </Suspense>
  );
}
