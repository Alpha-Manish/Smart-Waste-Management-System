import { Outlet, Link } from 'react-router-dom';
import { Sidebar, type MenuItem } from '../components/Sidebar';
import { LayoutDashboard, FileWarning, List, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const citizenMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/citizen', icon: LayoutDashboard },
  { name: 'Report Complaint', path: '/citizen/report', icon: FileWarning },
  { name: 'My Complaints', path: '/citizen/complaints', icon: List },
  { name: 'Profile & Status', path: '/citizen/profile', icon: UserCheck },
];

export function CitizenLayout() {
  const { user } = useAuth();
  
  const email = user?.email || 'citizen@portal';
  const displayName = user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Citizen');
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        items={citizenMenuItems} 
        profile={{ name: displayName, role: email, initials }}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header with live citizen profile status */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Citizen Portal</h2>
            <p className="text-xs text-slate-500 hidden sm:block">Smart Municipal Services & Issue Reporting</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status indicator badge */}
            <Link 
              to="/citizen/profile"
              className="hidden md:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              title="View Profile & System Status"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Citizen</span>
            </Link>

            {/* User chip */}
            <Link 
              to="/citizen/profile" 
              className="flex items-center gap-3 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity group"
              title="Go to Citizen Profile"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800 group-hover:text-teal-700 capitalize transition-colors">{displayName}</span>
                <span className="text-xs text-slate-500 font-mono">{email}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-teal-100 group-hover:ring-teal-300 transition-all">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

