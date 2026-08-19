import React from 'react';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton';
  text?: string;
  fullHeight?: boolean;
  count?: number;
}

export function LoadingState({ 
  type = 'spinner', 
  text = 'Loading data...', 
  fullHeight = false,
  count = 3
}: LoadingStateProps) {
  if (type === 'skeleton') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-60 animate-pulse flex flex-col">
            <div className="p-5 border-b border-slate-100 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-5 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-4 flex items-center justify-between mt-auto">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full ${fullHeight ? 'min-h-[60vh]' : 'py-12'}`}>
      <div className="relative w-12 h-12 mb-4">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">{text}</p>
    </div>
  );
}
