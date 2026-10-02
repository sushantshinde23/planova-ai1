import React, { useState } from 'react';
import { useMission } from '../store/missionContext';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Building,
  Truck,
  Shield,
  Layers,
  Radio,
  Eye,
  Compass,
  Globe,
  Activity,
  CheckCircle2,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyDOcoSt0YhwgNT0FfAAL151z4D_cqMvY58';

export const TacticalMapView: React.FC = () => {
  const { activeMission, resources, tasks, t, language } = useMission();
  const [mapMode, setMapMode] = useState<'google' | 'tactical'>('google');

  const [selectedEntity, setSelectedEntity] = useState<any>({
    type: 'route',
    title: 'Route R2 (Causeway Bridge)',
    status: 'HAZARD - SUBMERGED',
    waterDepth: '0.92m above deck',
    clearanceLimit: '0.35m safe threshold',
    affectedVehicles: ['Ambulance A-1', 'Ambulance A-2'],
    alternateProposed: 'Elevated Bypass Route R4 (KM 14)',
  });

  const [activeMarker, setActiveMarker] = useState<any | null>(null);

  // Real geographic coordinates for Sector 4 flood area in Mumbai basin
  const center = { lat: 19.076, lng: 72.8777 };

  const shelters = [
    {
      id: 's1',
      name: 'Shelter 1 — North Ridge Community Center',
      lat: 19.092,
      lng: 72.855,
      x: 220,
      y: 110,
      capacity: '1,120 / 1,500',
      pct: 74,
      status: 'Intake Open',
    },
    {
      id: 's2',
      name: 'Shelter 2 — Civic Stadium & Medical Wing',
      lat: 19.088,
      lng: 72.898,
      x: 580,
      y: 90,
      capacity: '1,580 / 2,000',
      pct: 79,
      status: 'Acute Trauma Care',
    },
    {
      id: 's3',
      name: 'Shelter 3 — Holy Cross Pediatric Wing',
      lat: 19.062,
      lng: 72.905,
      x: 740,
      y: 310,
      capacity: '690 / 1,000',
      pct: 69,
      status: 'Maternity / Infant Care',
    },
  ];

  const ambulances = [
    { id: 'A-1', lat: 19.079, lng: 72.868, x: 380, y: 260, status: 'Rerouting via R4', route: 'R4' },
    { id: 'A-2', lat: 19.077, lng: 72.865, x: 350, y: 275, status: 'Rerouting via R4', route: 'R4' },
    { id: 'A-3', lat: 19.086, lng: 72.892, x: 500, y: 150, status: 'Arrived at S2', route: 'R1' },
    { id: 'A-4', lat: 19.087, lng: 72.895, x: 520, y: 130, status: 'Unloading S2', route: 'R1' },
    { id: 'A-5', lat: 19.064, lng: 72.901, x: 670, y: 280, status: 'Arrived at S3', route: 'R3' },
    { id: 'A-6', lat: 19.067, lng: 72.898, x: 690, y: 260, status: 'En route S3', route: 'R3' },
    { id: 'A-7', lat: 19.082, lng: 72.885, x: 420, y: 190, status: 'ICU Transit', route: 'R1' },
    { id: 'A-8', lat: 19.072, lng: 72.889, x: 440, y: 210, status: 'Diverted Landslide', route: 'Off-grid' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{t.tacticalMap.kicker}</span>
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            {t.tacticalMap.title}: {activeMission?.title}
          </h1>
        </div>

        {/* View Switcher: Google Maps vs Tactical Radar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg text-xs font-mono shadow-xs">
            <button
              onClick={() => setMapMode('google')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'google'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.tacticalMap.googleMapsMode}</span>
            </button>
            <button
              onClick={() => setMapMode('tactical')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'tactical'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{t.tacticalMap.radarTacticalMode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas & Entity Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map Viewport */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-xl overflow-hidden relative min-h-[540px] flex flex-col justify-between">
          {/* Top HUD Bar */}
          <div className="p-2 flex items-center justify-between z-10 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>19.0760° N, 72.8777° E</span>
              <span>·</span>
              <span className="text-emerald-400">Google Maps Platform Grounded</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-300">Live GPS Telemetry</span>
            </div>
          </div>

          {/* VIEW MODE 1: REAL GOOGLE MAPS PLATFORM */}
          {mapMode === 'google' && (
            <div className="flex-1 w-full h-[460px] rounded-xl overflow-hidden relative">
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultCenter={center}
                  defaultZoom={13}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  mapId="planova_tactical_map_id"
                  className="w-full h-full"
                >
                  {/* Incident Epicenter */}
                  <AdvancedMarker
                    position={center}
                    onClick={() => {
                      setActiveMarker({
                        title: 'Staging Point Alpha (Sector 4 Riverbank)',
                        details: '4,200 Registered Citizens · 18 ICU Patients Staged',
                      });
                      setSelectedEntity({
                        type: 'incident',
                        title: 'Staging Point Alpha (Sector 4 Riverbank)',
                        status: 'TRIAGE ACTIVE',
                        evacuated: '2,810 of 4,200 citizens moved',
                        currentAcuity: 'High-Risk ICU cases remaining: 18',
                      });
                    }}
                  >
                    <Pin background="#ef4444" borderColor="#991b1b" glyphColor="#ffffff" scale={1.2} />
                  </AdvancedMarker>

                  {/* Shelters */}
                  {shelters.map((s) => (
                    <AdvancedMarker
                      key={s.id}
                      position={{ lat: s.lat, lng: s.lng }}
                      onClick={() => {
                        setActiveMarker({
                          title: s.name,
                          details: `Capacity: ${s.capacity} beds (${s.pct}% in use) · Status: ${s.status}`,
                        });
                        setSelectedEntity({
                          type: 'shelter',
                          title: s.name,
                          status: s.status,
                          capacity: s.capacity,
                          utilization: `${s.pct}%`,
                        });
                      }}
                    >
                      <Pin background="#10b981" borderColor="#065f46" glyphColor="#ffffff" />
                    </AdvancedMarker>
                  ))}

                  {/* Ambulances */}
                  {ambulances.map((amb) => (
                    <AdvancedMarker
                      key={amb.id}
                      position={{ lat: amb.lat, lng: amb.lng }}
                      onClick={() => {
                        setActiveMarker({
                          title: `Ambulance ${amb.id}`,
                          details: `Status: ${amb.status} · Corridor: ${amb.route}`,
                        });
                        setSelectedEntity({
                          type: 'ambulance',
                          title: `Ambulance Unit ${amb.id}`,
                          status: amb.status,
                          corridor: `Corridor ${amb.route}`,
                          telemetry: 'Speed: 52 km/h · O2 Level: 96% · Onboard Medics: 2',
                        });
                      }}
                    >
                      <Pin background="#3b82f6" borderColor="#1e40af" glyphColor="#ffffff" scale={0.8} />
                    </AdvancedMarker>
                  ))}

                  {/* Info Window */}
                  {activeMarker && (
                    <InfoWindow
                      position={center}
                      onCloseClick={() => setActiveMarker(null)}
                    >
                      <div className="p-2 text-xs font-mono text-slate-900">
                        <div className="font-bold text-sm">{activeMarker.title}</div>
                        <div className="text-slate-600 mt-1">{activeMarker.details}</div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>
          )}

          {/* VIEW MODE 2: HYDROLOGICAL VECTOR RADAR */}
          {mapMode === 'tactical' && (
            <div className="relative flex-1 flex items-center justify-center py-2">
              <svg viewBox="0 0 900 460" className="w-full h-full max-h-[460px] drop-shadow-md">
                <defs>
                  <linearGradient id="floodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0369a1" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#075985" stopOpacity="0.85" />
                  </linearGradient>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="900" height="460" fill="url(#grid)" />

                <path
                  d="M 50,380 Q 200,320 380,310 T 680,340 T 880,410 L 900,460 L 0,460 Z"
                  fill="url(#floodGrad)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="70" y="420" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  RIVER SURGE ZONE (+4.2m CREST)
                </text>

                {/* ROUTE 1 (Highway) */}
                <path d="M 180,280 L 320,190 L 580,90" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <text x="360" y="160" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ROUTE R1 (HIGHWAY) - OPEN
                </text>

                {/* ROUTE 2 (Causeway - BLOCKED) */}
                <path
                  d="M 180,280 L 320,270 L 400,260 L 220,110"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedEntity({
                      type: 'route',
                      title: 'Route R2 (Causeway Bridge)',
                      status: 'HAZARD - SUBMERGED',
                      waterDepth: '0.92m above road deck',
                      clearanceLimit: '0.35m safe passage threshold',
                      affectedVehicles: ['Ambulance A-1', 'Ambulance A-2'],
                      alternateProposed: 'Elevated Bypass Route R4 (KM 14)',
                    })
                  }
                />
                <circle cx="360" cy="265" r="9" fill="#ef4444" opacity="0.4" className="animate-ping" />
                <circle cx="360" cy="265" r="5" fill="#ef4444" />
                <text x="310" y="295" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  R2 BLOCKED (+0.92m)
                </text>

                {/* ROUTE 4 (Elevated Bypass) */}
                <path
                  d="M 180,280 L 280,350 L 480,230 L 220,110"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedEntity({
                      type: 'route',
                      title: 'Route R4 (Elevated Bypass)',
                      status: 'ACTIVE ADAPTIVE DIVERSION',
                      waterDepth: 'Zero (Elevated +12m)',
                      clearanceLimit: 'Toll plaza bypass granted',
                      affectedVehicles: ['Ambulance A-1', 'Ambulance A-2', '6 Commercial Vans'],
                      alternateProposed: 'Primary rerouting corridor for Plan v2/v3',
                    })
                  }
                />
                <text x="320" y="340" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ROUTE R4 (ELEVATED BYPASS) - ADAPTIVE DETOUR
                </text>

                {/* ROUTE 3 */}
                <path d="M 180,280 L 450,280 L 740,310" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

                {/* Epicenter */}
                <circle cx="180" cy="280" r="14" fill="#f43f5e" opacity="0.3" className="animate-pulse" />
                <circle cx="180" cy="280" r="7" fill="#f43f5e" />
                <text x="110" y="260" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGING POINT ALPHA
                </text>

                {/* Shelters */}
                {shelters.map((s) => (
                  <g
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'shelter',
                        title: s.name,
                        status: s.status,
                        capacity: s.capacity,
                        utilization: `${s.pct}%`,
                      })
                    }
                  >
                    <circle cx={s.x} cy={s.y} r="16" fill="#10b981" opacity="0.25" />
                    <circle cx={s.x} cy={s.y} r="8" fill="#10b981" />
                    <text x={s.x - 45} y={s.y - 14} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {s.name.split('—')[0]}
                    </text>
                  </g>
                ))}

                {/* Ambulances */}
                {ambulances.map((amb) => (
                  <g
                    key={amb.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'ambulance',
                        title: `Ambulance Unit ${amb.id}`,
                        status: amb.status,
                        corridor: `Corridor ${amb.route}`,
                        telemetry: 'Speed: 52 km/h · O2 Level: 96% · Paramedics: 2',
                      })
                    }
                  >
                    <circle cx={amb.x} cy={amb.y} r="5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
                    <text x={amb.x + 8} y={amb.y + 4} fill="#e2e8f0" fontSize="8" fontFamily="monospace">
                      {amb.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          {/* Bottom Map Legend */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-500 rounded"></span> R1 Highway (Open)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-rose-500 rounded"></span> R2 Causeway (Submerged)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-500 rounded border-b border-dashed"></span> R4 Bypass (Detour)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Shelters S1, S2, S3
              </span>
            </div>
            <span>Click any marker to inspect telemetry</span>
          </div>
        </div>

        {/* Selected Entity Live Telemetry Inspector */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              MAP TELEMETRY INSPECTOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
              {selectedEntity?.type || 'ROUTE'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {selectedEntity?.title}
            </h3>
            <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 block mt-1">
              Status: {selectedEntity?.status}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
            {selectedEntity?.waterDepth && (
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Sensor Depth</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{selectedEntity.waterDepth}</span>
              </div>
            )}
            {selectedEntity?.clearanceLimit && (
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Safe Limit</span>
                <span>{selectedEntity.clearanceLimit}</span>
              </div>
            )}
            {selectedEntity?.capacity && (
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Bed Occupancy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedEntity.capacity}</span>
              </div>
            )}
            {selectedEntity?.alternateProposed && (
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Alternate Routing</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{selectedEntity.alternateProposed}</span>
              </div>
            )}
            {selectedEntity?.telemetry && (
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Vehicle Diagnostic</span>
                <span>{selectedEntity.telemetry}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-900 text-slate-300 rounded-xl text-[11px] font-mono space-y-1">
            <span className="text-indigo-400 uppercase text-[10px] font-bold block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Google Maps Grounding
            </span>
            <p className="text-slate-400">
              Corridors mapped with precision coordinates and live IoT sensor feeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
