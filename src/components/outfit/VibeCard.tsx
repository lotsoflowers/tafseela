'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, isLoadableImage } from '@/lib/utils';
import type { OutfitVibe, BilingualText } from '@/types';

const vibeMeta: Record<OutfitVibe, { label: BilingualText }> = {
  daily: { label: { en: 'Daily', ar: 'يومي' } },
  evening: { label: { en: 'Evening', ar: 'سهرة' } },
  layered: { label: { en: 'Layered', ar: 'بطبقات' } },
  modest: { label: { en: 'Modest', ar: 'محتشم' } },
};

interface VibeCardProps {
  vibe: OutfitVibe;
  photo: string;
  className?: string;
}

export default function VibeCard({ vibe, photo, className }: VibeCardProps) {
  const { t } = useLanguage();
  const meta = vibeMeta[vibe];

  return (
    <Link
      href={`/catalog/vibe/${vibe}`}
      className={cn(
        'group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-blush via-soft/60 to-cream shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] animate-fade-in-up',
        className
      )}
    >
      {isLoadableImage(photo) && (
        <Image
          src={photo}
          alt={t(meta.label)}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-[20px] font-bold leading-tight text-white drop-shadow-sm">
          {t(meta.label)}
        </h3>
      </div>
    </Link>
  );
}

export { vibeMeta };
