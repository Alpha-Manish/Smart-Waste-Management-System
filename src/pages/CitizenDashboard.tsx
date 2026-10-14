import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileWarning, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ListFilter, 
  ShieldCheck, 
  Mail, 
  Calendar,
  MapPin, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { complaintService } from '../services/complaintService';
import { extractReporterEmail, cleanDescription } from '../utils/complaints';
import { type ComplaintStatus } from '../data/mockComplaints';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const email = user?.email || 'citizen@portal';
  const displayName = user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Citizen');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await complaintService.getComplaints();
        
        // Match complaints reported by this user or format all complaints
        const formatted = (data || []).map((c: any) => {
          const reporter = extractReporterEmail(c.description, c.user_email);
          const isMyComplaint = user?.email && reporter.toLowerCase() === user.email.toLowerCase();
          return {
            id: c.id,
            title: c.title || 'Untitled Issue',
            status: c.status as ComplaintStatus,
            issueType: c.issue_type || 'General Waste',
            location: c.location || 'Local Area',
            date: c.created_at || new Date().toISOString(),
            description: cleanDescription(c.description),
            reporterEmail: reporter,
            isMyComplaint,
          };
        });

        setComplaints(formatted);
      } catch (err) {
        console.error('Failed to load citizen dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.email]);

  // If user has specific complaints, calculate based on user's complaints; otherwise municipality-wide
  const userComplaints = complaints.filter(c => c.isMyComplaint);
  const relevantComplaints = userComplaints.length > 0 ? userComplaints : complaints;

  const totalCount = relevantComplaints.length;
  const pendingCount = relevantComplaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = relevantComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = relevantComplaints.filter(c => c.status === 'Resolved').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  const recentList = relevantComplaints.slice(0, 5);

  const statusStyles: Record<string, { bg: string, text: string, border: string, icon: any }> = {
    'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
    'In Progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: AlertCircle },
    'Resolved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile & Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-teal-100 mb-4 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified Citizen Account
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight capitalize">
              Welcome back, {displayName}!
            </h1>
            <p className="text-teal-100 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              Track real-time resolution of waste reports in your neighborhood and contribute to a cleaner, greener community.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-teal-100">
              <span className="flex items-center gap-1.5 font-mono">
                <Mail className="w-4 h-4 text-teal-300" />
                {email}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                System Active & Synchronized
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              to="/citizen/report"
              className="bg-white text-teal-800 hover:bg-teal-50 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-teal-600" />
              Report Issue Now
            </Link>
            <Link
              to="/citizen/complaints"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-5 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <ListFilter className="w-5 h-5" />
              My Complaints
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileWarning className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              Live Total
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLoading ? '...' : totalCount}
          </p>
          <h3 className="text-sm font-medium text-slate-500 mt-1">Total Reported Issues</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
              Pending
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLoading ? '...' : pendingCount}
          </p>
          <h3 className="text-sm font-medium text-slate-500 mt-1">Awaiting Review</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              In Progress
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLoading ? '...' : inProgressCount}
          </p>
          <h3 className="text-sm font-medium text-slate-500 mt-1">Being Addressed</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              {resolutionRate}% Rate
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLoading ? '...' : resolvedCount}
          </p>
          <h3 className="text-sm font-medium text-slate-500 mt-1">Resolved Successfully</h3>
        </div>
      </div>

      {/* Main Content: Recent Complaints & Civic Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Complaints</h2>
              <p className="text-xs text-slate-500 mt-1">Real-time status updates of your submitted reports</p>
            </div>
            <Link 
              to="/citizen/complaints"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
          ) : recentList.length > 0 ? (
            <div className="space-y-4">
              {recentList.map((complaint) => {
                const conf = statusStyles[complaint.status] || statusStyles['Pending'];
                const StatusIcon = conf.icon;
                return (
                  <div
                    key={complaint.id}
                    onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">#{complaint.id}</span>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                          {complaint.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {complaint.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(complaint.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                        conf.bg, conf.text, conf.border
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileWarning className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No issues reported yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Keep your neighborhood clean by reporting overflowing dustbins or missed waste pickups.
              </p>
              <Link
                to="/citizen/report"
                className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Report First Issue
              </Link>
            </div>
          )}
        </div>

        {/* Civic Impact & Quick Help Sidebar Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart City Impact</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your reports feed directly into the central municipal control panel. Municipal route optimization units use AI to schedule collections and prevent waste overflow.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between items-center font-medium">
                <span>Avg. Response Time:</span>
                <span className="font-bold text-teal-700">~24-48 Hours</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span>Direct Admin Link:</span>
                <span className="font-bold text-emerald-700">Synchronized</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
            <h4 className="font-bold text-base mb-2">Need Direct Assistance?</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              For emergency sanitation issues or hazardous material spills, reach out directly to municipal dispatch.
            </p>
            <div className="text-xs font-mono text-teal-300 bg-white/10 p-2.5 rounded-lg border border-white/10">
              Helpline: 1800-CITY-CLEAN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
