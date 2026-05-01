'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/products';
import PageShell from '@/components/layout/PageShell';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WishlistPage() {
  const { t } = useLanguage();
  const { items } = useWishlist();

  const wishlisted = products.filter((p) => items.includes(p.id));

  return (
    <PageShell>
      <div className="min-h-screen bg-cream dark:bg-background px-4 pt-2 pb-6 animate-fade-in">
        {/* Title sits in the TopBar — no duplicate H1 here */}
        {wishlisted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blush dark:bg-secondary flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-soft" />
            </div>
            <p className="text-ink dark:text-foreground font-medium text-lg mb-2">
              {t({ en: 'No wishlist items yet', ar: 'ما عندج مفضلة بعد' })}
            </p>
            <p className="text-ink/50 text-sm mb-6">
              {t({ en: 'Browse products and tap the heart to save them', ar: 'تصفحي المنتجات واضغطي على القلب لحفظها' })}
            </p>
            <Link href="/home">
              <Button className="bg-hero hover:bg-hero/90 text-white rounded-full px-8">
                {t({ en: 'Browse products', ar: 'تصفحي المنتجات' })}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {wishlisted.map((product) => (
              <div key={product.id} className="space-y-2">
                <ProductCard product={product} />
                {product.isOutOfStock && (
                  <Badge variant="secondary" className="bg-blush dark:bg-secondary text-plum dark:text-soft text-xs w-full justify-center">
                    {t({ en: "You'll be notified", ar: 'سيوصلج إشعار' })}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
