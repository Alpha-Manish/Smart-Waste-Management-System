import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  MapPin,
  Calendar,
  Zap,
  Search,
  Bell
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { RiskLevelBadge, type RiskLevel } from '../components/RiskLevelBadge';

// Mock Data
const predictionSummary = [
  {
    title: "Total Bins Analyzed",
    value: "1,248",
    trend: "+24",
    isPositive: true,
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "High Risk Bins",
    value: "12",
    trend: "-3",
    isPositive: true,
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Predicted Overflows",
    value: "4",
    trend: "-1",
    isPositive: true,
    icon: TrendingUp,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    title: "Collection Alerts",
    value: "28",
    trend: "+5",
    isPositive: false,
    icon: Bell,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  }
];

const predictionTrendData = [
  { day: 'Mon', historical: 65, predicted: null },
  { day: 'Tue', historical: 72, predicted: null },
  { day: 'Wed', historical: 68, predicted: null },
  { day: 'Thu', historical: 85, predicted: null },
  { day: 'Fri', historical: 78, predicted: 78 }, // Connection point
  { day: 'Sat', historical: null, predicted: 92 },
  { day: 'Sun', historical: null, predicted: 88 },
];

type HighRiskBin = {
  id: string;
  location: string;
  currentFill: number;
  predictedFill: number;
  riskLevel: RiskLevel;
  riskScore: number; // For sorting
};

const highRiskBins: HighRiskBin[] = [
  { id: "BIN-089", location: "Downtown Central Plaza", currentFill: 88, predictedFill: 100, riskLevel: "Critical", riskScore: 98 },
  { id: "BIN-142", location: "Westside Tech Park", currentFill: 82, predictedFill: 95, riskLevel: "High", riskScore: 85 },
  { id: "BIN-055", location: "North Station", currentFill: 75, predictedFill: 90, riskLevel: "High", riskScore: 78 },
  { id: "BIN-012", location: "South Market", currentFill: 65, predictedFill: 80, riskLevel: "Medium", riskScore: 65 },
].sort((a, b) => b.riskScore - a.riskScore);

const aiRecommendations = [
  {
    id: 1,
    type: 'schedule',
    title: "Schedule collection for Bin A tomorrow",
    description: "Bin A is accumulating waste faster than expected. Scheduling a pickup tomorrow will prevent overflow.",
    impact: "Prevents 1 overflow event",
    confidence: 92
  },
  {
    id: 2,
    type: 'alert',
    title: "Bin B likely to overflow within 24 hours",
    description: "Current fill rate suggests Bin B will reach 100% capacity by 2:00 PM tomorrow.",
    impact: "High risk of littering",
    confidence: 88
  },
  {
    id: 3,
    type: 'monitoring',
    title: "Area X requires additional monitoring",
    description: "Unusual spike in waste generation detected in Area X over the last 3 days.",
    impact: "Improves resource allocation",
    confidence: 75
  }
];

type PredictionTableRow = {
  id: string;
  name: string;
  currentFill: number;
  predictedFill: number;
  predictedFullDate: string;
  risk: RiskLevel;
};

const predictionTable: PredictionTableRow[] = [
  { id: "BIN-001", name: "Central Station Alpha", currentFill: 45, predictedFill: 85, predictedFullDate: "Tomorrow, 10:00 AM", risk: "Medium" },
  { id: "BIN-002", name: "Market Square North", currentFill: 20, predictedFill: 35, predictedFullDate: "Oct 12, 02:00 PM", risk: "Low" },
  { id: "BIN-003", name: "Industrial Zone B", currentFill: 80, predictedFill: 98, predictedFullDate: "Today, 4:00 PM", risk: "High" },
  { id: "BIN-004", name: "University Campus East", currentFill: 60, predictedFill: 90, predictedFullDate: "Today, 8:00 PM", risk: "High" },
  { id: "BIN-005", name: "City Mall Entrance", currentFill: 10, predictedFill: 15, predictedFullDate: "Oct 15, 09:00 AM", risk: "Low" },
];


export default function AIPredictions() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            AI Predictions & Insights
          </h1>
          <p className="text-slate-500 mt-1">Machine learning powered forecasting and recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-indigo-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Model Status: Active
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4" />
            Next 24 Hours
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {predictionSummary.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -z-10 transition-transform group-hover:scale-110`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Prediction Trend Chart</h2>
              <p className="text-sm text-slate-500">7-Day Historical vs Predicted Fill Levels</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="#64748b" 
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

        {/* High Risk Bins */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              High Risk Bins
            </h2>
          </div>
          <div className="flex-1 space-y-4">
            {highRiskBins.map((bin) => (
              <div key={bin.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  bin.riskLevel === 'Critical' ? 'bg-red-500' :
                  bin.riskLevel === 'High' ? 'bg-rose-500' :
                  bin.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div>
                    <span className="font-bold text-slate-800 block">{bin.id}</span>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5 gap-1">
                      <MapPin className="w-3 h-3" />
                      {bin.location}
                    </div>
                  </div>
                  <RiskLevelBadge level={bin.riskLevel} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pl-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Current</span>
                      <span className="font-bold text-slate-700">{bin.currentFill}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: `${bin.currentFill}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Predicted</span>
                      <span className="font-bold text-rose-600">{bin.predictedFill}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${bin.predictedFill}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
            View All Risks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              AI Recommendations
            </h2>
          </div>
          <div className="space-y-4">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{rec.title}</h3>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                    {rec.confidence}% Match
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Impact: {rec.impact}
                  </span>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Fill Level Predictions</h2>
              <p className="text-sm text-slate-500">Next 24 hours bin status forecast</p>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Export Report
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Bin ID</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Bin Name</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Current Fill %</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Predicted Fill %</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Predicted Full Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-500">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {predictionTable.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => navigate(`/admin/predictions/${row.id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{row.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-sm">{row.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.currentFill > 75 ? 'bg-rose-500' : row.currentFill > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${row.currentFill}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{row.currentFill}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.predictedFill > 85 ? 'bg-rose-500' : row.predictedFill > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${row.predictedFill}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{row.predictedFill}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-sm font-medium">{row.predictedFullDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskLevelBadge level={row.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
