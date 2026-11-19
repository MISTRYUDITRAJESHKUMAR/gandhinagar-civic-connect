import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_WARDS } from '../data/initialData';
import { CivicMap } from '../components/maps/CivicMap';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  FileSpreadsheet, 
  PhoneCall, 
  Send, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const CorporatorDashboard = ({ 
  complaints = [], 
  onSelectComplaint 
}) => {
  const { currentUser } = useAuth();
  const [selectedWardId, setSelectedWardId] = useState(currentUser?.wardId || 'W-04');
  const [activeCategory, setActiveCategory] = useState('All');

  const wardInfo = INITIAL_WARDS.find(w => w.id === selectedWardId) || INITIAL_WARDS[3];

  // Complaints in this ward
  const wardComplaints = complaints.filter(c => c.wardId === selectedWardId);
  const filtered = wardComplaints.filter(c => {
    if (activeCategory === 'All') return true;
    return c.category === activeCategory;
  });

  const total = wardComplaints.length;
  const resolved = wardComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const pending = total - resolved;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;
  const urgentCount = wardComplaints.filter(c => c.priority === 'Urgent' && !['Resolved', 'Closed'].includes(c.status)).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-400/20">
              <Users className="w-3.5 h-3.5" />
              <span>Ward Representative / Corporator Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {wardInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Corporator: <strong>{wardInfo.corporator}</strong> | Covered Sectors: {wardInfo.area}
            </p>
          </div>

          {/* Ward Switcher */}
          <div className="bg-white/10 backdrop-blur p-2 rounded-2xl border border-white/20">
            <label className="text-[10px] text-purple-200 block uppercase font-bold px-2 mb-1">
              Select Ward to Monitor
            </label>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="bg-purple-950/80 text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-purple-400/30 focus:outline-none"
            >
              {INITIAL_WARDS.map(w => (
                <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ward Performance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Ward Complaints</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-500">Reported by residents</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-600 uppercase">Resolution Rate</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{resolutionRate}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${resolutionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-500 uppercase">Active / Pending</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pending}</div>
          <span className="text-[11px] text-slate-500">With municipal depts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-red-500 uppercase">Urgent Attention</span>
          <div className="text-2xl font-black text-red-600 mt-1">{urgentCount}</div>
          <span className="text-[11px] text-slate-500">Needs coordination</span>
        </div>
      </div>

      {/* Ward Interactive Map & Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                Ward {wardInfo.number} Incident Geographical Grid
              </h2>
              <p className="text-xs text-slate-500">Interactive sector map showing complaint locations and statuses</p>
            </div>
          </div>

          <CivicMap
            mode="viewer"
            complaints={wardComplaints}
            onSelectComplaint={onSelectComplaint}
            height="340px"
            zoom={14}
            center={wardComplaints[0]?.location ? [wardComplaints[0].location.lat, wardComplaints[0].location.lng] : undefined}
          />
        </div>

        {/* Hotspots & Corporator Notes */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Frequent Problem Hotspots
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-amber-900">Sector 21 Vegetable Market</div>
              <p className="text-slate-600">Garbage container overflow reported 3 times this month. Recommended: Permanent twice-daily clearance round.</p>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">Responsible Dept: Sanitation</div>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-purple-900">CH-4 Intersection (Sec 16/17)</div>
              <p className="text-slate-600">Water accumulation post-rain leading to potholes. Road department patch work underway.</p>
              <div className="text-[10px] text-purple-700 font-semibold mt-1">Responsible Dept: Roads & Drainage</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => alert(`Ward ${wardInfo.number} report compiled! Generating official PDF summary for Municipal Commissioner review.`)}
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-purple-600 transition flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Ward Summary Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ward Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">All Registered Complaints in Ward {wardInfo.number}</h3>
          <span className="text-xs text-slate-400 font-medium">Click any row to view timeline or follow up</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No complaints registered in this ward yet.</div>
          ) : (
            filtered.map(c => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="p-4 hover:bg-purple-50/30 transition cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{c.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                    <span className="text-xs font-bold text-purple-700">{c.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{c.description}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">📍 {c.landmark || 'Gandhinagar'}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    Officer: {c.assignedOfficerName || 'Not Assigned'}
                  </span>
                  <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-purple-600 hover:text-white transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
