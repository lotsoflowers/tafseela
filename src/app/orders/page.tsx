'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import SegmentedSubtabs from '@/components/shared/SegmentedSubtabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/contexts/OrdersContext';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

type Tab = 'active' | 'past';

export default function OrdersPage() {
  const { t, language, direction } = useLanguage();
  const { getActiveOrders, getPastOrders } = useOrders();
  const [tab, setTab] = useState<Tab>('active');

  const active = getActiveOrders();
  const past = getPastOrders();
  const showing = tab === 'active' ? active : past;

  const subtabs = [
    { id: 'active' as const, label: { en: 'Active orders', ar: 'الطلبات النشطة' }, count: active.length },
    { id: 'past' as const, label: { en: 'Past orders', ar: 'الطلبات السابقة' }, count: past.length },
  ];

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <LargeTitle title={{ en: 'Orders', ar: 'الطلبات' }} />
      </div>

      <div className="px-2 pt-2">
        <SegmentedSubtabs items={subtabs} active={tab} onChange={setTab} />
      </div>

      {showing.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-20 text-center">
          <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-cream dark:bg-secondary">
            <Package className="size-9 text-soft" strokeWidth={1.5} />
          </span>
          <p className="text-[15px] font-semibold text-ink dark:text-foreground">
            {tab === 'active'
              ? t({ en: 'No active orders', ar: 'لا توجد طلبات نشطة' })
              : t({ en: 'No past orders', ar: 'لا توجد طلبات سابقة' })}
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-hero px-5 py-2.5 text-[13px] font-bold text-white"
          >
            {t({ en: 'Browse Catalog', ar: 'تصفّحي الفئات' })}
          </Link>
        </div>
      ) : (
        <div className="space-y-4 px-4 pt-4">
          {showing.map(order => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}

      <div className="h-12" />
    </PageShell>
  );
}

function OrderRow({ order }: { order: Order }) {
  const { t, direction, language } = useLanguage();
  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const statusLabel = (() => {
    switch (order.status) {
      case 'confirmed':
        return { en: 'Placed', ar: 'تم التأكيد' };
      case 'processing':
        return { en: 'Packed', ar: 'تم التغليف' };
      case 'shipped':
      case 'out-for-delivery':
        return { en: 'Shipped', ar: 'تم الشحن' };
      case 'delivered':
        return { en: 'Delivered', ar: 'تم التوصيل' };
    }
  })();

  const orderDate = new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block overflow-hidden rounded-3xl bg-white dark:bg-card"
    >
      <div className="px-4 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {t(statusLabel)}
        </p>
        <p className="mt-0.5 text-[14px] font-bold text-ink dark:text-foreground">
          {t({
            en: `Order ${order.id.slice(-6).toUpperCase()}`,
            ar: `طلب ${order.id.slice(-6).toUpperCase()}`,
          })}
        </p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{orderDate}</p>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex flex-1 gap-2 overflow-x-auto hide-scrollbar">
          {order.items.slice(0, 5).map((item, i) => {
            const product = products.find(p => p.id === item.productId);
            const hasPhoto = product && /^https?:\/\//.test(product.images[0] ?? '');
            return (
              <div
                key={`${item.productId}-${item.size}-${i}`}
                className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-blush/40"
              >
                {product && hasPhoto && (
                  <Image
                    src={product.images[0]}
                    alt={t(product.name)}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
        <Chevron className="size-5 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}
