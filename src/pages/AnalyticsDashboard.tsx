import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, 
  Trash2, CheckCircle2, FileWarning, Calendar, Filter, Clock, BatteryMedium,
  MapPin, Lightbulb, Activity, Flame, X, RotateCcw, Check
} from 'lucide-react';
import { mockBins } from '../data/mockBins';

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
  // Filter States
  const [timeRange, setTimeRange] = useState<'This Week' | 'This Month' | 'Last 3 Months' | 'This Year'>('This Month');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedIssue, setSelectedIssue] = useState<string>('All Issues');
  const [fillThreshold, setFillThreshold] = useState<string>('All Levels');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multiplier depending on selected time range
  const timeMultiplier = useMemo(() => {
    switch (timeRange) {
      case 'This Week': return 0.22;
      case 'Last 3 Months': return 2.8;
      case 'This Year': return 8.5;
      case 'This Month':
      default: return 1.0;
    }
  }, [timeRange]);

  // Area scale factor
  const areaMultiplier = useMemo(() => {
    return selectedArea === 'All Areas' ? 1.0 : 0.35;
  }, [selectedArea]);

  // Combined scale factor
  const scale = timeMultiplier * areaMultiplier;

  // 1. Overview Statistics (Reactively calculated)
  const overviewStats = useMemo(() => {
    const totalComplaintsVal = Math.round(1284 * scale);
    const resolvedVal = Math.round(892 * scale);
    const pendingVal = Math.round(142 * scale);
    const totalBinsCount = selectedArea === 'All Areas' ? mockBins.length : Math.max(4, Math.round(mockBins.length * 0.3));
    const fullBinsCount = mockBins.filter(b => b.fillPercentage > 85).length;
    const almostFullCount = mockBins.filter(b => b.fillPercentage > 60 && b.fillPercentage <= 85).length;

    return [
      { title: 'Total Complaints', value: totalComplaintsVal.toLocaleString(), trend: '+12%', isUp: true, icon: FileWarning, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { title: 'Resolved Complaints', value: resolvedVal.toLocaleString(), trend: '+8%', isUp: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { title: 'Pending Complaints', value: pendingVal.toLocaleString(), trend: '-5%', isUp: false, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { title: 'Monitored Bins', value: totalBinsCount.toString(), trend: '+2 new', isUp: true, icon: Trash2, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'Full Bins (>85%)', value: fullBinsCount.toString(), trend: '-4% today', isUp: false, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
      { title: 'Almost Full Bins', value: almostFullCount.toString(), trend: '+3% normal', isUp: true, icon: BatteryMedium, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];
  }, [scale, selectedArea]);

  // 2. Complaint Status Data (Reactively calculated)
  const complaintStatusData = useMemo(() => {
    const pending = Math.max(12, Math.round(142 * scale));
    const inProgress = Math.max(8, Math.round(85 * scale));
    const resolved = Math.max(25, Math.round(892 * scale));

    return [
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Resolved', value: resolved, color: '#10b981' },
    ];
  }, [scale]);

  // 3. Bin Status Distribution (Reactively calculated from mockBins & fillThreshold)
  const binStatusData = useMemo(() => {
    let bins = [...mockBins];

    if (fillThreshold === 'Critical (>85%)') {
      bins = bins.filter(b => b.fillPercentage > 85);
    } else if (fillThreshold === 'Almost Full (60-85%)') {
      bins = bins.filter(b => b.fillPercentage > 60 && b.fillPercentage <= 85);
    } else if (fillThreshold === 'Normal (25-60%)') {
      bins = bins.filter(b => b.fillPercentage >= 25 && b.fillPercentage <= 60);
    } else if (fillThreshold === 'Empty (<25%)') {
      bins = bins.filter(b => b.fillPercentage < 25);
    }

    const empty = bins.filter(b => b.fillPercentage < 25).length || 1;
    const normal = bins.filter(b => b.fillPercentage >= 25 && b.fillPercentage <= 60).length || 1;
    const almostFull = bins.filter(b => b.fillPercentage > 60 && b.fillPercentage <= 85).length || 1;
    const full = bins.filter(b => b.fillPercentage > 85).length || 1;

    return [
      { name: 'Empty', value: empty, color: '#10b981' },
      { name: 'Normal', value: normal, color: '#3b82f6' },
      { name: 'Almost Full', value: almostFull, color: '#f59e0b' },
      { name: 'Full', value: full, color: '#ef4444' },
    ];
  }, [fillThreshold]);

  // 4. Complaint Trend Data (Reactively adapts to TimeRange)
  const complaintTrendData = useMemo(() => {
    switch (timeRange) {
      case 'This Week':
        return [
          { name: 'Mon', Submitted: Math.round(38 * areaMultiplier) },
          { name: 'Tue', Submitted: Math.round(45 * areaMultiplier) },
          { name: 'Wed', Submitted: Math.round(52 * areaMultiplier) },
          { name: 'Thu', Submitted: Math.round(40 * areaMultiplier) },
          { name: 'Fri', Submitted: Math.round(65 * areaMultiplier) },
          { name: 'Sat', Submitted: Math.round(72 * areaMultiplier) },
          { name: 'Sun', Submitted: Math.round(48 * areaMultiplier) },
        ];
      case 'Last 3 Months':
        return [
          { name: 'August', Submitted: Math.round(240 * areaMultiplier) },
          { name: 'September', Submitted: Math.round(290 * areaMultiplier) },
          { name: 'October', Submitted: Math.round(340 * areaMultiplier) },
        ];
      case 'This Year':
        return [
          { name: 'Jan', Submitted: Math.round(120 * areaMultiplier) },
          { name: 'Feb', Submitted: Math.round(150 * areaMultiplier) },
          { name: 'Mar', Submitted: Math.round(180 * areaMultiplier) },
          { name: 'Apr', Submitted: Math.round(130 * areaMultiplier) },
          { name: 'May', Submitted: Math.round(210 * areaMultiplier) },
          { name: 'Jun', Submitted: Math.round(250 * areaMultiplier) },
          { name: 'Jul', Submitted: Math.round(220 * areaMultiplier) },
          { name: 'Aug', Submitted: Math.round(190 * areaMultiplier) },
          { name: 'Sep', Submitted: Math.round(260 * areaMultiplier) },
          { name: 'Oct', Submitted: Math.round(280 * areaMultiplier) },
          { name: 'Nov', Submitted: Math.round(310 * areaMultiplier) },
          { name: 'Dec', Submitted: Math.round(290 * areaMultiplier) },
        ];
      case 'This Month':
      default:
        return [
          { name: 'Week 1', Submitted: Math.round(65 * areaMultiplier) },
          { name: 'Week 2', Submitted: Math.round(82 * areaMultiplier) },
          { name: 'Week 3', Submitted: Math.round(74 * areaMultiplier) },
          { name: 'Week 4', Submitted: Math.round(95 * areaMultiplier) },
        ];
    }
  }, [timeRange, areaMultiplier]);

  // 5. Area-wise Complaints (Reactively highlights or filters selectedArea)
  const areaComplaintsData = useMemo(() => {
    const rawAreas = [
      { area: 'Downtown / Sec 1', Complaints: Math.round(142 * timeMultiplier) },
      { area: 'North Park / Sec 4', Complaints: Math.round(98 * timeMultiplier) },
      { area: 'Industrial / Zone B', Complaints: Math.round(86 * timeMultiplier) },
      { area: 'University District', Complaints: Math.round(74 * timeMultiplier) },
      { area: 'Residential / Zone A', Complaints: Math.round(52 * timeMultiplier) },
    ];

    if (selectedArea === 'All Areas') {
      return rawAreas;
    }
    return rawAreas.map(item => ({
      ...item,
      Complaints: item.area === selectedArea ? item.Complaints : Math.round(item.Complaints * 0.15)
    }));
  }, [timeMultiplier, selectedArea]);

  // 6. Top 10 Bins (Reactively filtered by fillThreshold)
  const top10Bins = useMemo(() => {
    let bins = [...mockBins];

    if (fillThreshold === 'Critical (>85%)') {
      bins = bins.filter(b => b.fillPercentage > 85);
    } else if (fillThreshold === 'Almost Full (60-85%)') {
      bins = bins.filter(b => b.fillPercentage > 60 && b.fillPercentage <= 85);
    } else if (fillThreshold === 'Normal (25-60%)') {
      bins = bins.filter(b => b.fillPercentage >= 25 && b.fillPercentage <= 60);
    } else if (fillThreshold === 'Empty (<25%)') {
      bins = bins.filter(b => b.fillPercentage < 25);
    }

    if (bins.length === 0) {
      bins = [...mockBins];
    }

    return bins
      .sort((a, b) => b.fillPercentage - a.fillPercentage)
      .slice(0, 10)
      .map(bin => ({
        name: bin.name.replace('Smart Bin ', 'Bin '),
        Fill: bin.fillPercentage
      }));
  }, [fillThreshold]);

  // 7. Collection Efficiency (Reactively adjusted)
  const collectionEfficiency = useMemo(() => {
    const base = [
      { name: 'Mon', Efficiency: 85 },
      { name: 'Tue', Efficiency: 88 },
      { name: 'Wed', Efficiency: 92 },
      { name: 'Thu', Efficiency: 84 },
      { name: 'Fri', Efficiency: 95 },
      { name: 'Sat', Efficiency: 78 },
      { name: 'Sun', Efficiency: 70 },
    ];
    if (selectedIssue === 'Missed Collection') {
      return base.map(d => ({ ...d, Efficiency: Math.max(50, d.Efficiency - 12) }));
    }
    return base;
  }, [selectedIssue]);

  // Smart Insights Dynamic Calculations
  const mostReportedArea = useMemo(() => {
    if (selectedArea !== 'All Areas') return selectedArea;
    return areaComplaintsData.reduce((prev, curr) => (prev.Complaints > curr.Complaints ? prev : curr)).area;
  }, [selectedArea, areaComplaintsData]);

  const highestFilledBin = top10Bins[0] || { name: 'City Center Hub', Fill: 98 };
  const resolvedCount = complaintStatusData.find(c => c.name === 'Resolved')?.value || 0;
  const totalComplaints = complaintStatusData.reduce((acc, curr) => acc + curr.value, 0);
  const resolutionRate = totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) + '%' : '92.4%';
  const mostCommonIssue = selectedIssue !== 'All Issues' ? selectedIssue : 'Overflowing Bins';

  // Has active non-default filters
  const hasActiveFilters = selectedArea !== 'All Areas' || selectedIssue !== 'All Issues' || fillThreshold !== 'All Levels';

  const resetAllFilters = () => {
    setSelectedArea('All Areas');
    setSelectedIssue('All Issues');
    setFillThreshold('All Levels');
    setTimeRange('This Month');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time data visualization and operational intelligence</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 appearance-none shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Filter Popover Toggle Button */}
          <div ref={filterRef} className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-xl border shadow-sm transition-all flex items-center gap-1.5 ${
                hasActiveFilters || isFilterOpen
                  ? 'bg-teal-50 text-teal-700 border-teal-300 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200'
              }`}
              title="Filter by Area, Issue, or Fill Threshold"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              )}
            </button>

            {/* Filter Dropdown Popover */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-sm text-slate-800">Analytics Filters</h4>
                  </div>
                  {hasActiveFilters && (
                    <button 
                      onClick={resetAllFilters}
                      className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Area / Zone */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Municipal Zone / Area
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="All Areas">All Areas (City-wide)</option>
                      <option value="Downtown / Sec 1">Downtown / Sec 1</option>
                      <option value="North Park / Sec 4">North Park / Sec 4</option>
                      <option value="Industrial / Zone B">Industrial / Zone B</option>
                      <option value="University District">University District</option>
                      <option value="Residential / Zone A">Residential / Zone A</option>
                    </select>
                  </div>

                  {/* Issue Category */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Complaint / Waste Category
                    </label>
                    <select
                      value={selectedIssue}
                      onChange={(e) => setSelectedIssue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="All Issues">All Waste Categories</option>
                      <option value="Overflowing Bins">Overflowing Bins</option>
                      <option value="Missed Collection">Missed Collection</option>
                      <option value="Illegal Dumping">Illegal Dumping</option>
                      <option value="Damaged Container">Damaged Container</option>
                      <option value="Hazardous Waste">Hazardous Waste</option>
                    </select>
                  </div>

                  {/* Bin Fill Level Threshold */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Bin Fill Threshold
                    </label>
                    <select
                      value={fillThreshold}
                      onChange={(e) => setFillThreshold(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="All Levels">All Levels (0 - 100%)</option>
                      <option value="Critical (>85%)">Critical Only (&gt; 85%)</option>
                      <option value="Almost Full (60-85%)">Almost Full (60 - 85%)</option>
                      <option value="Normal (25-60%)">Normal Fill (25 - 60%)</option>
                      <option value="Empty (<25%)">Empty Bins (&lt; 25%)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Apply Filter View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-200">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">Active Filters:</span>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            📅 {timeRange}
          </span>

          {selectedArea !== 'All Areas' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              📍 Area: {selectedArea}
              <button onClick={() => setSelectedArea('All Areas')} className="hover:text-teal-950">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedIssue !== 'All Issues' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              ⚠️ Issue: {selectedIssue}
              <button onClick={() => setSelectedIssue('All Issues')} className="hover:text-amber-950">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {fillThreshold !== 'All Levels' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              🗑️ Threshold: {fillThreshold}
              <button onClick={() => setFillThreshold('All Levels')} className="hover:text-rose-950">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button 
            onClick={resetAllFilters} 
            className="text-slate-400 hover:text-slate-700 font-medium ml-auto pl-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

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
            <p className="text-sm text-slate-500 mt-1">Real-time aggregate for {timeRange} {selectedArea !== 'All Areas' ? `(${selectedArea})` : ''}</p>
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
                    <span className="font-bold text-slate-900">{item.value.toLocaleString()}</span>
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
            <p className="text-sm text-slate-500 mt-1">Aggregated IoT telemetry ({fillThreshold})</p>
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
            <h2 className="text-xl font-bold text-slate-800">Complaint Submission Trends ({timeRange})</h2>
            <p className="text-sm text-slate-500 mt-1">Temporal volume analysis across selected interval</p>
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
            <p className="text-sm text-slate-500 mt-1">Comparative municipal volume by zone</p>
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
            <p className="text-sm text-slate-500 mt-1">Telemetry ranks for deployed smart waste containers</p>
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
            <p className="text-sm text-slate-500 mt-1">Fleet collection compliance score (%)</p>
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
            <p className="text-sm text-slate-500 mt-1">Dynamically calculated from your active filter parameters</p>
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
