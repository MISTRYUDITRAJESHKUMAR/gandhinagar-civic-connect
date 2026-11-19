import React from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Phone, 
  Calendar,
  AlertTriangle,
  HardHat,
  ChevronRight
} from 'lucide-react';
import { COMPLAINT_CATEGORIES, INITIAL_WARDS } from '../data/initialData';

export const LandingPage = ({ 
  complaints = [], 
  onNavigateAuth, 
  onNavigateTab 
}) => {
  const total = complaints.length;
  const resolved = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const inProgress = complaints.filter(c => ['Assigned', 'In Progress', 'Resolution Submitted'].includes(c.status)).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  // Sample resolved complaints with before/after photos
  const resolvedShowcase = complaints.filter(c => c.workOrder?.afterPhoto || c.status === 'Resolved');

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-8 sm:p-14 shadow-2xl overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -top-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gandhinagar Municipal Corporation (GMC) Digital Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Every Citizen. Every Ward. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              One Digital Connection.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Corporators and municipal officers cannot personally inspect every street, society, and road every day. 
            <strong> Gandhinagar Civic Connect</strong> bridges this gap—empowering citizens to report ground-level civic problems directly with photos and GPS, while departments resolve them with verifiable photographic proof.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateAuth('register')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-500/30 active:scale-95 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Report a Problem (Citizen Login)</span>
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 backdrop-blur transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore City Map</span>
            </button>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{total}+</div>
              <div className="text-slate-400 text-[11px]">Civic Issues Lodged</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{resolutionRate}%</div>
              <div className="text-slate-400 text-[11px]">Clearance Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">10 Wards</div>
              <div className="text-slate-400 text-[11px]">Sectors 1 to 30 Covered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">24-48h</div>
              <div className="text-slate-400 text-[11px]">Average SLA Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP HOW IT WORKS */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Simple & Transparent Process</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">How Civic Connect Solves Problems</h2>
          <p className="text-xs text-slate-500">From citizen reporting on the road to municipal verification & completion.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-slate-100 absolute top-4 right-4">01</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Citizen Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizen clicks a photo of the overflowed garbage, road pothole, or dark streetlight. GPS coordinates are tagged automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-slate-100 absolute top-4 right-4">02</span>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Admin Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Municipal Admin checks photo authenticity, detects duplicates, assigns priority, and routes to the concerned department.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-slate-100 absolute top-4 right-4">03</span>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Ground Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Department officer dispatches field team. Worker reaches spot, cleans/repairs, and uploads Before & After proof photos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-slate-100 absolute top-4 right-4">04</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">4. Verified & Closed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Officer certifies resolution. Citizen receives instant notification, submits 5-star rating, or reopens if dissatisfied.
            </p>
          </div>
        </div>
      </section>

      {/* RESOLVED WITH PROOF SHOWCASE */}
      {resolvedShowcase.length > 0 && (
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Verifiable Civic Proof</span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">Recently Resolved in Gandhinagar</h2>
              <p className="text-xs text-slate-400">See photographic evidence uploaded by field workers upon task completion.</p>
            </div>

            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View all on City Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resolvedShowcase.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-300">{item.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Resolved & Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Before:</span>
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                      <img src={item.media?.[0]?.url || item.workOrder?.beforePhoto} alt="Before" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">After Resolution:</span>
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40">
                      <img src={item.workOrder?.afterPhoto || item.media?.[0]?.url} alt="After" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{item.category}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.landmark || item.location?.address}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPLAINT CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Municipal Coverage</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Any Civic Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COMPLAINT_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateAuth('register')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-2">
                  Priority: {cat.defaultPriority}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{cat.label}</h4>
              </div>
              <div className="pt-3 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                <span>Report Issue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET YOUR WARD CORPORATORS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Gandhinagar Ward Representatives & Corporators
            </h2>
            <p className="text-xs text-slate-500">Every ward has dedicated elected corporators monitoring your issues.</p>
          </div>
          <span className="text-xs text-purple-700 bg-purple-50 font-bold px-3 py-1 rounded-full">
            10 GMC Wards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_WARDS.slice(0, 6).map((w) => (
            <div key={w.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Ward {w.number}</span>
                <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Elected Rep</span>
              </div>
              <div className="font-semibold text-slate-700">{w.corporator}</div>
              <div className="text-[11px] text-slate-400">{w.area}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black">
          Be an Active Citizen of Gandhinagar Today!
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          Create your citizen account in seconds. Help maintain the cleanliness, safety, and infrastructure of Gujarat's Green Capital.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigateAuth('register')}
            className="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg transition"
          >
            Create Citizen Account & Save to Database
          </button>
        </div>
      </section>

    </div>
  );
};
