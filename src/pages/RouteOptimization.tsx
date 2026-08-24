import React from 'react';
import { Truck, MapPin, Clock, CheckCircle2, AlertTriangle, TrendingUp, Map, Trash2, Route as RouteIcon, Sparkles, Zap, Info } from 'lucide-react';

const mockSummary = {
  totalBins: 245,
  collectionStops: 145,
  estimatedDistance: '42 km',
  estimatedTime: '4.5 hrs',
};

const mockStops = [
  { id: 'STP-001', stopNumber: 1, binName: 'Bin-A1', area: 'Downtown Sector A', fillPercentage: 95, priority: 'High' },
  { id: 'STP-002', stopNumber: 2, binName: 'Bin-C3', area: 'Central Market', fillPercentage: 88, priority: 'High' },
  { id: 'STP-003', stopNumber: 3, binName: 'Bin-T2', area: 'West End Tech Park', fillPercentage: 65, priority: 'Medium' },
  { id: 'STP-004', stopNumber: 4, binName: 'Bin-N1', area: 'North Hills Residential', fillPercentage: 30, priority: 'Low' },
];

const mockRecommendations = [
  { id: 'REC-1', title: 'Prioritize High-Fill Bins', description: 'Visit Bin A first due to critical fill level.', type: 'urgent' },
  { id: 'REC-2', title: 'Skip Low Priority', description: 'Skip low-priority bins to save 25 mins of travel time.', type: 'optimization' },
  { id: 'REC-3', title: 'Route Optimization', description: 'Optimize route to reduce overall travel distance by 12%.', type: 'insight' },
];

export default function RouteOptimization() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Route Optimization</h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered smart routing for waste collection</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-sm">
          <Map className="w-4 h-4" />
          View Live Map
        </button>
      </div>

      {/* 1. Route Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Bins</p>
            <p className="text-2xl font-bold text-slate-800">{mockSummary.totalBins}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Collection Stops</p>
            <p className="text-2xl font-bold text-slate-800">{mockSummary.collectionStops}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <RouteIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Est. Distance</p>
            <p className="text-2xl font-bold text-slate-800">{mockSummary.estimatedDistance}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Est. Time</p>
            <p className="text-2xl font-bold text-slate-800">{mockSummary.estimatedTime}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Collection Stops Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Current Collection Stops</h2>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500">
                  <th className="py-3 px-4 font-medium">Stop Number</th>
                  <th className="py-3 px-4 font-medium">Bin Name</th>
                  <th className="py-3 px-4 font-medium">Area</th>
                  <th className="py-3 px-4 font-medium">Fill Percentage</th>
                  <th className="py-3 px-4 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockStops.map((stop) => (
                  <tr key={stop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">#{stop.stopNumber}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{stop.binName}</td>
                    <td className="py-3 px-4 text-slate-600">{stop.area}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stop.fillPercentage > 90 ? 'bg-red-500' : stop.fillPercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stop.fillPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{stop.fillPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {stop.priority === 'High' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <AlertTriangle className="w-3 h-3" /> High
                        </span>
                      )}
                      {stop.priority === 'Medium' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <AlertTriangle className="w-3 h-3" /> Medium
                        </span>
                      )}
                      {stop.priority === 'Low' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* 3. Route Recommendations */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg border border-indigo-800/50 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">AI Routing Insights</h2>
              </div>
              <div className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <div className={`mt-0.5 shrink-0 p-2 rounded-lg ${
                      rec.type === 'urgent' ? 'bg-red-500/20 text-red-400' : 
                      rec.type === 'optimization' ? 'bg-emerald-500/20 text-emerald-400' : 
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {rec.type === 'urgent' ? <AlertTriangle className="w-4 h-4" /> : 
                       rec.type === 'optimization' ? <Zap className="w-4 h-4" /> : 
                       <Info className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {rec.title}
                      </h3>
                      <p className="text-xs mt-1.5 text-indigo-200 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Route Statistics */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Daily Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Fuel Saved</span>
                  <span className="font-medium text-slate-800">42 Liters</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Distance Reduced</span>
                  <span className="font-medium text-slate-800">18 km</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">On-Time Rate</span>
                  <span className="font-medium text-slate-800">94%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
