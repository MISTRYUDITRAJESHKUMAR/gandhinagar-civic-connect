import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured, firebaseConfig } from '../../config/firebase';
import { dataService } from '../../services/dataService';
import { 
  Building2, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Flame, 
  Sparkles, 
  Menu, 
  X,
  ChevronDown,
  Layers,
  HardHat,
  Briefcase,
  Users,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Navbar = ({ 
  onOpenReportModal, 
  activeTab, 
  setActiveTab, 
  onSelectComplaint,
  onOpenAuth
}) => {
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    const list = await dataService.getNotifications(currentUser?.id);
    setNotifications(list);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    await dataService.markNotificationRead(notif.id);
    await loadNotifications();
    if (notif.complaintId && onSelectComplaint) {
      const complaint = await dataService.getComplaintById(notif.complaintId);
      if (complaint) onSelectComplaint(complaint);
    }
    setShowNotifMenu(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin Command', bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500', icon: ShieldCheck };
      case 'corporator':
        return { label: 'Ward Corporator', bg: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500', icon: Users };
      case 'officer':
        return { label: 'Dept Officer', bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', icon: Briefcase };
      case 'worker':
        return { label: 'Field Worker', bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500', icon: HardHat };
      default:
        return { label: 'Citizen', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', icon: User };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role || 'citizen');
  const RoleIcon = roleInfo.icon;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        
        {/* Top Government Strip (Ultra-Responsive & Overflow-Safe) */}
        <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1 px-3 sm:px-6 flex justify-between items-center border-b border-slate-800 select-none">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate max-w-[65%] sm:max-w-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            <span className="font-bold text-white tracking-wide shrink-0">ગાંધીનગર મહાનગરપાલિકા</span>
            <span className="hidden md:inline text-slate-400 truncate">
              | Gandhinagar Municipal Corporation (GMC) Civic Portal
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Database Status Pill */}
            <button
              onClick={() => setShowFirebaseModal(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Click to view database connection status"
            >
              <Flame className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isFirebaseConfigured ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span className="hidden xs:inline">{isFirebaseConfigured ? 'Cloud Firestore' : 'Database Ready'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>

            <span className="hidden lg:inline text-slate-400">
              Helpline: 1800-233-0000
            </span>
          </div>
        </div>

        {/* Main Nav Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left Brand Identity */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" 
              onClick={() => setActiveTab(currentUser ? 'dashboard' : 'home')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight leading-none truncate">
                    <span className="hidden sm:inline">GANDHINAGAR </span>
                    <span className="text-emerald-600">CIVIC CONNECT</span>
                  </h1>
                </div>
                <p className="hidden md:block text-[10px] text-slate-500 font-medium truncate">
                  Citizen Reporting & Municipal Governance Grid
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links (Visible on lg and above to prevent wrapping) */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {!currentUser && (
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    activeTab === 'home' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
              )}

              {currentUser && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'dashboard' 
                      ? 'bg-emerald-50 text-emerald-700 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <RoleIcon className="w-4 h-4" />
                  <span>{roleInfo.label}</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'map' 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                City Map View
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'analytics' 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Analytics
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'about' 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                About
              </button>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Report New Complaint Button (Only for logged in citizen) */}
              {currentUser?.role === 'citizen' && (
                <button
                  onClick={onOpenReportModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Report Problem</span>
                </button>
              )}

              {/* Notifications Bell (Only when logged in) */}
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-[380px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">Notifications ({notifications.length})</span>
                        <button
                          onClick={async () => {
                            for (const n of notifications) await dataService.markNotificationRead(n.id);
                            loadNotifications();
                          }}
                          className="text-[11px] text-emerald-600 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                                !n.isRead ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-bold text-slate-800 text-[11px]">{n.title}</span>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 text-[10px] leading-relaxed line-clamp-2">{n.message}</p>
                              {n.complaintId && (
                                <span className="inline-block mt-1 text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {n.complaintId}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AUTHENTICATION STATE: USER PROFILE OR SIGN IN BUTTONS */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
                    className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500/30">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block text-left text-xs max-w-[110px]">
                      <div className="font-bold text-slate-800 truncate leading-tight">{currentUser?.name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold truncate capitalize">{roleInfo.label}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          onClick={() => { setActiveTab('dashboard'); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2"
                        >
                          <RoleIcon className="w-4 h-4 text-emerald-600" />
                          <span>My Module Dashboard</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>My Profile & Ward</span>
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); setActiveTab('home'); }}
                          className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 text-xs shadow-lg animate-in slide-in-from-top-2 duration-150">
            {currentUser ? (
              <div className="p-3 mb-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                  {roleInfo.label}
                </span>
              </div>
            ) : null}

            {/* Nav Links */}
            <div className="space-y-1">
              {currentUser ? (
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 ${
                    activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <RoleIcon className="w-4 h-4 text-emerald-600" />
                  <span>My Module ({roleInfo.label})</span>
                </button>
              ) : (
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold ${
                    activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
              )}

              <button
                onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 ${
                  activeTab === 'map' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>City Map View</span>
              </button>

              <button
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 ${
                  activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Analytics & Reports</span>
              </button>

              <button
                onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 ${
                  activeTab === 'about' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>About & Blueprint</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center gap-2 ${
                    activeTab === 'profile' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile & Ward</span>
                </button>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-200">
              {currentUser ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); setActiveTab('home'); }}
                  className="w-full py-2.5 px-3 text-center rounded-xl font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 text-center rounded-xl font-bold bg-slate-100 text-slate-800 hover:bg-slate-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 text-center rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      {/* FIREBASE API CONFIGURATION MODAL */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Database & Firebase Architecture</h3>
                  <p className="text-xs text-slate-500">Live Firebase Connection & Data Sync</p>
                </div>
              </div>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className={`p-4 rounded-2xl border ${
                isFirebaseConfigured 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  {isFirebaseConfigured ? 'Active: Live Cloud Firestore' : 'Active: Database Persistence & Auth Ready'}
                </div>
                <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                  {isFirebaseConfigured 
                    ? `Connected to Firebase Project "${firebaseConfig.projectId}". All users, complaints, and audit logs are saved directly to Cloud Firestore!` 
                    : 'The database is active with automatic offline-resilience and local persistence. When you add your Firebase credentials in .env, it automatically connects to your live Google Firebase!'}
                </p>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
                <div className="text-slate-400 mb-2 font-sans font-bold text-[11px] uppercase tracking-wider flex items-center justify-between">
                  <span>How & Where to Add your Firebase API:</span>
                  <span className="text-emerald-400">File: .env</span>
                </div>
                <div className="text-emerald-300"># In clean-gandhinagar/.env:</div>
                <div>VITE_FIREBASE_API_KEY={firebaseConfig.apiKey.slice(0, 12)}...</div>
                <div>VITE_FIREBASE_PROJECT_ID={firebaseConfig.projectId}</div>
                <div>VITE_FIREBASE_AUTH_DOMAIN={firebaseConfig.authDomain}</div>
                <div>VITE_FIREBASE_STORAGE_BUCKET={firebaseConfig.storageBucket}</div>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-between pt-2">
                <span>Detailed step-by-step setup in <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">FIREBASE_SETUP_GUIDE.md</code></span>
                <button
                  onClick={() => setShowFirebaseModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
