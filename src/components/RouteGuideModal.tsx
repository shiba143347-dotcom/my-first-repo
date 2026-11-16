import React from 'react';
import { CampusRoute } from '../types/tour';
import { ALL_VIEWPOINTS } from '../data/viewpoints';
import { Navigation, X, CheckCircle2, ChevronRight, Footprints } from 'lucide-react';

interface RouteGuideModalProps {
  route: CampusRoute;
  currentViewpointId: string;
  onNavigateToStep: (id: string) => void;
  onClearRoute: () => void;
}

export const RouteGuideModal: React.FC<RouteGuideModalProps> = ({
  route,
  currentViewpointId,
  onNavigateToStep,
  onClearRoute
}) => {
  const currentStepIdx = route.path.indexOf(currentViewpointId);
  const targetVp = ALL_VIEWPOINTS.find((v) => v.id === route.targetId);

  return (
    <div className="absolute top-16 left-4 sm:left-6 z-40 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/50 shadow-2xl overflow-hidden text-white select-none">
      {/* Route Header */}
      <div className="p-3.5 bg-cyan-950/70 border-b border-cyan-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-cyan-300">WALKING ROUTE GUIDANCE</div>
            <div className="text-[11px] text-slate-300">
              To: <span className="font-semibold text-white">{targetVp?.name || 'Destination'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClearRoute}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Distance Summary & Progress */}
      <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">Total Distance: <strong className="text-white">{route.totalDistance}m</strong></span>
        <span className="text-cyan-400 font-medium">
          Step {Math.max(1, currentStepIdx + 1)} of {route.path.length}
        </span>
      </div>

      {/* Steps List */}
      <div className="max-h-56 overflow-y-auto p-2 space-y-1.5">
        {route.steps.map((step, idx) => {
          const isCurrent = currentStepIdx === idx;
          const isPassed = currentStepIdx > idx;

          return (
            <div
              key={idx}
              onClick={() => onNavigateToStep(step.toId)}
              className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition text-xs ${
                isCurrent
                  ? 'bg-cyan-950/80 border border-cyan-400 text-white font-semibold'
                  : isPassed
                  ? 'bg-slate-950/40 text-slate-500 line-through'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 pr-2">
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Footprints className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span>{step.instruction}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                {step.distanceMeters}m
              </span>
            </div>
          );
        })}
      </div>

      {/* Auto Step Forward Action Button */}
      {currentStepIdx < route.path.length - 1 && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800">
          <button
            onClick={() => onNavigateToStep(route.path[currentStepIdx + 1])}
            className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-lg transition"
          >
            <span>Next Step: Advance Forward</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

