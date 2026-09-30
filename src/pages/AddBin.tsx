import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Database, Percent, Save, X, ArrowLeft, AlertTriangle } from 'lucide-react';
import { binService } from '../services/binService';
import { getStatusFromPercentage } from '../components/BinStatus';

export default function AddBin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '120L',
    fillPercentage: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await binService.createBin({
        name: formData.name,
        location: formData.location,
        capacity: formData.capacity,
        fillPercentage: formData.fillPercentage,
        status: getStatusFromPercentage(formData.fillPercentage)
      });
      navigate('/admin/bins');
    } catch (err: any) {
      console.error('Error creating bin:', err);
      setError(err.message || 'Failed to create bin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fillPercentage' ? Number(value) : value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/bins')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Bin</h1>
          <p className="text-slate-500 mt-1">Register a new smart waste bin in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Trash2 className="w-5 h-5 text-teal-600" />
              Bin Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Bin Name</label>
                <div className="relative">
                  <Trash2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Downtown Main St"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. 123 Main St"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Capacity</label>
                <div className="relative">
                  <Database className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                  >
                    <option value="120L">120L</option>
                    <option value="240L">240L</option>
                    <option value="360L">360L</option>
                    <option value="1100L">1100L</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Initial Fill Percentage (%)</label>
                <div className="relative">
                  <Percent className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="fillPercentage"
                    min="0"
                    max="100"
                    required
                    value={formData.fillPercentage}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/bins')}
            className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Bin'}
          </button>
        </div>
      </form>
    </div>
  );
}
