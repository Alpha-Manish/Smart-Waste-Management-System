import { useState, useRef, useEffect } from 'react';
import { 
  FileWarning, 
  Clock, 
  CheckCircle, 
  Trash2, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  BatteryMedium, 
  CheckCircle2, 
  Printer, 
  FileSpreadsheet, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { mockBins } from '../data/mockBins';
import { getStatusFromPercentage } from '../components/BinStatus';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthorizedAdminEmail } from '../utils/auth';

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
  const { user } = useAuth();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const adminName = user?.user_metadata?.name || localStorage.getItem('admin_name') || 'System Administrator';
  const adminEmail = user?.email || localStorage.getItem('custom_admin_email') || getAuthorizedAdminEmail();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDownloadReceipt = (format: 'pdf' | 'csv') => {
    const receiptId = `RCP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (format === 'csv') {
      const csvRows = [
        ['SMART URBAN WASTE MANAGEMENT SYSTEM - OFFICIAL OPERATIONAL RECEIPT & REPORT'],
        ['Receipt Reference ID:', receiptId],
        ['Generated Date:', dateStr],
        ['Generated Time:', timeStr],
        ['Authorized Administrator:', adminName],
        ['Administrator Email:', adminEmail],
        [],
        ['--- OPERATIONAL PERFORMANCE SUMMARY ---'],
        ['Metric', 'Current Value', 'Status'],
        ['Total Registered Smart Bins', `${totalBins} Units`, 'Active Telemetry'],
        ['Full Bins (Action Required)', `${fullBins} Units`, 'Immediate Dispatch'],
        ['Almost Full Bins (>60%)', `${almostFullBins} Units`, 'Scheduled Route'],
        ['Empty / Normal Bins', `${emptyBins} Units`, 'Optimal Status'],
        ['Total Citizen Complaints', '1,284 Reports', '+12% vs last month'],
        ['Resolved Complaints', '1,242 Reports', '96.7% Resolution Rate'],
        ['Pending Complaints', '42 Reports', 'Under Triage'],
        [],
        ['--- SMART BINS DETAILED INVENTORY ---'],
        ['Bin ID', 'Bin Name', 'Location', 'Capacity', 'Fill Level (%)', 'Status', 'Last Collected Date'],
        ...mockBins.map(bin => [
          bin.id,
          bin.name,
          bin.location,
          bin.capacity,
          `${bin.fillPercentage}%`,
          bin.status,
          bin.lastCollectedDate
        ])
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SmartWaste_Operational_Receipt_${receiptId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess('CSV Data Report downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } else {
      // PDF / Printable Receipt format
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Operational Receipt - ${receiptId}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; margin: 0; background: #fff; }
                .receipt-container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 24px; }
                .logo { font-size: 24px; font-weight: 800; color: #0f766e; }
                .sublogo { font-size: 12px; color: #64748b; margin-top: 4px; }
                .receipt-meta { text-align: right; }
                .receipt-badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px; }
                .meta-text { font-size: 13px; color: #475569; margin-top: 6px; }
                .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
                .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
                .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; }
                .stat-val { font-size: 20px; font-weight: 800; color: #0f172a; }
                .stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
                th { background: #f1f5f9; color: #475569; text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; }
                td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; }
                .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
                .seal { border: 2px dashed #0d9488; color: #0f766e; padding: 6px 14px; font-weight: bold; border-radius: 8px; font-size: 11px; }
                @media print {
                  body { padding: 0; }
                  .receipt-container { border: none; box-shadow: none; }
                }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                <div class="header">
                  <div>
                    <div class="logo">🌿 SmartWaste Municipality</div>
                    <div class="sublogo">Urban Sanitation, IoT Bin Telemetry & Logistics Division</div>
                    <div style="font-size: 13px; color: #334155; margin-top: 12px;"><strong>Authorized Officer:</strong> ${adminName}</div>
                    <div style="font-size: 12px; color: #64748b;"><strong>Officer Email:</strong> ${adminEmail}</div>
                  </div>
                  <div class="receipt-meta">
                    <span class="receipt-badge">OFFICIAL AUDIT RECEIPT</span>
                    <div class="meta-text"><strong>Receipt ID:</strong> ${receiptId}</div>
                    <div class="meta-text"><strong>Date:</strong> ${dateStr}</div>
                    <div class="meta-text"><strong>Time:</strong> ${timeStr}</div>
                  </div>
                </div>

                <div class="section-title">Operational Highlights</div>
                <div class="grid">
                  <div class="stat-box">
                    <div class="stat-val">${totalBins}</div>
                    <div class="stat-lbl">Total Smart Bins</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val" style="color: #ef4444;">${fullBins}</div>
                    <div class="stat-lbl">Full Bins (>85%)</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val" style="color: #10b981;">1,242</div>
                    <div class="stat-lbl">Resolved Complaints</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val" style="color: #0d9488;">96.7%</div>
                    <div class="stat-lbl">Resolution Rate</div>
                  </div>
                </div>

                <div class="section-title">Smart Bins Telemetry Audit</div>
                <table>
                  <thead>
                    <tr>
                      <th>Bin ID</th>
                      <th>Location / Zone</th>
                      <th>Capacity</th>
                      <th>Fill Level</th>
                      <th>Status</th>
                      <th>Last Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${mockBins.slice(0, 10).map(bin => `
                      <tr>
                        <td><strong>${bin.id}</strong></td>
                        <td>${bin.name} (${bin.location})</td>
                        <td>${bin.capacity}</td>
                        <td><strong>${bin.fillPercentage}%</strong></td>
                        <td>${bin.status}</td>
                        <td>${bin.lastCollectedDate}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div class="footer">
                  <div>Verified System Telemetry &middot; Electronic Stamp &middot; Confidential Municipal Record</div>
                  <div class="seal">✓ OFFICIAL AUDIT VERIFIED</div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      setDownloadSuccess('Official Receipt print preview opened!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    }

    setIsDownloadOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{downloadSuccess}</span>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">System Overview</h1>
          <p className="text-slate-600 mt-2">Real-time metrics for city-wide waste management operations.</p>
        </div>

        {/* Download Receipt / Report Menu */}
        <div ref={downloadRef} className="relative">
          <div className="inline-flex rounded-xl shadow-sm">
            <button
              onClick={() => handleDownloadReceipt('pdf')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-l-xl font-medium transition-colors flex items-center gap-2"
              title="Download / Print Operational Receipt"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              Download Receipt
            </button>
            <button
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2.5 rounded-r-xl border-l border-slate-700 transition-colors flex items-center justify-center"
              title="More download options"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Download Options Dropdown */}
          {isDownloadOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Download Options</p>
                <p className="text-[11px] text-slate-400">Choose export format for dashboard receipt</p>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleDownloadReceipt('pdf')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors flex items-center gap-2.5 text-sm font-medium"
                >
                  <Printer className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="font-semibold text-xs">Printable Receipt (PDF)</p>
                    <p className="text-[10px] text-slate-400">Official formatted audit receipt</p>
                  </div>
                </button>

                <button
                  onClick={() => handleDownloadReceipt('csv')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors flex items-center gap-2.5 text-sm font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-xs">Full Data Report (CSV)</p>
                    <p className="text-[10px] text-slate-400">Spreadsheet file with all metrics</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
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
          <div className="flex-1 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-dashed border-slate-200">
            <div className="text-center text-slate-400 mb-4">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Advanced Analytics Dashboard Available</p>
            </div>
            <Link 
              to="/admin/analytics" 
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              View Full Analytics
            </Link>
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
