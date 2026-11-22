'use client';

/**
 * Universal responsive media display component.
 *
 * Automatically handles:
 * - Portrait / landscape / square images without distortion
 * - Graceful fallback when image is unavailable
 * - Lazy loading for below-fold content
 * - Consistent aspect ratios per use-case variant
 *
 * Variants:
 *   card        — 16:9 landscape cards (achievements, events, news)
 *   profile     — 3:4 portrait (faculty, person)
 *   banner      — wide cinematic (hero, section banners)
 *   square      — 1:1 (gallery thumbnails, icons)
 *   gallery     — 4:3 (gallery grid items)
 *   contain     — full image visible, no crop (logos, documents)
 */

import { useState } from 'react';

type Variant = 'card' | 'profile' | 'banner' | 'square' | 'gallery' | 'contain';

const ASPECT_RATIOS: Record<Variant, string> = {
  card:    '16 / 9',
  profile: '3 / 4',
  banner:  '21 / 9',
  square:  '1 / 1',
  gallery: '4 / 3',
  contain: '4 / 3',
};

const FIT_MODE: Record<Variant, string> = {
  card:    'object-cover object-center',
  profile: 'object-cover object-top',
  banner:  'object-cover object-center',
  square:  'object-cover object-center',
  gallery: 'object-cover object-center',
  contain: 'object-contain object-center',
};

interface MediaImageProps {
  src?: string | null;
  alt?: string;
  variant?: Variant;
  className?: string;
  fallbackIcon?: string;
  fallbackBg?: string;
  eager?: boolean;
  onLoad?: () => void;
}

export default function MediaImage({
  src,
  alt = '',
  variant = 'card',
  className = '',
  fallbackIcon = '🖼️',
  fallbackBg = 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
  eager = false,
  onLoad,
}: MediaImageProps) {
  const [error, setError] = useState(false);
  const hasImage = !!src && !error;

  return (
    <div
      className={`relative overflow-hidden w-full ${className}`}
      style={{ aspectRatio: ASPECT_RATIOS[variant] }}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${FIT_MODE[variant]}`}
          onError={() => setError(true)}
          onLoad={onLoad}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: fallbackBg }}
          aria-hidden="true"
        >
          <span className="text-4xl opacity-40">{fallbackIcon}</span>
        </div>
      )}
    </div>
  );
}
