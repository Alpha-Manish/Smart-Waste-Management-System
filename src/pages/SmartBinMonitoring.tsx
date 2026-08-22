import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Plus, MapPin, Calendar, 
  BatteryMedium, AlertTriangle, CheckCircle2,
  LayoutGrid, List, Trash2
} from 'lucide-react';
import { mockBins, type BinStatus } from '../data/mockBins';
import { BinStatusBadge, getStatusFromPercentage } from '../components/BinStatus';
import { FillLevelProgress } from '../components/FillLevelProgress';

// --- Utility ---
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SmartBinMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BinStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const filteredBins = useMemo(() => {
    return mockBins.filter(bin => {
      const matchesSearch = bin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bin.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || getStatusFromPercentage(bin.fillPercentage) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-teal-600" />
            Smart Bin Monitoring
          </h1>
          <p className="text-slate-500 mt-1">Real-time status and management of waste bins</p>
        </div>
        
        <Link to="/admin/bins/add" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm hover:shadow-md">
          <Plus className="w-5 h-5" />
          Add New Bin
        </Link>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, name or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BinStatus | 'All')}
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none transition-all cursor-pointer min-w-[160px]"
            >
              <option value="All">All Statuses</option>
              <option value="Empty">Empty</option>
              <option value="Normal">Normal</option>
              <option value="Almost Full">Almost Full</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-end md:self-auto">
          <button 
            onClick={() => setViewMode('table')}
            className={classNames(
              "p-2 rounded-lg transition-all flex items-center justify-center",
              viewMode === 'table' ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            title="Table View"
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('card')}
            className={classNames(
              "p-2 rounded-lg transition-all flex items-center justify-center",
              viewMode === 'card' ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            title="Card View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {filteredBins.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No bins found</h3>
          <p className="text-slate-500 mt-1 max-w-sm">
            We couldn't find any smart bins matching your search and filter criteria.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
            className="mt-4 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hidden md:block animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm font-medium">
                      <th className="py-4 px-6">Bin Details</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Fill Level</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Last Collected</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBins.map((bin) => (
                      <tr key={bin.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{bin.name}</span>
                            <span className="text-xs text-slate-500">{bin.id} • {bin.capacity}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {bin.location}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <FillLevelProgress percentage={bin.fillPercentage} className="w-40" />
                        </td>
                        <td className="py-4 px-6">
                          <BinStatusBadge fillPercentage={bin.fillPercentage} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {bin.lastCollectedDate}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/bins/${bin.id}`} className="text-slate-500 hover:text-teal-600 text-sm font-medium">
                              View
                            </Link>
                            <Link to={`/admin/bins/edit/${bin.id}`} className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Card View (Always visible on mobile if table is chosen, or shown if card mode is selected) */}
          {(viewMode === 'card' || (viewMode === 'table' && typeof window !== 'undefined' && window.innerWidth < 768)) && (
            <div className={classNames(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
              viewMode === 'table' ? "md:hidden" : "animate-in fade-in slide-in-from-bottom-2 duration-300"
            )}>
              {filteredBins.map((bin) => (
                <div key={bin.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
                  
                  {/* Decorative background gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50/50 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{bin.name}</h3>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {bin.id} • {bin.capacity}
                      </span>
                    </div>
                    <BinStatusBadge 
                      fillPercentage={bin.fillPercentage} 
                      className="p-2 rounded-xl" 
                      showText={false} 
                      iconClassName="w-5 h-5"
                    />
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{bin.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{bin.lastCollectedDate}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <BatteryMedium className="w-4 h-4 text-slate-400" />
                        Fill Level
                      </div>
                      <span className="text-sm font-bold text-slate-800">{bin.fillPercentage}%</span>
                    </div>
                    <FillLevelProgress percentage={bin.fillPercentage} variant="bar-only" />
                  </div>
                  
                  {/* Hover action overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/95 backdrop-blur-sm border-t border-slate-100 flex gap-2">
                    <Link to={`/admin/bins/${bin.id}`} className="flex-1 text-center bg-slate-50 text-slate-700 hover:bg-slate-100 py-2 rounded-xl text-sm font-semibold transition-colors">
                      View
                    </Link>
                    <Link to={`/admin/bins/edit/${bin.id}`} className="flex-1 text-center bg-teal-50 text-teal-700 hover:bg-teal-100 py-2 rounded-xl text-sm font-semibold transition-colors">
                      Edit
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
