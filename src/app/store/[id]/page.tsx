'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { categories } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilter from '@/components/shared/CategoryFilter';
import ReviewCard from '@/components/review/ReviewCard';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const store = stores.find((s) => s.id === id);

  const storeProducts = useMemo(() => {
    if (!store) return [];
    return products.filter((p) => p.storeId === store.id);
  }, [store]);

  const storeCategories = useMemo(() => {
    const catIds = new Set(storeProducts.map((p) => p.categoryId));
    return categories.filter((c) => c.id === 'all' || catIds.has(c.id));
  }, [storeProducts]);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-background">
        <p className="text-lg font-semibold text-ink dark:text-foreground">
          {t({ en: 'Store not found', ar: 'المتجر غير موجود' })}
        </p>
      </div>
    );
  }

  const filteredProducts =
    selectedCategory === 'all'
      ? storeProducts
      : storeProducts.filter((p) => p.categoryId === selectedCategory);

  const storeProductIds = new Set(storeProducts.map((p) => p.id));
  const storeReviews = reviews.filter((r) => storeProductIds.has(r.productId));
  const displayedReviews = storeReviews.slice(0, 3);

  const initial = t(store.name).charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-cream dark:bg-background">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute start-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
      >
        <ArrowLeft className={cn('size-5 text-ink dark:text-foreground', language === 'ar' && 'rotate-180')} />
      </button>

      {/* Banner */}
      <div className="relative">
        <div className="flex aspect-[16/7] w-full items-center justify-center bg-plum">
          <span className="text-2xl font-bold text-white/20">
            {t(store.name)}
          </span>
        </div>

        {/* Store logo */}
        <div className="absolute -bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <div className="flex size-16 items-center justify-center rounded-full border-3 border-white bg-hero text-2xl font-bold text-white shadow-lg">
            {initial}
          </div>
        </div>
      </div>

      {/* Store info */}
      <div className="px-4 pt-12 text-center">
        <h1 className="text-xl font-bold text-ink dark:text-foreground">{t(store.name)}</h1>
        <p className="mt-1 text-sm text-ink/60">{t(store.description)}</p>

        {/* Stats */}
        <div className="mt-3 flex items-center justify-center gap-6 text-sm text-ink/70">
          <span>
            {store.productCount} {t({ en: 'products', ar: 'منتج' })}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {store.rating}
          </span>
          <span>
            {store.reviewCount} {t({ en: 'reviews', ar: 'تقييم' })}
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="mt-6 px-4">
        <CategoryFilter
          categories={storeCategories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Product grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Reviews section */}
      {displayedReviews.length > 0 && (
        <div className="mt-8 px-4 pb-8">
          <h2 className="mb-4 text-lg font-bold text-ink dark:text-foreground">
            {t({ en: 'Reviews', ar: 'التقييمات' })}
          </h2>
          <div className="space-y-3">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
