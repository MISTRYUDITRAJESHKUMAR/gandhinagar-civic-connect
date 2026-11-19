import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GANDHINAGAR_CENTER } from '../../data/initialData';
import { MapPin, Navigation, ExternalLink, AlertCircle } from 'lucide-react';

// Create custom color-coded HTML DivIcon
const createCustomIcon = (color = '#16a34a', isSelected = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${isSelected ? '36px' : '28px'};
        height: ${isSelected ? '36px' : '28px'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
    iconAnchor: [isSelected ? 18 : 14, isSelected ? 36 : 28],
    popupAnchor: [0, -32]
  });
};

const getStatusColor = (status, priority) => {
  if (priority === 'Urgent') return '#dc2626'; // Red
  switch (status) {
    case 'Submitted': return '#f59e0b'; // Amber
    case 'Verified': return '#3b82f6'; // Blue
    case 'Assigned': return '#8b5cf6'; // Purple
    case 'In Progress': return '#0284c7'; // Sky
    case 'Resolution Submitted': return '#06b6d4'; // Cyan
    case 'Resolved': return '#16a34a'; // Green
    case 'Closed': return '#10b981'; // Emerald
    case 'Reopened': return '#e11d48'; // Rose
    case 'Rejected': return '#64748b'; // Slate
    default: return '#16a34a';
  }
};

// Sub-component to handle map click in picker mode
const LocationPickerHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6))
      });
    }
  });
  return null;
};

// Sub-component to fly to selected location
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 15, { animate: true, duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

export const CivicMap = ({
  mode = 'viewer', // 'viewer' | 'picker'
  complaints = [],
  selectedComplaint = null,
  onSelectComplaint = null,
  onOpenModal = null,
  pickedLocation = null,
  onPickLocation = null,
  height = '420px',
  zoom = 13,
  center = GANDHINAGAR_CENTER
}) => {
  const [currentGpsLoading, setCurrentGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const handleGetCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }
    setCurrentGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6))
        };
        if (onPickLocation) onPickLocation(coords);
        setCurrentGpsLoading(false);
      },
      (err) => {
        console.warn("GPS lookup fallback:", err);
        // Fallback to Gandhinagar center with small offset
        const fallback = { lat: 23.2200, lng: 72.6400 };
        if (onPickLocation) onPickLocation(fallback);
        setCurrentGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const mapCenter = pickedLocation 
    ? [pickedLocation.lat, pickedLocation.lng] 
    : (selectedComplaint?.location?.lat ? [selectedComplaint.location.lat, selectedComplaint.location.lng] : center);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100" style={{ height }}>
      {/* Interactive Controls Overlay for Picker */}
      {mode === 'picker' && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGetCurrentGps}
            disabled={currentGpsLoading}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur text-slate-800 text-xs font-semibold rounded-xl shadow-md border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition"
          >
            <Navigation className={`w-4 h-4 text-emerald-600 ${currentGpsLoading ? 'animate-spin' : ''}`} />
            {currentGpsLoading ? 'Locating...' : 'Auto-Detect My GPS'}
          </button>
          
          <div className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click anywhere on Gandhinagar map to pin location</span>
          </div>
        </div>
      )}

      {/* Map Legend Overlay for Viewer */}
      {mode === 'viewer' && complaints.length > 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 text-[11px] flex flex-wrap gap-2.5 items-center">
          <span className="font-bold text-slate-700">Legend:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Urgent</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Submitted</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> In Progress</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Resolved</span>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} />

        {/* Picker Mode Single Marker */}
        {mode === 'picker' && (
          <>
            <LocationPickerHandler onLocationSelect={onPickLocation} />
            {pickedLocation && (
              <Marker
                position={[pickedLocation.lat, pickedLocation.lng]}
                icon={createCustomIcon('#16a34a', true)}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-emerald-700">Selected Incident Spot</p>
                    <p className="text-slate-600 mt-1">Lat: {pickedLocation.lat}</p>
                    <p className="text-slate-600">Lng: {pickedLocation.lng}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Viewer Mode Multiple Markers */}
        {mode === 'viewer' && complaints.map((c) => {
          if (!c.location?.lat || !c.location?.lng) return null;
          const isSelected = selectedComplaint?.id === c.id;
          const color = getStatusColor(c.status, c.priority);

          return (
            <Marker
              key={c.id}
              position={[c.location.lat, c.location.lng]}
              icon={createCustomIcon(color, isSelected)}
              eventHandlers={{
                click: () => onSelectComplaint && onSelectComplaint(c)
              }}
            >
              <Popup>
                <div className="min-w-[210px] p-1 font-sans">
                  <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-800">{c.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </div>
                  {c.media?.[0]?.url && (
                    <img 
                      src={c.media[0].url} 
                      alt="Complaint" 
                      className="w-full h-24 object-cover rounded-md mb-1.5"
                    />
                  )}
                  <p className="text-xs font-semibold text-slate-900 leading-tight mb-1">{c.category}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{c.description}</p>
                  <p className="text-[10px] text-slate-500 mb-2 font-medium">📍 {c.landmark || c.location?.address}</p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenModal) {
                        onOpenModal(c);
                      } else if (onSelectComplaint) {
                        onSelectComplaint(c);
                      }
                    }}
                    className="w-full py-1.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Complaint Details</span>
                    <span>→</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
