import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export type StatusType = 'Empty' | 'Normal' | 'Almost Full' | 'Full';

export interface BinStatusProps {
  fillPercentage: number;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function getStatusFromPercentage(percentage: number): StatusType {
  if (percentage <= 25) return 'Empty';
  if (percentage <= 60) return 'Normal';
  if (percentage <= 85) return 'Almost Full';
  return 'Full';
}

export function getStatusColor(status: StatusType): string {
  switch (status) {
    case 'Empty': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Almost Full': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Full': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getStatusIcon(status: StatusType, className = "w-4 h-4") {
  switch (status) {
    case 'Empty': return <CheckCircle2 className={className} />;
    case 'Normal': return <CheckCircle2 className={className} />;
    case 'Almost Full': return <AlertTriangle className={className} />;
    case 'Full': return <AlertTriangle className={className} />;
    default: return <CheckCircle2 className={className} />;
  }
}

export function BinStatusBadge({ 
  fillPercentage, 
  className = '', 
  iconClassName,
  showText = true, 
  showIcon = true,
  size = 'sm'
}: BinStatusProps) {
  const status = getStatusFromPercentage(fillPercentage);
  const colorClass = getStatusColor(status);
  
  // Size variations
  let sizeClasses = '';
  let defaultIconSize = '';
  
  switch (size) {
    case 'lg':
      sizeClasses = 'px-4 py-2 rounded-xl text-lg font-bold';
      defaultIconSize = 'w-5 h-5';
      break;
    case 'md':
      sizeClasses = 'px-3 py-1.5 rounded-lg text-sm font-semibold';
      defaultIconSize = 'w-4 h-4';
      break;
    case 'sm':
    default:
      sizeClasses = 'px-2.5 py-1 rounded-full text-xs font-semibold';
      defaultIconSize = 'w-4 h-4';
      break;
  }

  const finalIconClass = iconClassName || defaultIconSize;

  return (
    <span className={`inline-flex items-center justify-center gap-1.5 border ${sizeClasses} ${colorClass} ${className}`} title={status}>
      {showIcon && getStatusIcon(status, finalIconClass)}
      {showText && status}
    </span>
  );
}
