import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Trash2, MapPin, Database, Calendar, AlertCircle, 
  ArrowLeft, BatteryMedium, CheckCircle2, AlertTriangle, 
  History, Clock, Truck, Edit
} from 'lucide-react';
import { mockBins, type SmartBin, type BinStatus } from '../data/mockBins';
import { BinStatusBadge } from '../components/BinStatus';
import { FillLevelProgress } from '../components/FillLevelProgress';

// Mock history data specific to a bin
const mockHistory = [
  { id: 1, date: '2023-10-15', time: '08:30 AM', truck: 'Truck-04', action: 'Waste Collected', by: 'Driver Smith' },
  { id: 2, date: '2023-10-14', time: '02:15 PM', truck: 'Maintenance', action: 'Sensor Cleaned', by: 'Tech Team A' },
  { id: 3, date: '2023-10-10', time: '09:00 AM', truck: 'Truck-02', action: 'Waste Collected', by: 'Driver Jones' },
];

export default function BinDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [bin, setBin] = useState<SmartBin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      const foundBin = mockBins.find(b => b.id === id);
      setBin(foundBin || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!bin) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-2xl mx-auto mt-12">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Bin Not Found</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          The smart bin with ID "{id}" could not be found in our records.
        </p>
        <button 
          onClick={() => navigate('/admin/bins')}
          className="mt-6 bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          Return to Bin Monitoring
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/bins')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {bin.name}
              <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{bin.id}</span>
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {bin.location}
            </p>
          </div>
        </div>

        <Link 
          to={`/admin/bins/edit/${bin.id}`}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Bin
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Status & Level */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50/50 to-transparent rounded-bl-full -z-10" />
            
            <h3 className="text-slate-500 font-semibold text-sm mb-4">Current Status</h3>
            <div className="flex flex-col gap-4">
              <BinStatusBadge fillPercentage={bin.fillPercentage} size="lg" />
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <Database className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Capacity</p>
                    <p className="font-semibold text-slate-700">{bin.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Last Collected</p>
                    <p className="font-semibold text-slate-700">{bin.lastCollectedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fill Level Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-800 font-bold flex items-center gap-2">
                <BatteryMedium className="w-5 h-5 text-teal-600" />
                Fill Level
              </h3>
              <span className="text-2xl font-black text-slate-800">{bin.fillPercentage}%</span>
            </div>

            <FillLevelProgress percentage={bin.fillPercentage} size="lg" variant="bar-only" />
            
            <div className="flex justify-between mt-3 text-xs font-semibold text-slate-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Collection History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <History className="w-5 h-5 text-teal-600" />
              Recent Activity & Collection History
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {mockHistory.map((item, index) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {item.action.includes('Cleaned') ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Truck className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800">{item.action}</h4>
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      <span className="font-medium text-slate-700">{item.by}</span> using <span className="font-medium text-slate-700">{item.truck}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm transition-colors">
                Load More History
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
