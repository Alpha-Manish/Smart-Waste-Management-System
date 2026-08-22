import React, { useState } from 'react';
import { type ComplaintStatus } from '../data/mockComplaints';
import { Clock, AlertCircle, CheckCircle2, ChevronDown, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ComplaintStatusManagerProps {
  currentStatus: ComplaintStatus;
  onStatusChange: (status: ComplaintStatus) => void;
  disabled?: boolean;
}

export function ComplaintStatusManager({ currentStatus, onStatusChange, disabled = false }: ComplaintStatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ComplaintStatus | null>(null);

  const statusOptions: { value: ComplaintStatus; icon: React.ElementType; styles: string }[] = [
    { value: 'Pending', icon: Clock, styles: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'In Progress', icon: AlertCircle, styles: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Resolved', icon: CheckCircle2, styles: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  const currentOption = statusOptions.find(o => o.value === currentStatus) || statusOptions[0];
  const CurrentIcon = currentOption.icon;

  const handleSelect = (status: ComplaintStatus) => {
    if (status === currentStatus) {
      setIsOpen(false);
      return;
    }
    setPendingStatus(status);
    setIsOpen(false);
  };

  const confirmUpdate = () => {
    if (pendingStatus) {
      onStatusChange(pendingStatus);
      setPendingStatus(null);
    }
  };

  const cancelUpdate = () => {
    setPendingStatus(null);
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer hover:shadow-sm transition-all outline-none focus:ring-2 focus:ring-offset-1",
            currentOption.styles,
            currentStatus === 'Pending' ? 'focus:ring-amber-500' : currentStatus === 'In Progress' ? 'focus:ring-blue-500' : 'focus:ring-emerald-500',
            disabled && "opacity-60 cursor-not-allowed"
          )}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <CurrentIcon className="w-3.5 h-3.5" />
          {currentStatus}
          {!disabled && <ChevronDown className={cn("w-3.5 h-3.5 ml-1 transition-transform", isOpen && "rotate-180")} />}
        </button>

        {isOpen && !disabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 sm:left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 overflow-hidden transform opacity-100 scale-100 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
              {statusOptions.map(option => {
                const Icon = option.icon;
                const isSelected = currentStatus === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    disabled={isSelected}
                    className={cn(
                      "w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors",
                      isSelected 
                        ? "text-slate-400 bg-slate-50 cursor-default" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      option.value === 'Pending' ? 'bg-amber-100 text-amber-600' :
                      option.value === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-emerald-100 text-emerald-600',
                      isSelected && "opacity-50 grayscale"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{option.value}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modern Confirmation Modal */}
      {pendingStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={cancelUpdate} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Status Update</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                You are about to change this complaint's status to <span className="font-bold text-slate-800">{pendingStatus}</span>. This action will notify relevant personnel.
              </p>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button 
                  onClick={cancelUpdate}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmUpdate}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
                >
                  Yes, Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
