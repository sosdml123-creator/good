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

  // High-res 3D Image Logo
  if (variant === 'image') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src="/logo.png"
          alt="신상픽 (SinSangPick)"
          className={`${iconSizeMap[size]} rounded-2xl object-cover shadow-md shadow-blue-500/20 border border-white/20`}
        />
        <div className="flex flex-col text-left">
          <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
            신상픽
          </span>
          {showTagline && (
            <span className={`${textSizeMap[size].sub} font-bold text-[#0066FF] tracking-wider uppercase mt-0.5`}>
              Sinsangpick
            </span>
          )}
        </div>
      </div>
    );
  }

  // Crisp Vector 'N' Symbol (Scalable SVG)
  const VectorSymbol = (
    <div
      className={`relative shrink-0 ${iconSizeMap[size]} rounded-2xl bg-gradient-to-tr from-[#0066FF] via-[#007BFF] to-[#00C6FF] flex items-center justify-center p-1.5 shadow-md shadow-blue-500/25 border border-white/30`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="nStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E0F2FE" />
          </linearGradient>
          <linearGradient id="checkGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="100%" stop-color="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Dynamic 'N' shape representing NEW + PICK */}
        {/* Left vertical bar */}
        <path
          d="M26 78V26C26 23.8 27.8 22 30 22C32.2 22 34 23.8 34 26V78C34 80.2 32.2 82 30 82C27.8 82 26 80.2 26 78Z"
          fill="url(#nStroke)"
        />

        {/* Diagonal bridge flowing into upward pick */}
        <path
          d="M32 30L68 70C69.5 71.7 72 71.7 73.5 70L74 69.5V26C74 23.8 75.8 22 78 22C80.2 22 82 23.8 82 26V76C82 78.5 79.5 80.5 77 79.5C75 78.7 73.5 77.2 72 75.5L34 33.5V30H32Z"
          fill="url(#nStroke)"
        />

        {/* Vibrant Pick Arrow check accent */}
        <path
          d="M44 56L58 70L86 38"
          stroke="url(#checkGlow)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Sparkle Star on upper right */}
        <path
          d="M78 12C78 17 83 20 88 20C83 20 78 23 78 28C78 23 73 20 68 20C73 20 78 17 78 12Z"
          fill="#FFFFFF"
        />
        <circle cx="78" cy="20" r="1.5" fill="#38BDF8" />
      </svg>
    </div>
  );

  if (variant === 'symbol') {
    return <div className={`inline-flex items-center ${className}`}>{VectorSymbol}</div>;
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex flex-col text-left ${className}`}>
        <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
          신상픽
        </span>
        {showTagline && (
          <span className={`${textSizeMap[size].sub} font-bold text-[#0066FF] tracking-wider uppercase mt-0.5`}>
            Sinsangpick
          </span>
        )}
      </div>
    );
  }

  // Full Logo (Symbol + Typo)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {VectorSymbol}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className={`${textSizeMap[size].title} font-black tracking-tight text-gray-900 leading-none`}>
            신상픽
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]"></span>
        </div>
        {showTagline && (
          <span className={`${textSizeMap[size].sub} font-bold text-[#0066FF] tracking-wider uppercase mt-0.5`}>
            NEW PICK
          </span>
        )}
      </div>
    </div>
  );
};
