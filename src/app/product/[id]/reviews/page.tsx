'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, Check } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { SparkleRating } from '@/components/ui/SparkleStar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { products } from '@/data/products';
import { reviews as staticReviews } from '@/data/reviews';
import { cn } from '@/lib/utils';
import type { Review, ProductSize } from '@/types';

const RATINGS = [5, 4, 3, 2, 1] as const;
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ReviewsListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, direction, language } = useLanguage();
  const { getReviews } = useReviews();
  const product = products.find(p => p.id === id);
  if (!product) notFound();

  const userReviews = getReviews(product.id);
  const seedReviews = staticReviews.filter(r => r.productId === product.id);
  const all: Review[] = [...userReviews, ...seedReviews];

  const [filterOpen, setFilterOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<Set<number>>(new Set());
  const [sizeFilter, setSizeFilter] = useState<Set<ProductSize>>(new Set());
  const [photosOnly, setPhotosOnly] = useState(false);

  const filtered = useMemo(() => {
    return all.filter(r => {
      if (ratingFilter.size > 0 && !ratingFilter.has(Math.round(r.rating))) return false;
      if (photosOnly && (!r.images || r.images.length === 0)) return false;
      return true;
    });
  }, [all, ratingFilter, photosOnly]);

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const filterCount = ratingFilter.size + sizeFilter.size + (photosOnly ? 1 : 0);

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <Link
          href={`/product/${product.id}`}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </Link>
        <h1 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Reviews', ar: 'التقييمات' })}
        </h1>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 dark:bg-card">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-blush/40">
            {/^https?:\/\//.test(product.images[0] ?? '') && (
              <Image src={product.images[0]} alt={t(product.name)} fill sizes="56px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-ink dark:text-foreground">{t(product.name)}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <SparkleRating value={product.rating} size="sm" />
              <span className="text-[12px] font-semibold text-ink dark:text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[12px] text-muted-foreground">
                ({all.length})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="mt-4 flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-plum dark:bg-secondary dark:text-foreground"
        >
          <SlidersHorizontal className="size-4" strokeWidth={2} />
          {t({ en: 'Filters', ar: 'التصفية' })}
          {filterCount > 0 && (
            <span className="rounded-full bg-hero px-1.5 text-[10px] font-bold text-white">{filterCount}</span>
          )}
        </button>

        <div className="mt-4 space-y-3 pb-12">
          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center dark:bg-card">
              <p className="text-[14px] font-semibold text-ink dark:text-foreground">
                {t({ en: 'No reviews match your filters.', ar: 'لا توجد تقييمات تطابق التصفية.' })}
              </p>
            </div>
          ) : (
            filtered.map(r => <ReviewItem key={r.id} review={r} />)
          )}
        </div>
      </div>

      {filterOpen && (
        <FilterSheet
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          sizeFilter={sizeFilter}
          setSizeFilter={setSizeFilter}
          photosOnly={photosOnly}
          setPhotosOnly={setPhotosOnly}
          onClose={() => setFilterOpen(false)}
          resultCount={filtered.length}
        />
      )}
    </PageShell>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const { t, language } = useLanguage();
  const date = new Date(review.createdAt).toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
    day: 'numeric', month: 'short', year: '2-digit',
  });
  return (
    <article className="rounded-3xl bg-white p-4 dark:bg-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold text-ink dark:text-foreground">{t(review.userName)}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{date}</p>
        </div>
        <SparkleRating value={review.rating} size="sm" />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink/85 dark:text-foreground/85">{t(review.text)}</p>
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
          {review.images.map((src, i) => (
            <div key={i} className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-blush/40">
              <Image src={src} alt="" fill sizes="64px" className="object-cover" unoptimized={src.startsWith('blob:')} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function FilterSheet({
  ratingFilter,
  setRatingFilter,
  sizeFilter,
  setSizeFilter,
  photosOnly,
  setPhotosOnly,
  onClose,
  resultCount,
}: {
  ratingFilter: Set<number>;
  setRatingFilter: (s: Set<number>) => void;
  sizeFilter: Set<ProductSize>;
  setSizeFilter: (s: Set<ProductSize>) => void;
  photosOnly: boolean;
  setPhotosOnly: (v: boolean) => void;
  onClose: () => void;
  resultCount: number;
}) {
  const { t } = useLanguage();

  const toggleRating = (n: number) => {
    const next = new Set(ratingFilter);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setRatingFilter(next);
  };

  const toggleSize = (s: ProductSize) => {
    const next = new Set(sizeFilter);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    setSizeFilter(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white pb-32 dark:bg-card"
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-[16px] font-bold text-ink dark:text-foreground">
            {t({ en: 'Review Filters', ar: 'تصفية التقييمات' })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-cream dark:hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <section className="px-4 pb-4">
          <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Rating', ar: 'التقييم' })}
            {ratingFilter.size > 0 && <span className="ms-1.5 text-hero">({ratingFilter.size})</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            {RATINGS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => toggleRating(n)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors',
                  ratingFilter.has(n)
                    ? 'bg-hero text-white'
                    : 'bg-cream text-ink dark:bg-secondary dark:text-foreground'
                )}
              >
                ★ {n}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-4">
          <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Size', ar: 'المقاس' })}
            {sizeFilter.size > 0 && <span className="ms-1.5 text-hero">({sizeFilter.size})</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={cn(
                  'flex size-10 items-center justify-center rounded-full text-[13px] font-semibold transition-colors',
                  sizeFilter.has(s)
                    ? 'bg-ink text-white dark:bg-foreground dark:text-background'
                    : 'border border-soft/40 bg-white text-ink dark:border-border dark:bg-card dark:text-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-4">
          <button
            type="button"
            onClick={() => setPhotosOnly(!photosOnly)}
            className="flex w-full items-center gap-3 rounded-2xl bg-cream px-4 py-3 dark:bg-secondary"
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded border-2',
                photosOnly ? 'border-hero bg-hero' : 'border-soft/60'
              )}
            >
              {photosOnly && <Check className="size-3 text-white" strokeWidth={3} />}
            </span>
            <span className="text-[14px] font-semibold text-ink dark:text-foreground">
              {t({ en: 'Show reviews with photos', ar: 'عرض التقييمات بالصور' })}
            </span>
          </button>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-blush/40 bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-md dark:border-border/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-cream py-3.5 text-[15px] font-bold text-plum dark:bg-secondary dark:text-foreground"
          >
            {t({
              en: `Show reviews (${resultCount})`,
              ar: `عرض التقييمات (${resultCount})`,
            })}
          </button>
        </div>
      </div>
    </div>
  );
}
