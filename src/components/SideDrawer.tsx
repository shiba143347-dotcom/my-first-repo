import React, { useState } from 'react';
import { Viewpoint } from '../types/tour';
import { ChevronLeft, ChevronRight, Compass, Building, Home, Trophy, BookOpen, Coffee } from 'lucide-react';

interface SideDrawerProps {
  currentViewpoint: Viewpoint;
  onNavigateTo: (id: string) => void;
}

interface DestinationCard {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  bgGradient: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  currentViewpoint,
  onNavigateTo
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'highlights' | 'academic' | 'hostels' | 'sports'>('highlights');

  const highlightDestinations: DestinationCard[] = [
    {
      id: 'main_gate',
      title: 'Main Entrance Gate (South Gate Alpha)',
      category: 'Start of 800m Road (KIIT Main Arch style)',
      tag: 'Main Gateway',
      description: 'Grand ceremonial archway, RFID barriers, campus security (Modeled after KIIT entrance).',
      bgGradient: 'from-blue-600 to-indigo-900'
    },
    {
      id: 'entrance_road_3',
      title: 'Grand Fountain Circle (280m)',
      category: 'Campus Avenue (KIIT Chintan Circle style)',
      tag: 'Landmark',
      description: 'Choreographic central fountain and sculpture rotary.',
      bgGradient: 'from-cyan-600 to-blue-900'
    },
    {
      id: 'central_gardens_entry',
      title: 'Botanical Gardens & Rose Pavilion',
      category: 'Green Sanctuary (KIIT Rose Garden style)',
      tag: 'Nature',
      description: 'Lush floral terraces, study gazebos, water cascade.',
      bgGradient: 'from-emerald-600 to-teal-900'
    },
    {
      id: 'academic_plaza',
      title: 'Main Academic Plaza (800m Target)',
      category: 'Academic Complex (KIIT Campus 15 style)',
      tag: 'Flag Plaza',
      description: 'Soaring 7-story complex front court and ceremonial flagpole.',
      bgGradient: 'from-indigo-600 to-purple-900'
    },
    {
      id: 'cafeteria_plaza',
      title: 'Central Cafeteria Open Courtyard',
      category: 'Food Court (KIIT Kalinga Canteen style)',
      tag: 'Food Court',
      description: 'Artisan coffee kiosks, open-air socializing, gourmet food court.',
      bgGradient: 'from-amber-600 to-orange-900'
    },
    {
      id: 'auditorium_plaza',
      title: 'Grand Auditorium & Amphitheatre',
      category: 'Convention (KIIT Campus 6 Auditorium style)',
      tag: '1,200 Seats',
      description: 'Glass facade amphitheatre, convocations & international symposia.',
      bgGradient: 'from-rose-600 to-pink-900'
    }
  ];

  const academicDestinations: DestinationCard[] = [
    {
      id: 'acad_g_reception',
      title: 'Ground Floor – Grand Reception & Atrium',
      category: 'Floor 0 • Admin (KIIT Chintan Central Admin style)',
      tag: 'Director & Admin',
      description: 'Director Chamber, Chairman Chamber, Accounts, Admissions, Exams.',
      bgGradient: 'from-slate-700 to-slate-900'
    },
    {
      id: 'acad_f1_c101',
      title: 'Classroom 101 – Generative AI & Machine Learning',
      category: 'Floor 1 • Computing (KIIT CSE School style)',
      tag: 'Smart Room',
      description: 'School of Computing, smart stylus board, 80 seats.',
      bgGradient: 'from-blue-600 to-indigo-900'
    },
    {
      id: 'acad_f2_c201',
      title: 'Classroom 201 – Robotics & Automation',
      category: 'Floor 2 • Engineering (KIIT ETC & Robotics style)',
      tag: 'Mechatronics',
      description: 'School of Engineering, hardware benches, interactive projection.',
      bgGradient: 'from-cyan-600 to-slate-900'
    },
    {
      id: 'acad_f3_c301',
      title: 'Classroom 301 – UI/UX & Digital Design Studio',
      category: 'Floor 3 • Design & Management (KIIT KSOM style)',
      tag: 'Design Studio',
      description: 'School of Design & Management, ergonomic sit-stand desks.',
      bgGradient: 'from-purple-600 to-indigo-950'
    },
    {
      id: 'acad_f4_seminar',
      title: 'Executive Seminar Room',
      category: 'Floor 4 • Innovation (KIIT Seminar Hall style)',
      tag: '150-Seat Tier',
      description: 'Tiered executive amphitheater with delegate mics and 4K laser projection.',
      bgGradient: 'from-amber-600 to-stone-900'
    },
    {
      id: 'acad_f5_complab',
      title: 'Advanced Supercomputing & AI Lab',
      category: 'Floor 5 • AI Cluster (KIIT High Performance Computing style)',
      tag: '120 RTX Workstations',
      description: '120 GPU stations, high-speed fiber backbone, parallel computing cluster.',
      bgGradient: 'from-violet-600 to-indigo-950'
    },
    {
      id: 'acad_f6_library',
      title: 'Central University Library & Repository',
      category: 'Floor 6 • Sky Library (KIIT Central Library style)',
      tag: '50k+ Books',
      description: 'Panoramic 360 rooftop library, 200 quiet carrels, IEEE & JSTOR kiosks.',
      bgGradient: 'from-emerald-700 to-teal-950'
    }
  ];

  const hostelDestinations: DestinationCard[] = [
    {
      id: 'hostel_boys_entrance',
      title: 'GenZ Boys Hostel (Block B)',
      category: '5 Floors • 50 Rooms (KIIT King\'s Palace / KP style)',
      tag: 'Rooms B-001 to B-050',
      description: 'Student gym, TV recreation lounge, dining mess, high-speed Wi-Fi.',
      bgGradient: 'from-blue-700 to-indigo-950'
    },
    {
      id: 'hostel_girls_entrance',
      title: 'GenZ Girls Hostel (Block G)',
      category: '5 Floors • 50 Rooms (KIIT Queen\'s Castle / QC style)',
      tag: 'Rooms G-001 to G-050',
      description: 'Biometric security, rooftop terrace, wellness gym, study lounges.',
      bgGradient: 'from-pink-700 to-rose-950'
    },
    {
      id: 'hostel_intl_entrance',
      title: 'GenZ International Hostel (Block I)',
      category: '5 Floors • 50 Rooms',
      tag: 'Rooms I-001 to I-050',
      description: 'Global scholars residence, international dining, cultural media pod.',
      bgGradient: 'from-purple-700 to-indigo-950'
    },
    {
      id: 'hostel_premium_entrance',
      title: 'GenZ Premium Hostel (Block P)',
      category: '5 Floors • 50 Rooms',
      tag: 'Rooms P-001 to P-050',
      description: 'Private balconies, orthopedic bedding, individual climate control.',
      bgGradient: 'from-amber-700 to-yellow-950'
    },
    {
      id: 'hostel_b_r_b-012',
      title: 'Explore Room B-012 (Boys Hostel)',
      category: 'Floor 1 • Suite B-012',
      tag: 'Room 360 View',
      description: 'Furnished with bed, mattress, study desk, wardrobe, fan, window view.',
      bgGradient: 'from-indigo-600 to-blue-900'
    },
    {
      id: 'hostel_g_r_g-025',
      title: 'Explore Room G-025 (Girls Hostel)',
      category: 'Floor 2 • Suite G-025',
      tag: 'Room 360 View',
      description: 'Boutique single suite with campus panorama, desk, wardrobe, lights.',
      bgGradient: 'from-rose-600 to-pink-900'
    }
  ];

  const sportsDestinations: DestinationCard[] = [
    {
      id: 'cricket_ground_view',
      title: 'GenZ Cricket Oval & Pavilion',
      category: 'Sports & Athletics',
      tag: 'BCCI Regulation',
      description: 'Natural turf pitch, electronic scoreboard, spectator pavilion.',
      bgGradient: 'from-emerald-600 to-green-950'
    },
    {
      id: 'football_turf_view',
      title: 'FIFA Standard Football Turf',
      category: 'Sports & Athletics',
      tag: 'Astro-Turf',
      description: 'All-weather artificial pitch, floodlit stadium bleachers.',
      bgGradient: 'from-teal-600 to-emerald-950'
    },
    {
      id: 'playground_entry',
      title: 'Athletics Arena & 400m Track',
      category: 'Sports & Athletics',
      tag: 'Synthetic Track',
      description: 'Running track, basketball courts, multi-sport pavilion.',
      bgGradient: 'from-blue-600 to-cyan-950'
    },
    {
      id: 'medical_centre',
      title: '24/7 Campus Health & Medical Centre',
      category: 'Emergency & Care',
      tag: 'Pharmacy & Triage',
      description: 'Trauma care, pharmacy, on-call doctors, ambulance bay.',
      bgGradient: 'from-red-600 to-rose-950'
    }
  ];

  const getActiveCards = () => {
    switch (selectedTab) {
      case 'academic': return academicDestinations;
      case 'hostels': return hostelDestinations;
      case 'sports': return sportsDestinations;
      default: return highlightDestinations;
    }
  };

  return (
    <div className="relative flex items-center z-30 select-none">
      {/* Drawer Container */}
      <div
        className={`transition-all duration-300 ease-in-out h-[75vh] max-h-[600px] w-80 sm:w-88 rounded-r-3xl bg-slate-900/95 backdrop-blur-2xl border-y border-r border-slate-700/80 shadow-street flex flex-col overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wide">
            <Compass className="w-4 h-4" />
            <span>CAMPUS DIRECTORY & HIGHLIGHTS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            One-click Google Street View navigation to key university landmarks.
          </p>

          {/* Navigation Category Tabs */}
          <div className="grid grid-cols-4 gap-1 mt-3">
            <button
              onClick={() => setSelectedTab('highlights')}
              className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition ${
                selectedTab === 'highlights' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Avenue</span>
            </button>
            <button
              onClick={() => setSelectedTab('academic')}
              className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition ${
                selectedTab === 'academic' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Academic</span>
            </button>
            <button
              onClick={() => setSelectedTab('hostels')}
              className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition ${
                selectedTab === 'hostels' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hostels</span>
            </button>
            <button
              onClick={() => setSelectedTab('sports')}
              className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition ${
                selectedTab === 'sports' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports</span>
            </button>
          </div>
        </div>

        {/* Scrollable Destination Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {getActiveCards().map((item) => {
            const isCurrent = currentViewpoint.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onNavigateTo(item.id)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all duration-200 group relative overflow-hidden ${
                  isCurrent
                    ? 'border-indigo-400 bg-indigo-950/70 shadow-lg scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-800/60'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-700/40">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </div>

                {/* Title */}
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                  {item.title}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {isCurrent && (
                  <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Currently Viewing</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer Toggle Button (Google Maps Style Pill on Edge) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-16 rounded-r-2xl bg-slate-900/95 border-y border-r border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-all"
        title={isOpen ? 'Collapse Directory' : 'Expand Directory'}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
};

