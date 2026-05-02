'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import CartStoreGroup from '@/components/cart/CartStoreGroup';

export default function CartPage() {
  const { language } = useLanguage();
  const { items, getStoreGroups, getSubtotal, getTotal } = useCart();
  const router = useRouter();

  const storeGroups = getStoreGroups();
  const subtotal = getSubtotal();
  const total = getTotal();
  const storeCount = storeGroups.length;
  const isEmpty = items.length === 0;

  return (
    <PageShell className="bg-cream dark:bg-background">
      <LargeTitle title={{ en: 'My Cart', ar: 'سلتي' }} />
      <div className="max-w-lg mx-auto px-4 pb-6">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-24 rounded-full bg-blush dark:bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="size-10 text-hero" />
            </div>
            <p className="text-lg font-medium text-ink dark:text-foreground mb-2">
              {language === 'ar' ? 'سلتك فاضية' : 'Your cart is empty'}
            </p>
            <Link href="/home">
              <Button className="mt-4 bg-hero hover:bg-hero/90 text-white">
                {language === 'ar' ? 'تصفحي المتاجر' : 'Browse stores'}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Store groups */}
            <div className="space-y-4">
              {storeGroups.map((group, idx) => (
                <div key={group.storeId}>
                  {idx > 0 && (
                    <div className="flex items-center gap-3 my-4">
                      <Separator className="flex-1 bg-soft/50" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {language === 'ar' ? 'متجر آخر' : 'Another store'}
                      </span>
                      <Separator className="flex-1 bg-soft/50" />
                    </div>
                  )}
                  <CartStoreGroup storeId={group.storeId} items={group.items} />
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="mt-6 rounded-xl bg-white dark:bg-card p-4 space-y-3">
              <h2 className="font-semibold text-ink dark:text-foreground text-sm">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {language === 'ar'
                    ? `رسوم التوصيل (${storeCount} ${storeCount > 1 ? 'متاجر' : 'متجر'})`
                    : `Delivery (${storeCount} ${storeCount > 1 ? 'stores' : 'store'})`}
                </span>
                <span>{formatPrice(1.5 * storeCount)}</span>
              </div>
              <Separator className="bg-blush/50" />
              <div className="flex items-center justify-between font-bold text-ink dark:text-foreground text-lg">
                <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Multi-store note */}
            {storeCount > 1 && (
              <p className="mt-3 text-xs text-muted-foreground text-center px-4">
                {language === 'ar'
                  ? `طلبك فيه ${storeCount} متاجر — كل متجر يوصل بشكل منفصل`
                  : `Your order has ${storeCount} stores — each delivers separately`}
              </p>
            )}

            {/* Checkout button */}
            <Button
              className="w-full mt-6 bg-plum hover:bg-plum/90 text-white h-12 text-base font-semibold rounded-xl"
              onClick={() => router.push('/checkout')}
            >
              {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
            </Button>
          </>
        )}
      </div>
    </PageShell>
  );
}
