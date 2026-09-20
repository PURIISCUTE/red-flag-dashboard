import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const containerSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-[11px] px-2 py-0.5'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Visual Institutional Mark */}
      <div className="relative group">
        <div
          className={`${containerSizes[size]} bg-gradient-to-br from-[#260e14] via-[#1a0b10] to-[#0c0508] border border-[#FF4D4D]/60 flex items-center justify-center text-[#FF4D4D] shadow-[0_0_16px_rgba(255,77,77,0.35)] relative overflow-hidden transition-transform duration-200 group-hover:scale-105`}
        >
          {/* Subtle Corner Accent */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF4D4D]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF4D4D]"></div>
          
          <ShieldAlert className={`${iconSizes[size]} text-[#FF4D4D] drop-shadow-[0_0_8px_rgba(255,77,77,0.6)]`} />
        </div>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-mono ${textSizes[size]} font-extrabold text-white tracking-wider`}>
            REDFLAG<span className="text-[#FF4D4D]">TERMINAL</span>
          </span>
          <span
            className={`${badgeSizes[size]} bg-[#FF4D4D]/15 border border-[#FF4D4D]/50 text-[#FF4D4D] font-mono font-bold uppercase tracking-wider`}
          >
            ENTERPRISE
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-[#94a3b8] font-mono tracking-tight mt-1">
            SEC EDGAR Financial Forensics &amp; Governance Engine
          </span>
        )}
      </div>
    </div>
  );
};
