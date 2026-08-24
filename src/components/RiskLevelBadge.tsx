import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskLevelBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskLevelBadge({ level, className }: RiskLevelBadgeProps) {
  const styles: Record<RiskLevel, string> = {
    Low: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-rose-100 text-rose-700',
    Critical: 'bg-red-100 text-red-800',
  };

  return (
    <span 
      className={cn(
        "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center",
        styles[level] || styles.Low,
        className
      )}
    >
      {level}
    </span>
  );
}
