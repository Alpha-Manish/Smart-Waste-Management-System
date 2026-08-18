import { FileWarning, CheckCircle, Clock } from 'lucide-react';

// Dummy Data
const dashboardStats = [
  {
    title: 'Total Complaints',
    value: '14',
    icon: FileWarning,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: '+2 this month'
  },
  {
    title: 'Resolved Complaints',
    value: '9',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    trend: '64% resolution rate'
  },
  {
    title: 'Pending Complaints',
    value: '5',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    trend: 'Action required'
  }
];

export default function CitizenDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here is the summary of your reported issues.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              
              <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-4xl font-extrabold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity placeholder (optional, adds to modern dashboard design) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { title: 'Overflowing Bin at Central Park', status: 'Resolved', date: '2 days ago', statusColor: 'text-emerald-600 bg-emerald-50' },
            { title: 'Broken Sensor on 5th Ave', status: 'Pending', date: '5 days ago', statusColor: 'text-amber-600 bg-amber-50' },
            { title: 'Missed Collection at Main St', status: 'Resolved', date: '1 week ago', statusColor: 'text-emerald-600 bg-emerald-50' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100`}>
                  <FileWarning className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
