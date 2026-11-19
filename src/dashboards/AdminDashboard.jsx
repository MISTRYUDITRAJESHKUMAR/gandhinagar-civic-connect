import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DEPARTMENTS, INITIAL_WARDS } from '../data/initialData';
import { dataService } from '../services/dataService';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  MapPin, 
  ArrowRight, 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = ({ 
  complaints = [], 
  onSelectComplaint, 
  onRefresh 
}) => {
  const { currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');

  // Verification Queue: Needs admin check
  const verificationQueue = complaints.filter(c => c.status === 'Submitted');

  // Filtered City Complaints
  const filtered = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (deptFilter !== 'All' && c.departmentId !== deptFilter) return false;
    if (wardFilter !== 'All' && c.wardId !== wardFilter) return false;
    if (searchTerm) {
      const match = 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.landmark && c.landmark.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.citizenName && c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  const total = complaints.length;
  const underVerification = verificationQueue.length;
  const inAction = complaints.filter(c => ['Assigned', 'In Progress', 'Resolution Submitted'].includes(c.status)).length;
  const resolved = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2 border border-rose-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gandhinagar Municipal Corporation (GMC) Admin Control Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              City-Wide Civic Operations Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Administrator: <strong>{currentUser?.name || 'S. K. Mehta (IAS)'}</strong> | City-wide verification, department allocation, SLA enforcement, and analytics.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Total Wards</span>
              <span className="text-xl font-bold text-white">{INITIAL_WARDS.length} Wards</span>
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">Departments</span>
              <span className="text-xl font-bold text-white">{INITIAL_DEPARTMENTS.length} Depts</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total City Lodged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-500">Across all {INITIAL_WARDS.length} wards</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Needs Verification
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">{underVerification}</div>
          <span className="text-[11px] text-rose-800 font-semibold">Immediate action queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-sky-600 uppercase">In Active Resolution</span>
          <div className="text-2xl font-black text-sky-600 mt-1">{inAction}</div>
          <span className="text-[11px] text-slate-500">Field work dispatched</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase">Resolved & Closed</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolved}</div>
          <span className="text-[11px] text-slate-500">With completion proof</span>
        </div>
      </div>

      {/* PRIORITY 1: VERIFICATION QUEUE (Step 4 from blueprint) */}
      <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-md overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow">
              {verificationQueue.length}
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
                Pending Verification Queue
              </h2>
              <p className="text-xs text-rose-700">New citizen submissions requiring admin genuineness check & department assignment</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Review Step 4 & 6
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {verificationQueue.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
              <span className="font-bold text-slate-800">Verification queue is completely clear!</span>
              <span>All reported issues have been verified and allocated.</span>
            </div>
          ) : (
            verificationQueue.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {c.media?.[0]?.url ? (
                      <img src={c.media[0].url} alt="Proof" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Photo</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        {c.category}
                      </span>
                      {c.priority === 'Urgent' && (
                        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.description}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>📍 {c.landmark || 'Gandhinagar'}</span>
                      <span>•</span>
                      <span>By: {c.citizenName} ({c.citizenMobile})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onSelectComplaint(c)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                  >
                    <span>Verify & Assign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* City-Wide Complaint Database */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">City Complaints Directory</h2>
              <p className="text-xs text-slate-500">Filter, inspect, and monitor complaints across all departments</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, category, area..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Verified">Verified</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolution Submitted">Resolution Submitted</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All">All Departments</option>
                {INITIAL_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ward</label>
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All">All Wards</option>
                {INITIAL_WARDS.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No matching complaints found.</div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="p-4 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">{c.category}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {c.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{c.description}</p>
                  <span className="text-[11px] text-slate-400 block">
                    📍 {c.landmark || 'Gandhinagar'} | Target: {c.targetDate || 'Standard SLA'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                    {c.assignedOfficerName || 'Not Assigned'}
                  </span>
                  <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition">
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
