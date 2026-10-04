import React from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

/**
 * Professional Dashboard Card Container
 * Clean, crisp institutional styling with zero 3D distortion.
 */
export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-xl border border-slate-800 bg-slate-900 transition-all duration-150 ${className}`}
    >
      {children}
    </div>
  );
};
