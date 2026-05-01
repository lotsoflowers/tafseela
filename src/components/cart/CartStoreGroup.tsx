'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '@/types';

interface CartStoreGroupProps {
  storeId: string;
  items: CartItemType[];
  className?: string;
}

export default function CartStoreGroup({ storeId, items, className }: CartStoreGroupProps) {
  const { language, t } = useLanguage();

  const store = stores.find((s) => s.id === storeId);
  const storeName = store ? t(store.name) : storeId;

  const storeSubtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const deliveryLabel =
    language === 'ar'
      ? `توصيل من ${storeName}`
      : `Delivery from ${storeName}`;

  return (
    <div className={cn('rounded-xl bg-white dark:bg-card p-4', className)}>
      {/* Store header */}
      <h3 className="font-semibold text-ink dark:text-foreground text-sm mb-1">{storeName}</h3>

      {/* Items */}
      <div className="divide-y divide-blush/50">
        {items.map((item) => (
          <CartItem key={`${item.productId}-${item.size}`} item={item} />
        ))}
      </div>

      {/* Delivery + subtotal */}
      <div className="mt-3 pt-3 border-t border-blush/50 space-y-1 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{deliveryLabel}</span>
          <span>{formatPrice(1.5)}</span>
        </div>
        <div className="flex items-center justify-between font-medium text-ink dark:text-foreground">
          <span>{language === 'ar' ? 'المجموع' : 'Subtotal'}</span>
          <span>{formatPrice(storeSubtotal + 1.5)}</span>
        </div>
      </div>
    </div>
  );
}
