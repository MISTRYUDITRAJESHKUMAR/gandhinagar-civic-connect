import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  HardHat, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  FileCheck2,
  Calendar,
  Sparkles,
  Play
} from 'lucide-react';

export const AboutPage = ({ onOpenReport }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Building2 className="w-4 h-4" />
          <span>Gandhinagar Municipal Corporation (GMC) Civic Connect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Every Citizen. Every Ward. One Digital Connection.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Corporators and municipal officers cannot personally identify every civic issue across every street every day. 
          This platform enables citizens to report ground-level problems directly, while authorized departments verify, assign, resolve, and monitor them with verifiable completion proof.
        </p>
      </div>

      {/* 5 Distinct Roles Architecture */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 text-center uppercase tracking-wider">
          5 Autonomous Municipal Roles & Dashboards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">1. Citizen</h3>
            <p className="text-xs text-slate-600">
              Lodge complaints with photo & GPS, track real-time milestones, submit 5-star ratings, or reopen unresolved issues.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">2. Municipal Admin</h3>
            <p className="text-xs text-slate-600">
              City-wide verification desk, duplicate detection, department allocation, priority assignment, and SLA tracking.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">3. Ward Corporator</h3>
            <p className="text-xs text-slate-600">
              Ward-wise incident monitoring, hotspot detection, coordination, and citizen representation oversight.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">4. Dept Officer</h3>
            <p className="text-xs text-slate-600">
              Dispatch work orders to field teams, specify instructions and target dates, and verify completed proof before closing.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HardHat className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">5. Field Worker</h3>
            <p className="text-xs text-slate-600">
              Mobile-first work order checklist, GPS navigation, start timestamp, and upload of before/after resolution proof photos.
            </p>
          </div>
        </div>
      </div>

      {/* 11 Steps Workflow */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Complete 11-Step End-to-End Workflow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {[
            { num: '01', title: 'Citizen Registration', desc: 'Register and Sign In with Email & Password to create verified citizen profile.' },
            { num: '02', title: 'Report a Problem', desc: 'Select category, take photo, pin location on Leaflet OpenStreetMap.' },
            { num: '03', title: 'Complaint Creation', desc: 'Automatic unique ID generation (GCC-2026-000XXX) with timestamp.' },
            { num: '04', title: 'Admin Verification', desc: 'Admin checks authenticity, photo clarity, and duplicate detection.' },
            { num: '05', title: 'Ward Identification', desc: 'Ward mapped automatically to the relevant Corporator area.' },
            { num: '06', title: 'Department Assignment', desc: 'Admin routes to Sanitation, Roads, Streetlights, or Drainage.' },
            { num: '07', title: 'Department Action', desc: 'Officer creates work order and dispatches assigned field worker.' },
            { num: '08', title: 'Field Worker Action', desc: 'Worker visits spot, executes work, and captures completion photos.' },
            { num: '09', title: 'Officer Verification', desc: 'Officer inspects proof: Approves (Resolved) or sends back for rework.' },
            { num: '10', title: 'Citizen Feedback', desc: 'Citizen receives notification, submits star review, or reopens.' },
            { num: '11', title: 'Final Closure & Audit', desc: 'Case marked closed with immutable status change audit trail.' },
          ].map((s) => (
            <div key={s.num} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-mono text-emerald-600 font-bold text-xs">STEP {s.num}</span>
              <h4 className="font-bold text-slate-900">{s.title}</h4>
              <p className="text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot Plan & Testing Guide */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Recommended 90-Day Municipal Pilot Strategy</span>
        </div>
        <h3 className="text-xl font-bold">Ready for Government Evaluation & Pilot Launch</h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          The platform has been engineered strictly according to the complete Gandhinagar Civic Connect blueprint. 
          Sign in with designated municipal accounts to experience the complete verification, assignment, worker execution, and citizen feedback loop!
        </p>
      </div>
    </div>
  );
};
