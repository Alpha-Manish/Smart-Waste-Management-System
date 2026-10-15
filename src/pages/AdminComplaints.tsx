import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { type ComplaintStatus } from '../data/mockComplaints';
import { complaintService } from '../services/complaintService';
import { extractReporterEmail, cleanDescription } from '../utils/complaints';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileWarning,
  Edit3
} from 'lucide-react';
import { getComplaintCounts } from '../utils/analytics';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const ITEMS_PER_PAGE = 5;

const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const statusStyles = {
    'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const StatusIcon = {
    'Pending': Clock,
    'In Progress': AlertCircle,
    'Resolved': CheckCircle2,
  }[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
      statusStyles[status]
    )}>
      <StatusIcon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default function AdminComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await complaintService.getComplaints();
      const formatted = data.map((c: any) => ({
        id: c.id,
        title: c.title || 'Untitled Complaint',
        status: c.status,
        issueType: c.issue_type || 'Other',
        location: c.location,
        date: c.created_at || new Date().toISOString(),
        imageUrl: c.image_url,
        description: cleanDescription(c.description),
        reporterEmail: extractReporterEmail(c.description, c.user_email),
        timeline: []
      }));
      setComplaints(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueIssueTypes = useMemo(() => Array.from(new Set(complaints.map(c => c.issueType))), [complaints]);
  const counts = useMemo(() => getComplaintCounts(complaints), [complaints]);

  const statCards = [
    { title: 'Total Complaints', value: counts.total, icon: FileWarning, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending', value: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'In Progress', value: counts.inProgress, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Resolved', value: counts.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Filter
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          String(c.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.reporterEmail.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesIssue = issueTypeFilter === 'All' || c.issueType === issueTypeFilter;

    return matchesSearch && matchesStatus && matchesIssue;
  });


  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentComplaints = filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Status Update Handler
  const handleUpdateStatus = async (id: string | number, newStatus: ComplaintStatus) => {
    try {
      await complaintService.updateComplaintStatus(id, newStatus);
      setComplaints(prev => prev.map(c => 
        String(c.id) === String(id) ? { ...c, status: newStatus } : c
      ));
    } catch (error: any) {
      console.error('Failed to update status', error);
      alert('Failed to update status: ' + (error?.message || 'Unknown error'));
    } finally {
      setOpenDropdownId(null);
    }
  };


  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Complaints Management" 
        description="View and manage all citizen complaints across the municipality." 
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <span className="text-3xl font-black text-slate-800">{stat.value}</span>
              </div>
              <h3 className="text-slate-600 font-bold">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, title, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-400 bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:ring-teal-500 focus:border-teal-500 shadow-sm w-full sm:w-40"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={issueTypeFilter}
              onChange={(e) => {
                setIssueTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:ring-teal-500 focus:border-teal-500 shadow-sm w-full sm:w-48"
            >
              <option value="All">All Issue Types</option>
              {uniqueIssueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="text-sm font-medium text-slate-500 whitespace-nowrap">
            Total Results: <span className="text-slate-900">{filteredComplaints.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Complaint ID</th>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Reported By</th>
                <th className="px-6 py-4 font-bold">Issue Type</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
                    </div>
                  </td>
                </tr>
              ) : currentComplaints.length > 0 ? (
                currentComplaints.map((complaint, index) => {
                  const isBottomRow = index >= currentComplaints.length - 2;
                  return (
                  <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{complaint.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className="truncate max-w-[160px]" title={complaint.reporterEmail}>
                          {complaint.reporterEmail}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {complaint.issueType}
                    </td>
                    <td className="px-6 py-4">
                      <span className="line-clamp-2">{complaint.location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(complaint.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <div className="flex items-center justify-center gap-1">
                        {/* Direct Quick Edit Button */}
                        <button 
                          onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                          title="Edit Complaint"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === complaint.id ? null : complaint.id)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            openDropdownId === complaint.id 
                              ? "bg-teal-50 text-teal-600" 
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          )}
                          title="Actions & Status"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Actions Dropdown with smart upward/downward positioning */}
                      {openDropdownId === complaint.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className={cn(
                            "absolute right-6 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 text-left animate-in fade-in duration-150",
                            isBottomRow ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
                          )}>
                            <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                              Manage Complaint
                            </div>
                            
                            <button 
                              className="w-full px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 flex items-center gap-2.5 transition-colors"
                              onClick={() => {
                                navigate(`/admin/complaints/${complaint.id}`);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                              Edit & View Details
                            </button>

                            <div className="my-1.5 border-t border-slate-100" />
                            <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Update Status
                            </div>

                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'Pending')}
                              className={cn(
                                "w-full px-3.5 py-2 text-sm flex items-center justify-between transition-colors",
                                complaint.status === 'Pending' 
                                  ? "bg-amber-50 text-amber-800 font-bold" 
                                  : "text-slate-700 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span>Mark Pending</span>
                              </div>
                              {complaint.status === 'Pending' && (
                                <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-bold">Current</span>
                              )}
                            </button>

                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                              className={cn(
                                "w-full px-3.5 py-2 text-sm flex items-center justify-between transition-colors",
                                complaint.status === 'In Progress' 
                                  ? "bg-blue-50 text-blue-800 font-bold" 
                                  : "text-slate-700 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                <span>Mark In Progress</span>
                              </div>
                              {complaint.status === 'In Progress' && (
                                <span className="text-[10px] bg-blue-200/60 text-blue-900 px-1.5 py-0.5 rounded font-bold">Current</span>
                              )}
                            </button>

                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                              className={cn(
                                "w-full px-3.5 py-2 text-sm flex items-center justify-between transition-colors",
                                complaint.status === 'Resolved' 
                                  ? "bg-emerald-50 text-emerald-800 font-bold" 
                                  : "text-slate-700 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Mark Resolved</span>
                              </div>
                              {complaint.status === 'Resolved' && (
                                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded font-bold">Current</span>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );})
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No complaints found matching your search.
                  </td>

                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, filteredComplaints.length)}</span> of <span className="font-semibold text-slate-900">{filteredComplaints.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
