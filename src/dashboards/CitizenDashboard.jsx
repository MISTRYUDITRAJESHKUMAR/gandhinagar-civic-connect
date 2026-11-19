import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  MapPin, 
  ChevronRight, 
  Filter, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CitizenDashboard = ({ 
  complaints = [], 
  onOpenReport, 
  onSelectComplaint 
}) => {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter complaints for this citizen
  const myComplaints = complaints.filter(c => c.citizenId === currentUser?.id || !c.citizenId);

  const filtered = myComplaints.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const total = myComplaints.length;
  const inProgress = myComplaints.filter(c => ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolution Submitted'].includes(c.status)).length;
  const resolved = myComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const reopened = myComplaints.filter(c => c.status === 'Reopened').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Verified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'In Progress':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Resolution Submitted':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Closed':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'Reopened':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gandhinagar Citizen Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {currentUser?.name || 'Citizen'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Report civic issues in your sector, track live ground resolution, and provide feedback directly to Gandhinagar Municipal authorities.
            </p>
          </div>

          <button
            onClick={onOpenReport}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Report New Problem</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">My Complaints</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-500">Total submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-amber-500 uppercase">In Progress</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{inProgress}</div>
          <span className="text-[11px] text-slate-500">Under municipal action</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-500 uppercase">Resolved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolved}</div>
          <span className="text-[11px] text-slate-500">Fixed & verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-500 uppercase">Reopened</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{reopened}</div>
          <span className="text-[11px] text-slate-500">Awaiting rework</span>
        </div>
      </div>

      {/* Complaints List & Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Lodged Complaints & Real-Time Tracking</h2>
            <p className="text-xs text-slate-500">Select any complaint to view complete verification, worker proof, and timeline.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['All', 'Submitted', 'In Progress', 'Resolution Submitted', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                  statusFilter === st 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Rows */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No complaints found</p>
              <p className="text-xs text-slate-400 mt-1">Lodge a new civic problem or change the filter.</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Photo or Icon */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {c.media?.[0]?.url ? (
                      <img src={c.media[0].url} alt="Proof" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                        GMC
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                      {c.priority === 'Urgent' && (
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                          Urgent
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{c.category}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">{c.description}</p>
                    
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.landmark || 'Gandhinagar'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right hidden md:block">
                    <span className="text-[11px] text-slate-400 block">Current Action</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {c.assignedOfficerName || 'Awaiting Verification'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition"
                  >
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
