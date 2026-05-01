'use client';

import { Minus, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PriceTag from '@/components/shared/PriceTag';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export default function CartItem({ item, className }: CartItemProps) {
  const { t } = useLanguage();
  const { updateQuantity, removeItem } = useCart();

  const product = products.find((p) => p.id === item.productId);
  if (!product) return null;

  const handleIncrease = () => {
    if (item.quantity < 10) {
      updateQuantity(item.productId, item.size, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.size, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size);
  };

  return (
    <div className={cn('flex items-start gap-3 py-3', className)}>
      {/* Product image placeholder */}
      <div className="size-12 shrink-0 rounded-lg bg-soft/40" />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink dark:text-foreground leading-tight line-clamp-2">
          {t(product.name)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.size}
          </Badge>
        </div>
        <div className="mt-1">
          <PriceTag amount={product.price * item.quantity} className="text-sm" />
        </div>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-full"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium text-ink dark:text-foreground">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-full"
          onClick={handleIncrease}
          disabled={item.quantity >= 10}
        >
          <Plus className="size-3" />
        </Button>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove item"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
