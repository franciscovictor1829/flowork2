/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackInitials?: string;
  fallbackBgColor?: string;
}

const PALETTE = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-amber-600',
  'bg-cyan-700',
  'bg-rose-600',
];

function getDeterministicBg(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % PALETTE.length;
  return PALETTE[idx];
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackInitials,
  fallbackBgColor,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initials =
    fallbackInitials ||
    alt
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    'US';

  const bgColor = fallbackBgColor || getDeterministicBg(alt || initials);

  // If no source is provided (or it errored out), render the clean initials avatar
  if (hasError || !src || src.trim() === '') {
    return (
      <div
        className={`flex items-center justify-center font-bold text-white select-none ${bgColor} ${className}`}
        title={alt}
      >
        <span className="text-[11px] uppercase tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${bgColor} text-white font-bold text-[11px]`}>
          {initials}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
