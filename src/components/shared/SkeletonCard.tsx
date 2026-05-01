'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-white">
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full" />

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Store name */}
        <Skeleton className="h-3 w-16" />
        {/* Product name */}
        <Skeleton className="h-4 w-3/4" />
        {/* Price */}
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
