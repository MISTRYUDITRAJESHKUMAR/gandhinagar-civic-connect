import React, { useState } from 'react';
import { CivicMap } from '../components/maps/CivicMap';
import { INITIAL_DEPARTMENTS, INITIAL_WARDS } from '../data/initialData';
import { MapPin, Filter, Layers, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export const CityMapViewPage = ({ complaints = [], onSelectComplaint }) => {
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activePin, setActivePin] = useState(complaints[0] || null);

  const filtered = complaints.filter(c => {
    if (selectedWard !== 'All' && c.wardId !== selectedWard) return false;
    if (selectedDept !== 'All' && c.departmentId !== selectedDept) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive OpenStreetMap Geospatial View</span>
          </div>
          <h1 className="text-2xl font-bold">Gandhinagar Municipal Incident Map</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visualization of civic complaints across Sectors 1-30, Infocity, Kudasan, and Vavol.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="All">All Wards (10 Wards)</option>
            {INITIAL_WARDS.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {INITIAL_DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolution Submitted">Resolution Submitted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Map + Side Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Map Box */}
        <div className="lg:col-span-3 bg-white p-3 rounded-3xl border border-slate-200 shadow-xs">
          <CivicMap
            mode="viewer"
            complaints={filtered}
            selectedComplaint={activePin}
            onSelectComplaint={(c) => {
              setActivePin(c);
            }}
            onOpenModal={(c) => {
              setActivePin(c);
              if (onSelectComplaint) onSelectComplaint(c);
            }}
            height="560px"
            zoom={13}
          />
        </div>

        {/* Selected Pin Details Panel */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Incident Inspector
            </span>

            {activePin ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-100">
                  {activePin.media?.[0]?.url ? (
                    <img src={activePin.media[0].url} alt="Proof" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {activePin.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activePin.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{activePin.category}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activePin.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Landmark</span>
                    <span className="text-slate-800 font-semibold">{activePin.landmark}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Officer</span>
                    <span className="text-slate-800 font-semibold">{activePin.assignedOfficerName || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Date</span>
                    <span className="text-slate-800 font-semibold">{activePin.targetDate || 'Standard SLA'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Click any marker on the map to inspect its details
              </div>
            )}
          </div>

          {activePin && (
            <button
              type="button"
              onClick={() => {
                if (onSelectComplaint) onSelectComplaint(activePin);
              }}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Eye className="w-4 h-4" />
              <span>Open Full Case Modal</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
