import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Bell, Search } from 'lucide-react';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Component (Defaults to Admin items) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Admin Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-xl font-bold text-slate-800 hidden sm:block">Control Panel</h2>
          
          <div className="flex-1 max-w-md ml-4 sm:ml-8">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shadow-sm">
              AD
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
