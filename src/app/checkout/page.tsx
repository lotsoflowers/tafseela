'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Store, Check, ChevronDown } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import CountryPicker from '@/components/shared/CountryPicker';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAddresses } from '@/contexts/AddressesContext';
import { useOrders } from '@/contexts/OrdersContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { countries, defaultCountry } from '@/data/countries';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

type DeliveryMethod = 'postal' | 'pickup';
type PaymentMethod = Order['paymentMethod'];

const PAYMENT_METHODS: { id: PaymentMethod; label: { en: string; ar: string } }[] = [
  { id: 'knet', label: { en: 'KNET', ar: 'كي نت' } },
  { id: 'visa', label: { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' } },
  { id: 'apple-pay', label: { en: 'Apple Pay', ar: 'آبل باي' } },
  { id: 'cod', label: { en: 'Cash on delivery', ar: 'الدفع عند الاستلام' } },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { addresses, selected, addAddress, selectAddress } = useAddresses();
  const { placeOrder } = useOrders();

  const [delivery, setDelivery] = useState<DeliveryMethod>('postal');
  const [payment, setPayment] = useState<PaymentMethod>('knet');
  const [countryCode, setCountryCode] = useState<string>(defaultCountry.code);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    area: '',
    block: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !submitting) router.replace('/cart');
  }, [items.length, router, submitting]);

  useEffect(() => {
    if (selected) {
      setForm({
        fullName: selected.fullName,
        phone: selected.phone,
        area: typeof selected.area === 'string' ? selected.area : selected.area.en,
        block: selected.block,
        street: selected.street,
        building: selected.building,
        floor: selected.floor ?? '',
        apartment: selected.apartment ?? '',
      });
      setCountryCode(selected.countryCode || defaultCountry.code);
    }
  }, [selected]);

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const country = countries.find(c => c.code === countryCode) ?? defaultCountry;
  const formValid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.area.trim() &&
    form.block.trim() &&
    form.street.trim() &&
    form.building.trim();
  const canProceed = delivery === 'pickup' ? true : !!formValid;

  const handleProceed = () => {
    if (!canProceed) return;
    setSubmitting(true);

    let savedAddressId = selected?.id;
    if (delivery === 'postal') {
      if (!selected) {
        const newAddr = addAddress({
          fullName: form.fullName,
          phone: form.phone,
          area: { en: form.area, ar: form.area },
          block: form.block,
          street: form.street,
          building: form.building,
          floor: form.floor || undefined,
          apartment: form.apartment || undefined,
          countryCode,
        });
        savedAddressId = newAddr.id;
        selectAddress(newAddr.id);
      }
    }

    const order = placeOrder({
      items,
      total,
      deliveryAddress: {
        fullName: form.fullName || (delivery === 'pickup' ? 'Pickup' : ''),
        phone: form.phone,
        area: { en: form.area || 'Pickup Point', ar: form.area || 'نقطة الاستلام' },
        block: form.block,
        street: form.street,
        building: form.building,
        floor: form.floor || undefined,
        apartment: form.apartment || undefined,
      },
      paymentMethod: payment,
    });

    clearCart();
    router.push(`/orders/${order.id}?placed=1`);
  };

  return (
    <PageShell showTopBar={false} showBottomNav={false}>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-blush/40 bg-background/95 px-3 py-3 backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
          className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-cream dark:text-foreground dark:hover:bg-secondary"
        >
          <Back className="size-5" />
        </button>
        <h1 className="text-[15px] font-bold text-ink dark:text-foreground">
          {t({ en: 'Checkout', ar: 'إتمام الطلب' })}
        </h1>
      </div>

      <div className="mx-auto max-w-lg px-4 pb-32 pt-2">
        <Accordion multiple className="space-y-3">
          {/* SUMMARY */}
          <AccordionItem value="summary" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              <span>
                {t({ en: 'Summary', ar: 'الملخص' })}
                <span className="ms-1.5 font-normal text-muted-foreground">{items.length}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ul className="space-y-3">
                {items.map(item => {
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
                      </div>
                      <p className="shrink-0 text-[13px] font-bold text-ink dark:text-foreground">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* DELIVERY METHOD */}
          <AccordionItem value="delivery" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Delivery method', ar: 'طريقة التوصيل' })}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2">
                <RadioCard
                  active={delivery === 'postal'}
                  onClick={() => setDelivery('postal')}
                  icon={MapPin}
                  title={{ en: 'Postal address', ar: 'العنوان البريدي' }}
                  hint={{ en: 'Delivered to your door', ar: 'يصل إلى باب بيتك' }}
                />
                <RadioCard
                  active={delivery === 'pickup'}
                  onClick={() => setDelivery('pickup')}
                  icon={Store}
                  title={{ en: 'Pickup point', ar: 'نقطة استلام' }}
                  hint={{ en: 'Pick up from a nearby location', ar: 'استلمي من نقطة قريبة' }}
                />
              </div>

              {delivery === 'postal' && (
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker(true)}
                    className="flex w-full items-center justify-between rounded-2xl border border-soft/40 bg-white px-3 py-2.5 text-start text-[14px] dark:border-border dark:bg-card"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl leading-none">{country.flag}</span>
                      <span className="text-ink dark:text-foreground">{t(country.name)}</span>
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </button>

                  <Field
                    label={{ en: 'Full name', ar: 'الاسم الكامل' }}
                    value={form.fullName}
                    onChange={v => setForm(f => ({ ...f, fullName: v }))}
                    required
                  />
                  <Field
                    label={{ en: 'Phone', ar: 'رقم الجوال' }}
                    value={form.phone}
                    onChange={v => setForm(f => ({ ...f, phone: v }))}
                    placeholder={`${country.dialCode} ...`}
                    type="tel"
                    required
                  />
                  <Field
                    label={{ en: 'Area', ar: 'المنطقة' }}
                    value={form.area}
                    onChange={v => setForm(f => ({ ...f, area: v }))}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label={{ en: 'Block', ar: 'القطعة' }}
                      value={form.block}
                      onChange={v => setForm(f => ({ ...f, block: v }))}
                      required
                    />
                    <Field
                      label={{ en: 'Street', ar: 'الشارع' }}
                      value={form.street}
                      onChange={v => setForm(f => ({ ...f, street: v }))}
                      required
                    />
                  </div>
                  <Field
                    label={{ en: 'Building', ar: 'المبنى' }}
                    value={form.building}
                    onChange={v => setForm(f => ({ ...f, building: v }))}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label={{ en: 'Floor', ar: 'الدور' }}
                      value={form.floor}
                      onChange={v => setForm(f => ({ ...f, floor: v }))}
                    />
                    <Field
                      label={{ en: 'Apartment', ar: 'الشقة' }}
                      value={form.apartment}
                      onChange={v => setForm(f => ({ ...f, apartment: v }))}
                    />
                  </div>
                </div>
              )}

              {delivery === 'pickup' && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-soft/40 dark:border-border">
                  <div className="relative aspect-[4/3] w-full bg-cream dark:bg-secondary">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto size-8 text-soft" strokeWidth={1.5} />
                        <p className="mt-2 text-[13px] font-semibold text-muted-foreground">
                          {t({ en: 'Map preview', ar: 'معاينة الخريطة' })}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {t({ en: '(Map integration coming soon)', ar: '(تكامل الخريطة قريباً)' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[13px] font-bold uppercase tracking-wide text-ink dark:text-foreground">
                      {t({ en: 'Heverlee Ambassade', ar: 'نقطة الاستلام' })}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {t({
                        en: 'Naamsesteenweg 378C, 3001 Leuven',
                        ar: 'شارع 378، الكويت',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* PAYMENT METHOD */}
          <AccordionItem value="payment" className="overflow-hidden rounded-3xl bg-white dark:bg-card">
            <AccordionTrigger className="px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Payment method', ar: 'طريقة الدفع' })}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2">
                {PAYMENT_METHODS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-start text-[14px] transition-colors',
                      payment === p.id
                        ? 'border-hero bg-cream font-bold text-plum dark:bg-secondary dark:text-foreground'
                        : 'border-soft/40 bg-white text-ink dark:border-border dark:bg-card dark:text-foreground'
                    )}
                  >
                    <span>{t(p.label)}</span>
                    {payment === p.id && <Check className="size-5 text-hero" />}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* TOTALS */}
          <div className="rounded-3xl bg-white p-4 dark:bg-card">
            <Row label={{ en: 'Subtotal', ar: 'المجموع الفرعي' }} value={formatPrice(total)} />
          </div>
        </Accordion>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blush/40 bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-md dark:border-border/40">
        <button
          type="button"
          disabled={!canProceed || submitting}
          onClick={handleProceed}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-colors',
            canProceed
              ? 'bg-plum text-white hover:bg-plum/90'
              : 'bg-ink/30 text-white/80 dark:bg-foreground/20'
          )}
        >
          {t({
            en: `Proceed to payment · ${formatPrice(total)}`,
            ar: `المتابعة للدفع · ${formatPrice(total)}`,
          })}
        </button>
      </div>

      {showCountryPicker && (
        <CountryPicker
          value={countryCode}
          onSelect={c => {
            setCountryCode(c.code);
            setShowCountryPicker(false);
          }}
          onClose={() => setShowCountryPicker(false)}
        />
      )}
    </PageShell>
  );
}

function RadioCard({
  active,
  onClick,
  icon: Icon,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: { en: string; ar: string };
  hint: { en: string; ar: string };
}) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors',
        active
          ? 'border-hero bg-cream dark:bg-secondary'
          : 'border-soft/40 bg-white dark:border-border dark:bg-card'
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          active ? 'bg-hero text-white' : 'bg-cream text-plum dark:bg-secondary dark:text-foreground'
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink dark:text-foreground">{t(title)}</p>
        <p className="text-[12px] text-muted-foreground">{t(hint)}</p>
      </div>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border',
          active ? 'border-hero bg-hero' : 'border-soft/60 dark:border-border'
        )}
      >
        {active && <Check className="size-3 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: { en: string; ar: string };
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-ink dark:text-foreground">
        {t(label)}{required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-soft/40 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-hero/60 dark:border-border dark:bg-card dark:text-foreground"
      />
    </label>
  );
}

function Row({ label, value }: { label: { en: string; ar: string }; value: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="text-muted-foreground">{t(label)}</span>
      <span className="font-bold text-ink dark:text-foreground">{value}</span>
    </div>
  );
}
