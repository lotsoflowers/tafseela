'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, ShoppingBag, Heart, Check,
  Minus, Plus, Star,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { reviews as allReviews } from '@/data/reviews';
import ProductCarousel from '@/components/product/ProductCarousel';
import SizeSelector from '@/components/product/SizeSelector';
import FitBadge from '@/components/product/FitBadge';
import StarRating from '@/components/review/StarRating';
import ReviewCard from '@/components/review/ReviewCard';
import FitQuestionnaire from '@/components/fit/FitQuestionnaire';
import FitResult from '@/components/fit/FitResult';
import SizeChartDialog from '@/components/product/SizeChartDialog';
import AuthModal from '@/components/auth/AuthModal';
import { formatPrice } from '@/lib/format';
import type { ProductSize, FitRecommendation } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const router = useRouter();
  const { language, direction, t } = useLanguage();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addItem, itemCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [fitResult, setFitResult] = useState<FitRecommendation | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const store = product ? stores.find((s) => s.id === product.storeId) : null;
  const productReviews = product
    ? allReviews.filter((r) => r.productId === product.id)
    : [];

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-ink dark:text-foreground">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
          </p>
          <Link href="/home" className="mt-4 inline-block text-hero underline">
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  const ChevronBack = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product.id, product.storeId, selectedSize);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incQty = () => setQuantity((q) => Math.min(q + 1, 10));
  const decQty = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div className="relative min-h-screen bg-cream dark:bg-background pb-32">
      {/* Hero photo zone — full bleed, page background reads through */}
      <div className="relative">
        <ProductCarousel
          images={product.images}
          productName={t(product.name)}
        />

        {/* Floating top bar — chevron back + cart, both circular and glassy */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t({ en: 'Go back', ar: 'رجوع' })}
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              'bg-white/85 dark:bg-card/85 backdrop-blur-md',
              'shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
              'text-ink dark:text-foreground transition-transform active:scale-[0.95]'
            )}
          >
            <ChevronBack className="size-5" strokeWidth={2.5} />
          </button>

          <Link
            href="/cart"
            aria-label={t({ en: 'Cart', ar: 'سلة التسوق' })}
            className={cn(
              'relative flex size-10 items-center justify-center rounded-full',
              'bg-white/85 dark:bg-card/85 backdrop-blur-md',
              'shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
              'text-ink dark:text-foreground transition-transform active:scale-[0.95]'
            )}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hero px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-card">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Info card — overlaps the photo from below with a tall radius and a
          floating wishlist heart anchored to its edge. */}
      <div
        className={cn(
          'relative -mt-7 rounded-t-[28px] bg-white dark:bg-card',
          'px-5 pt-7 pb-6',
          'shadow-[0_-8px_24px_rgba(92,10,61,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)]'
        )}
      >
        {/* Floating wishlist heart anchored on the card edge */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute -top-7 end-5 flex size-14 items-center justify-center rounded-full',
            'bg-hero text-white',
            'shadow-[0_8px_20px_rgba(191,6,106,0.35)]',
            'transition-transform active:scale-[0.94] hover:scale-105'
          )}
        >
          <Heart
            className={cn('size-6 transition-all', wishlisted ? 'fill-white scale-110' : 'fill-none')}
            strokeWidth={2}
          />
        </button>

        {/* Title row — name on the leading side, price on the trailing side */}
        <div className="flex items-start justify-between gap-4 pe-16">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold leading-tight tracking-tight text-ink dark:text-foreground">
              {t(product.name)}
            </h1>
            {store && (
              <Link
                href={`/store/${store.id}`}
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-blush/60 dark:bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-plum dark:text-soft"
              >
                {t(store.name)}
              </Link>
            )}
          </div>
          <div className="shrink-0 text-end">
            <p className="text-[20px] font-bold text-ink dark:text-foreground whitespace-nowrap">
              {formatPrice(product.price)}
            </p>
            <p className="mt-0.5 text-[12px] text-ink/40 dark:text-foreground/40">
              {language === 'ar' ? 'الكويت' : 'Kuwait'}
            </p>
          </div>
        </div>

        {/* Rating + availability inline */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size={14} />
            <span className="text-[13px] font-medium text-ink/60 dark:text-foreground/60">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[12px] text-ink/40 dark:text-foreground/40">
              ({product.reviewCount})
            </span>
          </div>
          <span className="size-1 rounded-full bg-ink/15 dark:bg-foreground/15" />
          {product.isOutOfStock ? (
            <span className="text-[13px] font-medium text-red-500">
              {language === 'ar' ? 'غير متوفر' : 'Out of stock'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" strokeWidth={3} />
              {language === 'ar' ? 'متوفر' : 'In stock'}
            </span>
          )}
        </div>

        {/* Inline size row — "Your Size: [pills] | Size chart" */}
        {!product.isOutOfStock && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-ink/60 dark:text-foreground/60">
              {language === 'ar' ? 'مقاسك' : 'Your size'}
            </span>
            {store?.sizeChart && (
              <SizeChartDialog chart={store.sizeChart} storeName={t(store.name)} />
            )}
          </div>
        )}
        {!product.isOutOfStock && (
          <div className="mt-2.5">
            <SizeSelector
              sizes={product.sizes}
              availableSizes={product.availableSizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        )}

        {/* Description — collapsed-feel, no heading clutter */}
        <p className="mt-5 text-[14px] leading-relaxed text-ink/70 dark:text-foreground/70">
          {t(product.description)}
        </p>

        {/* Fit info chip */}
        <div className="mt-3">
          <FitBadge fit={product.fit} className="text-[12px]" />
        </div>

        {/* Fit questionnaire (collapsible) */}
        <div className="mt-6">
          <FitQuestionnaire
            productFit={product.fit}
            onResult={setFitResult}
          />
        </div>
        {fitResult && (
          <div className="mt-3">
            <FitResult result={fitResult} />
          </div>
        )}

        {/* Reviews */}
        {productReviews.length > 0 && (
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink dark:text-foreground">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {language === 'ar' ? 'التقييمات' : 'Reviews'}
                <span className="text-[13px] font-normal text-ink/40 dark:text-foreground/40">
                  ({productReviews.length})
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {productReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom — quantity stepper + Add to Cart pill */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-40',
          'border-t border-soft/30 dark:border-border',
          'bg-white/95 dark:bg-card/95 backdrop-blur-md',
          'px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)]'
        )}
      >
        {product.isOutOfStock ? (
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-colors',
              wishlisted ? 'bg-soft/30 text-hero' : 'bg-plum text-white'
            )}
          >
            <Heart className={cn('size-5', wishlisted && 'fill-hero')} />
            {wishlisted
              ? t({ en: 'In Wishlist', ar: 'في الويشليست' })
              : t({ en: 'Add to Wishlist', ar: 'أضيفي للويشليست' })}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Quantity stepper */}
            <div className="flex items-center gap-3 rounded-full border border-soft/40 dark:border-border px-3 py-2">
              <button
                type="button"
                onClick={decQty}
                aria-label="Decrease quantity"
                className="flex size-7 items-center justify-center rounded-full text-ink dark:text-foreground transition-colors hover:bg-blush/40 dark:hover:bg-foreground/5 active:scale-[0.94] disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="size-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-5 text-center text-[15px] font-bold tabular-nums text-ink dark:text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incQty}
                aria-label="Increase quantity"
                className="flex size-7 items-center justify-center rounded-full text-ink dark:text-foreground transition-colors hover:bg-blush/40 dark:hover:bg-foreground/5 active:scale-[0.94]"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Add to Cart pill */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize || addedToCart}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all',
                'active:scale-[0.97]',
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : !selectedSize
                    ? 'bg-ink/30 dark:bg-foreground/20 text-white/80'
                    : 'bg-ink dark:bg-foreground text-white dark:text-background shadow-[0_4px_12px_rgba(44,44,42,0.25)] dark:shadow-[0_4px_12px_rgba(245,233,222,0.2)]'
              )}
            >
              {addedToCart ? (
                <>
                  <Check className="size-5" strokeWidth={2.5} />
                  {t({ en: 'Added', ar: 'تمت الإضافة' })}
                </>
              ) : (
                <>
                  {!selectedSize
                    ? t({ en: 'Select a size', ar: 'اختاري مقاس' })
                    : t({ en: 'Add to Cart', ar: 'أضيفي للسلة' })}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Auth modal */}
      <AuthModal />
    </div>
  );
}
