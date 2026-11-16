import { Building } from '../types/tour';

export interface CampusGate {
  id: string;
  name: string;
  subtitle: string;
  coordinates: { x: number; y: number };
  viewpointId: string;
}

export interface CampusZone {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

export const CAMPUS_GATES: CampusGate[] = [
  {
    id: 'gate_1',
    name: 'Main Entrance Gate (South Gate Alpha)',
    subtitle: 'Grand Ceremonial Gateway (Inspired by KIIT Main Entrance Arch)',
    coordinates: { x: 500, y: 940 },
    viewpointId: 'main_gate'
  },
  {
    id: 'gate_2',
    name: 'East Campus Gate (Convention & Auditorium)',
    subtitle: 'Auditorium & Tech Park Access (Inspired by KIIT Campus 6 Gate)',
    coordinates: { x: 880, y: 650 },
    viewpointId: 'gate_2_east'
  },
  {
    id: 'gate_3',
    name: 'Sports & Stadium Gate (West)',
    subtitle: 'Athletics & Cricket Stadium Access (Inspired by KIIT Stadium Gate)',
    coordinates: { x: 120, y: 600 },
    viewpointId: 'gate_3_sports'
  },
  {
    id: 'gate_4',
    name: 'North Residential Gate (Hostel Complex)',
    subtitle: 'Hostel Quad Access (Inspired by KIIT KP & QC Hostels Gate)',
    coordinates: { x: 500, y: 40 },
    viewpointId: 'gate_4_hostel'
  }
];

export const CAMPUS_BUILDINGS: Building[] = [
  {
    id: 'academic_block',
    name: 'GenZ Main Academic Complex',
    code: 'ACAD',
    category: 'academic',
    description: 'Premier 7-story academic and research tower (inspired by KIIT Campus 15 School of Computer Engineering & Technology Block) housing classrooms, supercomputing labs, executive chambers, and the 6th floor Central Library.',
    totalFloors: 7,
    floors: [
      { id: 'f0', level: 0, name: 'Ground Floor – Directorate, Accounts & Admissions (Inspired by KIIT Central Admin)', mainViewpointId: 'acad_g_reception' },
      { id: 'f1', level: 1, name: '1st Floor – School of Computing & AI (Inspired by KIIT CSE Block)', mainViewpointId: 'acad_f1_lobby' },
      { id: 'f2', level: 2, name: '2nd Floor – School of Engineering & Robotics (Inspired by KIIT Electronics & Mechanical Wing)', mainViewpointId: 'acad_f2_lobby' },
      { id: 'f3', level: 3, name: '3rd Floor – School of Design & Management (Inspired by KIIT KSOM & Design)', mainViewpointId: 'acad_f3_lobby' },
      { id: 'f4', level: 4, name: '4th Floor – Executive Seminar & Innovation Suites (Inspired by KIIT Chintan Seminar Halls)', mainViewpointId: 'acad_f4_lobby' },
      { id: 'f5', level: 5, name: '5th Floor – Supercomputing & AI Labs (Inspired by KIIT High-Performance Computing Cluster)', mainViewpointId: 'acad_f5_lobby' },
      { id: 'f6', level: 6, name: '6th Floor – Central Library & Sky Research Wing (Inspired by KIIT Central Library & Research Pods)', mainViewpointId: 'acad_f6_lobby' },
    ],
    mapCoordinates: { x: 420, y: 420, width: 160, height: 110 }
  },
  {
    id: 'hostel_boys',
    name: 'GenZ Boys Hostel (Block B)',
    code: 'BH',
    category: 'hostel',
    description: '5-story modern residence (inspired by KIIT Kings Palace / KP Hostels). 50 fully furnished tech-enabled student suites (Rooms B-001 to B-050), recreation lounge, and dining mess.',
    totalFloors: 5,
    floors: [
      { id: 'hb_f0', level: 0, name: 'Ground Floor (Rooms B-001 to B-010)', mainViewpointId: 'hostel_b_f0_corridor' },
      { id: 'hb_f1', level: 1, name: 'First Floor (Rooms B-011 to B-020)', mainViewpointId: 'hostel_b_f1_corridor' },
      { id: 'hb_f2', level: 2, name: 'Second Floor (Rooms B-021 to B-030)', mainViewpointId: 'hostel_b_f2_corridor' },
      { id: 'hb_f3', level: 3, name: 'Third Floor (Rooms B-031 to B-040)', mainViewpointId: 'hostel_b_f3_corridor' },
      { id: 'hb_f4', level: 4, name: 'Fourth Floor (Rooms B-041 to B-050)', mainViewpointId: 'hostel_b_f4_corridor' },
    ],
    mapCoordinates: { x: 250, y: 160, width: 100, height: 80 }
  },
  {
    id: 'hostel_girls',
    name: 'GenZ Girls Hostel (Block G)',
    code: 'GH',
    category: 'hostel',
    description: '5-story secure residence (inspired by KIIT Queens Castle / QC Hostels). 50 rooms (Rooms G-001 to G-050), biometric security, gym, and dining hall.',
    totalFloors: 5,
    floors: [
      { id: 'hg_f0', level: 0, name: 'Ground Floor (Rooms G-001 to G-010)', mainViewpointId: 'hostel_g_f0_corridor' },
      { id: 'hg_f1', level: 1, name: 'First Floor (Rooms G-011 to G-020)', mainViewpointId: 'hostel_g_f1_corridor' },
      { id: 'hg_f2', level: 2, name: 'Second Floor (Rooms G-021 to G-030)', mainViewpointId: 'hostel_g_f2_corridor' },
      { id: 'hg_f3', level: 3, name: 'Third Floor (Rooms G-031 to G-040)', mainViewpointId: 'hostel_g_f3_corridor' },
      { id: 'hg_f4', level: 4, name: 'Fourth Floor (Rooms G-041 to G-050)', mainViewpointId: 'hostel_g_f4_corridor' },
    ],
    mapCoordinates: { x: 650, y: 160, width: 100, height: 80 }
  },
  {
    id: 'hostel_intl',
    name: 'GenZ International Hostel (Block I)',
    code: 'IH',
    category: 'hostel',
    description: '5-story global exchange student residence (inspired by KIIT International Residence). 50 rooms (Rooms I-001 to I-050).',
    totalFloors: 5,
    floors: [
      { id: 'hi_f0', level: 0, name: 'Ground Floor (Rooms I-001 to I-010)', mainViewpointId: 'hostel_i_f0_corridor' },
      { id: 'hi_f1', level: 1, name: 'First Floor (Rooms I-011 to I-020)', mainViewpointId: 'hostel_i_f1_corridor' },
      { id: 'hi_f2', level: 2, name: 'Second Floor (Rooms I-021 to I-030)', mainViewpointId: 'hostel_i_f2_corridor' },
      { id: 'hi_f3', level: 3, name: 'Third Floor (Rooms I-031 to I-040)', mainViewpointId: 'hostel_i_f3_corridor' },
      { id: 'hi_f4', level: 4, name: 'Fourth Floor (Rooms I-041 to I-050)', mainViewpointId: 'hostel_i_f4_corridor' },
    ],
    mapCoordinates: { x: 380, y: 120, width: 100, height: 80 }
  },
  {
    id: 'hostel_premium',
    name: 'GenZ Premium Hostel (Block P)',
    code: 'PH',
    category: 'hostel',
    description: '5-story luxury residential suites (inspired by KIIT Executive AC Hostels). 50 executive rooms (Rooms P-001 to P-050).',
    totalFloors: 5,
    floors: [
      { id: 'hp_f0', level: 0, name: 'Ground Floor (Rooms P-001 to P-010)', mainViewpointId: 'hostel_p_f0_corridor' },
      { id: 'hp_f1', level: 1, name: 'First Floor (Rooms P-011 to P-020)', mainViewpointId: 'hostel_p_f1_corridor' },
      { id: 'hp_f2', level: 2, name: 'Second Floor (Rooms P-021 to P-030)', mainViewpointId: 'hostel_p_f2_corridor' },
      { id: 'hp_f3', level: 3, name: 'Third Floor (Rooms P-031 to P-040)', mainViewpointId: 'hostel_p_f3_corridor' },
      { id: 'hp_f4', level: 4, name: 'Fourth Floor (Rooms P-041 to P-050)', mainViewpointId: 'hostel_p_f4_corridor' },
    ],
    mapCoordinates: { x: 520, y: 120, width: 100, height: 80 }
  },
  {
    id: 'canteen_hub',
    name: 'GenZ Central Cafeteria & Food Court',
    code: 'CAFE',
    category: 'amenity',
    description: 'Multi-cuisine student hub with outdoor terrace and bakery (inspired by KIIT Kalinga Food Court & Campus Canteen).',
    totalFloors: 1,
    floors: [{ id: 'cafe_g', level: 0, name: 'Ground Floor', mainViewpointId: 'canteen_interior' }],
    mapCoordinates: { x: 670, y: 490, width: 85, height: 65 }
  },
  {
    id: 'auditorium_hub',
    name: 'GenZ Grand Auditorium & Cultural Complex',
    code: 'AUD',
    category: 'amenity',
    description: '1,200-seat acoustic theatre for convocations and international symposia (inspired by KIIT Campus 6 Auditorium).',
    totalFloors: 1,
    floors: [{ id: 'aud_g', level: 0, name: 'Main Hall', mainViewpointId: 'auditorium_interior' }],
    mapCoordinates: { x: 740, y: 590, width: 95, height: 75 }
  },
  {
    id: 'medical_hub',
    name: 'GenZ Health & Medical Centre',
    code: 'MED',
    category: 'amenity',
    description: '24/7 on-campus emergency clinic and pharmacy (inspired by KIMS Health Clinic).',
    totalFloors: 1,
    floors: [{ id: 'med_g', level: 0, name: 'Clinic Floor', mainViewpointId: 'medical_centre' }],
    mapCoordinates: { x: 260, y: 530, width: 75, height: 60 }
  },
  {
    id: 'sports_hub',
    name: 'GenZ Athletics & Sports Pavilion',
    code: 'SPORT',
    category: 'sports',
    description: 'Olympic-standard athletics track, FIFA football turf, cricket oval with pavilion (inspired by KIIT International Cricket Stadium & Sports Complex).',
    totalFloors: 1,
    floors: [{ id: 'sport_g', level: 0, name: 'Ground', mainViewpointId: 'playground_entry' }],
    mapCoordinates: { x: 180, y: 640, width: 150, height: 130 }
  }
];

export const CAMPUS_ZONES: CampusZone[] = [
  { id: 'zone_gardens', name: 'Botanical Gardens & Rose Park (KIIT Rose Garden style)', type: 'garden', x: 560, y: 730, width: 130, height: 110, color: '#10b981', label: 'Rose Gardens' },
  { id: 'zone_car_park', name: 'North Car Parking Plaza', type: 'parking', x: 640, y: 650, width: 80, height: 50, color: '#64748b', label: 'Car Parking' },
  { id: 'zone_bike_park', name: 'Bike & Scooter EV Parking', type: 'parking', x: 370, y: 760, width: 70, height: 45, color: '#64748b', label: 'Bike Parking' },
  { id: 'zone_cricket', name: 'Cricket Stadium Oval (KIIT Stadium style)', type: 'sports', x: 150, y: 760, width: 120, height: 90, color: '#22c55e', label: 'Cricket Stadium' },
  { id: 'zone_football', name: 'FIFA Football Turf', type: 'sports', x: 150, y: 630, width: 110, height: 80, color: '#22c55e', label: 'Football Turf' },
  { id: 'zone_hostel_park', name: 'Hostel Quad Lawn (KP / QC style)', type: 'garden', x: 420, y: 220, width: 160, height: 70, color: '#10b981', label: 'Hostel Quad' },
];

