'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import OutfitCard from '@/components/outfit/OutfitCard';
import { IconButton } from '@/components/glass';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOutfitsByVibe } from '@/data/outfits';
import { vibeMeta } from '@/components/outfit/VibeCard';
import { isLoadableImage } from '@/lib/utils';
import type { OutfitVibe } from '@/types';

const VALID_VIBES: OutfitVibe[] = ['daily', 'evening', 'layered', 'modest'];

export default function VibeDetailPage({
  params,
}: {
  params: { vibe: string };
}) {
  const { vibe } = params;
  const { t, direction } = useLanguage();

  if (!VALID_VIBES.includes(vibe as OutfitVibe)) notFound();
  const typedVibe = vibe as OutfitVibe;
  const meta = vibeMeta[typedVibe];
  const items = getOutfitsByVibe(typedVibe);
  const heroPhoto = items[0]?.lifestylePhoto;
  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;

  return (
    <PageShell showTopBar={false}>
      {/* Floating back over blurred hero — glass IconButton */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 p-3">
        <Link href="/catalog" className="pointer-events-auto" aria-label={t({ en: 'Back', ar: 'رجوع' })}>
          <IconButton size={40} icon={<Back size={18} />} />
        </Link>
      </div>

      {/* Blurred lifestyle hero with vibe overlay */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-blush via-soft/60 to-cream">
        {isLoadableImage(heroPhoto) && (
          <Image
            src={heroPhoto}
            alt={t(meta.label)}
            fill
            sizes="100vw"
            priority
            className="scale-110 object-cover blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <h1 className="text-[34px] font-bold leading-none text-white drop-shadow-sm">
            {t(meta.label)}
          </h1>
          <p className="mt-1 text-[13px] font-medium text-white/85">
            {t({
              en: `${items.length} outfits`,
              ar: `${items.length} إطلالة`,
            })}
          </p>
        </div>
      </div>

      <section className="px-4 pt-6">
        <div className="stagger-grid grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map(o => (
            <OutfitCard key={o.id} outfit={o} />
          ))}
        </div>
      </section>

      <div className="h-12" />
    </PageShell>
  );
}
