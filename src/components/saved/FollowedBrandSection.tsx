'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { isLoadableImage } from '@/lib/utils';

interface FollowedBrandSectionProps {
  storeId: string;
}

export default function FollowedBrandSection({ storeId }: FollowedBrandSectionProps) {
  const { t } = useLanguage();
  const store = stores.find(s => s.id === storeId);
  if (!store) return null;
  const newArrivals = products.filter(p => p.storeId === storeId).slice(0, 6);
  const hasLogo = isLoadableImage(store.logo);

  return (
    <div>
      <div className="flex items-center gap-3 px-4">
        <Link href={`/store/${store.id}`} className="flex items-center gap-3">
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blush/60 text-[13px] font-bold text-plum">
            {hasLogo ? (
              <Image src={store.logo} alt={t(store.name)} fill className="object-cover" />
            ) : (
              t(store.name).charAt(0)
            )}
          </span>
          <div>
            <p className="text-[15px] font-bold text-ink dark:text-foreground">{t(store.name)}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t({ en: 'New arrivals', ar: 'الوصول الجديد' })}
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 hide-scrollbar">
        {newArrivals.map(p => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blush via-soft/60 to-cream"
          >
            {isLoadableImage(p.images[0]) && (
              <Image
                src={p.images[0]}
                alt={t(p.name)}
                fill
                sizes="128px"
                className="object-cover"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
