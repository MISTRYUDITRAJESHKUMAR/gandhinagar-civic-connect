import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  HardHat, 
  Send, 
  ChevronRight, 
  Layers, 
  AlertCircle,
  FileCheck,
  Calendar
} from 'lucide-react';

export const DepartmentDashboard = ({ 
  complaints = [], 
  onSelectComplaint 
}) => {
  const { currentUser } = useAuth();
  const [selectedDeptId, setSelectedDeptId] = useState(currentUser?.departmentId || 'DEP-SAN');
  const [statusTab, setStatusTab] = useState('all');

  const deptInfo = INITIAL_DEPARTMENTS.find(d => d.id === selectedDeptId) || INITIAL_DEPARTMENTS[0];

  // Complaints assigned to this department
  const deptComplaints = complaints.filter(c => c.departmentId === selectedDeptId);

  // Resolution verification queue (Field worker has submitted proof)
  const pendingProofVerification = deptComplaints.filter(c => c.status === 'Resolution Submitted');

  const filtered = deptComplaints.filter(c => {
    if (statusTab === 'verification') return c.status === 'Resolution Submitted';
    if (statusTab === 'active') return ['Assigned', 'In Progress'].includes(c.status);
    if (statusTab === 'resolved') return ['Resolved', 'Closed'].includes(c.status);
    return true;
  });

  const total = deptComplaints.length;
  const inProgress = deptComplaints.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length;
  const resolved = deptComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-yellow-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/20">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Department Officer Executive Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {deptInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 mt-1">
              Officer in Charge: <strong>{deptInfo.head}</strong> | Work Order Dispatch & Proof Verification
            </p>
          </div>

          {/* Department Switcher */}
          <div className="bg-white/10 backdrop-blur p-2 rounded-2xl border border-white/20">
            <label className="text-[10px] text-amber-200 block uppercase font-bold px-2 mb-1">
              Department View
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-amber-950/80 text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-amber-400/30 focus:outline-none"
            >
              {INITIAL_DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Assigned to Dept</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-500">From Municipal Admin</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1">
            <FileCheck className="w-3 h-3" /> Awaiting Verification
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingProofVerification.length}</div>
          <span className="text-[11px] text-amber-800 font-semibold">Worker proof uploaded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-sky-600 uppercase">Field Work In Progress</span>
          <div className="text-2xl font-black text-sky-600 mt-1">{inProgress}</div>
          <span className="text-[11px] text-slate-500">Under execution</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase">Officer Approved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolved}</div>
          <span className="text-[11px] text-slate-500">Certified resolved</span>
        </div>
      </div>

      {/* PRIORITY QUEUE: RESOLUTION VERIFICATION */}
      {pendingProofVerification.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-amber-400 shadow-md overflow-hidden">
          <div className="p-4 bg-amber-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-100" />
              <h3 className="text-sm font-bold">Field Work Proof Ready for Officer Verification ({pendingProofVerification.length})</h3>
            </div>
            <span className="text-xs text-amber-100 font-semibold">Step 9 in Blueprint</span>
          </div>

          <div className="p-4 divide-y divide-slate-100">
            {pendingProofVerification.map(c => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-300">
                    <img src={c.workOrder?.afterPhoto || c.media?.[0]?.url} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-800">{c.id}</span>
                    <h4 className="text-xs font-bold text-slate-900">{c.category}</h4>
                    <p className="text-xs text-slate-600">{c.workOrder?.notes || 'Resolution proof submitted'}</p>
                    <span className="text-[11px] text-emerald-700 font-semibold">Worker: {c.assignedWorkerName}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectComplaint(c)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Inspect & Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Complaint Registry */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Work Orders & Complaint Ledger</h3>
            <p className="text-xs text-slate-500">Dispatch field workers, set target dates, and review progress</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${statusTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              All ({deptComplaints.length})
            </button>
            <button
              onClick={() => setStatusTab('active')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${statusTab === 'active' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              In Progress ({inProgress})
            </button>
            <button
              onClick={() => setStatusTab('resolved')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${statusTab === 'resolved' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Resolved ({resolved})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No complaints in this category.</div>
          ) : (
            filtered.map(c => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="p-4 hover:bg-amber-50/20 transition cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                    <span className="text-xs font-bold text-amber-800">{c.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{c.description}</p>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>📍 {c.landmark}</span>
                    <span>•</span>
                    <span>Field Worker: <strong className="text-slate-700">{c.assignedWorkerName || 'Unassigned'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Date</span>
                    <span className="font-semibold text-slate-800">{c.targetDate || 'Standard'}</span>
                  </div>
                  <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-600 hover:text-white transition">
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
