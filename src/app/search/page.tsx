'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ShoppingBag, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { categories } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import StoreCard from '@/components/store/StoreCard';
import PageShell from '@/components/layout/PageShell';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.en.toLowerCase().includes(q) ||
          p.name.ar.includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    return result;
  }, [query, selectedCategories, minPrice, maxPrice, minRating]);

  const filteredStores = useMemo(() => {
    if (!query.trim()) return stores;
    const q = query.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.ar.includes(q)
    );
  }, [query]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasProducts = filteredProducts.length > 0;
  const hasStores = filteredStores.length > 0;

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="size-16 text-soft/60" />
      <p className="mt-4 text-lg font-semibold text-ink">
        {t({ en: 'No results found', ar: 'ما لقينا نتائج' })}
      </p>
      <p className="mt-1 text-sm text-ink/60">
        {t({ en: 'Try different keywords', ar: 'جربي كلمات ثانية' })}
      </p>
    </div>
  );

  return (
    <PageShell className="bg-cream">
      <div className="px-4 pt-4">
        {/* Search input */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 size-5 -translate-y-1/2 text-soft" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({
                en: 'Search products or stores',
                ar: 'ابحثي عن منتج أو متجر',
              })}
              className="w-full rounded-full border border-soft bg-white py-3 pe-4 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-soft focus:border-hero/40"
            />
          </div>

          {/* Filter button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-soft bg-white transition-colors hover:bg-blush/30"
                />
              }
            >
              <SlidersHorizontal className="size-5 text-ink" />
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl p-0">
              <SheetHeader className="border-b border-soft/30 px-4 pb-3 pt-4">
                <SheetTitle>
                  {t({ en: 'Filters', ar: 'فلاتر' })}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6 p-4">
                {/* Category filter */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">
                    {t({ en: 'Category', ar: 'الفئة' })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => {
                        const isActive = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-hero text-white'
                                : 'border border-soft bg-white text-ink hover:bg-blush/30'
                            )}
                          >
                            {t(cat.name)}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">
                    {t({ en: 'Price range', ar: 'نطاق السعر' })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={t({ en: 'Min', ar: 'أقل' })}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-ink/50">-</span>
                    <Input
                      type="number"
                      placeholder={t({ en: 'Max', ar: 'أعلى' })}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Rating minimum */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">
                    {t({ en: 'Minimum rating', ar: 'أقل تقييم' })}
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setMinRating((prev) => (prev === star ? 0 : star))
                        }
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={cn(
                            star <= minRating
                              ? 'fill-hero text-hero'
                              : 'fill-soft/40 text-soft'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply */}
                <Button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-hero text-white hover:bg-hero/90"
                >
                  {t({ en: 'Apply filters', ar: 'تطبيق الفلاتر' })}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="products">
              {t({ en: 'Products', ar: 'منتجات' })}
            </TabsTrigger>
            <TabsTrigger value="stores">
              {t({ en: 'Stores', ar: 'متاجر' })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4">
            {hasProducts ? (
              <div className="grid grid-cols-2 gap-3 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              emptyState
            )}
          </TabsContent>

          <TabsContent value="stores" className="mt-4">
            {hasStores ? (
              <div className="space-y-3 pb-4">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              emptyState
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
