'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFolders } from '@/contexts/FoldersContext';
import { products } from '@/data/products';
import { outfits } from '@/data/outfits';
import { cn, isLoadableImage } from '@/lib/utils';
import type { Folder } from '@/types';

interface FolderCardProps {
  folder: Folder;
}

function thumbnailFor(itemId: string): string | null {
  if (itemId.startsWith('outfit:')) {
    const outfit = outfits.find(o => `outfit:${o.id}` === itemId);
    return outfit?.lifestylePhoto ?? null;
  }
  const product = products.find(p => p.id === itemId);
  return product?.images[0] ?? null;
}

export default function FolderCard({ folder }: FolderCardProps) {
  const { t } = useLanguage();
  const { renameFolder, deleteFolder } = useFolders();
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(folder.name);

  const previews = folder.itemIds.slice(0, 4).map(thumbnailFor);
  while (previews.length < 4) previews.push(null);

  const handleRename = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== folder.name) renameFolder(folder.id, trimmed);
    setRenaming(false);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(92,10,61,0.04),0_8px_24px_rgba(92,10,61,0.05)] dark:bg-card dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.5)]">
      <Link href={`/wishlist/folder/${folder.id}`} className="block">
        <div className="grid grid-cols-2 gap-px bg-blush/40">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-cream dark:bg-secondary">
              {isLoadableImage(src) && (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </Link>
      <div className="flex items-center gap-2 px-3 py-2.5">
        {renaming ? (
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.slice(0, 25))}
            onBlur={handleRename}
            onKeyDown={e => e.key === 'Enter' && handleRename()}
            autoFocus
            maxLength={25}
            className="min-w-0 flex-1 rounded-md bg-cream px-2 py-1 text-[13px] font-semibold text-ink outline-none dark:bg-secondary dark:text-foreground"
          />
        ) : (
          <Link href={`/wishlist/folder/${folder.id}`} className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-ink dark:text-foreground">
              {folder.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t({
                en: `${folder.itemIds.length} items`,
                ar: `${folder.itemIds.length} قطعة`,
              })}
            </p>
          </Link>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={t({ en: 'Folder actions', ar: 'إجراءات المجلد' })}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-cream dark:hover:bg-secondary"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className={cn(
                'absolute end-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-card',
                'border border-soft/40 dark:border-border'
              )}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setRenaming(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-[13px] hover:bg-cream dark:hover:bg-secondary"
                >
                  <Pencil className="size-4" />
                  {t({ en: 'Rename', ar: 'إعادة تسمية' })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    deleteFolder(folder.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-[13px] text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="size-4" />
                  {t({ en: 'Delete', ar: 'حذف' })}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
