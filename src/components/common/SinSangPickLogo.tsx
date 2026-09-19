import React from 'react';

interface SinSangPickLogoProps {
  variant?: 'symbol' | 'full' | 'image' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const SinSangPickLogo: React.FC<SinSangPickLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Size mappings
  const iconSizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeMap = {
    xs: { title: 'text-xs', sub: 'text-[8px]' },
    sm: { title: 'text-sm', sub: 'text-[9px]' },
    md: { title: 'text-[17px]', sub: 'text-[10px]' },
    lg: { title: 'text-xl', sub: 'text-xs' },
    xl: { title: 'text-2xl', sub: 'text-sm' },
  };

  // High-res Official Logo Image
  const OfficialLogoImage = (
    <div
      className={`relative shrink-0 ${iconSizeMap[size]} rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-xs border border-gray-100 p-0.5`}
    >
      <img
        src="/logo.png"
        alt="신상픽 (SinSangPick)"
        className="w-full h-full object-contain rounded-[14px]"
      />
    </div>
  );

  if (variant === 'image' || variant === 'symbol') {
    if (variant === 'symbol') {
      return <div className={`inline-flex items-center ${className}`}>{OfficialLogoImage}</div>;
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {OfficialLogoImage}
        <div className="flex flex-col text-left">
          <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
            신상픽
          </span>
          {showTagline && (
            <span className={`${textSizeMap[size].sub} font-semibold text-gray-400 tracking-wider uppercase mt-0.5`}>
              Sinsangpick
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex flex-col text-left ${className}`}>
        <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
          신상픽
        </span>
        {showTagline && (
          <span className={`${textSizeMap[size].sub} font-semibold text-gray-400 tracking-wider uppercase mt-0.5`}>
            Sinsangpick
          </span>
        )}
      </div>
    );
  }

  // Full Logo (Symbol + Typo)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {OfficialLogoImage}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
            신상픽
          </span>
        </div>
        {showTagline && (
          <span className={`${textSizeMap[size].sub} font-semibold text-amber-500 tracking-wider uppercase mt-0.5`}>
            NEW PICK
          </span>
        )}
      </div>
    </div>
  );
};
