import React from 'react';
import { NavigationEdge } from '../types/tour';
import { ArrowUp, DoorOpen, Footprints, LogOut, ArrowUpCircle, ArrowDownCircle, MoveUp } from 'lucide-react';

interface NavigationArrowsProps {
  connections: NavigationEdge[];
  cameraYaw: number;   // 0 to 360 degrees
  cameraPitch: number; // -85 to 85 degrees
  fov: number;         // Field of view (35 to 95)
  onNavigate: (targetId: string, edge: NavigationEdge) => void;
}

export const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  connections,
  cameraYaw,
  cameraPitch,
  fov,
  onNavigate
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {connections.map((edge) => {
        // Calculate relative yaw (-180 to +180)
        let diffYaw = edge.heading - cameraYaw;
        while (diffYaw > 180) diffYaw -= 360;
        while (diffYaw < -180) diffYaw += 360;

        // Default pitch: -16 degrees for road/path arrows, 0 for doors, +22 for stairs up, -22 for stairs down
        let targetPitch = edge.pitch !== undefined ? edge.pitch : -16;
        if (edge.type === 'door' || edge.type === 'exit') targetPitch = targetPitch || -2;
        if (edge.type === 'stairs') targetPitch = targetPitch || (edge.label.includes('Ascend') ? 18 : -18);
        if (edge.type === 'elevator') targetPitch = targetPitch || 5;

        const diffPitch = targetPitch - cameraPitch;

        // Check if within visible field of view (+ slight margin)
        const hFov = fov * 0.95;
        const vFov = fov * 0.75;

        if (Math.abs(diffYaw) > hFov || Math.abs(diffPitch) > vFov) {
          return null; // Behind camera or outside screen
        }

        // Screen coordinates in percentage (0 to 100)
        const screenX = 50 + (diffYaw / hFov) * 50;
        const screenY = 50 - (diffPitch / vFov) * 50;

        // Ground perspective tilt and scale
        const isRoadOrPath = edge.type === 'road' || edge.type === 'path' || !edge.type;
        const isDoor = edge.type === 'door';
        const isExit = edge.type === 'exit';
        const isStairs = edge.type === 'stairs';
        const isElevator = edge.type === 'elevator';

        return (
          <div
            key={edge.targetId}
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              transform: `translate(-50%, -50%)`,
            }}
            className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center select-none"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(edge.targetId, edge);
            }}
          >
            {/* Hover Tooltip Pill */}
            <div className="mb-2 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white border border-indigo-500/40 shadow-lg text-xs font-semibold whitespace-nowrap">
                {isDoor && <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />}
                {isExit && <LogOut className="w-3.5 h-3.5 text-amber-400" />}
                {isStairs && <Footprints className="w-3.5 h-3.5 text-cyan-400" />}
                {isElevator && <ArrowUpCircle className="w-3.5 h-3.5 text-indigo-400" />}
                {isRoadOrPath && <MoveUp className="w-3.5 h-3.5 text-blue-400" />}
                <span>{edge.label}</span>
                {edge.distance && (
                  <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded-full border border-indigo-700/50">
                    {edge.distance}
                  </span>
                )}
              </div>
            </div>

            {/* Street View Icon: Ground Chevron or Interactive Portal */}
            {isRoadOrPath && (
              <div className="relative flex items-center justify-center">
                {/* Ground Ellipse Halo */}
                <div className="w-16 h-8 rounded-[100%] bg-white/20 border-2 border-white/80 group-hover:bg-indigo-500/40 group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center justify-center animate-chevron-pulse">
                  <ArrowUp className="w-6 h-6 text-white group-hover:text-indigo-200 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                </div>
              </div>
            )}

            {isDoor && (
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/85 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-300 group-hover:scale-115 transition-all">
                  <DoorOpen className="w-6 h-6" />
                </div>
              </div>
            )}

            {isExit && (
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/85 hover:bg-amber-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-amber-300 group-hover:scale-115 transition-all">
                  <LogOut className="w-6 h-6" />
                </div>
              </div>
            )}

            {isStairs && (
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/85 hover:bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] border-2 border-cyan-300 group-hover:scale-115 transition-all">
                  <Footprints className="w-6 h-6" />
                </div>
              </div>
            )}

            {isElevator && (
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/85 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border-2 border-indigo-300 group-hover:scale-115 transition-all">
                  <ArrowUpCircle className="w-6 h-6" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

