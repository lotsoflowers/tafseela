'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SegmentedSubtabs from '@/components/shared/SegmentedSubtabs';
import VibeCard from '@/components/outfit/VibeCard';
import FollowedBrandSection from '@/components/saved/FollowedBrandSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useBrandFollow } from '@/contexts/BrandFollowContext';
import { outfits } from '@/data/outfits';
import { stores } from '@/data/stores';
import { isLoadableImage } from '@/lib/utils';
import type { OutfitVibe } from '@/types';

type Tab = 'foryou' | 'brands';

const VIBES: OutfitVibe[] = ['daily', 'evening', 'layered', 'modest'];

const photoForVibe = (vibe: OutfitVibe): string => {
  const featured = outfits.find(o => o.vibe === vibe && o.isFeatured);
  return (featured ?? outfits.find(o => o.vibe === vibe))?.lifestylePhoto ?? '';
};

export default function HomePage() {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const { state: onboarding, loaded } = useOnboarding();
  const { followed } = useBrandFollow();
  const [tab, setTab] = useState<Tab>('foryou');

  useEffect(() => {
    if (loaded && !onboarding.completed) router.replace('/onboarding');
  }, [loaded, onboarding.completed, router]);

  const heroOutfit = outfits.find(o => o.isFeatured) ?? outfits[0];
  const Arrow = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const followedStores = followed
    .map(id => stores.find(s => s.id === id))
    .filter(Boolean) as typeof stores;

  const subtabs = [
    { id: 'foryou' as const, label: { en: 'For You', ar: 'لكِ' } },
    { id: 'brands' as const, label: { en: 'Followed Brands', ar: 'متابَعة' } },
  ];

  return (
    <PageShell showTopBar={false}>
      <div className="px-2 pt-[calc(env(safe-area-inset-top)+12px)]">
        <SegmentedSubtabs items={subtabs} active={tab} onChange={setTab} />
      </div>

      {tab === 'foryou' && (
        <>
          {/* Hero collection card */}
          {heroOutfit && (
            <Link
              href={`/outfit/${heroOutfit.id}`}
              className="group relative mx-4 mt-4 block aspect-[16/10] overflow-hidden rounded-3xl bg-gradient-to-br from-blush via-soft/60 to-cream shadow-card-hover transition-transform duration-300 ease-out hover:-translate-y-1 active:scale-[0.99] animate-lift-in"
            >
              {isLoadableImage(heroOutfit.lifestylePhoto) && (
                <Image
                  src={heroOutfit.lifestylePhoto}
                  alt={t(heroOutfit.name)}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
                    {t({ en: 'New collection', ar: 'مجموعة جديدة' })}
                  </p>
                  <h1 className="mt-1 text-[24px] font-bold uppercase leading-none tracking-tight drop-shadow-sm">
                    {t({ en: 'Bloom Time', ar: 'موسم التفصيلة' })}
                  </h1>
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 pb-0.5 text-[13px] font-semibold">
                  {t({ en: 'Explore', ar: 'استكشفي' })}
                  <Arrow className="size-4" strokeWidth={2.25} />
                </span>
              </div>
            </Link>
          )}

          {/* EXPLORE TRENDS */}
          <section className="mt-8 px-4">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-ink dark:text-foreground">
              {t({ en: 'Explore Trends', ar: 'اكتشفي الترندات' })}
            </h2>
            <div className="stagger-grid grid grid-cols-2 gap-3">
              {VIBES.map(vibe => (
                <VibeCard key={vibe} vibe={vibe} photo={photoForVibe(vibe)} />
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'brands' && (
        <section className="pt-4">
          {followedStores.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-cream dark:bg-secondary">
                <Heart className="size-9 text-soft" strokeWidth={1.5} />
              </span>
              <p className="text-[15px] font-semibold text-ink dark:text-foreground">
                {t({ en: 'Not following any brands yet', ar: 'لا تتابعين أي ماركة بعد' })}
              </p>
              <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
                {t({
                  en: 'Tap Follow on a brand in Catalog to see new arrivals here.',
                  ar: 'اضغطي متابعة على ماركة من الفئات لترين الجديد هنا.',
                })}
              </p>
              <Link
                href="/catalog"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-hero px-5 py-2.5 text-[13px] font-bold text-white"
              >
                {t({ en: 'Browse Catalog', ar: 'تصفّحي الفئات' })}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {followedStores.map(store => (
                <FollowedBrandSection key={store.id} storeId={store.id} />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="h-12" />
    </PageShell>
  );
}
