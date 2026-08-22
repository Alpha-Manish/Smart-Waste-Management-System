import { FileWarning, Clock, CheckCircle, Trash2, TrendingUp, Users, AlertTriangle, BatteryMedium, CheckCircle2 } from 'lucide-react';
import { mockBins } from '../data/mockBins';
import { getStatusFromPercentage } from '../components/BinStatus';

const adminStats = [
  {
    title: 'Total Complaints',
    value: '1,284',
    icon: FileWarning,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    trend: '+12% vs last month',
    trendUp: true,
  },
  {
    title: 'Pending Complaints',
    value: '42',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    trend: '-5% vs last month',
    trendUp: false,
  },
  {
    title: 'Resolved Complaints',
    value: '1,242',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    trend: '96.7% resolution rate',
    trendUp: true,
  },
  {
    title: 'Total Bins',
    value: '8,459',
    icon: Trash2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: '+120 new deployed',
    trendUp: true,
  }
];

export default function AdminDashboard() {
  const totalBins = mockBins.length;
  const fullBins = mockBins.filter(b => getStatusFromPercentage(b.fillPercentage) === 'Full').length;
  const almostFullBins = mockBins.filter(b => getStatusFromPercentage(b.fillPercentage) === 'Almost Full').length;
  const emptyBins = mockBins.filter(b => getStatusFromPercentage(b.fillPercentage) === 'Empty').length;

  const binStats = [
    {
      title: 'Total Smart Bins',
      value: totalBins,
      icon: Trash2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'Active tracking',
      trendUp: true,
    },
    {
      title: 'Full Bins',
      value: fullBins,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: 'Needs collection',
      trendUp: false,
    },
    {
      title: 'Almost Full',
      value: almostFullBins,
      icon: BatteryMedium,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: 'Schedule soon',
      trendUp: false,
    },
    {
      title: 'Empty Bins',
      value: emptyBins,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'Optimal state',
      trendUp: true,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">System Overview</h1>
          <p className="text-slate-600 mt-2">Real-time metrics for city-wide waste management operations.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
              
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <h3 className="text-slate-500 font-medium mt-1 mb-4">{stat.title}</h3>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-md font-semibold ${stat.trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bin Monitoring Stats Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-teal-600" />
          Live Bin Monitoring
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {binStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-black text-slate-800">{stat.value}</span>
                </div>
                
                <div>
                  <h3 className="text-slate-600 font-bold">{stat.title}</h3>
                  <div className="mt-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${stat.trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map / Chart Placeholders */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Collection Efficiency</h2>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-teal-500">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
            <div className="text-center text-slate-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Chart Visualization Placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Active Personnel</h2>
          <div className="flex-1 flex flex-col gap-4">
            {[
              { name: 'Fleet Drivers', count: 142, total: 150, color: 'bg-blue-500' },
              { name: 'Maintenance Crew', count: 28, total: 35, color: 'bg-amber-500' },
              { name: 'System Admins', count: 8, total: 8, color: 'bg-emerald-500' },
            ].map((team, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    {team.name}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{team.count}/{team.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`${team.color} h-2 rounded-full`} 
                    style={{ width: `${(team.count / team.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure BarChart3 is imported since it's used in the placeholder
import { BarChart3 } from 'lucide-react';
