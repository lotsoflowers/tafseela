'use client';

import { use, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, MessageCircle, ExternalLink, Sparkle, Check } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import TrackingSteps from '@/components/orders/TrackingSteps';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/contexts/OrdersContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function OrderDetailContent({ id }: { id: string }) {
  const { t, language, direction } = useLanguage();
  const { getOrder, getReturnsForOrder } = useOrders();
  const params = useSearchParams();
  const justPlaced = params.get('placed') === '1';
  const [showSuccess, setShowSuccess] = useState(justPlaced);

  useEffect(() => {
    if (justPlaced) {
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [justPlaced]);

  const order = getOrder(id);
  if (!order) notFound();

  const returns = getReturnsForOrder(order.id);
  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const isPast = order.status === 'delivered';
  const orderShortId = order.id.slice(-6).toUpperCase();

  const subtotal = order.items.reduce((sum, item) => {
    const p = products.find(pp => pp.id === item.productId);
    return sum + (p?.price ?? 0) * item.quantity;
  }, 0);

  const paymentLabel = (() => {
    switch (order.paymentMethod) {
      case 'knet': return { en: 'KNET', ar: 'كي نت' };
      case 'visa': return { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' };
      case 'apple-pay': return { en: 'Apple Pay', ar: 'آبل باي' };
      case 'cod': return { en: 'Cash on delivery', ar: 'الدفع عند الاستلام' };
    }
  })();

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <Link
          href="/orders"
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </Link>
        <h1 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Order Details', ar: 'تفاصيل الطلب' })}
        </h1>
        <a
          href="#"
          className="ms-auto text-[12px] font-semibold text-hero"
        >
          {t({ en: 'Customer service', ar: 'خدمة العملاء' })}
        </a>
      </div>

      {showSuccess && (
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <Check className="size-5 shrink-0 text-emerald-600" strokeWidth={2.5} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-emerald-700 dark:text-emerald-300">
              {t({ en: 'Order placed!', ar: 'تم تأكيد الطلب!' })}
            </p>
            <p className="text-[12px] text-emerald-600 dark:text-emerald-400">
              {t({
                en: "We'll send updates as your order moves.",
                ar: 'سنرسل لك تحديثات بحالة الطلب.',
              })}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-lg px-4 pb-12 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
            {t({ en: `Order ${orderShortId}`, ar: `طلب ${orderShortId}` })}
          </p>
          {isPast && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              {t({ en: 'Return period ended', ar: 'انتهت فترة الإرجاع' })}
            </span>
          )}
        </div>

        <Accordion multiple className="space-y-3">
          <AccordionItem value="summary" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              <span>
                {t({ en: 'Summary', ar: 'الملخص' })}
                <span className="ms-1.5 font-normal text-muted-foreground">{order.items.length}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ul className="space-y-3">
                {order.items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  const hasPhoto = /^https?:\/\//.test(product.images[0] ?? '');
                  return (
                    <li key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-blush/40">
                        {hasPhoto && (
                          <Image src={product.images[0]} alt={t(product.name)} fill sizes="56px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink dark:text-foreground">
                          {t(product.name)}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {item.size} · {t({ en: `Qty ${item.quantity}`, ar: `الكمية ${item.quantity}` })}
                        </p>
                        {isPast && returns.length === 0 && (
                          <Link
                            href={`/product/${product.id}/reviews/write?orderId=${order.id}`}
                            className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-hero"
                          >
                            <Sparkle className="size-3" fill="currentColor" />
                            {t({ en: 'Rate & Review', ar: 'قيّمي' })}
                          </Link>
                        )}
                      </div>
                      <p className="shrink-0 text-[13px] font-bold text-ink dark:text-foreground">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-1.5 border-t border-blush/40 pt-3 text-[13px] dark:border-border/40">
                <Row label={{ en: 'Subtotal', ar: 'المجموع الفرعي' }} value={formatPrice(subtotal)} muted />
                <Row label={{ en: 'Delivery', ar: 'التوصيل' }} value={formatPrice(order.total - subtotal)} muted />
                <Row label={{ en: 'Total', ar: 'الإجمالي' }} value={formatPrice(order.total)} bold />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tracking" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Order tracking', ar: 'تتبع الطلب' })}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <TrackingSteps order={order} />
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-hero"
              >
                {t({ en: 'Go to courier website', ar: 'الذهاب لموقع شركة الشحن' })}
                <ExternalLink className="size-3" strokeWidth={2.25} />
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Shipping address', ar: 'عنوان الشحن' })}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-[13px] text-ink dark:text-foreground">
              <p className="font-semibold">{order.deliveryAddress.fullName}</p>
              <p className="mt-1 text-muted-foreground">
                {t(order.deliveryAddress.area)}, {t({ en: 'Block', ar: 'قطعة' })} {order.deliveryAddress.block},{' '}
                {t({ en: 'Street', ar: 'شارع' })} {order.deliveryAddress.street},{' '}
                {t({ en: 'Building', ar: 'مبنى' })} {order.deliveryAddress.building}
              </p>
              <p className="text-muted-foreground">{order.deliveryAddress.phone}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Payment method', ar: 'طريقة الدفع' })}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-[13px] text-ink dark:text-foreground">
              <p>{paymentLabel && t(paymentLabel)}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {!isPast && returns.length === 0 && (
          <Link
            href={`/orders/${order.id}/return`}
            className="mt-6 flex items-center justify-center gap-2 rounded-full border border-soft/40 bg-white py-3 text-[14px] font-semibold text-ink dark:border-border dark:bg-card dark:text-foreground"
          >
            {t({ en: 'Place a return', ar: 'تقديم طلب إرجاع' })}
          </Link>
        )}

        {returns.length > 0 && (
          <div className="mt-6 rounded-2xl bg-cream p-4 dark:bg-secondary">
            <p className="text-[12px] font-bold uppercase tracking-wide text-plum dark:text-foreground">
              {t({ en: 'Already in return', ar: 'في الإرجاع حالياً' })}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {t({
                en: `${returns.length} return request${returns.length > 1 ? 's' : ''} on this order.`,
                ar: `${returns.length} طلب إرجاع على هذا الطلب.`,
              })}
            </p>
          </div>
        )}

        <a
          href="#"
          className="mt-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-muted-foreground"
        >
          <MessageCircle className="size-4" />
          {t({ en: 'Contact customer service', ar: 'تواصلي مع خدمة العملاء' })}
        </a>
      </div>
    </PageShell>
  );
}

function Row({ label, value, muted, bold }: { label: { en: string; ar: string }; value: string; muted?: boolean; bold?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between">
      <span className={cn(muted && !bold && 'text-muted-foreground', bold && 'font-bold text-ink dark:text-foreground')}>
        {t(label)}
      </span>
      <span className={cn(bold ? 'font-bold text-ink dark:text-foreground' : 'text-ink dark:text-foreground')}>
        {value}
      </span>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <OrderDetailContent id={id} />
    </Suspense>
  );
}
