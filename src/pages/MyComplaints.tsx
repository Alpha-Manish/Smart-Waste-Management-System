import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Filter, Clock, CheckCircle2, AlertCircle, FileWarning, MapPin, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Complaint, type ComplaintStatus, MOCK_COMPLAINTS } from '../data/mockComplaints';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Data is now imported from ../data/mockComplaints

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

export default function MyComplaints() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');

  const filteredComplaints = useMemo(() => {
    return MOCK_COMPLAINTS.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <PageHeader 
        title="My Complaints" 
        description="Track the status and history of the issues you've reported." 
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, ID, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'All')}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm text-slate-900 shadow-sm appearance-none transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint.id} 
              onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
            >
              {complaint.imageUrl ? (
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={complaint.imageUrl} 
                    alt={complaint.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>
              ) : null}
              <div className="p-5 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{complaint.id}</span>
                  {!complaint.imageUrl && <StatusBadge status={complaint.status} />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                  {complaint.title}
                </h3>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <FileWarning className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{complaint.issueType}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{complaint.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-5 py-3 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(complaint.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <button 
                  onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No complaints found"
          description="We couldn't find any complaints matching your current search and filter criteria. Try adjusting your filters."
          action={
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          }
        />
      )}
    </div>
  );
}
