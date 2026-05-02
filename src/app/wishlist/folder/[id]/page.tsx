'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import ProductCard from '@/components/product/ProductCard';
import OutfitCard from '@/components/outfit/OutfitCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFolders } from '@/contexts/FoldersContext';
import { products } from '@/data/products';
import { outfits } from '@/data/outfits';

export default function FolderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { t, direction } = useLanguage();
  const { getFolder, removeFromFolder } = useFolders();

  const folder = getFolder(id);
  if (!folder) notFound();

  const folderProducts = folder.itemIds
    .filter(itemId => !itemId.startsWith('outfit:'))
    .map(itemId => products.find(p => p.id === itemId))
    .filter(Boolean) as typeof products;
  const folderOutfits = folder.itemIds
    .filter(itemId => itemId.startsWith('outfit:'))
    .map(itemId => outfits.find(o => `outfit:${o.id}` === itemId))
    .filter(Boolean) as typeof outfits;

  const Back = direction === 'rtl' ? ChevronRight : ChevronLeft;

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <Link
          href="/wishlist"
          className="-ms-2 inline-flex items-center gap-1 text-[13px] font-semibold text-muted-foreground"
        >
          <Back className="size-4" />
          {t({ en: 'Saved', ar: 'المحفوظات' })}
        </Link>
        <h1 className="mt-2 text-[28px] font-bold text-ink dark:text-foreground">
          {folder.name}
        </h1>
        <p className="text-[13px] text-muted-foreground">
          {t({
            en: `${folder.itemIds.length} items`,
            ar: `${folder.itemIds.length} قطعة`,
          })}
        </p>
      </div>

      {folder.itemIds.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-20 text-center">
          <p className="text-[15px] font-semibold text-ink dark:text-foreground">
            {t({ en: 'Nothing in this folder yet', ar: 'لا يوجد شيء في هذا المجلد بعد' })}
          </p>
          <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
            {t({
              en: 'Tap the menu on any saved item or outfit to add it here.',
              ar: 'اضغطي القائمة على أي قطعة أو إطلالة محفوظة لإضافتها هنا.',
            })}
          </p>
        </div>
      ) : (
        <>
          {folderOutfits.length > 0 && (
            <section className="mt-6 px-4">
              <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {t({ en: 'Outfits', ar: 'الإطلالات' })}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {folderOutfits.map(o => (
                  <div key={o.id} className="relative">
                    <OutfitCard outfit={o} />
                    <button
                      type="button"
                      onClick={() => removeFromFolder(folder.id, `outfit:${o.id}`)}
                      aria-label={t({ en: 'Remove from folder', ar: 'إزالة من المجلد' })}
                      className="absolute end-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-md"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {folderProducts.length > 0 && (
            <section className="mt-6 px-4">
              <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {t({ en: 'Items', ar: 'القطع' })}
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {folderProducts.map(p => (
                  <div key={p.id} className="relative">
                    <ProductCard product={p} />
                    <button
                      type="button"
                      onClick={() => removeFromFolder(folder.id, p.id)}
                      aria-label={t({ en: 'Remove from folder', ar: 'إزالة من المجلد' })}
                      className="absolute end-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-md"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="h-12" />
    </PageShell>
  );
}
