'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { formatPrice } from '@/lib/format';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DeliveryAddress } from '@/types';

interface ConfirmStepProps {
  address: DeliveryAddress | null;
  paymentMethod: string;
  onConfirm: () => void;
  className?: string;
}

const paymentLabels: Record<string, { en: string; ar: string }> = {
  knet: { en: 'KNET', ar: 'كي نت' },
  'apple-pay': { en: 'Apple Pay', ar: 'Apple Pay' },
  visa: { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' },
  cod: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
};

export default function ConfirmStep({
  address,
  paymentMethod,
  onConfirm,
  className,
}: ConfirmStepProps) {
  const { language, t } = useLanguage();
  const { getStoreGroups, getSubtotal, getTotal } = useCart();

  const storeGroups = getStoreGroups();
  const subtotal = getSubtotal();
  const total = getTotal();
  const storeCount = storeGroups.length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Order items by store */}
      {storeGroups.map((group) => {
        const store = stores.find((s) => s.id === group.storeId);
        return (
          <div key={group.storeId} className="rounded-xl bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink text-sm">
                {store ? t(store.name) : group.storeId}
              </h3>
              <span className="text-xs text-muted-foreground">
                {language === 'ar' ? '2-3 أيام عمل' : '2-3 business days'}
              </span>
            </div>
            {group.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-3"
                >
                  <div className="size-10 shrink-0 rounded-lg bg-soft/40" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink line-clamp-1">{t(product.name)}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {item.size}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-ink shrink-0">
                    {formatPrice(product.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Delivery address */}
      {address && (
        <div className="rounded-xl bg-white p-4 space-y-2">
          <h3 className="font-semibold text-ink text-sm">
            {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
          </h3>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="text-ink font-medium">{address.fullName}</p>
            <p>{address.phone}</p>
            <p>
              {language === 'ar' ? address.area.ar : address.area.en}
              {' — '}
              {language === 'ar' ? 'ق' : 'Block'} {address.block},{' '}
              {language === 'ar' ? 'ش' : 'St'} {address.street},{' '}
              {language === 'ar' ? 'م' : 'Bldg'} {address.building}
            </p>
            {address.floor && (
              <p>
                {language === 'ar' ? 'الدور' : 'Floor'}: {address.floor}
                {address.apartment &&
                  `, ${language === 'ar' ? 'شقة' : 'Apt'} ${address.apartment}`}
              </p>
            )}
            {address.notes && <p className="italic">{address.notes}</p>}
          </div>
        </div>
      )}

      {/* Payment method */}
      <div className="rounded-xl bg-white p-4 space-y-2">
        <h3 className="font-semibold text-ink text-sm">
          {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {paymentLabels[paymentMethod]
            ? t(paymentLabels[paymentMethod])
            : paymentMethod}
        </p>
      </div>

      {/* Total */}
      <div className="rounded-xl bg-white p-4 space-y-2">
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
        <div className="flex items-center justify-between font-bold text-ink text-lg">
          <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Confirm button */}
      <Button
        className="w-full bg-hero hover:bg-hero/90 text-white h-14 text-base font-bold rounded-xl"
        onClick={onConfirm}
      >
        {language === 'ar' ? 'تأكيدي طلبج' : 'Confirm order'}
      </Button>
    </div>
  );
}
