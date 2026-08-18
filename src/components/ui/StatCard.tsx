
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = 'text-teal-600',
  bgColor = 'bg-teal-50',
  trend,
  trendUp,
  className = '',
}: StatCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        {trend && trendUp === undefined && (
          <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
        <h3 className="text-slate-500 font-medium mt-1 mb-4">{title}</h3>
        
        {trend && trendUp !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-md font-semibold ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
