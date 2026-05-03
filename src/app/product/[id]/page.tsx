'use client';

import { useState, useRef, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, ShoppingBag, Heart, Check,
  Bell, BellOff, Share2, Minus, Plus,
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
import Banner from '@/components/shared/Banner';
import { notifyAddedToBag } from '@/lib/notify';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatPrice } from '@/lib/format';
import type { ProductSize, FitRecommendation } from '@/types';

// Sheet snap points — fraction of viewport height occupied by the photo
// above the sheet. PEEK ≈ photo dominates, EXPANDED ≈ sheet dominates with
// the photo just peeking at the top.
const PEEK_TOP_VH = 58;
const EXPANDED_TOP_VH = 9;
const COMMIT_PX = 60;

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
  const [quantity, setQuantity] = useState(1);

  // Bottom-sheet state
  const [sheetState, setSheetState] = useState<'peek' | 'expanded'>('peek');
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const dragStartYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const product = products.find(p => p.id === id);
  const store = product ? stores.find(s => s.id === product.storeId) : undefined;

  // Lock body scroll while the sheet is mounted — content scrolls internally.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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
    for (let i = 0; i < quantity; i++) {
      addItem(product.id, product.storeId, selectedSize);
    }
    setAddedToCart(true);
    notifyAddedToBag(language, product.name);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRestockToggle = () => {
    if (!selectedSize) return;
    if (subscribedToSelected) unsubscribe(product.id, selectedSize);
    else subscribe(product.id, selectedSize);
  };

  const incQty = () => setQuantity(q => Math.min(q + 1, 10));
  const decQty = () => setQuantity(q => Math.max(q - 1, 1));

  // Sheet drag — pointer events live ONLY on the drag handle so the
  // internal content scroll doesn't fight with sheet drag.
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = e.clientY;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || dragStartYRef.current === null) return;
    setDragOffsetPx(e.clientY - dragStartYRef.current);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // releasePointerCapture can throw if the pointer was never captured
    }
    const finalDragOffset =
      dragStartYRef.current !== null ? e.clientY - dragStartYRef.current : 0;
    if (sheetState === 'peek' && finalDragOffset < -COMMIT_PX) {
      setSheetState('expanded');
    } else if (sheetState === 'expanded' && finalDragOffset > COMMIT_PX) {
      setSheetState('peek');
    }
    dragStartYRef.current = null;
    setDragOffsetPx(0);
  };

  const baseTopVh = sheetState === 'peek' ? PEEK_TOP_VH : EXPANDED_TOP_VH;
  const sheetTopStyle = draggingRef.current
    ? {
        top: `calc(${baseTopVh}vh + ${dragOffsetPx}px)`,
        transition: 'none',
      }
    : {
        top: `${baseTopVh}vh`,
        transition: 'top 380ms cubic-bezier(0.32, 0.72, 0, 1)',
      };

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-background">
      {/* Hero photo zone — fixed background behind the sheet */}
      <div
        className="absolute inset-x-0 top-0 z-0"
        style={{ height: `${PEEK_TOP_VH + 5}vh` }}
      >
        <ProductCarousel images={product.images} productName={t(product.name)} />
      </div>

      {/* Floating top bar */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-3 pt-[calc(env(safe-area-inset-top)+12px)]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md active:scale-95 dark:bg-card/85 dark:text-foreground"
        >
          <ChevronBack className="size-5" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t({ en: 'Share', ar: 'مشاركة' })}
            className="flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md active:scale-95 dark:bg-card/85 dark:text-foreground"
          >
            <Share2 className="size-5" strokeWidth={1.75} />
          </button>
          <Link
            href="/cart"
            aria-label={t({ en: 'Bag', ar: 'الحقيبة' })}
            className="relative flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md active:scale-95 dark:bg-card/85 dark:text-foreground"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hero px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-card animate-pop-in">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom sheet — draggable, snaps between peek and expanded */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 rounded-t-[28px] bg-card',
          'shadow-[0_-8px_24px_rgba(92,10,61,0.10)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)]',
          'flex flex-col'
        )}
        style={sheetTopStyle}
      >
        {/* Drag-handle zone — pointer events live here only */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="cursor-grab touch-none select-none pt-2.5 pb-1.5 active:cursor-grabbing"
        >
          <div className="mx-auto h-1 w-10 rounded-full bg-ink/20 dark:bg-foreground/25" />
        </div>

        {/* Floating wishlist heart anchored on the sheet edge */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? t({ en: 'Remove from saved', ar: 'إزالة من المحفوظات' }) : t({ en: 'Save', ar: 'احفظي' })}
          className={cn(
            'absolute -top-7 end-5 flex size-14 items-center justify-center rounded-full',
            'bg-hero text-white shadow-cta',
            'transition-transform active:scale-94 hover:scale-105 z-20',
            wishlisted && 'scale-105'
          )}
        >
          <Heart
            className={cn('size-6 transition-all', wishlisted ? 'fill-white scale-110' : 'fill-none')}
            strokeWidth={2}
          />
        </button>

        {/* Scrollable sheet content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-3 pb-32">
          {/* Title + price */}
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

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2 text-[13px]">
            <SparkleRating value={product.rating} size="sm" />
            <span className="font-semibold text-ink dark:text-foreground">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({totalReviewCount})</span>
            <span className="size-1 rounded-full bg-ink/15 dark:bg-foreground/15" />
            {product.isOutOfStock ? (
              <span className="text-[13px] font-medium text-red-500">
                {t({ en: 'Out of stock', ar: 'نفد' })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" strokeWidth={3} />
                {t({ en: 'In stock', ar: 'متوفر' })}
              </span>
            )}
          </div>

          {/* Size */}
          {!product.isOutOfStock && (
            <>
              <div className="mt-5 flex items-center justify-between gap-3">
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
            </>
          )}

          {/* Subscribed-state banner */}
          {selectedSize && subscribedToSelected && (
            <Banner
              variant="info"
              icon={<Bell className="size-4" strokeWidth={2} />}
              title={{ en: 'Push notifications are on', ar: 'الإشعارات مفعّلة' }}
              body={{
                en: `You'll be alerted when size ${selectedSize} is back in stock.`,
                ar: `سيتم إشعارك عندما يعود مقاس ${selectedSize} إلى المخزون.`,
              }}
              className="mt-4"
            />
          )}

          {/* Description */}
          <p className="mt-5 text-[14px] leading-relaxed text-ink/75 dark:text-foreground/75">
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
                  {t({ en: `Article: ${product.id}`, ar: `رقم القطعة: ${product.id}` })}
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
            <section className="mt-8">
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
            <section className="mt-8">
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
            <section className="mt-8">
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
      </div>

      {/* Sticky bottom dock — quantity + Add to Bag, OR restock toggle */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-40',
          'border-t border-soft/30 dark:border-border',
          'bg-white/95 dark:bg-card/95 backdrop-blur-md',
          'px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)]'
        )}
      >
        {sizeIsOOS ? (
          <button
            type="button"
            onClick={handleRestockToggle}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-colors active:scale-[0.97]',
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
        ) : product.isOutOfStock ? (
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
              ? t({ en: 'In Saved', ar: 'في المحفوظات' })
              : t({ en: 'Save for later', ar: 'احفظيها لاحقاً' })}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-soft/40 bg-white px-1.5 py-1 dark:border-border dark:bg-card">
              <button
                type="button"
                onClick={decQty}
                aria-label={t({ en: 'Decrease', ar: 'إنقاص' })}
                disabled={quantity <= 1}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-[background-color,transform] hover:bg-cream active:scale-90 disabled:opacity-30 dark:text-foreground dark:hover:bg-secondary"
              >
                <Minus className="size-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-5 text-center text-[15px] font-bold tabular-nums text-ink dark:text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incQty}
                aria-label={t({ en: 'Increase', ar: 'زيادة' })}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-[background-color,transform] hover:bg-cream active:scale-90 dark:text-foreground dark:hover:bg-secondary"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToBag}
              disabled={!selectedSize || addedToCart}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all active:scale-[0.97]',
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : !selectedSize
                    ? 'bg-ink/30 text-white/80 dark:bg-foreground/20'
                    : 'bg-hero text-white shadow-cta hover:bg-hero/90'
              )}
            >
              {addedToCart ? (
                <>
                  <Check className="size-5" strokeWidth={2.5} />
                  {t({ en: 'Added', ar: 'تمت الإضافة' })}
                </>
              ) : !selectedSize ? (
                t({ en: 'Select a size', ar: 'اختاري مقاس' })
              ) : (
                t({ en: 'Add to Bag', ar: 'أضيفي للحقيبة' })
              )}
            </button>
          </div>
        )}
      </div>

      <AuthModal />
    </div>
  );
}
