import React from 'react';
import { Link } from 'react-router-dom';
import { type Complaint, type ComplaintStatus, MOCK_COMPLAINTS } from '../data/mockComplaints';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, FileWarning } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface RecentComplaintsProps {
  complaints?: Complaint[];
  limit?: number;
  adminRoute?: boolean;
}

export function RecentComplaints({ 
  complaints = MOCK_COMPLAINTS, 
  limit = 5,
  adminRoute = true
}: RecentComplaintsProps) {
  // Sort complaints by date (descending) and take the specified limit
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const getStatusConfig = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200' };
      case 'In Progress':
        return { icon: AlertCircle, color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' };
      case 'Resolved':
        return { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-indigo-600" />
          Recent Complaints
        </h2>
        <Link 
          to={adminRoute ? "/admin/complaints" : "/citizen/complaints"} 
          className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recentComplaints.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentComplaints.map((complaint) => {
              const statusConfig = getStatusConfig(complaint.status);
              const StatusIcon = statusConfig.icon;
              const routePrefix = adminRoute ? '/admin/complaints' : '/citizen/complaints';

              return (
                <div key={complaint.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group">
                  
                  <div className="flex items-start gap-3.5">
                    <div className={cn("mt-0.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border", statusConfig.bg)}>
                      <StatusIcon className={cn("w-4 h-4", statusConfig.color)} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-teal-700 transition-colors">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-1 text-xs font-semibold">
                        <span className={statusConfig.color}>{complaint.status}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          {new Date(complaint.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Button */}
                  <Link 
                    to={`${routePrefix}/${complaint.id}`}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-200 rounded-lg transition-colors border border-slate-200 shadow-sm flex-shrink-0"
                  >
                    View Details
                  </Link>

                  {/* Mobile Chevron */}
                  <Link 
                    to={`${routePrefix}/${complaint.id}`}
                    className="sm:hidden p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors flex-shrink-0"
                    aria-label="View Details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            No recent complaints found.
          </div>
        )}
      </div>
    </div>
  );
}
