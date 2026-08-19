import { Outlet } from 'react-router-dom';
import { Sidebar, type MenuItem } from '../components/Sidebar';
import { LayoutDashboard, FileWarning, List } from 'lucide-react';

const citizenMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/citizen', icon: LayoutDashboard },
  { name: 'Report Complaint', path: '/citizen/report', icon: FileWarning },
  { name: 'My Complaints', path: '/citizen/complaints', icon: List },
];

export function CitizenLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        items={citizenMenuItems} 
        profile={{ name: 'Citizen', role: 'Resident', initials: 'CZ' }}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header (optional, for spacing or user profile) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-xl font-bold text-slate-800">Citizen Portal</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
