import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Fingerprint, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileWarning, 
  PlusCircle, 
  List, 
  LogOut,
  MapPin,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { complaintService } from '../services/complaintService';
import { extractReporterEmail, cleanDescription } from '../utils/complaints';
import { type ComplaintStatus } from '../data/mockComplaints';

export default function CitizenProfile() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const email = user?.email || 'citizen@portal';
  const displayName = user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Citizen');
  const initials = displayName.slice(0, 2).toUpperCase();
  const userId = user?.id || 'AUTH-SESSION-LOCAL';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Active Session';
  const lastSignIn = (user as any)?.last_sign_in_at ? new Date((user as any).last_sign_in_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Just now';

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        setIsLoading(true);
        const data = await complaintService.getComplaints();
        const myReports = (data || []).map((c: any) => {
          const reporter = extractReporterEmail(c.description, c.user_email);
          const isMine = user?.email && reporter.toLowerCase() === user.email.toLowerCase();
          return {
            id: c.id,
            title: c.title || 'Untitled Complaint',
            status: c.status as ComplaintStatus,
            issueType: c.issue_type || 'General Waste',
            location: c.location || 'Local Community',
            date: c.created_at || new Date().toISOString(),
            description: cleanDescription(c.description),
            reporterEmail: reporter,
            isMine,
          };
        }).filter((c: any) => c.isMine);

        setComplaints(myReports);
      } catch (err) {
        console.error('Failed to load profile complaints:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitizenData();
  }, [user?.email]);

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 px-8 flex items-end">
          <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl translate-y-10 flex-shrink-0">
            <div className="w-full h-full bg-teal-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-inner">
              {initials}
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Active Citizen
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Authenticated citizen account linked to central municipal waste management portal.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/citizen/report"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Report Issue
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Account Identity Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Login Email
              </span>
              <p className="font-mono text-sm font-bold text-slate-800 break-all">{email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Fingerprint className="w-3.5 h-3.5 text-teal-600" />
                Unique Login ID (UID)
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 truncate" title={userId}>{userId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Registered Since
              </span>
              <p className="text-sm font-bold text-slate-800">{createdAt}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Last Active
              </span>
              <p className="text-sm font-bold text-slate-800">{lastSignIn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync with Admin Portal Notice */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-950">
              Live Synchronization with Admin Control Room
            </h3>
            <p className="text-xs text-teal-800 mt-0.5 leading-relaxed">
              Every issue submitted under your authenticated email (<span className="font-mono font-semibold">{email}</span>) is instantly tagged and reflected in the central municipal Admin Portal for verified review, dispatching, and resolution.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-teal-800 border border-teal-200 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Admin Bridge Active
          </span>
        </div>
      </div>

      {/* Stats Summary for this Specific Citizen */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Civic Contribution Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Total Filed Reports</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{isLoading ? '...' : totalComplaints}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <FileWarning className="w-3.5 h-3.5 text-indigo-500" />
              <span>Registered under your ID</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{isLoading ? '...' : pendingComplaints}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-amber-700">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Awaiting municipal review</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500">In Progress</span>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">{isLoading ? '...' : inProgressComplaints}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-blue-700">
              <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Field staff dispatched</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Resolved Issues</span>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{isLoading ? '...' : resolvedComplaints}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cleaned & completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions under this Citizen Email */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Recent Submissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Issues specifically linked to your login ID</p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <List className="w-4 h-4" />
            View Complaints List
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          </div>
        ) : complaints.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {complaints.slice(0, 5).map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{c.id}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    c.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    c.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {c.status}
                  </span>
                  <Link
                    to={`/citizen/complaints/${c.id}`}
                    className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FileWarning className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No submissions found under this account</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Any complaint you report while logged into this account will be automatically associated with your login email and ID.
            </p>
            <Link
              to="/citizen/report"
              className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              File Your First Report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
