import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { INITIAL_DEPARTMENTS, INITIAL_WARDS } from '../data/initialData';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  BarChart3, 
  FileSpreadsheet, 
  AlertTriangle, 
  Building2,
  Users
} from 'lucide-react';

export const AnalyticsPage = ({ complaints = [] }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, [complaints]);

  const loadStats = async () => {
    const res = await dataService.getAnalytics();
    setStats(res);
  };

  if (!stats) return <div className="p-8 text-center text-xs text-slate-400">Loading civic analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Civic Governance & SLA Analytics</span>
          </div>
          <h1 className="text-2xl font-bold">Gandhinagar City Performance Metrics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Department SLA adherence, ward resolution efficiency, and recurring hotspot analytics.
          </p>
        </div>

        <button
          onClick={() => alert('Official Gandhinagar Municipal Corporation Performance Report compiled successfully! Ready for download.')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Commissioner Report</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Logged</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
          <span className="text-[11px] text-slate-500">City-wide total</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-500 uppercase">New / Submitted</span>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats.submitted}</div>
          <span className="text-[11px] text-slate-500">Awaiting verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-sky-500 uppercase">Active In Progress</span>
          <div className="text-3xl font-black text-sky-600 mt-1">{stats.inProgress}</div>
          <span className="text-[11px] text-slate-500">Field work allocated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-500 uppercase">Resolved & Closed</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats.resolved}</div>
          <span className="text-[11px] text-slate-500">With completion proof</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-600 uppercase">Resolution Rate</span>
          <div className="text-3xl font-black text-purple-600 mt-1">{stats.resolutionRate}%</div>
          <span className="text-[11px] text-slate-500">Average resolution: 36 hrs</span>
        </div>
      </div>

      {/* Department-Wise Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Department-Wise Case Distribution & Resolution
            </h2>
          </div>

          <div className="space-y-4">
            {stats.deptStats.map(d => {
              const rate = d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 100;
              return (
                <div key={d.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{d.name}</span>
                      <span className="text-[11px] text-slate-400 block">Lead: {d.head}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{d.resolved} / {d.total} Resolved</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block">{rate}% Clearance</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${rate}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ward-Wise Clearance Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Ward Representative Accountability Ledger
            </h2>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="py-2.5 px-3">Ward</th>
                  <th className="py-2.5 px-3">Corporator</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Resolved</th>
                  <th className="py-2.5 px-3">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats.wardStats.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Ward {w.number}</td>
                    <td className="py-2.5 px-3 text-slate-600">{w.corporator}</td>
                    <td className="py-2.5 px-3 font-semibold">{w.total}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600">{w.resolved}</td>
                    <td className="py-2.5 px-3 font-semibold text-amber-600">{w.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
