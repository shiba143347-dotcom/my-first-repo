import React from 'react';
import { Viewpoint } from '../types/tour';
import { X, Check, BedDouble, Wind, Lightbulb, ShieldCheck, Wifi, Monitor, Laptop, Maximize } from 'lucide-react';

interface RoomDetailModalProps {
  viewpoint: Viewpoint;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ viewpoint, onClose }) => {
  const isHostelRoom = viewpoint.category === 'hostel' && !!viewpoint.roomNumber;
  const isClassroom = viewpoint.category === 'academic' && (!!viewpoint.roomNumber || viewpoint.id.includes('complab') || viewpoint.id.includes('seminar') || viewpoint.id.includes('library'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-700/50 mb-3">
          {viewpoint.buildingName} • {viewpoint.floorName}
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          {viewpoint.name}
        </h2>

        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          {viewpoint.description}
        </p>

        {/* Hostel Room Inventory & Amenities Checklist */}
        {isHostelRoom && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <BedDouble className="w-4 h-4" />
              <span>Standard Room Inventory & Facilities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Comfort Orthopedic Bed', desc: 'Single/twin bed with high-density mattress & pillow' },
                { title: 'Hardwood Study Table', desc: 'Solid wood desk with book rack & laptop bay' },
                { title: 'Ergonomic Mesh Chair', desc: 'Adjustable height & lumbar spine support' },
                { title: 'Two-Door Wardrobe', desc: 'Spacious lockable hanging & shelving space' },
                { title: 'Whisper-Quiet Fan', desc: 'High-speed 5-blade ceiling ventilation fan' },
                { title: 'LED Reading Lights', desc: 'Warm 3000K study lamp & diffuse ambient bar' },
                { title: 'Double-Glazed Window', desc: 'Soundproof glass overlooking campus greenery' },
                { title: 'Under-Bed Storage Box', desc: 'Secure luggage and footwear compartment' },
                { title: 'High-Speed Wi-Fi 6', desc: 'Dedicated 500Mbps wireless access point' },
                { title: 'Safety & Power Strip', desc: 'Surge-protected outlets with dual USB-C ports' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classroom / Laboratory Specifications */}
        {isClassroom && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Smart Classroom & Facility Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Interactive 4K Smartboard', desc: 'Multi-touch optical stylus & whiteboard capture' },
                { title: 'Acoustic Array Microphones', desc: 'Ceiling mounted voice-tracking beamforming mics' },
                { title: 'High-Speed Mesh Wi-Fi', desc: 'Gigabit wireless for all student devices' },
                { title: 'Climate Controlled AC', desc: 'Automated temperature and air filtration system' },
                { title: 'Ergonomic Lecture Seating', desc: 'Tiered auditorium seating with tablet arms' },
                { title: 'Dual 4K Laser Projection', desc: 'Ultra-short throw high-lumen laser projectors' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-600/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dismiss Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white transition"
          >
            Back to 360° Exploration
          </button>
        </div>
      </div>
    </div>
  );
};

