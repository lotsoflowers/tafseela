'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/contexts/OrdersContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { cn, isLoadableImage } from '@/lib/utils';
import type { ReturnReason, BilingualText, ProductSize } from '@/types';

type Step = 1 | 2 | 3;

const REASONS: { id: ReturnReason; label: BilingualText }[] = [
  { id: 'not-as-described', label: { en: 'Not as described', ar: 'مختلف عن الوصف' } },
  { id: 'wrong-size', label: { en: 'Wrong size', ar: 'مقاس خاطئ' } },
  { id: 'damaged', label: { en: 'Damaged', ar: 'تالف' } },
  { id: 'late', label: { en: 'Arrived too late', ar: 'وصل متأخراً' } },
  { id: 'changed-mind', label: { en: 'Changed my mind', ar: 'غيّرت رأيي' } },
  { id: 'other', label: { en: 'Other', ar: 'سبب آخر' } },
];

export default function PlaceReturnPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { getOrder, getReturnsForOrder, placeReturn } = useOrders();

  const order = getOrder(id);
  if (!order) notFound();

  const existing = getReturnsForOrder(order.id);
  const alreadyReturnedKeys = new Set(
    existing.flatMap(r => r.items.map(i => `${i.productId}-${i.size}`))
  );

  const returnable = order.items.filter(
    item => !alreadyReturnedKeys.has(`${item.productId}-${item.size}`)
  );

  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reasons, setReasons] = useState<Record<string, ReturnReason>>({});
  const [reasonText, setReasonText] = useState<Record<string, string>>({});

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const total = returnable.length;
  const selectedCount = selected.size;
  const orderShortId = order.id.slice(-6).toUpperCase();

  const toggleSelect = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const setReason = (key: string, reason: ReturnReason) =>
    setReasons(prev => ({ ...prev, [key]: reason }));

  const allReasonsSet = Array.from(selected).every(k => reasons[k]);

  const handleSubmit = () => {
    const items = Array.from(selected).map(key => {
      const [productId, sizeStr] = key.split('|');
      const item = order.items.find(i => i.productId === productId && i.size === sizeStr);
      return {
        productId,
        size: (item?.size ?? sizeStr) as ProductSize,
        quantity: item?.quantity ?? 1,
        reason: reasons[key],
        reasonText: reasonText[key]?.trim() || undefined,
      };
    });
    if (items.length === 0) return;
    placeReturn(order.id, items as Parameters<typeof placeReturn>[1]);
    setStep(3);
  };

  const handleClose = () => router.push(`/orders/${order.id}`);

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          onClick={() => (step > 1 && step < 3 ? setStep((s => (s - 1) as Step)(step)) : handleClose())}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </button>
        <h1 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Place return', ar: 'تقديم إرجاع' })}
        </h1>
      </div>

      <div className="mx-auto max-w-lg px-4 pb-32 pt-4">
        {step === 1 && (
          <>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t({ en: `Step 1 / 3`, ar: 'الخطوة 1 / 3' })}
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-ink dark:text-foreground">
              {t({ en: 'Select items you want to return', ar: 'اختاري القطع التي تريدين إرجاعها' })}
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {t({
                en: `${selectedCount} / ${total} items selected`,
                ar: `${selectedCount} / ${total} قطعة محددة`,
              })}
            </p>

            <div className="mt-4 overflow-hidden rounded-3xl bg-white dark:bg-card">
              {returnable.map((item, i) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                const key = `${item.productId}|${item.size}`;
                const checked = selected.has(key);
                const hasPhoto = isLoadableImage(product.images[0]);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleSelect(key)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-start',
                      i > 0 && 'border-t border-blush/60 dark:border-border/60'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border',
                        checked ? 'border-hero bg-hero' : 'border-soft/60 dark:border-border'
                      )}
                    >
                      {checked && <Check className="size-3 text-white" strokeWidth={3} />}
                    </span>
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
                    </div>
                    <p className="shrink-0 text-[13px] font-bold text-ink dark:text-foreground">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </button>
                );
              })}
            </div>

            {existing.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {t({ en: 'Already in return', ar: 'في الإرجاع' })}
                </h3>
                <div className="overflow-hidden rounded-3xl bg-cream dark:bg-secondary">
                  {existing.flatMap(r => r.items).map((item, i) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={`${item.productId}-${item.size}-${i}`}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 opacity-70',
                          i > 0 && 'border-t border-blush/40 dark:border-border/40'
                        )}
                      >
                        <span className="text-[13px] line-through text-ink dark:text-foreground">
                          {t(product.name)}
                        </span>
                        <span className="ms-auto text-[12px] text-muted-foreground">
                          {item.size}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t({ en: 'Step 2 / 3', ar: 'الخطوة 2 / 3' })}
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-ink dark:text-foreground">
              {t({ en: 'Describe reason for your return', ar: 'صفّي سبب الإرجاع' })}
            </h2>

            <div className="mt-4 space-y-3">
              {Array.from(selected).map(key => {
                const [productId, size] = key.split('|');
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                const hasPhoto = isLoadableImage(product.images[0]);
                return (
                  <div key={key} className="overflow-hidden rounded-3xl bg-white p-4 dark:bg-card">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-blush/40">
                        {hasPhoto && (
                          <Image src={product.images[0]} alt={t(product.name)} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink dark:text-foreground">
                          {t(product.name)}
                        </p>
                        <p className="text-[12px] text-muted-foreground">{size}</p>
                      </div>
                      <p className="shrink-0 text-[13px] font-bold text-ink dark:text-foreground">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <label className="mt-3 block">
                      <span className="mb-1 block text-[12px] font-semibold text-ink dark:text-foreground">
                        {t({ en: 'Reason', ar: 'السبب' })}
                      </span>
                      <select
                        value={reasons[key] ?? ''}
                        onChange={e => setReason(key, e.target.value as ReturnReason)}
                        className="w-full appearance-none rounded-2xl border border-soft/40 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
                      >
                        <option value="" disabled>
                          {t({ en: 'Select a reason', ar: 'اختاري السبب' })}
                        </option>
                        {REASONS.map(r => (
                          <option key={r.id} value={r.id}>{t(r.label)}</option>
                        ))}
                      </select>
                    </label>

                    {reasons[key] === 'other' && (
                      <label className="mt-2 block">
                        <textarea
                          value={reasonText[key] ?? ''}
                          onChange={e => setReasonText(prev => ({ ...prev, [key]: e.target.value.slice(0, 300) }))}
                          rows={3}
                          placeholder={t({ en: 'Tell us more...', ar: 'أخبرينا المزيد...' })}
                          maxLength={300}
                          className="w-full rounded-2xl border border-soft/40 bg-white px-3 py-2.5 text-[13px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
                        />
                        <span className="mt-0.5 block text-end text-[11px] text-muted-foreground">
                          {(reasonText[key] ?? '').length} / 300
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-5 flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
              <Check className="size-9 text-emerald-600" strokeWidth={2.25} />
            </span>
            <h2 className="text-[22px] font-bold text-ink dark:text-foreground">
              {t({ en: 'Return submitted', ar: 'تم تقديم طلب الإرجاع' })}
            </h2>
            <p className="mt-2 max-w-xs text-[14px] text-muted-foreground">
              {t({
                en: `We'll send pickup instructions for order ${orderShortId} shortly.`,
                ar: `سنرسل تعليمات الاستلام لطلب ${orderShortId} قريباً.`,
              })}
            </p>
            <Link
              href={`/orders/${order.id}`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-plum px-8 py-3 text-[15px] font-bold text-white"
            >
              {t({ en: 'Back to order', ar: 'العودة للطلب' })}
            </Link>
          </div>
        )}
      </div>

      {step !== 3 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blush/40 bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-md dark:border-border/40">
          <button
            type="button"
            disabled={
              (step === 1 && selectedCount === 0) ||
              (step === 2 && !allReasonsSet)
            }
            onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-colors',
              (step === 1 && selectedCount === 0) || (step === 2 && !allReasonsSet)
                ? 'bg-ink/30 text-white/80 dark:bg-foreground/20'
                : 'bg-plum text-white hover:bg-plum/90'
            )}
          >
            {step === 1
              ? t({ en: 'Continue', ar: 'متابعة' })
              : t({ en: 'Submit return', ar: 'تقديم الإرجاع' })}
          </button>
        </div>
      )}
    </PageShell>
  );
}
