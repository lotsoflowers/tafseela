'use client';

import { Sparkle } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import SearchBar from '@/components/shared/SearchBar';
import VibeCard from '@/components/outfit/VibeCard';
import CategoryIconTile from '@/components/catalog/CategoryIconTile';
import BrandRow from '@/components/catalog/BrandRow';
import { useLanguage } from '@/contexts/LanguageContext';
import { outfits } from '@/data/outfits';
import { categories } from '@/data/categories';
import { stores } from '@/data/stores';
import type { OutfitVibe } from '@/types';

const VIBES: OutfitVibe[] = ['daily', 'evening', 'layered', 'modest'];

const photoForVibe = (vibe: OutfitVibe): string => {
  const featured = outfits.find(o => o.vibe === vibe && o.isFeatured);
  return (featured ?? outfits.find(o => o.vibe === vibe))?.lifestylePhoto ?? '';
};

const itemCategories = categories.filter(c => c.id !== 'all');

const sortedStores = [...stores].sort((a, b) =>
  a.name.en.localeCompare(b.name.en)
);

export default function CatalogPage() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <LargeTitle title={{ en: 'Catalog', ar: 'الفئات' }} />

        <div className="mt-2">
          <SearchBar />
        </div>

        {/* Women-only segmented control — single active pill, palette-locked */}
        <div className="mt-4 flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-1.5 text-[13px] font-semibold text-plum dark:bg-secondary dark:text-foreground"
            aria-label={t({ en: 'Women', ar: 'نساء' })}
          >
            <Sparkle className="size-3 text-hero" fill="currentColor" strokeWidth={1.5} />
            {t({ en: 'Women', ar: 'نساء' })}
            <Sparkle className="size-3 text-hero" fill="currentColor" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      {/* OUTFITS */}
      <section className="mt-8 px-4">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: 'Outfits', ar: 'الإطلالات' })}
        </h2>
        <div className="stagger-grid grid grid-cols-2 gap-3">
          {VIBES.map(vibe => (
            <VibeCard key={vibe} vibe={vibe} photo={photoForVibe(vibe)} />
          ))}
        </div>
      </section>

      {/* ITEMS */}
      <section className="mt-8 px-4">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: 'Items', ar: 'القطع' })}
        </h2>
        <div className="stagger-grid grid grid-cols-3 gap-3 sm:grid-cols-4">
          {itemCategories.map(category => (
            <CategoryIconTile key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="mt-8">
        <div className="mb-3 px-4">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Brands', ar: 'الماركات' })}
          </h2>
        </div>
        <div className="ios-list mx-4 shadow-card">
          {sortedStores.map(store => (
            <div key={store.id} className="ios-list-row">
              <BrandRow store={store} />
            </div>
          ))}
        </div>
      </section>

      <div className="h-8" />
    </PageShell>
  );
}
