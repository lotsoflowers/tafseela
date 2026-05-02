'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles, Store as StoreIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SearchBar from '@/components/shared/SearchBar';
import CategoryFilter from '@/components/shared/CategoryFilter';
import HeroOverlayActions from '@/components/shared/HeroOverlayActions';
import ProductCard from '@/components/product/ProductCard';
import OutfitCard from '@/components/outfit/OutfitCard';
import StoreCard from '@/components/store/StoreCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { products } from '@/data/products';
import { outfits } from '@/data/outfits';
import { stores } from '@/data/stores';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const HERO_IMAGE = 'https://cdn.shopify.com/s/files/1/0601/9825/6875/files/SD1-211.jpg?v=1777037814&width=1600';

export default function HomePage() {
  const { language, t, direction } = useLanguage();
  const { state: onboardingState, loaded: onboardingLoaded } = useOnboarding();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onboardingLoaded && !onboardingState.completed) {
      router.replace('/onboarding');
    }
  }, [onboardingLoaded, onboardingState.completed, router]);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  const featuredProducts = products.filter((p) => p.isFeatured);
  const featuredOutfits = outfits.filter((o) => o.isFeatured);

  const scrollFeatured = (dir: 'left' | 'right') => {
    if (!featuredScrollRef.current) return;
    const amount = dir === 'left' ? -200 : 200;
    featuredScrollRef.current.scrollBy({ left: direction === 'rtl' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <PageShell showTopBar={false}>
      <div className="animate-fade-in space-y-5 pb-4">
        {/* Hero — bleeds to the very top of the screen, no header above it.
            Real product image as backdrop, dramatic dark gradient for
            legibility, floating actions, big display heading, CTA. */}
        <div className="relative -mt-px overflow-hidden aspect-[4/5] sm:aspect-[3/2]">
          <Image
            src={HERO_IMAGE}
            alt={t({ en: 'New arrivals', ar: 'وصل حديثاً' })}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover scale-[1.02] hover:scale-[1.06] transition-transform duration-[2500ms] ease-out"
          />

          {/* Layered gradient — keeps the photo visible up top, deepens to plum at the bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/60 to-plum/0" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/40 via-transparent to-transparent rtl:bg-gradient-to-l" />
          {/* Faint top wash so the floating action icons stay legible */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />

          {/* Floating top row — wordmark + actions, no surrounding header */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-2">
            <Link href="/home" className="group inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full bg-gradient-to-br from-soft to-hero shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />
              <span className="text-[19px] font-extrabold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                {t({ en: 'Tafseela', ar: 'تفصيلة' })}
              </span>
            </Link>
            <HeroOverlayActions />
          </div>

          {/* Floating eyebrow chip — moved down so it doesn't collide with the actions */}
          <div className="absolute top-[68px] start-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-hero ring-1 ring-white/40">
              <span className="size-1.5 rounded-full bg-hero animate-pulse" />
              {t({ en: 'New this week', ar: 'جديد هذا الأسبوع' })}
            </span>
          </div>

          {/* Content stacked at the bottom */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-6 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-soft">
              {t({ en: 'Tafseela', ar: 'تفصيلة' })}
            </p>
            <h1 className="mt-2 text-[40px] font-bold leading-[0.95] tracking-tight drop-shadow-sm">
              {language === 'ar' ? (
                <>اكتشفي<br />أحدث الموضة</>
              ) : (
                <>Discover the<br />latest drops</>
              )}
            </h1>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-white/80">
              {t({
                en: 'Curated collections from Kuwait’s best boutiques',
                ar: 'مجموعات منتقاة من أفضل بوتيكات الكويت',
              })}
            </p>
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById('home-products')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white dark:bg-card px-5 py-3 text-sm font-bold text-plum dark:text-soft shadow-lg transition-transform active:scale-[0.97] hover:bg-blush"
            >
              {t({ en: 'Shop new arrivals', ar: 'تصفحي الجديد' })}
              {direction === 'rtl' ? (
                <ArrowLeft className="size-4" strokeWidth={2.5} />
              ) : (
                <ArrowRight className="size-4" strokeWidth={2.5} />
              )}
            </button>
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
              <h2 className="flex items-center gap-1.5 text-base font-bold text-ink dark:text-foreground">
                <Sparkles className="size-4 text-hero" />
                {t({ en: 'Featured', ar: 'مميز' })}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollFeatured('left')}
                  className="rounded-full p-1 text-ink/40 hover:text-ink hover:bg-blush transition-colors dark:text-foreground/40 dark:hover:text-foreground dark:hover:bg-card"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeatured('right')}
                  className="rounded-full p-1 text-ink/40 hover:text-ink hover:bg-blush transition-colors dark:text-foreground/40 dark:hover:text-foreground dark:hover:bg-card"
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

        {/* Featured outfits — Plum's signature pattern */}
        {featuredOutfits.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-4">
              <h2 className="flex items-center gap-1.5 text-base font-bold text-ink dark:text-foreground">
                <Sparkles className="size-4 text-hero" />
                {t({ en: 'Selected outfits', ar: 'إطلالات مختارة' })}
              </h2>
              <Link
                href="/catalog"
                className="text-[12px] font-semibold text-hero"
              >
                {t({ en: 'See all', ar: 'الكل' })}
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 snap-x snap-mandatory">
              {featuredOutfits.map((outfit) => (
                <div key={outfit.id} className="w-44 shrink-0 snap-start">
                  <OutfitCard outfit={outfit} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category filter — anchored so the hero CTA can scroll the user here */}
        <div id="home-products" className="px-4 scroll-mt-4">
          <CategoryFilter
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* iOS-style segmented control */}
        <div className="px-4 space-y-4">
          <div
            role="tablist"
            className={cn(
              'relative grid grid-cols-2 rounded-[10px] p-0.5',
              'bg-ink/[0.06] dark:bg-foreground/[0.08]'
            )}
          >
            {/* Sliding pill — picks the active half */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-0.5 w-[calc(50%-2px)] rounded-[8px]',
                'bg-white dark:bg-card',
                'shadow-[0_3px_8px_rgba(92,10,61,0.12),0_1px_1px_rgba(0,0,0,0.04)]',
                'dark:shadow-[0_3px_8px_rgba(0,0,0,0.4)]',
                'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                activeTab === 'products'
                  ? 'translate-x-0.5 rtl:-translate-x-0.5'
                  : 'translate-x-[calc(100%+2px)] rtl:-translate-x-[calc(100%+2px)]'
              )}
            />
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
              className={cn(
                'relative z-10 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold',
                'transition-colors duration-200 active:scale-[0.97]',
                activeTab === 'products'
                  ? 'text-ink dark:text-foreground'
                  : 'text-ink/55 dark:text-foreground/55'
              )}
            >
              <Sparkles className="size-3.5" strokeWidth={2.5} />
              {t({ en: 'Products', ar: 'منتجات' })}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'stores'}
              onClick={() => setActiveTab('stores')}
              className={cn(
                'relative z-10 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold',
                'transition-colors duration-200 active:scale-[0.97]',
                activeTab === 'stores'
                  ? 'text-ink dark:text-foreground'
                  : 'text-ink/55 dark:text-foreground/55'
              )}
            >
              <StoreIcon className="size-3.5" strokeWidth={2.5} />
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
