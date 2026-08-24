import React from 'react';
import { Globe2, Target, TrendingUp, TrendingDown, Wind, CheckCircle2, Truck, Leaf, Users, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockMetrics = [
  { label: 'Complaints Resolved', value: '85%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', progress: 85, progressColor: 'bg-emerald-500' },
  { label: 'Waste Collection Efficiency', value: '92%', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50', progress: 92, progressColor: 'bg-blue-500' },
  { label: 'Overflow Reduction', value: '45%', icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-50', progress: 45, progressColor: 'bg-purple-500' },
  { label: 'Carbon Emission Reduction', value: '30%', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50', progress: 30, progressColor: 'bg-amber-500' },
];

const sdgChartData = [
  { month: 'Jan', sdg11: 45, sdg12: 30, sdg13: 50 },
  { month: 'Feb', sdg11: 52, sdg12: 35, sdg13: 55 },
  { month: 'Mar', sdg11: 61, sdg12: 42, sdg13: 65 },
  { month: 'Apr', sdg11: 68, sdg12: 50, sdg13: 72 },
  { month: 'May', sdg11: 75, sdg12: 60, sdg13: 78 },
  { month: 'Jun', sdg11: 82, sdg12: 68, sdg13: 85 },
];

const mockInsights = [
  { id: 1, title: 'Overflow Incidents', description: 'Reduced overflow incidents by 30% through predictive routing.', icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 2, title: 'Collection Efficiency', description: 'Improved collection efficiency by 25% across all active sectors.', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, title: 'Citizen Engagement', description: 'Increased citizen participation in reporting by 40% this quarter.', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function SDGReports() {
  return (
    <div className="space-y-6">
      {/* 1. SDG Overview */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl shadow-lg p-8 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Globe2 className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold">SDG Impact Reporting</h1>
          </div>
          <p className="text-emerald-50 text-lg leading-relaxed">
            Tracking our contribution towards the United Nations Sustainable Development Goals (SDGs). 
            Our smart waste management initiatives directly impact global sustainability targets.
          </p>
        </div>
      </div>

      {/* 2. Impact Metrics */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Impact Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-2">{metric.label}</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={`${metric.progressColor} h-1.5 rounded-full transition-all duration-1000`} 
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SDG Progress Charts */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">SDG Goal Progress Trends</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sdgChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dx={-10}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                name="SDG 11 (Cities)" 
                dataKey="sdg11" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                name="SDG 12 (Consumption)" 
                dataKey="sdg12" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                name="SDG 13 (Climate)" 
                dataKey="sdg13" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Sustainability Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800">Sustainability Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockInsights.map((insight) => (
            <div key={insight.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className={`mt-0.5 shrink-0 p-3 rounded-xl ${insight.bg} ${insight.color}`}>
                <insight.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{insight.title}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
