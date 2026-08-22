import React from 'react';

export interface FillLevelProgressProps {
  percentage: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'bar-only';
  animated?: boolean;
}

export function getFillColor(percentage: number): string {
  if (percentage <= 25) return 'bg-emerald-500';
  if (percentage <= 60) return 'bg-blue-500';
  if (percentage <= 85) return 'bg-orange-500';
  return 'bg-red-500';
}

export function FillLevelProgress({ 
  percentage, 
  className = '', 
  size = 'md',
  variant = 'inline',
  animated = true
}: FillLevelProgressProps) {
  const fillColor = getFillColor(percentage);
  
  let heightClass = 'h-2';
  let textClass = 'text-sm w-9';
  
  if (size === 'sm') {
    heightClass = 'h-1.5';
    textClass = 'text-xs w-8';
  } else if (size === 'lg') {
    heightClass = 'h-6';
    textClass = 'text-base w-12';
  }

  const progressBar = (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ${heightClass} ${variant === 'bar-only' ? className : ''}`}>
      <div 
        className={`h-full rounded-full transition-all ease-out relative ${fillColor} ${animated ? 'duration-1000' : 'duration-0'}`}
        style={{ width: `${percentage}%` }}
      >
        {size === 'lg' && animated && (
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        )}
      </div>
    </div>
  );

  if (variant === 'bar-only') {
    return progressBar;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {progressBar}
      <span className={`font-medium text-slate-700 shrink-0 ${textClass}`}>
        {percentage}%
      </span>
    </div>
  );
}
