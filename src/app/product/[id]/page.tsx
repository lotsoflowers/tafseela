'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Check,
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
import PriceTag from '@/components/shared/PriceTag';
import StarRating from '@/components/review/StarRating';
import ReviewCard from '@/components/review/ReviewCard';
import FitQuestionnaire from '@/components/fit/FitQuestionnaire';
import FitResult from '@/components/fit/FitResult';
import SizeChartDialog from '@/components/product/SizeChartDialog';
import AuthModal from '@/components/auth/AuthModal';
import { Separator } from '@/components/ui/separator';
import type { ProductSize, FitRecommendation } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const { language, direction, t } = useLanguage();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addItem, itemCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [fitResult, setFitResult] = useState<FitRecommendation | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.id === id);
  const store = product ? stores.find((s) => s.id === product.storeId) : null;
  const productReviews = product
    ? allReviews.filter((r) => r.productId === product.id)
    : [];

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-ink">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
          </p>
          <Link
            href="/home"
            className="mt-4 inline-block text-hero underline"
          >
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    addItem(product.id, product.storeId, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddToWishlist = () => {
    toggleWishlist(product.id);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/home"
          className="flex size-10 items-center justify-center rounded-full bg-cream"
        >
          <ArrowLeft
            className={cn(
              'size-5 text-ink',
              direction === 'rtl' && 'rotate-180'
            )}
          />
        </Link>

        <Link
          href="/cart"
          className="relative flex size-10 items-center justify-center rounded-full bg-cream"
        >
          <ShoppingBag className="size-5 text-ink" />
          {itemCount > 0 && (
            <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-hero text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Product carousel */}
      <ProductCarousel
        images={product.images}
        productName={t(product.name)}
        className="px-4"
      />

      {/* Product info */}
      <div className="mt-4 space-y-4 px-4">
        {/* Store */}
        {store && (
          <Link
            href={`/store/${store.id}`}
            className="inline-flex items-center gap-2"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-soft/20 text-xs font-bold text-plum">
              {t(store.name).charAt(0)}
            </div>
            <span className="text-sm font-medium text-plum">
              {t(store.name)}
            </span>
          </Link>
        )}

        {/* Product name */}
        <h1 className="text-xl font-bold text-ink">{t(product.name)}</h1>

        {/* Price + rating */}
        <div className="flex items-center justify-between">
          <PriceTag amount={product.price} className="text-lg" />
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size={14} />
            <span className="text-sm text-ink/50">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Availability */}
        <div>
          {product.isOutOfStock ? (
            <span className="text-sm font-medium text-red-500">
              {language === 'ar' ? 'غير متوفر' : 'Out of stock'}
            </span>
          ) : (
            <span className="text-sm font-medium text-green-600">
              {language === 'ar' ? 'متوفر' : 'In stock'}
            </span>
          )}
        </div>

        {/* Size selector */}
        {!product.isOutOfStock && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">
                {language === 'ar' ? 'اختاري المقاس' : 'Select size'}
              </p>
              {store?.sizeChart && (
                <SizeChartDialog
                  chart={store.sizeChart}
                  storeName={t(store.name)}
                />
              )}
            </div>
            <SizeSelector
              sizes={product.sizes}
              availableSizes={product.availableSizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        )}

        {/* Fit questionnaire */}
        <FitQuestionnaire
          productFit={product.fit}
          onResult={setFitResult}
        />

        {/* Fit result */}
        {fitResult && <FitResult result={fitResult} />}

        <Separator />

        {/* Description */}
        <div>
          <h2 className="mb-2 text-base font-semibold text-ink">
            {language === 'ar' ? 'التفاصيل' : 'Details'}
          </h2>
          <p className="text-sm leading-relaxed text-ink/70">
            {t(product.description)}
          </p>
        </div>

        {/* Fit info */}
        <div>
          <h2 className="mb-2 text-base font-semibold text-ink">
            {language === 'ar' ? 'معلومات القصة' : 'Fit info'}
          </h2>
          <FitBadge fit={product.fit} className="text-sm" />
        </div>

        <Separator />

        {/* Reviews */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-ink">
            {language === 'ar' ? 'التقييمات' : 'Reviews'}
            {productReviews.length > 0 && (
              <span className="ms-1 text-sm font-normal text-ink/50">
                ({productReviews.length})
              </span>
            )}
          </h2>

          {productReviews.length > 0 ? (
            <div className="space-y-3">
              {productReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink/40">
              {language === 'ar'
                ? 'لا توجد تقييمات بعد'
                : 'No reviews yet'}
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 start-0 end-0 z-30 border-t border-soft/30 bg-white px-4 py-3">
        {product.isOutOfStock ? (
          <button
            type="button"
            onClick={handleAddToWishlist}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors',
              wishlisted
                ? 'bg-soft/30 text-hero'
                : 'bg-plum text-white'
            )}
          >
            <Heart
              className={cn(
                'size-5',
                wishlisted && 'fill-hero'
              )}
            />
            {wishlisted
              ? language === 'ar'
                ? 'في الويشليست'
                : 'In Wishlist'
              : language === 'ar'
                ? 'أضيفي للويشليست'
                : 'Add to Wishlist'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize || addedToCart}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors',
              addedToCart
                ? 'bg-green-500 text-white'
                : !selectedSize
                  ? 'bg-hero/40 text-white'
                  : 'bg-hero text-white active:bg-hero/90'
            )}
          >
            {addedToCart ? (
              <>
                <Check className="size-5" />
                {language === 'ar' ? 'تمت الإضافة' : 'Added'}
              </>
            ) : (
              <>
                <ShoppingBag className="size-5" />
                {!selectedSize
                  ? language === 'ar'
                    ? 'اختاري مقاس'
                    : 'Select a size'
                  : language === 'ar'
                    ? 'أضيفي للسلة'
                    : 'Add to Cart'}
              </>
            )}
          </button>
        )}
      </div>

      {/* Auth modal */}
      <AuthModal />
    </div>
  );
}
