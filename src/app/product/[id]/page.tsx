'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, ShoppingBag, Heart, Check,
  Bell, BellOff, Share2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRestockAlerts } from '@/contexts/RestockAlertsContext';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { reviews as staticReviews } from '@/data/reviews';
import { useReviews } from '@/contexts/ReviewsContext';
import { getOutfitsContainingProduct } from '@/data/outfits';
import ProductCarousel from '@/components/product/ProductCarousel';
import SizeSelector from '@/components/product/SizeSelector';
import FitBadge from '@/components/product/FitBadge';
import FitQuestionnaire from '@/components/fit/FitQuestionnaire';
import FitResult from '@/components/fit/FitResult';
import SizeChartDialog from '@/components/product/SizeChartDialog';
import AuthModal from '@/components/auth/AuthModal';
import ProductCard from '@/components/product/ProductCard';
import OutfitCard from '@/components/outfit/OutfitCard';
import { SparkleRating } from '@/components/ui/SparkleStar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatPrice } from '@/lib/format';
import type { ProductSize, FitRecommendation } from '@/types';

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const { language, direction, t } = useLanguage();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addItem, itemCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isSubscribed, subscribe, unsubscribe } = useRestockAlerts();
  const { getReviews } = useReviews();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [fitResult, setFitResult] = useState<FitRecommendation | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find(p => p.id === id);
  const store = product ? stores.find(s => s.id === product.storeId) : undefined;

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-ink dark:text-foreground">
            {t({ en: 'Product not found', ar: 'المنتج غير موجود' })}
          </p>
          <Link href="/home" className="mt-4 inline-block text-hero underline">
            {t({ en: 'Back to home', ar: 'العودة للرئيسية' })}
          </Link>
        </div>
      </div>
    );
  }

  const ChevronBack = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const wishlisted = isWishlisted(product.id);
  const productReviewsStatic = staticReviews.filter(r => r.productId === product.id);
  const productReviewsLocal = getReviews(product.id);
  const allReviews = [...productReviewsLocal, ...productReviewsStatic];
  const totalReviewCount = product.reviewCount + productReviewsLocal.length;

  const containingOutfits = getOutfitsContainingProduct(product.id);
  const styledWith = products
    .filter(p => p.id !== product.id && p.storeId === product.storeId && p.categoryId !== product.categoryId)
    .slice(0, 4);
  const similar = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId && p.storeId !== product.storeId)
    .slice(0, 4);

  const sizeIsOOS = selectedSize !== null && !product.availableSizes.includes(selectedSize);
  const subscribedToSelected = selectedSize !== null && isSubscribed(product.id, selectedSize);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addItem(product.id, product.storeId, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRestockToggle = () => {
    if (!selectedSize) return;
    if (subscribedToSelected) unsubscribe(product.id, selectedSize);
    else subscribe(product.id, selectedSize);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between p-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md dark:bg-card/85 dark:text-foreground"
        >
          <ChevronBack className="size-5" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t({ en: 'Share', ar: 'مشاركة' })}
            className="flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md dark:bg-card/85 dark:text-foreground"
          >
            <Share2 className="size-5" strokeWidth={1.75} />
          </button>
          <Link
            href="/cart"
            aria-label={t({ en: 'Bag', ar: 'الحقيبة' })}
            className="relative flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md dark:bg-card/85 dark:text-foreground"
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

      {/* Hero carousel */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-blush/40">
        <ProductCarousel images={product.images} productName={t(product.name)} />
      </div>

      {/* Main content */}
      <div className="px-5 pt-5 pb-12">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold leading-tight text-ink dark:text-foreground">
              {t(product.name)}
            </h1>
            <p className="mt-1 text-[20px] font-bold text-ink dark:text-foreground">
              {formatPrice(product.price)}
            </p>
            {store && (
              <Link
                href={`/store/${store.id}`}
                className="mt-1 inline-block text-[13px] font-semibold text-hero underline-offset-2 hover:underline"
              >
                {t(store.name)}
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wishlisted ? t({ en: 'Remove from saved', ar: 'إزالة من المحفوظات' }) : t({ en: 'Save', ar: 'احفظي' })}
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-full border border-soft/40 transition-colors dark:border-border',
              wishlisted ? 'bg-hero text-white' : 'bg-white text-ink dark:bg-card dark:text-foreground hover:border-ink/40'
            )}
          >
            <Heart className={cn('size-5', wishlisted && 'fill-white')} strokeWidth={2} />
          </button>
        </div>

        {/* Rating row */}
        <div className="mt-3 flex items-center gap-2 text-[13px]">
          <SparkleRating value={product.rating} size="sm" />
          <span className="font-semibold text-ink dark:text-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({totalReviewCount})
          </span>
        </div>

        {/* Size selector */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink dark:text-foreground">
            {t({ en: 'Size', ar: 'المقاس' })}
            {selectedSize && (
              <span className="ms-1.5 font-normal text-muted-foreground">{selectedSize}</span>
            )}
          </span>
          {store?.sizeChart && (
            <SizeChartDialog chart={store.sizeChart} storeName={t(store.name)} />
          )}
        </div>
        <div className="mt-2.5">
          <SizeSelector
            sizes={product.sizes}
            availableSizes={product.availableSizes}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
            allowUnavailableSelection
          />
        </div>

        {/* Subscribe-state banner — visible only when user has subscribed for any size of this product */}
        {selectedSize && subscribedToSelected && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-cream p-3 dark:bg-secondary">
            <Bell className="size-4 shrink-0 text-plum dark:text-foreground" strokeWidth={2} />
            <div className="min-w-0 flex-1 text-[13px]">
              <p className="font-semibold text-ink dark:text-foreground">
                {t({ en: 'Push notifications are on', ar: 'الإشعارات مفعّلة' })}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {t({
                  en: `You'll be alerted when size ${selectedSize} is back in stock.`,
                  ar: `سيتم إشعارك عندما يعود مقاس ${selectedSize} إلى المخزون.`,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Primary CTA — Add to Bag, Notify, or Stop alerts */}
        <div className="mt-5">
          {sizeIsOOS ? (
            <button
              type="button"
              onClick={handleRestockToggle}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-colors',
                subscribedToSelected
                  ? 'bg-cream text-plum dark:bg-secondary dark:text-foreground'
                  : 'bg-ink text-white dark:bg-foreground dark:text-background'
              )}
            >
              {subscribedToSelected ? (
                <>
                  <BellOff className="size-5" strokeWidth={2} />
                  {t({ en: 'Stop restock alerts', ar: 'إيقاف تنبيهات التوفر' })}
                </>
              ) : (
                <>
                  <Bell className="size-5" strokeWidth={2} />
                  {t({ en: 'Notify when restocked', ar: 'أشعريني عند التوفر' })}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={!selectedSize || addedToCart}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all',
                'active:scale-[0.97]',
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : !selectedSize
                    ? 'bg-ink/30 text-white/80 dark:bg-foreground/20'
                    : 'bg-hero text-white shadow-[0_4px_12px_rgba(191,6,106,0.3)] hover:bg-hero/90'
              )}
            >
              {addedToCart ? (
                <>
                  <Check className="size-5" strokeWidth={2.5} />
                  {t({ en: 'Added to Bag', ar: 'أُضيفت للحقيبة' })}
                </>
              ) : !selectedSize ? (
                t({ en: 'Select a size', ar: 'اختاري مقاس' })
              ) : (
                t({ en: 'Add to Bag', ar: 'أضيفي للحقيبة' })
              )}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="mt-6 text-[14px] leading-relaxed text-ink/75 dark:text-foreground/75">
          {t(product.description)}
        </p>

        {/* Fit badge */}
        <div className="mt-3">
          <FitBadge fit={product.fit} className="text-[12px]" />
        </div>

        {/* Fit questionnaire */}
        <div className="mt-6">
          <FitQuestionnaire productFit={product.fit} onResult={setFitResult} />
          {fitResult && (
            <div className="mt-3">
              <FitResult result={fitResult} />
            </div>
          )}
        </div>

        {/* Accordions */}
        <Accordion multiple className="mt-8 border-t border-soft/40 dark:border-border">
          <AccordionItem value="size-fit" className="border-b border-soft/40 dark:border-border">
            <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink dark:text-foreground">
              {t({ en: 'Size and fit', ar: 'المقاس والقصة' })}
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-ink/75 dark:text-foreground/75">
              <p>
                {t({
                  en: `Fit: ${product.fit.replace('-', ' ')}.`,
                  ar: 'تفاصيل القصة والمقاس متوفرة في جدول المقاسات.',
                })}
              </p>
              {store?.sizeChart?.notes && (
                <p className="mt-2">{t(store.sizeChart.notes)}</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-details" className="border-b border-soft/40 dark:border-border">
            <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink dark:text-foreground">
              {t({ en: 'Item details', ar: 'تفاصيل القطعة' })}
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-ink/75 dark:text-foreground/75">
              <p>{t(product.description)}</p>
              <p className="mt-2 text-muted-foreground">
                {t({
                  en: `Article: ${product.id}`,
                  ar: `رقم القطعة: ${product.id}`,
                })}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="care" className="border-b border-soft/40 dark:border-border">
            <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink dark:text-foreground">
              {t({ en: 'Care instructions', ar: 'تعليمات العناية' })}
            </AccordionTrigger>
            <AccordionContent className="text-[13px] text-ink/75 dark:text-foreground/75">
              <p>
                {t({
                  en: 'Machine wash at max. 30°C. Do not bleach. Do not iron. Refer to care label sewn inside the garment for full details.',
                  ar: 'يُغسل بالغسالة بحد أقصى 30°م. لا يُبيّض. لا يُكوى. راجعي ملصق العناية الموجود داخل القطعة لمزيد من التفاصيل.',
                })}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reviews" className="border-b border-soft/40 dark:border-border">
            <AccordionTrigger className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink dark:text-foreground">
              <span className="flex items-center gap-2">
                {t({ en: 'Reviews', ar: 'التقييمات' })}
                <SparkleRating value={product.rating} size="sm" />
                <span className="text-muted-foreground">{product.rating.toFixed(1)}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href={`/product/${product.id}/reviews`}
                className="inline-block text-[13px] font-semibold text-hero hover:underline"
              >
                {t({
                  en: `Read all ${totalReviewCount} reviews`,
                  ar: `اقرئي كل ${totalReviewCount} تقييم`,
                })}
              </Link>
              {allReviews.length > 0 && (
                <p className="mt-2 line-clamp-3 text-[13px] text-ink/75 dark:text-foreground/75">
                  &ldquo;{t(allReviews[0].text)}&rdquo; — {t(allReviews[0].userName)}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ITEM IN OUTFITS */}
        {containingOutfits.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {t({ en: 'Item in outfits', ar: 'القطعة ضمن إطلالات' })}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {containingOutfits.slice(0, 4).map(o => (
                <OutfitCard key={o.id} outfit={o} />
              ))}
            </div>
          </section>
        )}

        {/* STYLED WITH THIS ITEM */}
        {styledWith.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {t({ en: 'Styled with this item', ar: 'تنسيق مع هذه القطعة' })}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {styledWith.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* SIMILAR ITEMS */}
        {similar.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {t({ en: 'Similar items', ar: 'قطع مشابهة' })}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {similar.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <AuthModal />
    </div>
  );
}
