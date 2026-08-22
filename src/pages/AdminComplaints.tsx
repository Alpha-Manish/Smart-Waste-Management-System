import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { type Complaint, type ComplaintStatus, MOCK_COMPLAINTS } from '../data/mockComplaints';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileWarning
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
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const uniqueIssueTypes = Array.from(new Set(complaints.map(c => c.issueType)));
  const counts = getComplaintCounts(complaints);

  const statCards = [
    { title: 'Total Complaints', value: counts.total, icon: FileWarning, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending', value: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'In Progress', value: counts.inProgress, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Resolved', value: counts.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Filter
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesIssue = issueTypeFilter === 'All' || c.issueType === issueTypeFilter;

    return matchesSearch && matchesStatus && matchesIssue;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentComplaints = filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Status Update Handler
  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
    setOpenDropdownId(null);
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Complaint ID</th>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Issue Type</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentComplaints.length > 0 ? (
                currentComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{complaint.title}</div>
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
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === complaint.id ? null : complaint.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Actions Dropdown */}
                      {openDropdownId === complaint.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-10 top-10 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 text-left">
                            <button 
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => {
                                navigate(`/admin/complaints/${complaint.id}`);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                              View Details
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</div>
                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'Pending')}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4 text-amber-500" />
                              Mark Pending
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4 text-blue-500" />
                              Mark In Progress
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Mark Resolved
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
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
