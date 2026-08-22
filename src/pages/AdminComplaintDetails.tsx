import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  FileWarning, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  AlignLeft,
  Image as ImageIcon,
  User
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type ComplaintStatus, MOCK_COMPLAINTS } from '../data/mockComplaints';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const STATUS_STEPS: { status: ComplaintStatus; icon: React.ElementType }[] = [
  { status: 'Pending', icon: Clock },
  { status: 'In Progress', icon: AlertCircle },
  { status: 'Resolved', icon: CheckCircle2 },
];

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific complaint by ID
  const [complaint, setComplaint] = useState(MOCK_COMPLAINTS.find(c => c.id === id) || MOCK_COMPLAINTS[0]);

  const currentStatusIndex = STATUS_STEPS.findIndex(step => step.status === complaint.status);

  const handleUpdateStatus = (newStatus: ComplaintStatus) => {
    setComplaint(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate('/admin/complaints')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Complaints
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{complaint.id}</span>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
              complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              'bg-emerald-100 text-emerald-800 border-emerald-200'
            )}>
              {complaint.status}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{complaint.title}</h1>
        </div>
        
        {/* Admin Action Buttons */}
        <div className="flex gap-3">
          {complaint.status === 'Pending' && (
            <button 
              onClick={() => handleUpdateStatus('In Progress')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Mark In Progress
            </button>
          )}
          {complaint.status !== 'Resolved' && (
            <button 
              onClick={() => handleUpdateStatus('Resolved')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Resolved
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Image */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Display Image */}
            <div className="w-full h-64 sm:h-80 bg-slate-100 relative group">
              {complaint.imageUrl ? (
                <img 
                  src={complaint.imageUrl} 
                  alt="Complaint evidence" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No image provided</p>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <User className="w-4 h-4" />
                    Citizen Name
                  </span>
                  <p className="text-slate-900 font-medium">Anonymous Citizen</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <FileWarning className="w-4 h-4" />
                    Issue Type
                  </span>
                  <p className="text-slate-900 font-medium">{complaint.issueType}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Calendar className="w-4 h-4" />
                    Submitted Date
                  </span>
                  <p className="text-slate-900 font-medium">
                    {new Date(complaint.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <MapPin className="w-4 h-4" />
                    Location
                  </span>
                  <p className="text-slate-900 font-medium">{complaint.location}</p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-slate-100">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3">
                  <AlignLeft className="w-4 h-4" />
                  Description
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Status Timeline</h3>
            
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100" />
              
              <div className="space-y-8 relative">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const Icon = step.icon;
                  
                  // Find timeline event if it exists
                  const event = complaint.timeline?.find(e => e.status === step.status);

                  return (
                    <div key={step.status} className="flex gap-4 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border-4 border-white shadow-sm",
                        isCompleted ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="pt-3 pb-2 flex-1">
                        <p className={cn(
                          "font-bold text-sm",
                          isCurrent ? "text-teal-700" : isCompleted ? "text-slate-900" : "text-slate-400"
                        )}>
                          {step.status}
                        </p>
                        {event && (
                          <div className="mt-1">
                            <p className="text-xs font-medium text-slate-500">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
