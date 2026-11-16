import React, { useState, useRef } from 'react';
import { Viewpoint, CampusRoute } from '../types/tour';
import { CAMPUS_BUILDINGS, CAMPUS_GATES, CAMPUS_ZONES } from '../data/campusLayout';
import { ALL_VIEWPOINTS } from '../data/viewpoints';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';

interface CampusMiniMapProps {
  currentViewpoint: Viewpoint;
  cameraHeading: number;
  activeRoute: CampusRoute | null;
  onSelectViewpoint: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CampusMiniMap: React.FC<CampusMiniMapProps> = ({
  currentViewpoint,
  cameraHeading,
  activeRoute,
  onSelectViewpoint,
  isExpanded,
  onToggleExpand,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Center on current user
  const handleCenterOnUser = () => {
    setZoom(1.2);
    setPan({
      x: (500 - currentViewpoint.coordinates.x) * 0.8,
      y: (500 - currentViewpoint.coordinates.y) * 0.8
    });
  };

  // Build active route path coordinate string
  let routePathD = '';
  if (activeRoute && activeRoute.path.length > 1) {
    const coords = activeRoute.path
      .map((id) => {
        const vp = ALL_VIEWPOINTS.find((v) => v.id === id);
        return vp ? `${vp.coordinates.x},${vp.coordinates.y}` : null;
      })
      .filter(Boolean);
    if (coords.length > 1) {
      routePathD = `M ${coords.join(' L ')}`;
    }
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out shadow-street rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/95 backdrop-blur-xl flex flex-col ${
        isExpanded
          ? 'fixed inset-6 sm:inset-12 z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
          : 'w-72 h-48 sm:w-80 sm:h-56'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <Navigation className="w-3.5 h-3.5" />
          <span>Interactive Campus Map</span>
          {activeRoute && (
            <span className="text-[10px] bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded-full">
              Route: {activeRoute.totalDistance}m
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCenterOnUser}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            title="Center on Current Position"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map SVG Canvas Area */}
      <div
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden bg-[#0c1424]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Base Grid Pattern */}
          <defs>
            <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            {/* Field of View Cone Gradient */}
            <radialGradient id="fovConeGrad" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="1000" fill="#090e17" />
          <rect width="1000" height="1000" fill="url(#campusGrid)" />

          {/* Campus Boundary Fence */}
          <rect
            x="40"
            y="40"
            width="920"
            height="920"
            rx="24"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeDasharray="12 6"
          />

          {/* Green Landscaping Zones */}
          {CAMPUS_ZONES.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx="8"
                fill={zone.color}
                fillOpacity={zone.type === 'garden' ? 0.25 : 0.2}
                stroke={zone.color}
                strokeOpacity={0.6}
                strokeWidth="1.5"
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 4}
                fill="#ffffff"
                fillOpacity={0.8}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Road Network */}
          {/* 1. Main 800m Avenue (South Gate to Academic Plaza) */}
          <path
            d="M 500 950 L 500 460"
            stroke="#334155"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 500 950 L 500 460"
            stroke="#facc15"
            strokeWidth="2"
            strokeDasharray="12 12"
          />

          {/* 2. East Campus Road (Fountain to East Gate 2) */}
          <path
            d="M 500 710 L 670 690 L 880 650"
            stroke="#334155"
            strokeWidth="20"
            strokeLinejoin="round"
          />

          {/* 3. West Sports Road (Junction to Gate 3) */}
          <path
            d="M 500 630 L 380 620 L 260 660 L 120 600"
            stroke="#334155"
            strokeWidth="18"
            strokeLinejoin="round"
          />

          {/* 4. North Hostel Ring Road (Academic Rear to Hostels & Gate 4) */}
          <path
            d="M 500 390 L 450 220 L 500 40"
            stroke="#334155"
            strokeWidth="20"
            strokeLinejoin="round"
          />
          <path
            d="M 450 220 L 250 160"
            stroke="#334155"
            strokeWidth="14"
            strokeDasharray="6 4"
          />
          <path
            d="M 450 220 L 380 120"
            stroke="#334155"
            strokeWidth="14"
            strokeDasharray="6 4"
          />
          <path
            d="M 450 220 L 520 120"
            stroke="#334155"
            strokeWidth="14"
            strokeDasharray="6 4"
          />
          <path
            d="M 450 220 L 650 160"
            stroke="#334155"
            strokeWidth="14"
            strokeDasharray="6 4"
          />

          {/* Active Navigation Route Path Line */}
          {routePathD && (
            <path
              d={routePathD}
              stroke="#06b6d4"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          )}

          {/* Campus Buildings */}
          {CAMPUS_BUILDINGS.map((b) => (
            <g
              key={b.id}
              className="cursor-pointer group"
              onClick={() => onSelectViewpoint(b.floors[0].mainViewpointId)}
            >
              <rect
                x={b.mapCoordinates.x}
                y={b.mapCoordinates.y}
                width={b.mapCoordinates.width}
                height={b.mapCoordinates.height}
                rx="6"
                fill={
                  currentViewpoint.buildingId === b.id
                    ? '#4f46e5'
                    : b.category === 'academic'
                    ? '#1e293b'
                    : b.category === 'hostel'
                    ? '#1e1b4b'
                    : '#0f172a'
                }
                stroke={currentViewpoint.buildingId === b.id ? '#818cf8' : '#6366f1'}
                strokeWidth={currentViewpoint.buildingId === b.id ? 3 : 1.5}
                className="transition-colors duration-200 group-hover:fill-indigo-700/80"
              />
              <text
                x={b.mapCoordinates.x + b.mapCoordinates.width / 2}
                y={b.mapCoordinates.y + b.mapCoordinates.height / 2 - 2}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {b.name}
              </text>
              <text
                x={b.mapCoordinates.x + b.mapCoordinates.width / 2}
                y={b.mapCoordinates.y + b.mapCoordinates.height / 2 + 13}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
              >
                {b.totalFloors} Floors
              </text>
            </g>
          ))}

          {/* Campus Gates Markers */}
          {CAMPUS_GATES.map((g) => (
            <g
              key={g.id}
              className="cursor-pointer group"
              onClick={() => onSelectViewpoint(g.viewpointId)}
            >
              <circle
                cx={g.coordinates.x}
                cy={g.coordinates.y}
                r="10"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={g.coordinates.x}
                y={g.coordinates.y + 20}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {g.name}
              </text>
            </g>
          ))}

          {/* Outdoor Viewpoint Dots */}
          {ALL_VIEWPOINTS.filter((v) => v.category === 'outdoor' || v.floorLevel === 0).map((v) => (
            <circle
              key={v.id}
              cx={v.coordinates.x}
              cy={v.coordinates.y}
              r={currentViewpoint.id === v.id ? 7 : 4}
              fill={currentViewpoint.id === v.id ? '#38bdf8' : '#94a3b8'}
              className="cursor-pointer hover:r-6 hover:fill-amber-400 transition-all"
              onClick={() => onSelectViewpoint(v.id)}
            />
          ))}

          {/* Current User Position & Field of View Direction Cone */}
          <g transform={`translate(${currentViewpoint.coordinates.x}, ${currentViewpoint.coordinates.y})`}>
            {/* FOV Cone */}
            <g transform={`rotate(${cameraHeading})`}>
              <path
                d="M 0 0 L -35 -70 A 80 80 0 0 1 35 -70 Z"
                fill="url(#fovConeGrad)"
                pointerEvents="none"
              />
            </g>

            {/* Pulsing Blue Location Pin */}
            <circle cx="0" cy="0" r="16" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        </svg>

        {/* Compass Legend */}
        <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded-md text-[10px] text-slate-400 flex items-center gap-1 border border-slate-800 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>N: 0° | Facing {Math.round(cameraHeading)}°</span>
        </div>
      </div>
    </div>
  );
};

