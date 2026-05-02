import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Whether a path can actually be fetched by next/image at runtime.
// Local /images/... and /placeholder paths are never present in this repo's
// public/ directory, so we treat external https:// URLs and blob: URIs (used
// for review-photo previews) as the only loadable sources. Everything else
// renders a fallback surface instead of crashing the Image component.
export function isLoadableImage(src: string | undefined | null): src is string {
  if (!src) return false;
  return /^(https?:\/\/|blob:|data:)/.test(src);
}
