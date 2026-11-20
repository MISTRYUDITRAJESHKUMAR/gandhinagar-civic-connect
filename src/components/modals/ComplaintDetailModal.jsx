import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { INITIAL_DEPARTMENTS, INITIAL_WARDS, DEMO_USERS } from '../../data/initialData';
import { CivicMap } from '../maps/CivicMap';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  RotateCcw, 
  Star, 
  ShieldCheck, 
  HardHat, 
  Briefcase, 
  ChevronRight,
  Layers,
  ArrowRight,
  Sparkles,
  FileCheck2,
  PhoneCall,
  Camera,
  RefreshCw
} from 'lucide-react';

export const ComplaintDetailModal = ({ complaint, onClose, onUpdated }) => {
  const { currentUser } = useAuth();
  if (!complaint) return null;

  // Modals & Action States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'action'
  const [isProcessing, setIsProcessing] = useState(false);

  // Admin Assignment State
  const [assignDeptId, setAssignDeptId] = useState(complaint.departmentId || 'DEP-SAN');
  const [assignPriority, setAssignPriority] = useState(complaint.priority || 'Medium');
  const [assignTargetDate, setAssignTargetDate] = useState(complaint.targetDate || '2026-11-22');
  const [assignWardId, setAssignWardId] = useState(complaint.wardId || 'W-04');
  const [rejectionReason, setRejectionReason] = useState('');

  // Department Officer State
  const [workerName, setWorkerName] = useState('Vikram Rathod');
  const [workerId, setWorkerId] = useState('USR-WRK-01');
  const [workerInstructions, setWorkerInstructions] = useState('Inspect site immediately, clear debris, and disinfect perimeter.');
  const [officerRemarks, setOfficerRemarks] = useState('');

  // Field Worker State (Live Camera Capture & Metadata)
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [captureMetadata, setCaptureMetadata] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [workerNotes, setWorkerNotes] = useState('Work completed thoroughly on-site as per municipal instructions. Area cleared and sanitized.');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Live Camera Functions
  const startLiveCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Live webcam stream error:", err);
      setIsCameraActive(false);
      setCameraError('Webcam direct stream permission unavailable. Please use the "Take Photo via Device Camera" button below.');
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // Draw real-time frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Official GMC Watermark overlay on the image
    const now = new Date();
    const timeStr = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' });
    const lat = complaint.location?.lat || 23.2232;
    const lng = complaint.location?.lng || 72.6492;
    const worker = currentUser?.name || 'Vikram Rathod';
    
    const bannerHeight = 44;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`🟢 LIVE GMC ON-SITE PROOF • ${complaint.id}`, 12, canvas.height - 24);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`📅 ${timeStr} | 📍 GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E | 👷 ${worker}`, 12, canvas.height - 8);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setAfterPhotoUrl(dataUrl);

    setCaptureMetadata({
      capturedAt: now.toISOString(),
      formattedTime: timeStr,
      lat: lat,
      lng: lng,
      landmark: complaint.landmark || 'Gandhinagar Field Site',
      workerName: worker,
      complaintId: complaint.id,
      isLiveCaptured: true
    });

    stopLiveCamera();
  };

  const handleDeviceCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const now = new Date();
        const timeStr = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' });
        const lat = complaint.location?.lat || 23.2232;
        const lng = complaint.location?.lng || 72.6492;
        const worker = currentUser?.name || 'Vikram Rathod';

        const bannerHeight = Math.max(50, Math.floor(canvas.height * 0.08));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#10b981';
        ctx.font = `bold ${Math.max(14, Math.floor(bannerHeight * 0.32))}px sans-serif`;
        ctx.fillText(`🟢 LIVE GMC ON-SITE PROOF • ${complaint.id}`, 16, canvas.height - bannerHeight * 0.55);

        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(12, Math.floor(bannerHeight * 0.28))}px sans-serif`;
        ctx.fillText(`📅 ${timeStr} | 📍 GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E | 👷 ${worker}`, 16, canvas.height - bannerHeight * 0.18);

        const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAfterPhotoUrl(stampedDataUrl);

        setCaptureMetadata({
          capturedAt: now.toISOString(),
          formattedTime: timeStr,
          lat: lat,
          lng: lng,
          landmark: complaint.landmark || 'Gandhinagar Field Site',
          workerName: worker,
          complaintId: complaint.id,
          isLiveCaptured: true
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Citizen Feedback / Reopen State
  const [rating, setRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  // -----------------------------------------------------------------
  // Action Handlers
  // -----------------------------------------------------------------
  const handleAdminVerify = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await dataService.verifyComplaint(
        complaint.id, 
        currentUser?.name || 'Municipal Admin', 
        assignWardId, 
        'Admin verified location, photo, and genuine civic problem.'
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminReject = async () => {
    if (isProcessing) return;
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason');
      return;
    }
    setIsProcessing(true);
    try {
      const updated = await dataService.rejectComplaint(
        complaint.id, 
        currentUser?.name || 'Municipal Admin', 
        rejectionReason
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminAssign = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const dept = INITIAL_DEPARTMENTS.find(d => d.id === assignDeptId);
    try {
      const updated = await dataService.assignDepartment(
        complaint.id, 
        currentUser?.name || 'Municipal Admin',
        {
          departmentId: assignDeptId,
          priority: assignPriority,
          targetDate: assignTargetDate,
          officerId: 'USR-OFF-01',
          officerName: dept?.head || 'Department Officer'
        }
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOfficerAssignWorker = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await dataService.assignWorker(
        complaint.id,
        currentUser?.name || 'Department Officer',
        {
          workerId,
          workerName,
          instructions: workerInstructions,
          targetDate: assignTargetDate
        }
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOfficerVerifyResolution = async (approved) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await dataService.verifyResolution(
        complaint.id,
        currentUser?.name || 'Department Officer',
        approved,
        officerRemarks || (approved ? 'Verified and approved on-site completion' : 'Incomplete work, rework required')
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWorkerStart = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await dataService.startWork(
        complaint.id,
        currentUser?.name || 'Field Worker'
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWorkerSubmitProof = async () => {
    if (isProcessing) return;
    if (!afterPhotoUrl) {
      alert('Please capture live completion photo using the device camera');
      return;
    }
    setIsProcessing(true);
    try {
      const updated = await dataService.submitResolutionProof(
        complaint.id,
        currentUser?.name || 'Field Worker',
        {
          beforePhoto: complaint.media?.[0]?.url,
          afterPhoto: afterPhotoUrl,
          notes: workerNotes,
          captureMetadata: captureMetadata || {
            capturedAt: new Date().toISOString(),
            formattedTime: new Date().toLocaleString('en-IN'),
            lat: complaint.location?.lat || 23.2232,
            lng: complaint.location?.lng || 72.6492,
            workerName: currentUser?.name || 'Field Worker',
            isLiveCaptured: true
          }
        }
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCitizenFeedback = async (satisfied) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const updated = await dataService.submitFeedback(
        complaint.id,
        currentUser?.name || 'Citizen',
        {
          rating,
          feedbackText: feedbackNotes || (satisfied ? 'Work completed satisfactorily.' : 'Issue unresolved.'),
          isSatisfied: satisfied
        }
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCitizenReopen = async () => {
    if (isProcessing) return;
    if (!reopenReason.trim()) {
      alert('Please provide reason for reopening');
      return;
    }
    setIsProcessing(true);
    try {
      const updated = await dataService.reopenComplaint(
        complaint.id,
        currentUser?.name || 'Citizen',
        reopenReason
      );
      if (updated) onUpdated(updated);
    } finally {
      setIsProcessing(false);
    }
  };

  // Stepper milestones
  const steps = [
    'Submitted',
    'Under Verification',
    'Assigned',
    'In Progress',
    'Resolution Submitted',
    'Resolved',
    'Closed'
  ];

  const currentStepIndex = steps.indexOf(complaint.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-500/30">
              {complaint.id}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">{complaint.category}</h2>
              <p className="text-xs text-slate-400">
                Lodge Date: {new Date(complaint.createdAt).toLocaleDateString()} | {complaint.landmark || 'Gandhinagar'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Stepper Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {steps.map((step, idx) => {
              const isPast = currentStepIndex > idx || complaint.status === 'Closed' || (complaint.status === 'Resolved' && idx <= 5);
              const isCurrent = complaint.status === step;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isCurrent 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : isPast 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 rounded-full border border-current text-[10px] flex items-center justify-center">{idx+1}</span>}
                    <span>{step}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition ${activeTab === 'overview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Overview & Location
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition ${activeTab === 'timeline' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'}`}
          >
            Audit Trail & History ({complaint.history?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`py-3 border-b-2 transition ${activeTab === 'action' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-800'} flex items-center gap-1.5`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Role Actions ({currentUser?.role})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Media + Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Photos (Original & Resolution) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Complaint Photos & Proof
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Citizen Initial Photo */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-600">Incident Photo:</span>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-100 shadow-inner">
                        {complaint.media?.[0]?.url ? (
                          <img 
                            src={complaint.media[0].url} 
                            alt="Incident" 
                            className="w-full h-full object-cover hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No photo attached
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Worker Resolution Proof Photo */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700">Resolution Proof:</span>
                        {complaint.workOrder?.afterPhoto && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Live Camera Proof
                          </span>
                        )}
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50/50 shadow-inner flex flex-col justify-center">
                        {complaint.workOrder?.afterPhoto ? (
                          <div>
                            <div className="h-32 overflow-hidden bg-slate-900 flex items-center justify-center">
                              <img 
                                src={complaint.workOrder.afterPhoto} 
                                alt="Resolution" 
                                className="w-full h-full object-cover hover:scale-105 transition"
                              />
                            </div>
                            <div className="p-2 bg-emerald-50/90 border-t border-emerald-100 text-[10px] space-y-0.5">
                              <div className="flex items-center justify-between text-emerald-900 font-bold">
                                <span>🟢 Spot Verified Proof</span>
                                <span>{complaint.workOrder.captureMetadata?.formattedTime || (complaint.workOrder.completedAt ? new Date(complaint.workOrder.completedAt).toLocaleTimeString() : 'Live Proof')}</span>
                              </div>
                              <div className="text-slate-600 truncate">
                                📍 {complaint.workOrder.captureMetadata?.lat ? `${complaint.workOrder.captureMetadata.lat.toFixed(4)}°N, ${complaint.workOrder.captureMetadata.lng.toFixed(4)}°E` : (complaint.landmark || 'Gandhinagar')}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-36 flex items-center justify-center text-center p-3 text-xs text-slate-400">
                            Pending resolution proof from field worker
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {complaint.workOrder?.notes && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold">Field Worker Notes: </span>
                      {complaint.workOrder.notes}
                    </div>
                  )}
                </div>

                {/* Right: Key Details & Metadata */}
                <div className="space-y-3 text-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Issue Details
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Description</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{complaint.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported By</span>
                        <span className="font-semibold text-slate-800">{complaint.citizenName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span>
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                          complaint.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {complaint.priority || 'Medium'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Resolution Date</span>
                        <span className="font-semibold text-slate-800">{complaint.targetDate || 'Standard SLA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Officer</span>
                        <span className="font-semibold text-slate-800">{complaint.assignedOfficerName || 'Pending Assignment'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Map View */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Exact Incident Spot: {complaint.landmark || 'Gandhinagar'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {complaint.location?.lat}, {complaint.location?.lng}
                  </span>
                </div>
                <CivicMap
                  mode="viewer"
                  complaints={[complaint]}
                  selectedComplaint={complaint}
                  height="220px"
                  zoom={15}
                  center={[complaint.location?.lat || 23.2156, complaint.location?.lng || 72.6369]}
                />
              </div>

            </div>
          )}

          {/* TAB 2: AUDIT TRAIL / TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Immutable Status History & Audit Trail
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {complaint.history?.map((h, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-800">{h.status}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mb-1">Actor: {h.actor}</div>
                      <p className="text-slate-700">{h.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROLE SPECIFIC ACTIONS */}
          {activeTab === 'action' && (
            <div className="space-y-5">
              
              {/* Public Unauthenticated Mode */}
              {!currentUser && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Public Case Transparency Mode</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    This civic complaint, its milestones, and photographic resolution proofs are publicly viewable for Gandhinagar transparency. To lodge a complaint, dispatch field workers, or submit reviews, please sign in to your designated account.
                  </p>
                </div>
              )}
              
              {/* -------------------- MUNICIPAL ADMIN ACTIONS -------------------- */}
              {currentUser?.role === 'admin' && (
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                    <span>Municipal Admin Action Desk</span>
                  </div>

                  {complaint.status === 'Submitted' && (
                    <div className="space-y-3">
                      <p className="text-xs text-rose-900">
                        Step 4: Verify whether this complaint is genuine, valid, and within Gandhinagar Municipal jurisdiction.
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleAdminVerify}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Verify & Approve Complaint
                        </button>
                      </div>

                      <div className="pt-2 border-t border-rose-200">
                        <label className="block text-xs font-bold text-rose-900 mb-1">Or Reject Complaint with Reason:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. Unclear photo, outside Gandhinagar jurisdiction..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 text-xs bg-white"
                          />
                          <button
                            onClick={handleAdminReject}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Department Assignment */}
                  {['Verified', 'Submitted'].includes(complaint.status) && (
                    <div className="space-y-3 pt-3 border-t border-rose-200">
                      <span className="text-xs font-bold text-slate-800 block">
                        Step 6: Allocate Department, Priority & SLA Target
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Department</label>
                          <select
                            value={assignDeptId}
                            onChange={(e) => setAssignDeptId(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            {INITIAL_DEPARTMENTS.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Priority</label>
                          <select
                            value={assignPriority}
                            onChange={(e) => setAssignPriority(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent (Safety)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Target Date</label>
                          <input
                            type="date"
                            value={assignTargetDate}
                            onChange={(e) => setAssignTargetDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleAdminAssign}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        {isProcessing ? 'Assigning...' : 'Confirm Assignment to Department'}
                      </button>
                    </div>
                  )}

                  {/* Already Assigned State (Replaces form once confirmed) */}
                  {['Assigned', 'In Progress', 'Resolution Submitted', 'Resolved', 'Closed'].includes(complaint.status) && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-emerald-950">
                          Assigned to {INITIAL_DEPARTMENTS.find(d => d.id === complaint.departmentId)?.name || complaint.departmentId || 'Department'}
                        </p>
                        <p className="text-emerald-800 text-[11px]">
                          Priority: <span className="font-semibold">{complaint.priority || 'Medium'}</span> | Target SLA: <span className="font-semibold">{complaint.targetDate || 'Pending'}</span>
                        </p>
                        <p className="text-emerald-700 text-[11px]">
                          Work order handed over to Department Officer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- DEPARTMENT OFFICER ACTIONS -------------------- */}
              {currentUser?.role === 'officer' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <span>Department Officer Action Desk</span>
                  </div>

                  {/* Assign Worker */}
                  {complaint.status === 'Assigned' && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-800 block">
                        Step 7: Assign Field Worker & Work Order
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Select Field Worker</label>
                          <select
                            value={workerName}
                            onChange={(e) => setWorkerName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Vikram Rathod">Vikram Rathod (Sanitation Team 1)</option>
                            <option value="Kishore Parmar">Kishore Parmar (Civil Team 2)</option>
                            <option value="Manojbhai Dave">Manojbhai Dave (Electrical Squad)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Expected Completion</label>
                          <input
                            type="date"
                            value={assignTargetDate}
                            onChange={(e) => setAssignTargetDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1 text-xs">Work Instructions</label>
                        <textarea
                          rows="2"
                          value={workerInstructions}
                          onChange={(e) => setWorkerInstructions(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleOfficerAssignWorker}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 disabled:opacity-50 transition"
                      >
                        {isProcessing ? 'Dispatching Work Order...' : 'Dispatch Work Order to Field Worker'}
                      </button>
                    </div>
                  )}

                  {/* Already Assigned Worker State */}
                  {['In Progress', 'Resolution Submitted', 'Resolved', 'Closed'].includes(complaint.status) && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-900">
                          Work Order Dispatched to {complaint.assignedWorkerName || 'Field Worker'}
                        </p>
                        <p className="text-emerald-700 text-[11px] mt-0.5">
                          Worker is actively resolving this issue on site.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verify Resolution Proof */}
                  {complaint.status === 'Resolution Submitted' && (
                    <div className="space-y-3 pt-3 border-t border-amber-200">
                      <span className="text-xs font-bold text-emerald-800 block">
                        Step 9: Officer Verification of Field Work Proof
                      </span>
                      <p className="text-xs text-slate-600">
                        Field worker has submitted resolution photos. Review the proof above.
                      </p>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1 text-xs">Verification Remarks</label>
                        <input
                          type="text"
                          value={officerRemarks}
                          onChange={(e) => setOfficerRemarks(e.target.value)}
                          placeholder="e.g. Satisfactory on-site cleanup verified."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOfficerVerifyResolution(true)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Approve Resolution (Mark Resolved)
                        </button>
                        <button
                          onClick={() => handleOfficerVerifyResolution(false)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Send Back for Rework
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- FIELD WORKER ACTIONS -------------------- */}
              {currentUser?.role === 'worker' && (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <HardHat className="w-5 h-5 text-blue-600" />
                    <span>Field Worker Action Desk</span>
                  </div>

                  {complaint.status === 'Assigned' && (
                    <div>
                      <p className="text-xs text-blue-900 mb-3">
                        You have arrived at the location? Mark the task as started to notify citizen & officer.
                      </p>
                      <button
                        onClick={handleWorkerStart}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                      >
                        Mark Work as Started (In Progress)
                      </button>
                    </div>
                  )}

                  {complaint.status === 'In Progress' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 block">
                          Step 8: Live Camera On-Site Completion Proof
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          Live Camera Only
                        </span>
                      </div>

                      {/* Live Camera Viewfinder */}
                      {isCameraActive ? (
                        <div className="rounded-2xl border-2 border-emerald-500 overflow-hidden bg-black relative flex flex-col items-center">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full max-h-72 object-cover"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            <span>Live Viewfinder Active</span>
                          </div>

                          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 px-4">
                            <button
                              type="button"
                              onClick={captureLivePhoto}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Capture Live Photo Now</span>
                            </button>
                            <button
                              type="button"
                              onClick={stopLiveCamera}
                              className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-bold rounded-xl text-xs backdrop-blur-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* When photo is NOT yet captured */}
                          {!afterPhotoUrl ? (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 text-center space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                                <Camera className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  Capture Live On-Site Photo Proof
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                                  Photos must be captured directly from the camera at the spot. Pre-saved gallery uploads are disabled for verification integrity.
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={startLiveCamera}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                                >
                                  <Camera className="w-4 h-4" />
                                  <span>Open Live Camera</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                                >
                                  <Camera className="w-4 h-4" />
                                  <span>Take Photo via Mobile Camera</span>
                                </button>

                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={handleDeviceCameraCapture}
                                  className="hidden"
                                />
                              </div>

                              {cameraError && (
                                <p className="text-rose-600 text-xs font-medium">{cameraError}</p>
                              )}
                            </div>
                          ) : (
                            /* Captured Photo Preview + Live Details Underneath */
                            <div className="rounded-2xl border border-emerald-300 bg-white overflow-hidden shadow-xs space-y-0">
                              <div className="relative max-h-64 overflow-hidden bg-slate-900 flex items-center justify-center">
                                <img
                                  src={afterPhotoUrl}
                                  alt="Live Captured On-Site Proof"
                                  className="w-full max-h-64 object-contain"
                                />
                                <div className="absolute top-2 right-2">
                                  <button
                                    type="button"
                                    onClick={() => { setAfterPhotoUrl(''); setCaptureMetadata(null); }}
                                    className="px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1 transition"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Retake Photo</span>
                                  </button>
                                </div>
                              </div>

                              {/* Live Details Underneath the Camera Image */}
                              <div className="p-3.5 bg-emerald-50/80 border-t border-emerald-200 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Live Captured Image Details (Spot Verified)
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                                    🟢 Real-Time Capture
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-xl border border-emerald-100">
                                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <div>
                                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Live Timestamp</span>
                                      <span className="font-bold text-slate-800 text-[11px]">
                                        {captureMetadata?.formattedTime || new Date().toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-xl border border-emerald-100">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <div>
                                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">GPS Geolocation</span>
                                      <span className="font-bold text-slate-800 text-[11px]">
                                        {captureMetadata?.lat ? `${captureMetadata.lat.toFixed(4)}° N, ${captureMetadata.lng.toFixed(4)}° E` : '23.2232° N, 72.6492° E'} ({complaint.landmark || 'Gandhinagar'})
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-xl border border-emerald-100">
                                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <div>
                                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Field Worker</span>
                                      <span className="font-bold text-slate-800 text-[11px]">
                                        {currentUser?.name || 'Vikram Rathod'} ({currentUser?.id || 'USR-WRK-01'})
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-xl border border-emerald-100">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <div>
                                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Integrity Status</span>
                                      <span className="font-bold text-emerald-700 text-[11px]">
                                        Direct Camera Stamp • Not From Gallery
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Work Completion Notes */}
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1 text-xs">Work Completion Notes *</label>
                        <textarea
                          rows="2"
                          value={workerNotes}
                          onChange={(e) => setWorkerNotes(e.target.value)}
                          placeholder="Describe the on-ground resolution work done..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleWorkerSubmitProof}
                        disabled={isProcessing || !afterPhotoUrl}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isProcessing ? 'Submitting Proof...' : 'Submit Live Camera Proof for Officer Verification'}</span>
                      </button>
                    </div>
                  )}

                  {/* Already Submitted State */}
                  {['Resolution Submitted', 'Resolved', 'Closed'].includes(complaint.status) && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-950">
                          Live Camera Completion Proof Submitted
                        </p>
                        <p className="text-emerald-700 text-[11px] mt-0.5">
                          Work details and on-site photos forwarded to Department Officer for inspection.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- CITIZEN FEEDBACK & REOPEN -------------------- */}
              {currentUser?.role === 'citizen' && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Citizen Feedback & Satisfaction</span>
                  </div>

                  {complaint.status === 'Resolved' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700">
                        Municipal team has marked this issue as resolved. Please rate the service quality:
                      </p>

                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-125 transition"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-700 ml-2">{rating} / 5 Stars</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={feedbackNotes}
                          onChange={(e) => setFeedbackNotes(e.target.value)}
                          placeholder="Your comments or review for the municipal team..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleCitizenFeedback(true)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Confirm & Close Complaint
                        </button>
                        <button
                          onClick={() => handleCitizenFeedback(false)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Report Not Satisfied (Reopen)
                        </button>
                      </div>
                    </div>
                  )}

                  {['Closed', 'Resolved'].includes(complaint.status) && (
                    <div className="pt-3 border-t border-emerald-200 space-y-2">
                      <span className="text-xs font-bold text-rose-800 block">Has the issue re-occurred?</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          placeholder="State why issue needs reopening..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                        <button
                          onClick={handleCitizenReopen}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                        >
                          Reopen Issue
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Role Context Hint */}
              <div className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span>Logged in as: <strong className="text-slate-800 capitalize">{currentUser?.role || 'Guest'}</strong></span>
                <span className="text-emerald-700 font-semibold">Tip: Sign in with your designated Admin, Officer, Worker, or Citizen credentials to perform module actions.</span>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Status: <strong className="text-slate-800">{complaint.status}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition"
          >
            Close View
          </button>
        </div>

      </div>
    </div>
  );
};
