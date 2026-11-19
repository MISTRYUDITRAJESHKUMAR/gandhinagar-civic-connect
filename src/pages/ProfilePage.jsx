import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_WARDS, INITIAL_DEPARTMENTS } from '../data/initialData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  HardHat, 
  Users, 
  CheckCircle2, 
  Edit3, 
  Save, 
  LogOut, 
  Clock, 
  Building2 
} from 'lucide-react';

export const ProfilePage = ({ complaints = [], onSelectComplaint }) => {
  const { currentUser, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [wardId, setWardId] = useState(currentUser?.wardId || 'W-04');
  const [address, setAddress] = useState(currentUser?.address || 'Gandhinagar, Gujarat');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const wardInfo = INITIAL_WARDS.find(w => w.id === currentUser.wardId) || INITIAL_WARDS[3];
  const deptInfo = INITIAL_DEPARTMENTS.find(d => d.id === currentUser.departmentId);

  // User complaints
  const userComplaints = complaints.filter(c => c.citizenId === currentUser.id);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name,
      mobile,
      wardId,
      address
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-emerald-600/20">
              {currentUser.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.designation || 'Gandhinagar Civic Portal Member'}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Account ID: <strong className="text-slate-700 font-mono">{currentUser.id}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Saved in Database</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updates successfully saved into the database!</span>
          </div>
        )}
      </div>

      {/* Edit Form or Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Contact & Ward Details */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {isEditing ? 'Edit Profile Details' : 'Account & Residential Information'}
          </h2>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Ward</label>
                  <select
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {INITIAL_WARDS.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Residential Address / Society</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save to Database</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                  <span className="font-semibold text-slate-800">{currentUser.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mobile Number</span>
                  <span className="font-semibold text-slate-800">{currentUser.mobile || 'Not set'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Residential Ward & Sectors</span>
                  <span className="font-semibold text-slate-800">{wardInfo.name}</span>
                  <span className="text-[11px] text-slate-500 block">Sectors: {wardInfo.area}</span>
                </div>
              </div>

              {deptInfo && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Municipal Department</span>
                    <span className="font-semibold text-slate-800">{deptInfo.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Personal Activity Stats */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Civic Activity Record
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Complaints Lodged</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{userComplaints.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-xs font-bold text-blue-800 uppercase block">Resolved with Proof</span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {userComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-600 uppercase block">Audit Verification</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Citizen ID
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
