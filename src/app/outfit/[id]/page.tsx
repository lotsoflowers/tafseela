'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import ProductCard from '@/components/product/ProductCard';
import OutfitCard from '@/components/outfit/OutfitCard';
import WishlistButton from '@/components/shared/WishlistButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOutfit, getOutfitTotalPrice, getRelatedOutfits } from '@/data/outfits';
import { products } from '@/data/products';
import { stores } from '@/data/stores';
import { cn } from '@/lib/utils';

export default function OutfitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const outfit = getOutfit(id);
  const { t, language, direction } = useLanguage();

  if (!outfit) notFound();

  const items = outfit.items
    .map(productId => products.find(p => p.id === productId))
    .filter(Boolean) as typeof products;

  const total = getOutfitTotalPrice(outfit);
  const related = getRelatedOutfits(outfit.id, 4);
  const store = outfit.brand ? stores.find(s => s.id === outfit.brand) : undefined;
  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const currency = language === 'ar' ? 'د.ك' : 'KD';

  return (
    <PageShell showTopBar={false}>
      {/* Floating top bar over hero photo */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between p-3">
        <Link
          href="/catalog"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md dark:bg-card/85 dark:text-foreground"
          aria-label={t({ en: 'Back', ar: 'رجوع' })}
        >
          <Back className="size-5" />
        </Link>
        <button
          type="button"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur-md dark:bg-card/85 dark:text-foreground"
          aria-label={t({ en: 'Share', ar: 'مشاركة' })}
        >
          <Share2 className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Lifestyle hero */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush/40">
        {outfit.lifestylePhoto && (
          <Image
            src={outfit.lifestylePhoto}
            alt={t(outfit.name)}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
      </div>

      {/* Header card overlapping the hero */}
      <div className="relative z-10 -mt-8 rounded-t-3xl bg-background px-4 pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t({
                en: `${items.length} items · ${currency} ${total.toFixed(total % 1 === 0 ? 0 : 3)}`,
                ar: `${items.length} قطع · ${currency} ${total.toFixed(total % 1 === 0 ? 0 : 3)}`,
              })}
            </p>
            <h1 className="mt-1 text-[24px] font-bold leading-tight text-ink dark:text-foreground">
              {t(outfit.name)}
            </h1>
            {store && (
              <Link
                href={`/store/${store.id}`}
                className="mt-1 inline-block text-[13px] font-semibold text-hero underline-offset-2 hover:underline"
              >
                {t(store.name)}
              </Link>
            )}
          </div>
          <WishlistButton
            productId={`outfit:${outfit.id}`}
            className={cn(
              '!size-12 -mt-12 !shadow-[0_8px_24px_rgba(92,10,61,0.18)] !bg-hero !text-white'
            )}
          />
        </div>
      </div>

      {/* Items in this outfit */}
      <section className="px-4 pt-2">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: 'Items in this outfit', ar: 'القطع في هذه الإطلالة' })}
        </h2>
        <div className="stagger-grid grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* Similar outfits */}
      {related.length > 0 && (
        <section className="mt-10 px-4">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t({ en: 'Similar outfits', ar: 'إطلالات مشابهة' })}
          </h2>
          <div className="stagger-grid grid grid-cols-2 gap-3">
            {related.map(o => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        </section>
      )}

      <div className="h-12" />
    </PageShell>
  );
}
