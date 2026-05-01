'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockOrder } from '@/data/orders';
const orders = [mockOrder];
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { formatPrice, formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, language, direction } = useLanguage();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink/60">{t({ en: 'Order not found', ar: 'الطلب غير موجود' })}</p>
      </div>
    );
  }

  // Group items by store
  const storeGroups = new Map<string, typeof order.items>();
  order.items.forEach((item) => {
    const existing = storeGroups.get(item.storeId) || [];
    existing.push(item);
    storeGroups.set(item.storeId, existing);
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-blush px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/home')} className="text-ink">
          <ArrowLeft className={cn('w-5 h-5', direction === 'rtl' && 'rotate-180')} />
        </button>
        <h1 className="font-bold text-ink">
          {t({ en: 'Order Confirmation', ar: 'تأكيد الطلب' })}
        </h1>
      </div>

      <div className="px-4 py-6 space-y-4 animate-fade-in">
        {/* Order info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-ink/60">
              {t({ en: 'Order', ar: 'طلب' })} #{order.id}
            </p>
            <Badge className="bg-hero/10 text-hero border-0">
              {t({ en: 'Order confirmed', ar: 'تم تأكيد الطلب' })}
            </Badge>
          </div>
          <p className="text-xs text-ink/50">{formatDate(order.createdAt, language)}</p>
        </div>

        {/* Items by store */}
        {Array.from(storeGroups.entries()).map(([storeId, items]) => {
          const store = stores.find((s) => s.id === storeId);
          return (
            <div key={storeId} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-bold text-ink mb-3">
                {store ? t(store.name) : storeId}
              </p>
              {items.map((item, idx) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    <div className="w-12 h-12 rounded-lg bg-soft/20 flex items-center justify-center shrink-0">
                      <span className="text-[8px] text-plum text-center">
                        {product ? t(product.name).slice(0, 15) : ''}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">
                        {product ? t(product.name) : item.productId}
                      </p>
                      <p className="text-xs text-ink/50">
                        {t({ en: 'Size', ar: 'المقاس' })}: {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {product ? formatPrice(product.price * item.quantity) : ''}
                    </p>
                  </div>
                );
              })}
              <Separator className="my-2 bg-cream" />
              <p className="text-xs text-ink/50">
                {t({ en: 'Estimated delivery: 2-3 business days', ar: 'التوصيل المتوقع: ٢-٣ أيام عمل' })}
              </p>
            </div>
          );
        })}

        {/* Total */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between">
            <p className="font-bold text-ink">{t({ en: 'Total paid', ar: 'المبلغ المدفوع' })}</p>
            <p className="font-bold text-hero">{formatPrice(order.total)}</p>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-medium text-ink text-sm mb-2">
            {t({ en: 'Delivery address', ar: 'عنوان التوصيل' })}
          </p>
          <p className="text-sm text-ink/70">
            {order.deliveryAddress.fullName}<br />
            {t(order.deliveryAddress.area)}, {t({ en: 'Block', ar: 'قطعة' })} {order.deliveryAddress.block}<br />
            {t({ en: 'Street', ar: 'شارع' })} {order.deliveryAddress.street}, {t({ en: 'Bldg', ar: 'مبنى' })} {order.deliveryAddress.building}
          </p>
        </div>

        {/* Track order button */}
        <Link href={`/order/track/${order.id}`}>
          <Button className="w-full bg-hero hover:bg-hero/90 text-white rounded-full py-6 text-base font-bold">
            {t({ en: 'Track your order', ar: 'تتبعي طلبج' })}
          </Button>
        </Link>
      </div>
    </div>
  );
}
