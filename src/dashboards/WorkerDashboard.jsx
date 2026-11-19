import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HardHat, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Navigation, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

export const WorkerDashboard = ({ 
  complaints = [], 
  onSelectComplaint 
}) => {
  const { currentUser } = useAuth();
  
  // Work assigned to this worker
  const myTasks = complaints.filter(c => 
    c.assignedWorkerId === currentUser?.id || 
    c.assignedWorkerName?.toLowerCase().includes('vikram') ||
    c.status === 'In Progress' ||
    c.status === 'Assigned'
  );

  const activeTasks = myTasks.filter(c => ['Assigned', 'In Progress'].includes(c.status));
  const completedTasks = myTasks.filter(c => ['Resolution Submitted', 'Resolved', 'Closed'].includes(c.status));

  return (
    <div className="space-y-6">
      {/* Mobile-Friendly Worker Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/20">
              <HardHat className="w-3.5 h-3.5" />
              <span>Field Worker Task Hub (Mobile Ready)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Task Orders: {currentUser?.name || 'Vikram Rathod'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              {currentUser?.designation || 'Field Sanitation Supervisor - Gandhinagar Sector Grid'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-blue-200 block uppercase font-bold">Active Work Orders</span>
            <span className="text-2xl font-black text-white">{activeTasks.length} Pending</span>
          </div>
        </div>
      </div>

      {/* Quick Task Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Assigned Tasks & Work Orders</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">{activeTasks.length} Active Jobs</span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">All assigned jobs are up to date!</p>
            <p className="text-xs text-slate-400 mt-0.5">New tasks from department officers will show up here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTasks.map((t) => (
              <div 
                key={t.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {t.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      t.status === 'In Progress' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.category}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.description}</p>
                  </div>

                  {/* Instructions from Officer */}
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Officer Instructions:
                    </div>
                    <p className="text-slate-700">
                      {t.workOrder?.instructions || 'Reach site, inspect civic problem, perform repairs and upload before/after photos.'}
                    </p>
                    <div className="text-[10px] text-blue-700 font-semibold pt-1">
                      Target Completion: {t.targetDate || 'Today'}
                    </div>
                  </div>

                  {/* Location & Navigation */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {t.landmark || 'Gandhinagar Sector'}
                    </span>

                    {t.location?.lat && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${t.location.lat},${t.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Open GPS</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Worker Action Trigger Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Officer: {t.assignedOfficerName || 'Officer Desk'}</span>
                  <button
                    onClick={() => onSelectComplaint(t)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.status === 'Assigned' ? 'Start Work' : 'Upload Proof'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks History */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">My Completed Tasks History ({completedTasks.length})</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {completedTasks.map(t => (
              <div key={t.id} onClick={() => onSelectComplaint(t)} className="p-4 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-800 mr-2">{t.id}</span>
                  <span className="text-xs font-bold text-slate-900">{t.category}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.landmark}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
