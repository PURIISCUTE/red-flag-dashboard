import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
  iconOnly = false
}) => {
  const iconDimensions = {
    sm: { width: 32, height: 32, viewBox: '0 0 120 120' },
    md: { width: 42, height: 42, viewBox: '0 0 120 120' },
    lg: { width: 54, height: 54, viewBox: '0 0 120 120' },
    xl: { width: 72, height: 72, viewBox: '0 0 120 120' }
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const terminalSizes = {
    sm: 'text-[9px] tracking-[0.18em]',
    md: 'text-[11px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.22em]',
    xl: 'text-sm tracking-[0.24em]'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const dim = iconDimensions[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none transition-opacity ${
        onClick ? 'cursor-pointer hover:opacity-95' : ''
      } ${className}`}
    >
      {/* Precision Caduceus + Financial Arrow + Laboratory Flask Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dim.width}
          height={dim.height}
          viewBox={dim.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* Ambient Neon Red Glow Filter */}
            <filter id={`redGlow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id={`redGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#FF3838" />
              <stop offset="100%" stopColor="#D92027" />
            </linearGradient>
          </defs>

          <g filter={`url(#redGlow-${size})`}>
            {/* 1. Caduceus Wings (Top Left and Top Right) */}
            <path
              d="M 54 28 C 42 22, 28 20, 16 28 C 22 37, 38 40, 54 36 Z"
              fill={`url(#redGrad-${size})`}
              fillOpacity="0.95"
            />
            <path
              d="M 66 28 C 78 22, 92 20, 104 28 C 98 37, 82 40, 66 36 Z"
              fill={`url(#redGrad-${size})`}
              fillOpacity="0.95"
            />

            {/* 2. Central Medical Rod (Staff of Hermes / Asclepius) */}
            <circle cx="60" cy="17" r="6" fill="#FF4D4D" />
            <line
              x1="60"
              y1="23"
              x2="60"
              y2="108"
              stroke="#FF3838"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* 3. Entwined Caduceus Serpents (S-Curves) */}
            {/* Upper loop left */}
            <path
              d="M 60 38 C 40 38, 40 52, 60 56 C 80 60, 80 74, 60 78 C 40 82, 40 96, 60 102"
              stroke="#FF3838"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Upper loop right */}
            <path
              d="M 60 38 C 80 38, 80 52, 60 56 C 40 60, 40 74, 60 78 C 80 82, 80 96, 60 102"
              stroke="#FF3838"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* 4. Ascending Financial Market Stock Chart Line with Arrow */}
            <polyline
              points="16,92 30,76 44,88 88,42"
              stroke="#FF4D4D"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Arrowhead */}
            <polygon
              points="88,34 94,48 80,48"
              fill="#FF4D4D"
              transform="rotate(45 88 42)"
            />

            {/* 5. Chemistry / Laboratory Flask (Lower Right) */}
            <g transform="translate(68, 70)">
              {/* Flask neck */}
              <line x1="16" y1="2" x2="16" y2="8" stroke="#FF4D4D" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="2" x2="22" y2="8" stroke="#FF4D4D" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="14" y1="2" x2="24" y2="2" stroke="#FF4D4D" strokeWidth="2.5" strokeLinecap="round" />
              {/* Flask body */}
              <path
                d="M 16 8 L 8 28 C 7 30, 8 32, 11 32 L 27 32 C 30 32, 31 30, 30 28 L 22 8 Z"
                stroke="#FF4D4D"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#FF3838"
                fillOpacity="0.2"
              />
              {/* Liquid level */}
              <path
                d="M 11 24 Q 19 22 27 24 L 28 29 C 28 30, 27 31, 26 31 L 12 31 C 11 31, 10 30, 10 29 Z"
                fill="#FF4D4D"
                fillOpacity="0.75"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Typography Lockup matching the user's branding */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline">
            <span className={`font-sans ${titleSizes[size]} font-bold text-white tracking-tight`}>
              RedFlag
            </span>
          </div>
          <div className={`font-sans ${terminalSizes[size]} font-bold text-white uppercase`}>
            TERMINAL
          </div>
          {showSubtitle && (
            <div className={`font-sans ${subtitleSizes[size]} text-slate-300 font-normal leading-tight mt-0.5 whitespace-nowrap`}>
              Financial Forensics for Healthcare
            </div>
          )}
        </div>
      )}
    </div>
  );
};
