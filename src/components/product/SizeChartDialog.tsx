'use client';

import { Ruler } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { SizeChart, SizeMeasurement } from '@/types';

interface SizeChartDialogProps {
  chart: SizeChart;
  storeName: string;
  className?: string;
}

const COLUMN_LABELS: Record<keyof Omit<SizeMeasurement, 'size'>, { en: string; ar: string }> = {
  bust:     { en: 'Bust',     ar: 'الصدر' },
  waist:    { en: 'Waist',    ar: 'الخصر' },
  hips:     { en: 'Hips',     ar: 'الورك' },
  length:   { en: 'Length',   ar: 'الطول' },
  shoulder: { en: 'Shoulder', ar: 'الكتف' },
};

const COLUMN_ORDER: Array<keyof Omit<SizeMeasurement, 'size'>> = [
  'bust',
  'waist',
  'hips',
  'length',
  'shoulder',
];

export default function SizeChartDialog({ chart, storeName, className }: SizeChartDialogProps) {
  const { language, t } = useLanguage();

  // Only render columns that have data in at least one row.
  const visibleColumns = COLUMN_ORDER.filter((key) =>
    chart.measurements.some((m) => m[key] !== undefined)
  );

  const unitLabel = chart.unit === 'in'
    ? { en: 'inches', ar: 'إنش' }
    : { en: 'cm',     ar: 'سم' };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-medium text-hero',
          'underline-offset-4 hover:underline transition-colors',
          className
        )}
      >
        <Ruler className="size-4" />
        {language === 'ar' ? 'جدول المقاسات' : 'Size chart'}
      </DialogTrigger>

      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle className="text-plum dark:text-soft">
            {language === 'ar' ? `جدول مقاسات ${storeName}` : `${storeName} size chart`}
          </DialogTitle>
          <DialogDescription className="text-xs text-ink/60">
            {language === 'ar'
              ? `جميع القياسات بـ${t(unitLabel)}`
              : `All measurements in ${t(unitLabel)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto rounded-lg border border-soft/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blush/60 text-plum dark:text-soft">
                <th className="px-3 py-2 text-start font-semibold">
                  {language === 'ar' ? 'المقاس' : 'Size'}
                </th>
                {visibleColumns.map((key) => (
                  <th key={key} className="px-3 py-2 text-start font-semibold whitespace-nowrap">
                    {t(COLUMN_LABELS[key])}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.measurements.map((row, i) => (
                <tr
                  key={row.size}
                  className={cn(
                    'border-t border-soft/30 dark:border-border',
                    i % 2 === 0 ? 'bg-white dark:bg-card' : 'bg-cream/40 dark:bg-secondary/30'
                  )}
                >
                  <td className="px-3 py-2 font-bold text-hero">{row.size}</td>
                  {visibleColumns.map((key) => (
                    <td key={key} className="px-3 py-2 text-ink/80">
                      {row[key] !== undefined ? row[key] : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {chart.notes && (
          <p className="mt-2 text-xs leading-relaxed text-ink/60">
            {t(chart.notes)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
