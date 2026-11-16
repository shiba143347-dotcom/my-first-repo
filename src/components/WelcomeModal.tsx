import React from 'react';
import { Compass, Map, Building2, Home, Search, Navigation2, CheckCircle2, Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  onStartTour: () => void;
  onExploreMap: () => void;
  onGoAcademic: () => void;
  onGoHostels: () => void;
  onOpenSearch: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  onStartTour,
  onExploreMap,
  onGoAcademic,
  onGoHostels,
  onOpenSearch,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-white max-h-[95vh] overflow-y-auto">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding Crest */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg font-black text-xl text-white">
            GZ
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL VIRTUAL CAMPUS PLATFORM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GENZ UNIVERSITY
            </h1>
          </div>
        </div>

        {/* Welcome Pitch */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Welcome to the next-generation 360° Google Street View virtual university. Explore the complete campus from anywhere in the world — advance down the 800m entrance avenue, enter the 7-story Academic Tower, and walk inside all 200 student hostel rooms.
        </p>

        {/* Spatial Reference Info (KIIT Campus Mapping Guide) */}
        <div className="my-4 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 text-xs text-indigo-200 flex flex-col gap-1.5">
          <div className="font-bold text-white flex items-center gap-1.5 text-xs">
            <span>🗺️ Spatial Layout Reference (Modeled after KIIT University Bhubaneswar):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <div>• <strong>Main Gate & Boulevard:</strong> Modeled on KIIT Main Entrance Arch</div>
            <div>• <strong>Roundabout & Fountain:</strong> Modeled on KIIT Chintan Circle</div>
            <div>• <strong>Academic Complex (7 Floors):</strong> Modeled on Campus 15 (School of Computer Engineering)</div>
            <div>• <strong>Hostels (4 Blocks / 200 Rooms):</strong> Modeled on Kings Palace (KP) & Queens Castle (QC)</div>
            <div>• <strong>Sports Complex:</strong> Modeled on KIIT International Cricket Stadium & Grounds</div>
            <div>• <strong>Food Court & Auditorium:</strong> Modeled on Kalinga Food Court & Campus 6 Auditorium</div>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center text-center">
            <span className="text-lg font-black text-indigo-400">800m</span>
            <span className="text-[10px] text-slate-400">Entrance Avenue</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center text-center">
            <span className="text-lg font-black text-cyan-400">7 Floors</span>
            <span className="text-[10px] text-slate-400">Academic Complex</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center text-center">
            <span className="text-lg font-black text-emerald-400">4 Hostels</span>
            <span className="text-[10px] text-slate-400">Boys, Girls, Intl, Prem</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center text-center">
            <span className="text-lg font-black text-amber-400">200 Rooms</span>
            <span className="text-[10px] text-slate-400">Furnished Suites</span>
          </div>
        </div>

        {/* Action Buttons (As required by Part 12) */}
        <div className="space-y-3">
          <button
            onClick={onStartTour}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 font-extrabold text-sm sm:text-base text-white shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform" />
              <span>Start Virtual Tour (From Main Gate Alpha)</span>
            </div>
            <Navigation2 className="w-4 h-4 text-white/80" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onGoAcademic}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-indigo-500 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/40 flex items-center justify-center shrink-0 text-indigo-400 group-hover:scale-105 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Academic Building</div>
                <div className="text-[11px] text-slate-400">7 Floors, Labs, Library</div>
              </div>
            </button>

            <button
              onClick={onGoHostels}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/40 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Explore Hostels</div>
                <div className="text-[11px] text-slate-400">4 Blocks, 200 Rooms</div>
              </div>
            </button>

            <button
              onClick={onExploreMap}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-500 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/40 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 transition">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Explore Campus Map</div>
                <div className="text-[11px] text-slate-400">Full 2D GIS & Routes</div>
              </div>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/40 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 transition">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Search Location</div>
                <div className="text-[11px] text-slate-400">Find rooms, labs, offices</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

