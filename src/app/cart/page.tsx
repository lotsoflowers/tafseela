'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, AlertCircle, BellOff } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import CartItemRow from '@/components/cart/CartItemRow';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function BagPage() {
  const { t } = useLanguage();
  const { items, itemCount, total } = useCart();
  const router = useRouter();

  const enriched = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const isOOS = product.isOutOfStock;
      const sizeOOS = !isOOS && !product.availableSizes.includes(item.size);
      const variant: 'normal' | 'action-needed' | 'unavailable' = isOOS
        ? 'unavailable'
        : sizeOOS
          ? 'action-needed'
          : 'normal';
      return { item, product, variant };
    })
    .filter(Boolean) as { item: typeof items[number]; product: typeof products[number]; variant: 'normal' | 'action-needed' | 'unavailable' }[];

  const normal = enriched.filter(e => e.variant === 'normal');
  const actionNeeded = enriched.filter(e => e.variant === 'action-needed');
  const unavailable = enriched.filter(e => e.variant === 'unavailable');

  const isEmpty = items.length === 0;
  const checkoutItemCount = normal.reduce((c, e) => c + e.item.quantity, 0);

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <LargeTitle title={{ en: 'Bag', ar: 'الحقيبة' }} />
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center px-6 py-20 text-center">
          <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-cream dark:bg-secondary">
            <ShoppingBag className="size-9 text-soft" strokeWidth={1.5} />
          </span>
          <p className="text-[15px] font-semibold text-ink dark:text-foreground">
            {t({ en: 'Your bag is empty', ar: 'حقيبتك فارغة' })}
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-hero px-5 py-2.5 text-[13px] font-bold text-white"
          >
            {t({ en: 'Browse Catalog', ar: 'تصفّحي الفئات' })}
          </Link>
        </div>
      ) : (
        <>
          <section className="pt-2">
            {normal.length > 0 && (
              <div className="mx-4 overflow-hidden rounded-3xl bg-white dark:bg-card">
                {normal.map((e, i) => (
                  <div
                    key={`${e.product.id}-${e.item.size}`}
                    className={cn(i > 0 && 'border-t border-blush/60 dark:border-border/60')}
                  >
                    <CartItemRow product={e.product} cartItem={e.item} variant="normal" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {actionNeeded.length > 0 && (
            <section className="mt-5">
              <div className="mb-2 flex items-center gap-2 px-4">
                <AlertCircle className="size-4 text-red-500" strokeWidth={2.25} />
                <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-red-500">
                  {t({ en: 'Action needed', ar: 'يتطلب إجراء' })}
                </h2>
              </div>
              <p className="mb-2 px-4 text-[12px] text-muted-foreground">
                {t({
                  en: 'Selected size is no longer available. Pick a new size or remove.',
                  ar: 'المقاس المختار لم يعد متوفراً. اختاري مقاساً آخر أو أزيليه.',
                })}
              </p>
              <div className="mx-4 overflow-hidden rounded-3xl bg-white dark:bg-card">
                {actionNeeded.map((e, i) => (
                  <div
                    key={`${e.product.id}-${e.item.size}`}
                    className={cn(i > 0 && 'border-t border-blush/60 dark:border-border/60')}
                  >
                    <CartItemRow product={e.product} cartItem={e.item} variant="action-needed" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {unavailable.length > 0 && (
            <section className="mt-5">
              <div className="mb-2 flex items-center gap-2 px-4">
                <BellOff className="size-4 text-muted-foreground" strokeWidth={2} />
                <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {t({ en: 'Unavailable items', ar: 'قطع غير متوفرة' })}
                </h2>
              </div>
              <div className="mx-4 overflow-hidden rounded-3xl bg-white dark:bg-card">
                {unavailable.map((e, i) => (
                  <div
                    key={`${e.product.id}-${e.item.size}`}
                    className={cn(i > 0 && 'border-t border-blush/60 dark:border-border/60')}
                  >
                    <CartItemRow product={e.product} cartItem={e.item} variant="unavailable" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sticky bottom checkout CTA — sits above BottomNav */}
          <div className="fixed inset-x-3 bottom-[88px] z-40 lg:bottom-3">
            <button
              type="button"
              disabled={checkoutItemCount === 0}
              onClick={() => router.push('/checkout')}
              className={cn(
                'flex w-full items-center justify-between rounded-full px-6 py-3.5 text-[14px] font-bold transition-colors',
                'shadow-[0_8px_24px_rgba(92,10,61,0.18)]',
                checkoutItemCount === 0
                  ? 'bg-ink/30 text-white/80 dark:bg-foreground/20'
                  : 'bg-plum text-white hover:bg-plum/90'
              )}
            >
              <span>
                {t({ en: 'Checkout', ar: 'إتمام الطلب' })}
              </span>
              <span className="text-[13px] opacity-90">
                {t({
                  en: `${checkoutItemCount} items · ${formatPrice(total)}`,
                  ar: `${checkoutItemCount} قطعة · ${formatPrice(total)}`,
                })}
              </span>
            </button>
          </div>

          <div className="h-32" />
        </>
      )}
    </PageShell>
  );
}
