import React from 'react';
import { Viewpoint } from '../types/tour';
import {
  Compass,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Home,
  ArrowLeft,
  Info,
  MapPin,
  Settings,
  Layers,
  Sparkles
} from 'lucide-react';

interface StreetViewUIProps {
  currentViewpoint: Viewpoint;
  cameraHeading: number;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetHeading: () => void;
  onGoHome: () => void;
  onGoBack: () => void;
  canGoBack: boolean;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenRoomDetails: () => void;
  onOpenAdmin: () => void;
}

export const StreetViewUI: React.FC<StreetViewUIProps> = ({
  currentViewpoint,
  cameraHeading,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetHeading,
  onGoHome,
  onGoBack,
  canGoBack,
  onToggleFullscreen,
  isFullscreen,
  onOpenRoomDetails,
  onOpenAdmin
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Bar (Right side quick actions) */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Back and Home Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-street transition flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Previous Viewpoint"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-street transition flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Main Gate (Alpha)"
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Main Gate</span>
          </button>

          {/* Admin Management Dashboard Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-indigo-900/80 text-white border border-slate-700/80 hover:border-indigo-500 shadow-street transition flex items-center gap-1.5 text-xs font-semibold"
            title="Campus Management & Panorama Upload System"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Admin Panel</span>
          </button>
        </div>

        {/* Right: GenZ Demo Badge & Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-[11px] text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>360° Real Photographic Panoramas</span>
          </div>

          <button
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-street transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 360 View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar & Location Info */}
      <div className="flex items-end justify-between w-full">
        {/* Current Location Badge & Info Pill */}
        <div className="pointer-events-auto max-w-sm sm:max-w-md">
          <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-street text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-700/40">
                {currentViewpoint.buildingName}
              </span>
              <span className="text-[11px] text-slate-400">
                {currentViewpoint.floorName}
              </span>
            </div>

            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{currentViewpoint.name}</span>
            </h1>

            {/* Room Details Button for Classrooms and Hostel Rooms */}
            {(currentViewpoint.roomNumber || currentViewpoint.amenities) && (
              <button
                onClick={onOpenRoomDetails}
                className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
              >
                <Info className="w-3.5 h-3.5 text-indigo-200" />
                <span>View Room Amenities & Inventory</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Bottom: Compass & Zoom Controls */}
        <div className="flex flex-col items-center gap-2.5 pointer-events-auto">
          {/* Street View Compass Needle */}
          <button
            onClick={onResetHeading}
            className="w-12 h-12 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 shadow-street flex items-center justify-center text-white transition group relative"
            title="Click to Reset Camera to True North (0°)"
          >
            <div
              className="w-8 h-8 flex items-center justify-center transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${-cameraHeading}deg)` }}
            >
              <Compass className="w-7 h-7 text-red-500 group-hover:scale-110 transition" />
            </div>
            <span className="absolute -bottom-1 text-[9px] font-mono font-bold text-slate-400">
              {Math.round(cameraHeading)}°
            </span>
          </button>

          {/* Zoom Controls (+ / -) */}
          <div className="flex flex-col rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-street overflow-hidden">
            <button
              onClick={onZoomIn}
              disabled={zoomLevel >= 1}
              className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition border-b border-slate-800"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onZoomOut}
              disabled={zoomLevel <= 0}
              className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

