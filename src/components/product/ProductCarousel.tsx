'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

const SLIDE_COLORS = [
  'bg-hero/10',
  'bg-soft/30',
  'bg-blush dark:bg-secondary',
  'bg-plum/10',
];

function isExternalImage(src: string): boolean {
  return /^https?:\/\//.test(src);
}

export default function ProductCarousel({
  images,
  productName,
  className,
}: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const onApiChange = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Carousel
        opts={{ direction: 'ltr' }}
        setApi={onApiChange}
        className="w-full"
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              {isExternalImage(src) ? (
                <div className="relative aspect-[4/5] overflow-hidden bg-blush/30 dark:bg-secondary/40">
                  <Image
                    src={src}
                    alt={productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex aspect-[4/5] items-center justify-center',
                    SLIDE_COLORS[index % SLIDE_COLORS.length]
                  )}
                >
                  <span className="px-6 text-center text-lg font-semibold text-ink/60">
                    {productName}
                  </span>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots — sit at the bottom of the photo, like iOS PageControl */}
      {total > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
          {images.map((_, index) => (
            <span
              key={index}
              className={cn(
                'block rounded-full transition-all duration-300',
                index === current
                  ? 'h-2 w-5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                  : 'size-2 bg-white/55'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
