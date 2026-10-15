import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  Trash2, 
  BarChart3, 
  BrainCircuit, 
  Route as RouteIcon, 
  Globe2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Leaf,
  LogOut,
  UserCog
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthorizedAdminEmail } from '../utils/auth';

/** Utility for tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export interface UserProfile {
  name: string;
  role: string;
  initials: string;
}

const defaultAdminItems: MenuItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
  { name: 'Bin Monitoring', path: '/admin/bins', icon: Trash2 },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'AI Prediction', path: '/admin/predictions', icon: BrainCircuit },
  { name: 'Route Optimization', path: '/admin/routes', icon: RouteIcon },
  { name: 'SDG Reports', path: '/admin/sdg-report', icon: Globe2 },
  { name: 'Admin Profile', path: '/admin/profile', icon: UserCog },
];

export function Sidebar({ 
  items = defaultAdminItems,
  profile
}: { 
  items?: MenuItem[],
  profile?: UserProfile
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const adminName = user?.user_metadata?.name || localStorage.getItem('admin_name') || profile?.name || 'Admin';
  const adminEmail = user?.email || localStorage.getItem('custom_admin_email') || getAuthorizedAdminEmail();
  const adminRole = profile?.role || 'Super Administrator';
  const adminInitials = adminName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-white shadow-md border border-slate-200 text-slate-600 hover:text-teal-600 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-100">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed ? "justify-center w-full" : "justify-start")}>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-teal-600" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-slate-800 whitespace-nowrap">
                SmartWaste
              </span>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin' || item.path === '/citizen'}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-teal-50 text-teal-700 font-semibold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors", 
                    isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  
                  {!isCollapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-600 rounded-r-full" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Collapse Toggle */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center py-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* User profile snippet */}
          {!isCollapsed && (
            <Link 
              to="/admin/profile" 
              className="flex items-center gap-3 mt-3 px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 group"
              title="View Admin Profile"
            >
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                <span className="text-xs font-bold">{adminInitials}</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-800 truncate group-hover:text-teal-700">{adminName}</span>
                <span className="text-[11px] text-slate-500 font-mono truncate" title={adminEmail}>{adminRole}</span>
              </div>
            </Link>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-3 mt-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
