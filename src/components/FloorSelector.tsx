import React from 'react';
import { Viewpoint } from '../types/tour';
import { CAMPUS_BUILDINGS } from '../data/campusLayout';
import { Layers, ArrowUpDown } from 'lucide-react';

interface FloorSelectorProps {
  currentViewpoint: Viewpoint;
  onNavigateTo: (targetId: string) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  currentViewpoint,
  onNavigateTo
}) => {
  // Check if current viewpoint belongs to a multi-floor building
  const building = CAMPUS_BUILDINGS.find((b) => b.id === currentViewpoint.buildingId);
  if (!building || building.totalFloors <= 1) {
    return null; // Only show when in multi-floor buildings
  }

  return (
    <div className="flex flex-col items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-street z-30">
      <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-indigo-400 border-b border-slate-800 mb-1">
        <ArrowUpDown className="w-3 h-3" />
        <span className="hidden sm:inline">ELEVATOR</span>
        <span>LIFT</span>
      </div>

      <div className="flex flex-col-reverse gap-1">
        {building.floors.map((floor) => {
          const isActive = currentViewpoint.floorLevel === floor.level;

          return (
            <button
              key={floor.id}
              onClick={() => onNavigateTo(floor.mainViewpointId)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={`${floor.name}`}
            >
              <span>{floor.level === 0 ? 'G' : floor.level}</span>
              <span className="text-[8px] font-normal opacity-70">
                {floor.level === 0 ? 'Lobby' : `Fl ${floor.level}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

