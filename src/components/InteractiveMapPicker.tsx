import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Search, Check, Layers, AlertCircle } from 'lucide-react';

interface InteractiveMapPickerProps {
  latitude: number;
  longitude: number;
  radius: number;
  onChange: (coords: { lat: number; lng: number; address?: string }) => void;
  height?: string;
}

const SAUDI_CITIES_COORDS: Record<string, { lat: number; lng: number }> = {
  'الرياض': { lat: 24.7136, lng: 46.6753 },
  'جدة': { lat: 21.5433, lng: 39.1728 },
  'مكة المكرمة': { lat: 21.4225, lng: 39.8262 },
  'المدينة المنورة': { lat: 24.4672, lng: 39.6111 },
  'الدمام': { lat: 26.4344, lng: 50.1033 },
  'الخبر': { lat: 26.2818, lng: 50.2084 },
  'الظهران': { lat: 26.2361, lng: 50.0393 },
  'الأحساء - الهفوف': { lat: 25.3647, lng: 49.5857 },
  'القصيم - بريدة': { lat: 26.3592, lng: 43.9818 },
  'عنيزة': { lat: 26.0858, lng: 43.9936 },
  'حائل': { lat: 27.5236, lng: 41.6966 },
  'تبوك': { lat: 28.3835, lng: 36.5662 },
  'أبها': { lat: 18.2164, lng: 42.5053 },
  'خميس مشيط': { lat: 18.3000, lng: 42.7333 },
  'جازان': { lat: 16.8892, lng: 42.5706 },
  'نجران': { lat: 17.5656, lng: 44.2289 },
  'الطائف': { lat: 21.2841, lng: 40.4248 },
  'ينبع': { lat: 24.0895, lng: 38.0637 },
  'الجبيل': { lat: 27.0046, lng: 49.6601 },
  'حفر الباطن': { lat: 28.4328, lng: 45.9708 },
  'عرعر': { lat: 30.9753, lng: 41.0381 },
  'سكاكا': { lat: 29.9697, lng: 40.2064 },
};

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  latitude,
  longitude,
  radius,
  onChange,
  height = '360px',
}) => {
  const [zoom, setZoom] = useState(16);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Approximate GPS to Pixel math for tile preview
  // OpenStreetMap tile coordinates
  const latRad = (latitude * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const xTile = Math.floor(((longitude + 180) / 360) * n);
  const yTile = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle GPS Auto-detect
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChange({ lat, lng, address: 'موقعي الحالي (تم التحديد بنجاح)' });
        setZoom(17);
      },
      (err) => {
        setIsLocating(false);
        setGeoError('يرجى السماح بصلاحية الموقع من إعدادات المتصفح أو تحديد المكان على الخريطة');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle City search
  const handleSearchSelect = (cityName: string) => {
    const coords = SAUDI_CITIES_COORDS[cityName];
    if (coords) {
      onChange({ lat: coords.lat, lng: coords.lng, address: cityName });
      setSearchQuery('');
      setZoom(16);
    }
  };

  // Handle click on canvas/map area to reposition pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = clickX - centerX;
    const deltaY = clickY - centerY;

    // Convert pixel delta to approximate lat/lng delta based on zoom
    const metersPerPixel = (156543.03392 * Math.cos(latRad)) / Math.pow(2, zoom);
    const deltaMetersX = deltaX * metersPerPixel;
    const deltaMetersY = -deltaY * metersPerPixel;

    // 1 deg lat ~ 111,320m, 1 deg lng ~ 111,320 * cos(lat)
    const newLat = Number((latitude + deltaMetersY / 111320).toFixed(6));
    const newLng = Number((longitude + deltaMetersX / (111320 * Math.cos(latRad))).toFixed(6));

    onChange({ lat: newLat, lng: newLng });
  };

  // Filter city suggestions
  const filteredCities = Object.keys(SAUDI_CITIES_COORDS).filter((c) =>
    c.includes(searchQuery.trim())
  );

  return (
    <div className="space-y-3 font-sans" dir="rtl">
      {/* Top Search & Quick Jump Bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مدينة أو حي سريعاً (الرياض، جدة، مكة...)"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden font-bold"
          />
          {searchQuery.trim() && filteredCities.length > 0 && (
            <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto py-1">
              {filteredCities.map((cityName) => (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => handleSearchSelect(cityName)}
                  className="w-full text-right px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>{cityName}</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="تحديد موقعي الحالي بدقة GPS"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'جاري التحديد...' : 'موقعي الحالي (GPS)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200"
            title="تغيير نمط الخريطة"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mapType === 'streets' ? 'قمر صناعي' : 'خريطة شوارع'}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Map Visual Container */}
      <div
        ref={containerRef}
        onClick={handleMapClick}
        style={{ height }}
        className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-md bg-slate-100 cursor-crosshair select-none group"
      >
        {/* Real Dynamic Map Tile Background (OSM / Esri World Imagery) */}
        <iframe
          title="School Location Map"
          className="w-full h-full border-0 pointer-events-none"
          src={
            mapType === 'satellite'
              ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=k&z=${zoom}&ie=UTF8&iwloc=&output=embed`
              : `https://maps.google.com/maps?q=${latitude},${longitude}&t=m&z=${zoom}&ie=UTF8&iwloc=&output=embed`
          }
        />

        {/* Map Center Pin Indicator Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Geofence Perimeter Radius Circle */}
          <div
            style={{
              width: `${Math.min(280, Math.max(70, radius * 0.35))}px`,
              height: `${Math.min(280, Math.max(70, radius * 0.35))}px`,
            }}
            className="rounded-full border-2 border-dashed border-emerald-500 bg-emerald-500/15 animate-pulse flex items-center justify-center"
          >
            <span className="bg-emerald-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold shadow-xs">
              نطاق التحضير: {radius}م
            </span>
          </div>

          {/* Center Red Drop Pin */}
          <div className="absolute flex flex-col items-center -translate-y-6">
            <div className="relative">
              <MapPin className="w-9 h-9 text-rose-600 fill-rose-500 drop-shadow-lg filter" />
              <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
            </div>
            <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[1px] -mt-1" />
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setZoom(Math.min(20, zoom + 1))}
            className="w-8 h-8 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-800 rounded-lg shadow-md flex items-center justify-center font-bold text-sm border border-slate-200"
            title="تكبير الخريطة"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(Math.max(10, zoom - 1))}
            className="w-8 h-8 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-800 rounded-lg shadow-md flex items-center justify-center font-bold text-sm border border-slate-200"
            title="تصغير الخريطة"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Tip Badge */}
        <div className="absolute bottom-2 right-2 left-2 z-10 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              اضغط على أي مكان في الخريطة لنقل الدبوس فوراً 📍
            </span>
            <span className="font-mono text-emerald-300 text-[10px] dir-ltr">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Fine-Tuning Coordinates (Collapsible / Refined) */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-500 font-bold ml-1">خط العرض:</span>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => onChange({ lat: parseFloat(e.target.value) || 24.7136, lng: longitude })}
              className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-slate-900 font-mono font-bold w-24 text-center text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold ml-1">خط الطول:</span>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => onChange({ lat: latitude, lng: parseFloat(e.target.value) || 46.6753 })}
              className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-slate-900 font-mono font-bold w-24 text-center text-xs"
            />
          </div>
        </div>
        <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>الموقع محدد ومعتمد بدقة</span>
        </div>
      </div>
    </div>
  );
};
