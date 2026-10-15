import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { 
  Bell, 
  Search, 
  X, 
  Trash2, 
  MessageSquareWarning, 
  BarChart3, 
  BrainCircuit, 
  Route as RouteIcon, 
  Globe2, 
  UserCog, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  LogOut, 
  ChevronRight,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UNAUTHORIZED_ADMIN_MESSAGE, getAuthorizedAdminEmail } from '../utils/auth';
import { mockBins } from '../data/mockBins';
import { MOCK_COMPLAINTS } from '../data/mockComplaints';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'danger' | 'warning' | 'info' | 'success';
  link: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Critical Bin Fill Level',
    description: 'Shopping Mall Plaza (BIN-004) has reached 98% capacity. Immediate dispatch recommended.',
    time: '10m ago',
    read: false,
    type: 'danger',
    link: '/admin/bins'
  },
  {
    id: 'n2',
    title: 'High Priority Citizen Complaint',
    description: 'Illegal dumping reported near Sector 5 Park. Awaiting field agent assignment.',
    time: '25m ago',
    read: false,
    type: 'warning',
    link: '/admin/complaints'
  },
  {
    id: 'n3',
    title: 'AI Prediction Warning',
    description: 'Metro Station A forecasted to overflow in 2.5 hours due to peak transit hours.',
    time: '45m ago',
    read: false,
    type: 'info',
    link: '/admin/predictions'
  },
  {
    id: 'n4',
    title: 'Collection Route Generated',
    description: 'Optimized 5-stop waste pickup route calculated for Truck-02 (saves 4.2 km).',
    time: '1h ago',
    read: false,
    type: 'success',
    link: '/admin/routes'
  }
];

export function AdminLayout() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile Menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const adminName = user?.user_metadata?.name || localStorage.getItem('admin_name') || 'Admin';
  const adminEmail = user?.email || localStorage.getItem('custom_admin_email') || getAuthorizedAdminEmail();
  const adminInitials = adminName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle outside click to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ unauthorizedMessage: UNAUTHORIZED_ADMIN_MESSAGE }} replace />;
  }

  // Quick navigation pages index
  const adminPages = [
    { title: 'Dashboard Overview', desc: 'Central performance metrics and stats', path: '/admin', icon: BarChart3, category: 'Pages' },
    { title: 'Smart Bin Monitoring', desc: 'Real-time bin fill levels and IoT statuses', path: '/admin/bins', icon: Trash2, category: 'Pages' },
    { title: 'Add New Smart Bin', desc: 'Register a new smart waste bin', path: '/admin/bins/add', icon: PlusCircle, category: 'Actions' },
    { title: 'Complaints Management', desc: 'Citizen waste reports and resolution triage', path: '/admin/complaints', icon: MessageSquareWarning, category: 'Pages' },
    { title: 'Analytics Dashboard', desc: 'Collection efficiency and recycling metrics', path: '/admin/analytics', icon: BarChart3, category: 'Pages' },
    { title: 'AI Predictions', desc: 'Predictive overflow and maintenance forecasts', path: '/admin/predictions', icon: BrainCircuit, category: 'Pages' },
    { title: 'Route Optimization', desc: 'Dynamic garbage truck route planning', path: '/admin/routes', icon: RouteIcon, category: 'Pages' },
    { title: 'SDG & ESG Reports', desc: 'UN sustainability impact and carbon metrics', path: '/admin/sdg-report', icon: Globe2, category: 'Pages' },
    { title: 'Admin Profile & Settings', desc: 'Manage credentials, name, email, and security', path: '/admin/profile', icon: UserCog, category: 'Account' },
  ];

  // Filter items matching query
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const matchedPages = trimmedSearch 
    ? adminPages.filter(p => p.title.toLowerCase().includes(trimmedSearch) || p.desc.toLowerCase().includes(trimmedSearch))
    : [];

  const matchedBins = trimmedSearch 
    ? mockBins.filter(b => b.name.toLowerCase().includes(trimmedSearch) || b.location.toLowerCase().includes(trimmedSearch) || b.id.toLowerCase().includes(trimmedSearch)).slice(0, 3)
    : [];

  const matchedComplaints = trimmedSearch
    ? MOCK_COMPLAINTS.filter(c => (c.title && c.title.toLowerCase().includes(trimmedSearch)) || (c.location && c.location.toLowerCase().includes(trimmedSearch))).slice(0, 3)
    : [];

  const hasSearchResults = matchedPages.length > 0 || matchedBins.length > 0 || matchedComplaints.length > 0;

  const handleSelectSearchResult = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setIsNotifOpen(false);
    navigate(item.link);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 transition-all duration-300 min-w-0">
        {/* Admin Header / Control Panel */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">Control Panel</h2>
            <p className="text-xs text-slate-400 hidden lg:block">System Operations & Resource Management</p>
          </div>
          
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md ml-4 sm:ml-8">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search bins, complaints, pages..." 
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  } else if (e.key === 'Enter' && searchQuery.trim()) {
                    if (matchedPages.length > 0) {
                      handleSelectSearchResult(matchedPages[0].path);
                    } else {
                      navigate(`/admin/bins`);
                      setIsSearchOpen(false);
                    }
                  }
                }}
                className="w-full bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:border-teal-500 rounded-full py-2 pl-10 pr-9 text-sm focus:ring-2 focus:ring-teal-500/20 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[420px] overflow-y-auto">
                {hasSearchResults ? (
                  <div className="p-2 space-y-3">
                    {/* Pages match */}
                    {matchedPages.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Pages & Tools
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedPages.map((page) => (
                            <button
                              key={page.path}
                              onClick={() => handleSelectSearchResult(page.path)}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-50/70 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <page.icon className="w-4 h-4 text-teal-600 shrink-0" />
                                <div className="truncate">
                                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">{page.title}</p>
                                  <p className="text-xs text-slate-400 truncate">{page.desc}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bins match */}
                    {matchedBins.length > 0 && (
                      <div className="border-t border-slate-100 pt-2">
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Smart Bins
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedBins.map((bin) => (
                            <button
                              key={bin.id}
                              onClick={() => handleSelectSearchResult(`/admin/bins`)}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Trash2 className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-teal-600" />
                                <div className="truncate">
                                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">{bin.name}</p>
                                  <p className="text-xs text-slate-400">{bin.location} • {bin.id}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                {bin.fillPercentage}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complaints match */}
                    {matchedComplaints.length > 0 && (
                      <div className="border-t border-slate-100 pt-2">
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Complaints
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedComplaints.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleSelectSearchResult(`/admin/complaints`)}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <MessageSquareWarning className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-amber-600" />
                                <div className="truncate">
                                  <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-700">{c.title}</p>
                                  <p className="text-xs text-slate-400">{c.location}</p>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                {c.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No matching results found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for a bin name, location, or page title.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 ml-4">
            {/* Interactive Notifications Button */}
            <div ref={notifRef} className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2.5 rounded-xl transition-all ${
                  isNotifOpen 
                    ? 'bg-teal-50 text-teal-600' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="System notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start gap-3 relative ${
                            !item.read ? 'bg-teal-50/20' : ''
                          }`}
                        >
                          {!item.read && (
                            <span className="absolute left-2 top-5 w-2 h-2 rounded-full bg-teal-500" />
                          )}
                          <div className="mt-0.5 shrink-0 pl-2">
                            {item.type === 'danger' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            {item.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                            {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">No new system notifications.</p>
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <button
                        onClick={handleClearNotifications}
                        className="text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
                      >
                        Clear all
                      </button>
                      <Link
                        to="/admin/bins"
                        onClick={() => setIsNotifOpen(false)}
                        className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 px-2 py-1"
                      >
                        View all bins
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar & Interactive Menu */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-teal-500/20 transition-all focus:outline-none"
                aria-label="Admin user menu"
                title={adminName}
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-colors border-2 border-white">
                  {adminInitials}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-900 truncate">{adminName}</p>
                    <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{adminEmail}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      Super Administrator
                    </span>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/admin/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50/70 rounded-xl transition-colors"
                    >
                      <UserCog className="w-4 h-4 text-teal-600" />
                      Admin Profile & Credentials
                    </Link>

                    <Link
                      to="/admin/bins"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50/70 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500" />
                      Manage Smart Bins
                    </Link>

                    <Link
                      to="/admin/complaints"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50/70 rounded-xl transition-colors"
                    >
                      <MessageSquareWarning className="w-4 h-4 text-slate-500" />
                      Citizen Complaints
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
