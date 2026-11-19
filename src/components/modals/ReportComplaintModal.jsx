import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { COMPLAINT_CATEGORIES, INITIAL_WARDS } from '../../data/initialData';
import { CivicMap } from '../maps/CivicMap';
import { 
  X, 
  Upload, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Layers, 
  Trash2,
  FileText
} from 'lucide-react';

export const ReportComplaintModal = ({ isOpen, onClose, onCreated }) => {
  const { currentUser } = useAuth();
  
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0].label);
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [wardId, setWardId] = useState(currentUser?.wardId || 'W-04');
  const [location, setLocation] = useState({ lat: 23.2355, lng: 72.6480, address: 'Sector 21, Gandhinagar' });
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80');
  const [photoName, setPhotoName] = useState('sample_garbage_overflow.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicates, setDuplicates] = useState([]);

  // Check for duplicate issues whenever category or location changes
  useEffect(() => {
    if (location?.lat && location?.lng && category) {
      const found = dataService.detectDuplicates(category, location.lat, location.lng);
      setDuplicates(found);
    }
  }, [category, location]);

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a brief description of the issue');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = COMPLAINT_CATEGORIES.find(c => c.label === category);
      
      const complaintData = {
        citizenId: currentUser?.id || 'USR-CIT-01',
        citizenName: currentUser?.name || 'Citizen User',
        citizenMobile: currentUser?.mobile || '9876543210',
        category,
        description,
        landmark: landmark || 'Gandhinagar Ward Area',
        wardId,
        departmentId: selectedCat?.departmentId || 'DEP-SAN',
        priority: selectedCat?.defaultPriority || 'Medium',
        location: {
          lat: location.lat,
          lng: location.lng,
          address: landmark ? `${landmark}, Gandhinagar` : `Coordinates (${location.lat}, ${location.lng})`
        },
        media: photoPreview ? [{
          url: photoPreview,
          type: 'image/jpeg',
          caption: landmark || 'Complaint incident photo'
        }] : []
      };

      const created = await dataService.createComplaint(complaintData);
      setIsSubmitting(false);
      onCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to register complaint. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Report a Civic Problem</h2>
              <p className="text-xs text-emerald-100">Step 2: Lodge ground-level issue with photo and GPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate warning notification if detected within 250m */}
        {duplicates.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-bold">Possible Duplicate Detected ({duplicates.length}): </span>
              A similar "{category}" issue is already registered nearby ({duplicates[0].id}). 
              Our municipal team is already on it, but you can still submit if it's a new occurrence.
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Category & Ward Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Problem Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {COMPLAINT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Municipal Ward / Area *
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {INITIAL_WARDS.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Problem Description *
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem clearly (e.g. Overfilled garbage container spilling onto street, road pothole, streetlight not working)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            ></textarea>
          </div>

          {/* Landmark Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Landmark / Society / Street
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Sector 21 Shopping Center, Near Gate #3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Incident Photo / Proof *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Choose File from Device</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview Thumbnail */}
              {photoPreview && (
                <div className="w-full sm:w-1/2 relative rounded-2xl overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate">
                    {photoName}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Gandhinagar GPS Map Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Pinpoint Location on Gandhinagar Map *
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {location.lat}, {location.lng}
              </span>
            </div>

            <CivicMap
              mode="picker"
              pickedLocation={location}
              onPickLocation={(coords) => setLocation(coords)}
              height="240px"
              zoom={14}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Submitting to Municipal Grid...' : 'Submit Civic Complaint'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
