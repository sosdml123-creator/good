import React, { useState } from 'react';
import { BRAND_SVG_LOGOS, BRAND_ALIASES, BRAND_THEME_COLORS } from '../../utils/brandLogos';

interface BrandLogoProps {
  brandName: string;
  logoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  roundedClassName?: string;
  showBorder?: boolean;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const TEXT_SIZE_MAP = {
  xs: 'text-[9px]',
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-lg',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandName,
  logoUrl,
  size = 'md',
  className = '',
  roundedClassName = 'rounded-2xl',
  showBorder = true,
}) => {
  const [hasError, setHasError] = useState(false);

  // Normalize brand name
  const raw = (brandName || '').trim();
  const normalized = BRAND_ALIASES[raw] || raw;

  // Resolve SVG Logo first if no valid external logoUrl or if error occurred
  const svgLogo = BRAND_SVG_LOGOS[normalized] || BRAND_SVG_LOGOS[raw];
  
  // Choose source
  const imageSrc = !hasError && logoUrl ? logoUrl : svgLogo;

  const theme = BRAND_THEME_COLORS[normalized] || {
    bg: '#0066FF',
    text: '#FFFFFF',
    border: '#0052CC'
  };

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const textSizeClass = TEXT_SIZE_MAP[size] || TEXT_SIZE_MAP.md;

  if (imageSrc) {
    return (
      <div
        className={`relative ${sizeClass} ${roundedClassName} bg-white shrink-0 overflow-hidden flex items-center justify-center p-1.5 ${
          showBorder ? 'border border-gray-100 shadow-2xs' : ''
        } ${className}`}
      >
        <img
          src={imageSrc}
          alt={brandName}
          onError={() => {
            if (!hasError && logoUrl) {
              setHasError(true);
            }
          }}
          className="w-full h-full object-contain select-none"
          loading="lazy"
        />
      </div>
    );
  }

  // Elegant text badge fallback if no logo image exists
  const initial = raw.length > 2 ? raw.slice(0, 2) : raw;

  return (
    <div
      className={`relative ${sizeClass} ${roundedClassName} shrink-0 overflow-hidden flex items-center justify-center font-black ${textSizeClass} shadow-2xs select-none ${className}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        border: showBorder ? `1.5px solid ${theme.border}` : 'none'
      }}
    >
      <span>{initial}</span>
    </div>
  );
};
