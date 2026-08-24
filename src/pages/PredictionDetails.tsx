import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Trash2, 
  BrainCircuit, 
  AlertTriangle, 
  Battery, 
  Clock, 
  TrendingUp, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { RiskLevelBadge } from '../components/RiskLevelBadge';
import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const mockTrendData = [
  { time: '00:00', historical: 25, predicted: null },
  { time: '04:00', historical: 35, predicted: null },
  { time: '08:00', historical: 45, predicted: null },
  { time: '12:00', historical: 58, predicted: null },
  { time: '16:00', historical: 70, predicted: 70 }, // Connection point
  { time: '20:00', historical: null, predicted: 85 },
  { time: '24:00', historical: null, predicted: 100 },
];

const mockRecommendations = [
  {
    id: 1,
    type: 'schedule',
    title: "Schedule Emergency Pickup",
    description: "Bin is projected to overflow within 8 hours during peak pedestrian traffic.",
    impact: "Prevents littering in high-traffic zone",
    confidence: 96
  },
  {
    id: 2,
    type: 'capacity',
    title: "Deploy Additional Bin",
    description: "Historical data indicates this bin overflows twice weekly. Adding a secondary bin is recommended.",
    impact: "Long-term capacity resolution",
    confidence: 89
  }
];

export default function PredictionDetails() {
  const { id } = useParams();

  // Mock data for the specific bin
  const binId = id || "BIN-089";
  const binName = "Downtown Central Plaza";
  const location = "Sector 4, Central District";
  const currentFill = 70;
  const predictedFullDate = "Today, 24:00";
  const riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' = "Critical";
  const lastCollected = "Yesterday, 14:30";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/predictions" 
            className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Prediction Details: {binId}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <RiskLevelBadge level={riskLevel} />
              <span className="text-slate-500 text-sm">Detailed AI forecast and metrics</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Pickup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bin Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-slate-400" />
              Bin Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name & Location</label>
                <div className="mt-1 font-medium text-slate-800">{binName}</div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Status</label>
                <div className="flex items-end gap-3 mt-2">
                  <span className="text-4xl font-bold text-slate-800">{currentFill}%</span>
                  <span className="text-sm font-medium text-slate-500 mb-1">Filled</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${currentFill}%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</label>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Last Collected
                  </span>
                  <span className="font-medium text-slate-800">{lastCollected}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-rose-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-rose-800">Overflow Alert</h2>
                <p className="text-rose-600/80 text-sm mt-1">
                  This bin is projected to reach 100% capacity at:
                </p>
                <div className="text-2xl font-black text-rose-700 mt-2">
                  {predictedFullDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Graph & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Prediction Graph */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Fill Level Forecast
                </h2>
                <p className="text-sm text-slate-500">24-hour historical and projected trajectory</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <div className="w-3 h-0.5 bg-slate-400"></div> Historical
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <div className="w-3 h-0.5 bg-indigo-500 border-t border-dashed"></div> Predicted
                </div>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '100% Capacity', fill: '#ef4444', fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="historical" 
                    stroke="#94a3b8" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    name="Historical Fill %" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    strokeDasharray="5 5" 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    name="Predicted Fill %" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-500" />
              Targeted AI Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {rec.title}
                    </h3>
                    <span className="px-2 py-1 bg-white text-indigo-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm">
                      {rec.confidence}% Match
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {rec.impact}
                    </span>
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
