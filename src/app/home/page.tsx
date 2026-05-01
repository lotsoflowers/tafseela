'use client';

import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import SearchBar from '@/components/shared/SearchBar';
import CategoryFilter from '@/components/shared/CategoryFilter';
import ProductCard from '@/components/product/ProductCard';
import StoreCard from '@/components/store/StoreCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { categories } from '@/data/categories';

export default function HomePage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  return (
    <PageShell className="bg-cream">
      <div className="animate-fade-in space-y-4 p-4">
        {/* Search */}
        <SearchBar />

        {/* Category filter */}
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="w-full">
            <TabsTrigger value="products" className="flex-1">
              {t({ en: 'Products', ar: 'منتجات' })}
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex-1">
              {t({ en: 'Stores', ar: 'متاجر' })}
            </TabsTrigger>
          </TabsList>

          {/* Products tab */}
          <TabsContent value="products">
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          {/* Stores tab */}
          <TabsContent value="stores">
            <div className="mt-4 space-y-4">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
