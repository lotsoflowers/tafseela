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
  'bg-blush',
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
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-blush/30">
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
                    'flex aspect-[3/4] items-center justify-center rounded-lg',
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

      {/* Dot indicators */}
      <div className="absolute bottom-3 start-0 end-0 flex items-center justify-center gap-1.5">
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white">
          {current + 1}/{total}
        </span>
      </div>

      {/* Dots row */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {images.map((_, index) => (
          <span
            key={index}
            className={cn(
              'block size-2 rounded-full transition-colors',
              index === current ? 'bg-hero' : 'bg-soft/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
