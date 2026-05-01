'use client';

import { useState, useRef } from 'react';
import { Sparkles, Store as StoreIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SearchBar from '@/components/shared/SearchBar';
import CategoryFilter from '@/components/shared/CategoryFilter';
import ProductCard from '@/components/product/ProductCard';
import StoreCard from '@/components/store/StoreCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  const featuredProducts = products.filter((p) => p.isFeatured);

  const scrollFeatured = (dir: 'left' | 'right') => {
    if (!featuredScrollRef.current) return;
    const amount = dir === 'left' ? -200 : 200;
    featuredScrollRef.current.scrollBy({ left: direction === 'rtl' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <PageShell className="bg-cream">
      <div className="animate-fade-in space-y-5 pb-4">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-plum via-hero to-plum px-5 py-8">
          <div className="pattern-dots absolute inset-0" />
          <div className="pattern-diagonal absolute inset-0" />

          {/* Floating decorative elements */}
          <span className="absolute top-3 end-6 text-white/10 text-3xl animate-float" style={{ animationDelay: '0s' }}>{'✦'}</span>
          <span className="absolute bottom-4 start-8 text-white/10 text-2xl animate-float" style={{ animationDelay: '1s' }}>{'♡'}</span>
          <span className="absolute top-1/2 end-16 text-white/[0.07] text-xl animate-float" style={{ animationDelay: '0.5s' }}>{'◇'}</span>

          <div className="relative z-10 text-center space-y-2">
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              {t({
                en: 'Discover the Latest Fashion',
                ar: 'اكتشفي أحدث الموضة',
              })}
            </h1>
            <p className="text-sm text-white/70">
              {t({
                en: 'Curated collections from Kuwait\'s best boutiques',
                ar: 'مجموعات منتقاة من أفضل بوتيكات الكويت',
              })}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4">
          <SearchBar />
        </div>

        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-4">
              <h2 className="flex items-center gap-1.5 text-base font-bold text-ink">
                <Sparkles className="size-4 text-hero" />
                {t({ en: 'Featured', ar: 'مميز' })}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollFeatured('left')}
                  className="rounded-full p-1 text-ink/40 hover:text-ink hover:bg-blush transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeatured('right')}
                  className="rounded-full p-1 text-ink/40 hover:text-ink hover:bg-blush transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div
              ref={featuredScrollRef}
              className="flex gap-3 overflow-x-auto hide-scrollbar px-4 snap-x snap-mandatory"
            >
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-40 shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category filter */}
        <div className="px-4">
          <CategoryFilter
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Custom Tabs */}
        <div className="px-4 space-y-4">
          {/* Tab buttons */}
          <div className="flex gap-1 rounded-2xl bg-blush/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300',
                activeTab === 'products'
                  ? 'bg-white text-hero shadow-md'
                  : 'text-ink/50 hover:text-ink/70'
              )}
            >
              <Sparkles className="size-4" />
              {t({ en: 'Products', ar: 'منتجات' })}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stores')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300',
                activeTab === 'stores'
                  ? 'bg-white text-hero shadow-md'
                  : 'text-ink/50 hover:text-ink/70'
              )}
            >
              <StoreIcon className="size-4" />
              {t({ en: 'Stores', ar: 'متاجر' })}
            </button>
          </div>

          {/* Products tab content */}
          {activeTab === 'products' && (
            <div className="stagger-grid grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-ink/40">
                  {t({ en: 'No products found', ar: 'لا توجد منتجات' })}
                </div>
              )}
            </div>
          )}

          {/* Stores tab content */}
          {activeTab === 'stores' && (
            <div className="stagger-grid space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="animate-fade-in-up">
                  <StoreCard store={store} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
