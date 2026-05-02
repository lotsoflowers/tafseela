'use client';

import { LayoutGrid } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import LargeTitle from '@/components/layout/LargeTitle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CatalogPage() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <div className="px-4 pt-2">
        <LargeTitle
          title={{ en: 'Catalog', ar: 'الفئات' }}
          subtitle={{
            en: 'Browse outfits, items, and brands',
            ar: 'تصفّحي الإطلالات والقطع والعلامات',
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-cream">
          <LayoutGrid className="size-8 text-soft" strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-foreground">
          {t({
            en: 'Catalog is coming together',
            ar: 'الفئات قيد الإعداد',
          })}
        </p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {t({
            en: 'Outfits, item categories, and a full brand directory will live here.',
            ar: 'الإطلالات وأقسام القطع ودليل العلامات الكامل سيظهر هنا.',
          })}
        </p>
      </div>
    </PageShell>
  );
}
