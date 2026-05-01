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
  const { language, t, direction } = useLanguage();
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
        {/* Hero — editorial, not poster. Soft blush-to-cream gradient, oversized display type, single hero accent line. */}
        <div className="relative overflow-hidden bg-gradient-to-b from-blush/50 via-cream to-cream px-5 pt-7 pb-6">
          {/* Subtle floating mark, off to one side */}
          <span
            className="absolute top-4 end-5 text-hero/15 text-5xl select-none animate-float"
            aria-hidden
          >
            {'✦'}
          </span>

          <div className="relative z-10 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-hero">
              {t({ en: 'Tafseela', ar: 'تفصيلة' })}
            </p>
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-plum">
              {language === 'ar' ? (
                <>اكتشفي أحدث<br />الموضة</>
              ) : (
                <>Discover the<br />latest fashion</>
              )}
            </h1>
            <p className="max-w-[28ch] text-sm leading-relaxed text-ink/60">
              {t({
                en: 'Curated collections from Kuwait’s best boutiques',
                ar: 'مجموعات منتقاة من أفضل بوتيكات الكويت',
              })}
            </p>
            {/* Brand accent line */}
            <div className="mt-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-hero to-soft" />
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

        {/* Tabs — minimal underline style */}
        <div className="px-4 space-y-4">
          <div className="flex items-center gap-6 border-b border-soft/30">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              aria-pressed={activeTab === 'products'}
              className={cn(
                'relative flex items-center gap-2 pb-2.5 text-sm font-semibold transition-colors',
                activeTab === 'products' ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
              )}
            >
              <Sparkles className="size-4" />
              {t({ en: 'Products', ar: 'منتجات' })}
              <span
                className={cn(
                  'absolute -bottom-px start-0 end-0 h-[2px] rounded-full transition-all duration-300',
                  activeTab === 'products' ? 'bg-hero opacity-100' : 'bg-transparent opacity-0'
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stores')}
              aria-pressed={activeTab === 'stores'}
              className={cn(
                'relative flex items-center gap-2 pb-2.5 text-sm font-semibold transition-colors',
                activeTab === 'stores' ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
              )}
            >
              <StoreIcon className="size-4" />
              {t({ en: 'Stores', ar: 'متاجر' })}
              <span
                className={cn(
                  'absolute -bottom-px start-0 end-0 h-[2px] rounded-full transition-all duration-300',
                  activeTab === 'stores' ? 'bg-hero opacity-100' : 'bg-transparent opacity-0'
                )}
              />
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
