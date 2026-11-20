import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dataService } from './services/dataService';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { CitizenDashboard } from './dashboards/CitizenDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { CorporatorDashboard } from './dashboards/CorporatorDashboard';
import { DepartmentDashboard } from './dashboards/DepartmentDashboard';
import { WorkerDashboard } from './dashboards/WorkerDashboard';
import { CityMapViewPage } from './pages/CityMapViewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import { ReportComplaintModal } from './components/modals/ReportComplaintModal';
import { ComplaintDetailModal } from './components/modals/ComplaintDetailModal';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Flame, 
  ExternalLink,
  Plus
} from 'lucide-react';

const AppContent = () => {
  const { currentUser } = useAuth();
  
  const [complaints, setComplaints] = useState([]);
  // If user is already logged in, show 'dashboard', otherwise start on 'home'
  const [activeTab, setActiveTab] = useState(currentUser ? 'dashboard' : 'home'); 
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'register'
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, [currentUser]);

  // When auth state changes, align default view
  useEffect(() => {
    if (currentUser && activeTab === 'auth') {
      setActiveTab('dashboard');
    } else if (!currentUser && (activeTab === 'dashboard' || activeTab === 'profile')) {
      setActiveTab('home');
    }
  }, [currentUser, activeTab]);

  const loadComplaints = async () => {
    const list = await dataService.getComplaints();
    setComplaints(list);
  };

  const handleComplaintCreated = (created) => {
    loadComplaints();
    setSelectedComplaint(created);
  };

  const handleComplaintUpdated = (updated) => {
    loadComplaints();
    setSelectedComplaint(updated);
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setActiveTab('auth');
  };

  const handleTriggerReport = () => {
    if (!currentUser) {
      handleOpenAuth('register');
    } else {
      setIsReportOpen(true);
    }
  };

  // Render role-specific dashboard
  const renderDashboard = () => {
    if (!currentUser) {
      return (
        <LandingPage 
          complaints={complaints}
          onNavigateAuth={handleOpenAuth}
          onNavigateTab={setActiveTab}
        />
      );
    }

    switch (currentUser.role) {
      case 'admin':
        return (
          <AdminDashboard 
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
            onRefresh={loadComplaints}
          />
        );
      case 'corporator':
        return (
          <CorporatorDashboard 
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
          />
        );
      case 'officer':
        return (
          <DepartmentDashboard 
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
          />
        );
      case 'worker':
        return (
          <WorkerDashboard 
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
          />
        );
      default:
        return (
          <CitizenDashboard 
            complaints={complaints}
            onOpenReport={() => setIsReportOpen(true)}
            onSelectComplaint={setSelectedComplaint}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        onOpenReportModal={handleTriggerReport}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectComplaint={setSelectedComplaint}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Public Landing Home */}
        {activeTab === 'home' && (
          <LandingPage 
            complaints={complaints}
            onNavigateAuth={handleOpenAuth}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Dedicated Authentication Page */}
        {activeTab === 'auth' && (
          <AuthPage
            initialTab={authInitialTab}
            onBack={() => setActiveTab(currentUser ? 'dashboard' : 'home')}
            onSuccess={() => setActiveTab('dashboard')}
          />
        )}

        {/* User Profile Page */}
        {activeTab === 'profile' && (
          <ProfilePage
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
          />
        )}

        {/* Role Authenticated Dashboard */}
        {activeTab === 'dashboard' && renderDashboard()}

        {/* City Geospatial Map */}
        {activeTab === 'map' && (
          <CityMapViewPage 
            complaints={complaints}
            onSelectComplaint={setSelectedComplaint}
          />
        )}

        {/* Analytics & Reports */}
        {activeTab === 'analytics' && (
          <AnalyticsPage complaints={complaints} />
        )}

        {/* About Blueprint */}
        {activeTab === 'about' && (
          <AboutPage 
            onOpenReport={handleTriggerReport} 
          />
        )}
      </main>

      {/* Floating Action Button (Mobile report complaint) */}
      <button
        onClick={handleTriggerReport}
        className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition"
        title="Report Problem"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Report Complaint Modal */}
      <ReportComplaintModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onCreated={handleComplaintCreated}
      />

      {/* Complaint Detail & Workflow Stepper Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdated={handleComplaintUpdated}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900">Gandhinagar Civic Connect</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Empowering citizens of Gandhinagar with a direct digital connection to municipal corporators, administrators, and field resolution teams.
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-2 uppercase text-[11px] tracking-wider">Quick Navigation</span>
              <ul className="space-y-1.5 text-slate-500">
                <li><button onClick={() => setActiveTab(currentUser ? 'dashboard' : 'home')} className="hover:text-emerald-600">Portal Home</button></li>
                <li><button onClick={() => setActiveTab('map')} className="hover:text-emerald-600">OpenStreetMap Sector View</button></li>
                <li><button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-600">Governance Analytics</button></li>
                <li><button onClick={() => handleOpenAuth('login')} className="hover:text-emerald-600">Citizen & Official Login</button></li>
                <li><button onClick={() => handleOpenAuth('register')} className="hover:text-emerald-600">Register Account (Database)</button></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-2 uppercase text-[11px] tracking-wider">Covered Regions</span>
              <ul className="space-y-1.5 text-slate-500 text-[11px]">
                <li>Sectors 1 to 30 (Capital Complex)</li>
                <li>Infocity & GIFT City Corridor</li>
                <li>Kudasan, Sargasan, Vavol, Bhaijipura</li>
                <li>Pethapur Heritage Ward</li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-2 uppercase text-[11px] tracking-wider">Municipal Helplines</span>
              <div className="space-y-1 text-slate-500 text-[11px]">
                <p>📍 GMC Head Office, Sector 17, Gandhinagar</p>
                <p>📞 Emergency Toll-Free: 1800-233-0000</p>
                <p>✉️ civic-support@gandhinagar.gov.in</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <span>© 2026 Gandhinagar Municipal Corporation (GMC). All rights reserved.</span>
            <span>Database Connected • Full Authentication & Governance Suite</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
