import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, AlertTriangle, 
  Trash2, CheckCircle2, FileWarning, Calendar, Filter, Clock, BatteryMedium,
  MapPin, Lightbulb, Activity, CheckCircle, Flame
} from 'lucide-react';
import { mockBins } from '../data/mockBins';

// Mock Data
const overviewStats = [
  { title: 'Total Complaints', value: '1,284', trend: '+12%', isUp: true, icon: FileWarning, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Resolved Complaints', value: '892', trend: '+8%', isUp: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Pending Complaints', value: '142', trend: '-5%', isUp: false, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Total Bins', value: '8,459', trend: '+1.5%', isUp: true, icon: Trash2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Full Bins', value: '234', trend: '-12%', isUp: false, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { title: 'Almost Full Bins', value: '456', trend: '+3%', isUp: true, icon: BatteryMedium, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const complaintData = [
  { name: 'Jan', Resolved: 400, Pending: 240, New: 150 },
  { name: 'Feb', Resolved: 300, Pending: 139, New: 220 },
  { name: 'Mar', Resolved: 200, Pending: 980, New: 120 },
  { name: 'Apr', Resolved: 278, Pending: 390, New: 250 },
  { name: 'May', Resolved: 189, Pending: 480, New: 210 },
  { name: 'Jun', Resolved: 239, Pending: 380, New: 190 },
];

const complaintTrendData = [
  { name: 'Jan', Submitted: 120 },
  { name: 'Feb', Submitted: 150 },
  { name: 'Mar', Submitted: 180 },
  { name: 'Apr', Submitted: 130 },
  { name: 'May', Submitted: 210 },
  { name: 'Jun', Submitted: 250 },
  { name: 'Jul', Submitted: 220 },
  { name: 'Aug', Submitted: 190 },
  { name: 'Sep', Submitted: 260 },
  { name: 'Oct', Submitted: 280 },
  { name: 'Nov', Submitted: 310 },
  { name: 'Dec', Submitted: 290 },
];

const areaComplaintsData = [
  { area: 'Downtown / Sec 1', Complaints: 142 },
  { area: 'North Park / Sec 4', Complaints: 98 },
  { area: 'Industrial / Zone B', Complaints: 86 },
  { area: 'University District', Complaints: 74 },
  { area: 'Residential / Zone A', Complaints: 52 },
];

const complaintStatusData = [
  { name: 'Pending', value: 142, color: '#f59e0b' },
  { name: 'In Progress', value: 85, color: '#3b82f6' },
  { name: 'Resolved', value: 892, color: '#10b981' },
];

const binStatusData = [
  { name: 'Empty', value: 400, color: '#10b981' },
  { name: 'Normal', value: 300, color: '#3b82f6' },
  { name: 'Almost Full', value: 300, color: '#f59e0b' },
  { name: 'Full', value: 200, color: '#ef4444' },
];

const collectionEfficiency = [
  { name: 'Mon', Efficiency: 85 },
  { name: 'Tue', Efficiency: 88 },
  { name: 'Wed', Efficiency: 92 },
  { name: 'Thu', Efficiency: 84 },
  { name: 'Fri', Efficiency: 95 },
  { name: 'Sat', Efficiency: 78 },
  { name: 'Sun', Efficiency: 70 },
];

const top10Bins = [...mockBins]
  .sort((a, b) => b.fillPercentage - a.fillPercentage)
  .slice(0, 10)
  .map(bin => ({
    name: bin.name.replace('Smart Bin ', 'Bin '),
    Fill: bin.fillPercentage
  }));

// Custom label for Pie Charts
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('This Month');

  // Smart Insights Calculations
  const mostReportedArea = areaComplaintsData.reduce((prev, current) => (prev.Complaints > current.Complaints) ? prev : current).area;
  const highestFilledBin = top10Bins[0];
  const resolvedCount = complaintStatusData.find(c => c.name === 'Resolved')?.value || 0;
  const totalComplaints = complaintStatusData.reduce((acc, curr) => acc + curr.value, 0);
  const resolutionRate = ((resolvedCount / totalComplaints) * 100).toFixed(1) + '%';
  const mostCommonIssue = 'Missed Collection';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Comprehensive insights into waste management operations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 appearance-none shadow-sm cursor-pointer"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                stat.isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Complaint Status Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Complaint Status Distribution</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time aggregate of all reported issues</p>
          </div>
          <div className="h-80 w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {complaintStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 mt-6 md:mt-0 px-4">
              <div className="space-y-4">
                {complaintStatusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bin Analytics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Current Bin Status Distribution</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time aggregate of all deployed bins</p>
          </div>
          <div className="h-80 w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={binStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {binStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 mt-6 md:mt-0 px-4">
              <div className="space-y-4">
                {binStatusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value} Bins</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. Complaint Analytics Trends */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Complaint Submission Trends</h2>
            <p className="text-sm text-slate-500 mt-1">Total complaints submitted per month</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complaintTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Submitted" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Area-wise Complaints */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Area-wise Complaint Analysis</h2>
            <p className="text-sm text-slate-500 mt-1">Top complaint locations by volume</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={areaComplaintsData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis type="category" dataKey="area" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Complaints" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 6. Top 10 Bins Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Critical Bin Fill Levels</h2>
            <p className="text-sm text-slate-500 mt-1">Top 10 most full bins currently deployed</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Bins} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} angle={-35} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Fill Level']}
                />
                <Bar dataKey="Fill" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {top10Bins.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Fill > 85 ? '#ef4444' : entry.Fill > 60 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Collection Efficiency */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Collection Efficiency Over Time</h2>
            <p className="text-sm text-slate-500 mt-1">Daily performance metric score</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collectionEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="Efficiency" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* 8. Smart Insights Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Smart Insights
            </h2>
            <p className="text-sm text-slate-500 mt-1">Calculated observations from active system data</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-indigo-900 text-sm">Most Reported Area</h4>
              </div>
              <p className="text-lg font-black text-indigo-950">{mostReportedArea}</p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                  <FileWarning className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-rose-900 text-sm">Most Common Issue</h4>
              </div>
              <p className="text-lg font-black text-rose-950">{mostCommonIssue}</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-amber-900 text-sm">Highest Filled Bin</h4>
              </div>
              <p className="text-lg font-black text-amber-950">{highestFilledBin.name} <span className="text-amber-700 text-sm font-semibold ml-1">({highestFilledBin.Fill}%)</span></p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-emerald-900 text-sm">Resolution Rate</h4>
              </div>
              <p className="text-lg font-black text-emerald-950">{resolutionRate}</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
