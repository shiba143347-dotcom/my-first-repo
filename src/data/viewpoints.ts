import { Viewpoint, NavigationEdge } from '../types/tour';

// Helper to get real photo URL based on theme and location
function getRealPhotoUrl(theme: string, category: string, id: string): string {
  // 1. Pic 1: Real Heritage Main College Building & Monument (User Upload 1)
  if (id === 'main_gate' || id === 'academic_plaza') {
    return '/panoramas/college_heritage_main.jpg';
  }

  // 2. Pic 2: Real College Avenue Walk with Academic Towers & Students (User Upload 2)
  if (id === 'entrance_road_1' || id === 'entrance_road_2' || id === 'entrance_road_5' || id === 'road_east_junction') {
    return '/panoramas/college_avenue_walk.jpg';
  }

  // 3. Pic 3: Real College Academic Complex Entrance & Portico (User Upload 3)
  if (id === 'acad_g_entrance' || id === 'acad_rear_exit' || id === 'security_checkpoint_main' || id === 'gate_2_east') {
    return '/panoramas/college_admin_entrance.jpg';
  }

  // 4. Pic 4: Real College Sports Ground, Cricket Pitch & Playground (User Upload 4 & 9)
  if (
    id === 'cricket_ground_view' ||
    id === 'playground_entry' ||
    id === 'football_turf_view' ||
    id === 'sports_junction' ||
    id === 'gate_3_sports' ||
    theme.startsWith('sports_') ||
    theme.includes('cricket') ||
    theme.includes('football')
  ) {
    return '/panoramas/college_sports_playground.jpg';
  }

  // 5. Real Hostel Exterior & Entrance (IIT Guwahati Student Residence)
  if (theme === 'hostel_exterior' || (id.startsWith('hostel_') && id.endsWith('_entrance'))) {
    return '/panoramas/hostel_exterior.jpg';
  }

  // 6. Real Hostel Common Room & TV Lounge (IIT Delhi Student Common Room)
  if (theme === 'hostel_common' || id.includes('_common')) {
    return '/panoramas/hostel_common.jpg';
  }

  // 7. Real Hostel Individual Rooms (User Photos 1 & 2 - Dual-Angle 360°)
  if (theme.startsWith('hostel_room') || id.includes('_r_')) {
    if (id.includes('hostel_b') || id.includes('hostel_i')) {
      return '/panoramas/hostel_room_user1.jpg';
    } else {
      return '/panoramas/hostel_room_user2.jpg';
    }
  }

  // 8. Real Hostel Residential Floor Corridors
  if (theme === 'hostel_corridor') {
    return '/panoramas/hostel_corridor.jpg';
  }

  // 9. Real Academic Corridors & Staircases (Osmania University Grand Academic Wing)
  if (
    theme.includes('corridor_acad') ||
    theme.includes('corridor_admin') ||
    theme === 'staircase' ||
    id.includes('corridor') ||
    id.includes('stairs')
  ) {
    return '/panoramas/academic_corridor.jpg';
  }

  // 10. Real Cafeteria & Garden Lounge (User Photo 7)
  if (id === 'cafeteria_plaza') {
    return '/panoramas/cafeteria_plaza_user.jpg';
  }

  // 11. Real Central Canteen & Dining Mess (User Photo 8)
  if (id === 'canteen_interior' || theme.includes('dining') || theme.includes('canteen') || theme.includes('cafeteria')) {
    return '/panoramas/canteen_interior_user.jpg';
  }

  // 12. Fountain & Central Roundabout (NSIT Central Fountain)
  if (id === 'entrance_road_3' || theme.includes('fountain')) {
    return '/panoramas/fountain.jpg';
  }

  // 13. Parking Plazas (Authentic Indian Two-Wheeler & Car Parking)
  if (id === 'entrance_road_4' || id === 'north_car_parking' || id === 'bike_scooter_parking' || theme.startsWith('parking_')) {
    return '/panoramas/parking.jpg';
  }

  // 14. Botanical Gardens & Green Spaces (Dr. B.R. Ambedkar Open University)
  if (theme.startsWith('gardens_') || id === 'hostel_central_quad') {
    return '/panoramas/gardens.jpg';
  }
  if (id === 'hostel_ring_road_south' || id.startsWith('gate_4') || theme.includes('park')) {
    return '/panoramas/park_green.jpg';
  }

  // 15. Grand Auditorium & Seminar Halls (Badruka College Auditorium)
  if (theme.includes('auditorium') || theme.includes('seminar')) {
    return '/panoramas/auditorium.jpg';
  }

  // 16. Central University Library (Guru Nanak Dev University Central Library)
  if (theme === 'library_main') {
    return '/panoramas/library.jpg';
  }

  // 17. Supercomputing Lab & Classrooms (St. Claret College Lab & Ramakrishna Mission Classroom)
  if (theme === 'computer_lab') {
    return '/panoramas/complab.jpg';
  }
  if (theme.startsWith('classroom_')) {
    return '/panoramas/classroom_lecture.jpg';
  }

  // 18. Executive Offices, Director, Chairman & Medical Centre
  if (theme.startsWith('office_') || theme === 'medical_centre') {
    return '/panoramas/office.jpg';
  }

  // 19. Academic Building Reception, Lobbies & Elevators (WBNUJS Kolkata Atrium)
  if (theme.includes('reception') || theme.includes('lobby') || theme.includes('entrance') || theme.includes('acad_') || theme.includes('elevator')) {
    return '/panoramas/acad_reception.jpg';
  }

  return '/panoramas/college_heritage_main.jpg';
}

const outdoorViewpoints: Viewpoint[] = [
  {
    id: 'main_gate',
    name: 'Main Entrance Gate (South Gate Alpha)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Campus Perimeter',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 940 },
    initialYaw: 0, // Facing North down the 800m avenue
    initialPitch: 0,
    panoramaTheme: 'main_gate',
    description: 'Monumental ceremonial archway of GenZ University. Features 24/7 RFID smart boom barriers, high-resolution AI surveillance, and welcome pylons.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_1', heading: 0, pitch: -15, label: 'Advance along Palm Boulevard (80m)', distance: '80m', type: 'road' },
      { targetId: 'security_checkpoint_main', heading: 90, pitch: -10, label: 'Main Security Office & Visitor Pass Station', distance: '15m', type: 'door' },
    ]
  },
  {
    id: 'security_checkpoint_main',
    name: 'Main Gate Security & Visitor Office',
    category: 'admin',
    buildingId: 'outdoor',
    buildingName: 'Campus Security',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 520, y: 940 },
    initialYaw: 270,
    initialPitch: 0,
    panoramaTheme: 'office_security',
    description: 'Central campus monitoring desk, emergency response console, visitor credential verification, and automated ID issuance.',
    isAvailable: true,
    connections: [
      { targetId: 'main_gate', heading: 270, pitch: -10, label: 'Exit to Main Entrance Gate', distance: '15m', type: 'exit' },
    ]
  },
  {
    id: 'entrance_road_1',
    name: 'Palm Boulevard South (80m from Main Gate)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Main Entrance Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 880 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'boulevard_south',
    description: 'Lined with towering royal palms, ambient solar-powered LED streetlights, and dedicated pedestrian cycling tracks.',
    isAvailable: true,
    connections: [
      { targetId: 'main_gate', heading: 180, pitch: -15, label: 'Return to Main Gate (80m)', distance: '80m', type: 'road' },
      { targetId: 'entrance_road_2', heading: 0, pitch: -15, label: 'Continue on Palm Boulevard (100m)', distance: '100m', type: 'road' },
      { targetId: 'bike_scooter_parking', heading: 260, pitch: -15, label: 'Access Two-Wheeler & EV Bike Parking', distance: '60m', type: 'path' },
    ]
  },
  {
    id: 'bike_scooter_parking',
    name: 'Bike & Scooter EV Parking Plaza',
    category: 'amenity',
    buildingId: 'outdoor',
    buildingName: 'Mobility & Parking Hub',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 420, y: 860 },
    initialYaw: 90,
    initialPitch: 0,
    panoramaTheme: 'parking_bike',
    description: 'Covered solar canopies with 40 rapid EV charging bays and automated barcode ticketing for 1,200 two-wheelers.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_1', heading: 80, pitch: -15, label: 'Return to Palm Boulevard', distance: '60m', type: 'road' },
    ]
  },
  {
    id: 'entrance_road_2',
    name: 'Palm Boulevard Mid (180m from Main Gate)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Main Entrance Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 800 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'boulevard_mid',
    description: 'Midway point on the university ceremonial drive. Lush evergreen hedges, campus directory maps, and pedestrian benches.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_1', heading: 180, pitch: -15, label: 'Back towards Main Gate (100m)', distance: '100m', type: 'road' },
      { targetId: 'entrance_road_3', heading: 0, pitch: -15, label: 'Approach Grand Fountain Circle (100m)', distance: '100m', type: 'road' },
      { targetId: 'central_gardens_entry', heading: 85, pitch: -15, label: 'Enter Botanical Gardens & Floral Walk', distance: '70m', type: 'path' },
    ]
  },
  {
    id: 'central_gardens_entry',
    name: 'Botanical Gardens South Entry',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Botanical Gardens',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 580, y: 790 },
    initialYaw: 45,
    initialPitch: 0,
    panoramaTheme: 'gardens_rose',
    description: 'Landscaped floral terraces, rare botanical specimens, stone paved walkways, and shaded wooden pergolas.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_2', heading: 265, pitch: -15, label: 'Back to Palm Boulevard', distance: '70m', type: 'path' },
      { targetId: 'central_gardens_path', heading: 20, pitch: -15, label: 'Stroll along Rose Pavilion Walk', distance: '60m', type: 'path' },
    ]
  },
  {
    id: 'central_gardens_path',
    name: 'Botanical Gardens & Rose Pavilion',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Botanical Gardens',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 600, y: 730 },
    initialYaw: 330,
    initialPitch: 0,
    panoramaTheme: 'gardens_path',
    description: 'Tranquil student open-air study sanctuary with tiered water cascades, sensory plant beds, and Wi-Fi coverage.',
    isAvailable: true,
    connections: [
      { targetId: 'central_gardens_entry', heading: 200, pitch: -15, label: 'Return to South Entry', distance: '60m', type: 'path' },
      { targetId: 'entrance_road_3', heading: 280, pitch: -15, label: 'Exit to Grand Fountain Circle', distance: '80m', type: 'path' },
    ]
  },
  {
    id: 'entrance_road_3',
    name: 'Grand Fountain Circle & Central Roundabout (280m)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Main Entrance Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 710 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'fountain_circle',
    description: 'Iconic illuminated campus fountain with choreographic water jets and bronze sculpture of GenZ Innovation.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_2', heading: 180, pitch: -15, label: 'Back towards South Boulevard', distance: '100m', type: 'road' },
      { targetId: 'entrance_road_4', heading: 0, pitch: -15, label: 'Continue North to Parking & Sports Hub', distance: '90m', type: 'road' },
      { targetId: 'central_gardens_path', heading: 100, pitch: -15, label: 'Enter Botanical Rose Pavilion', distance: '80m', type: 'path' },
      { targetId: 'road_east_junction', heading: 75, pitch: -15, label: 'East Campus Road (To Auditorium & Gate 2)', distance: '120m', type: 'road' },
    ]
  },
  {
    id: 'road_east_junction',
    name: 'East Campus Avenue (Towards Auditorium)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'East Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 670, y: 690 },
    initialYaw: 60,
    initialPitch: 0,
    panoramaTheme: 'road_east',
    description: 'Wide boulevard connecting central campus to the 1,200-seat Grand Auditorium and East Gate.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_3', heading: 255, pitch: -15, label: 'Back to Grand Fountain Circle', distance: '120m', type: 'road' },
      { targetId: 'auditorium_plaza', heading: 45, pitch: -15, label: 'Grand Auditorium Forecourt', distance: '90m', type: 'road' },
      { targetId: 'gate_2_east', heading: 90, pitch: -15, label: 'East Campus Gate 2 (Checkpost Bravo)', distance: '160m', type: 'road' },
    ]
  },
  {
    id: 'gate_2_east',
    name: 'Gate 2 – East Campus Gate',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Campus Perimeter',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 880, y: 650 },
    initialYaw: 270,
    initialPitch: 0,
    panoramaTheme: 'gate_east',
    description: 'Secondary campus gate giving rapid access to city arterial transit, express bus stops, and tech convention guests.',
    isAvailable: true,
    connections: [
      { targetId: 'road_east_junction', heading: 270, pitch: -15, label: 'Head West into Campus (160m)', distance: '160m', type: 'road' },
      { targetId: 'auditorium_plaza', heading: 320, pitch: -15, label: 'Grand Auditorium Plaza (110m)', distance: '110m', type: 'road' },
    ]
  },
  {
    id: 'auditorium_plaza',
    name: 'Grand Auditorium Plaza & Amphitheatre',
    category: 'outdoor',
    buildingId: 'auditorium_hub',
    buildingName: 'GenZ Grand Auditorium',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 740, y: 610 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'auditorium_plaza',
    description: 'Monumental modern glass facade of the GenZ Auditorium, open amphitheatre seating, and red carpet entrance.',
    isAvailable: true,
    connections: [
      { targetId: 'road_east_junction', heading: 225, pitch: -15, label: 'Back to East Avenue', distance: '90m', type: 'road' },
      { targetId: 'gate_2_east', heading: 140, pitch: -15, label: 'East Gate 2 (110m)', distance: '110m', type: 'road' },
      { targetId: 'auditorium_interior', heading: 350, pitch: 0, label: 'Enter Grand Auditorium 1200-Seat Hall', distance: '25m', type: 'door' },
      { targetId: 'cafeteria_plaza', heading: 300, pitch: -15, label: 'Pathway to Central Cafeteria Plaza', distance: '90m', type: 'path' },
    ]
  },
  {
    id: 'auditorium_interior',
    name: 'Grand Auditorium Main Concert Hall',
    category: 'amenity',
    buildingId: 'auditorium_hub',
    buildingName: 'GenZ Grand Auditorium',
    floorId: 'ground',
    floorName: 'Main Auditorium Tier',
    floorLevel: 0,
    coordinates: { x: 750, y: 580 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'auditorium_inside',
    description: 'State-of-the-art acoustic timber panelling, motorized stage rigging, laser projection, and plush 1,200 velvet auditorium seating.',
    isAvailable: true,
    amenities: { capacity: 1200, hasAC: true, hasProjector: true, hasWifi: true, features: ['Dolby Atmos Audio', 'Motorized Stage Rigging', 'VIP Green Rooms'] },
    connections: [
      { targetId: 'auditorium_plaza', heading: 180, pitch: 0, label: 'Exit to Auditorium Forecourt', distance: '25m', type: 'exit' },
    ]
  },
  {
    id: 'entrance_road_4',
    name: 'Palm Boulevard North – Parking Crossroads (380m)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Main Entrance Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 630 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'boulevard_north',
    description: 'Intersection fronting the North Car Parking Plaza on the right and Medical Centre / Sports grounds to the left.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_3', heading: 180, pitch: -15, label: 'South towards Fountain Circle', distance: '90m', type: 'road' },
      { targetId: 'north_car_parking', heading: 85, pitch: -15, label: 'Enter North 4-Wheeler Car Parking', distance: '70m', type: 'road' },
      { targetId: 'sports_junction', heading: 270, pitch: -15, label: 'West to Sports Arena & Medical Centre', distance: '90m', type: 'road' },
      { targetId: 'entrance_road_5', heading: 0, pitch: -15, label: 'North to Cafeteria & Academic Plaza', distance: '80m', type: 'road' },
    ]
  },
  {
    id: 'north_car_parking',
    name: 'North Car Parking Plaza (300 Bays)',
    category: 'amenity',
    buildingId: 'outdoor',
    buildingName: 'Mobility & Parking Hub',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 620, y: 640 },
    initialYaw: 270,
    initialPitch: 0,
    panoramaTheme: 'parking_car',
    description: 'Organized asphalt parking grid for faculty, visitors, and students with license-plate recognition barriers and solar shade canopies.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_4', heading: 265, pitch: -15, label: 'Return to Boulevard Intersection', distance: '70m', type: 'road' },
    ]
  },
  {
    id: 'sports_junction',
    name: 'Sports Complex Junction & Health Way',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Sports & Health Corridor',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 380, y: 620 },
    initialYaw: 270,
    initialPitch: 0,
    panoramaTheme: 'sports_junction',
    description: 'Pedestrian and emergency link between the central avenue, the Medical Centre, and athletics grounds.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_4', heading: 90, pitch: -15, label: 'Back to Central Boulevard (90m)', distance: '90m', type: 'road' },
      { targetId: 'medical_centre', heading: 330, pitch: -5, label: 'Enter 24/7 Campus Health & Medical Centre', distance: '40m', type: 'door' },
      { targetId: 'playground_entry', heading: 240, pitch: -15, label: 'Sports Arena, Playground & Athletic Oval', distance: '75m', type: 'path' },
    ]
  },
  {
    id: 'medical_centre',
    name: 'GenZ Campus Health & Medical Centre',
    category: 'amenity',
    buildingId: 'medical_hub',
    buildingName: 'Health & Medical Complex',
    floorId: 'ground',
    floorName: 'Clinic Ground Level',
    floorLevel: 0,
    coordinates: { x: 320, y: 550 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'medical_centre',
    description: 'Fully equipped 24/7 medical triage, resident physician chambers, diagnostic pharmacy, recovery beds, and ambulance bay.',
    isAvailable: true,
    amenities: { hasAC: true, hasWifi: true, features: ['Emergency Triage', 'Diagnostic Pharmacy', 'Trauma Bay', 'Ambulance Standby'] },
    connections: [
      { targetId: 'sports_junction', heading: 150, pitch: -5, label: 'Exit to Sports Way', distance: '40m', type: 'exit' },
    ]
  },
  {
    id: 'playground_entry',
    name: 'Athletics Arena & Playground Entry',
    category: 'sports',
    buildingId: 'sports_hub',
    buildingName: 'Athletics & Sports Pavilion',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 260, y: 660 },
    initialYaw: 220,
    initialPitch: 0,
    panoramaTheme: 'sports_arena',
    description: '400m synthetic running track, spectator grandstands, multi-sport courts, and fitness gymnasium.',
    isAvailable: true,
    connections: [
      { targetId: 'sports_junction', heading: 60, pitch: -15, label: 'Return to Campus Junction (75m)', distance: '75m', type: 'path' },
      { targetId: 'cricket_ground_view', heading: 190, pitch: -10, label: 'Proceed to GenZ Cricket Oval & Pavilion', distance: '60m', type: 'path' },
      { targetId: 'football_turf_view', heading: 290, pitch: -10, label: 'Walk to FIFA Football Turf', distance: '55m', type: 'path' },
      { targetId: 'gate_3_sports', heading: 250, pitch: -15, label: 'Gate 3 (Sports West Gate)', distance: '110m', type: 'road' },
    ]
  },
  {
    id: 'cricket_ground_view',
    name: 'GenZ Cricket Oval & Pavilion',
    category: 'sports',
    buildingId: 'sports_hub',
    buildingName: 'Athletics & Sports Pavilion',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 200, y: 760 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'cricket_ground',
    description: 'BCCI-regulation natural grass turf wicket, automated electronic scoreboard, sight screens, and stadium seating.',
    isAvailable: true,
    connections: [
      { targetId: 'playground_entry', heading: 20, pitch: -15, label: 'Back to Arena Entry', distance: '60m', type: 'path' },
      { targetId: 'gate_3_sports', heading: 320, pitch: -15, label: 'Gate 3 West', distance: '90m', type: 'path' },
    ]
  },
  {
    id: 'football_turf_view',
    name: 'FIFA-Standard Football Turf & Bleachers',
    category: 'sports',
    buildingId: 'sports_hub',
    buildingName: 'Athletics & Sports Pavilion',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 190, y: 620 },
    initialYaw: 45,
    initialPitch: 0,
    panoramaTheme: 'football_turf',
    description: 'High-grade all-weather artificial astro-turf football pitch with floodlights for evening championship games.',
    isAvailable: true,
    connections: [
      { targetId: 'playground_entry', heading: 110, pitch: -15, label: 'Back to Arena Entry', distance: '55m', type: 'path' },
      { targetId: 'gate_3_sports', heading: 220, pitch: -15, label: 'Gate 3 West Exit', distance: '70m', type: 'path' },
    ]
  },
  {
    id: 'gate_3_sports',
    name: 'Gate 3 – Sports & Arena Gate (West)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Campus Perimeter',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 120, y: 600 },
    initialYaw: 90,
    initialPitch: 0,
    panoramaTheme: 'gate_sports',
    description: 'Dedicated sports logistics gate providing access for athlete buses, team convoys, and stadium spectators.',
    isAvailable: true,
    connections: [
      { targetId: 'football_turf_view', heading: 40, pitch: -15, label: 'Enter to Football Turf (70m)', distance: '70m', type: 'path' },
      { targetId: 'playground_entry', heading: 70, pitch: -15, label: 'Enter to Sports Arena (110m)', distance: '110m', type: 'road' },
    ]
  },
  {
    id: 'entrance_road_5',
    name: 'Central Promenade & Cafeteria Square (550m)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Main Entrance Avenue',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 550 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'boulevard_cafeteria',
    description: 'Pedestrianized boulevard lined with cafe umbrellas, outdoor seating pods, solar smart dustbins, and campus maps.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_4', heading: 180, pitch: -15, label: 'South to Parking & Boulevard', distance: '80m', type: 'road' },
      { targetId: 'cafeteria_plaza', heading: 75, pitch: -15, label: 'Head to Central Cafeteria & Food Court', distance: '65m', type: 'path' },
      { targetId: 'academic_plaza', heading: 0, pitch: -15, label: 'Advance to Main Academic Plaza (800m target)', distance: '80m', type: 'road' },
    ]
  },
  {
    id: 'cafeteria_plaza',
    name: 'Central Cafeteria Open Courtyard',
    category: 'amenity',
    buildingId: 'canteen_hub',
    buildingName: 'GenZ Central Cafeteria',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 620, y: 520 },
    initialYaw: 30,
    initialPitch: 0,
    panoramaTheme: 'cafeteria_plaza',
    description: 'Vibrant outdoor dining courtyard featuring artisan coffee kiosks, juice bars, water fountain, and student socializing pods.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_5', heading: 255, pitch: -15, label: 'Back to Central Promenade', distance: '65m', type: 'path' },
      { targetId: 'canteen_interior', heading: 20, pitch: 0, label: 'Enter GenZ Food Court & Gourmet Dining Hall', distance: '20m', type: 'door' },
      { targetId: 'auditorium_plaza', heading: 120, pitch: -15, label: 'Path to Grand Auditorium', distance: '90m', type: 'path' },
      { targetId: 'academic_plaza', heading: 310, pitch: -15, label: 'Direct walkway to Academic Building', distance: '70m', type: 'path' },
    ]
  },
  {
    id: 'canteen_interior',
    name: 'GenZ Food Court & Gourmet Dining Hall',
    category: 'amenity',
    buildingId: 'canteen_hub',
    buildingName: 'GenZ Central Cafeteria',
    floorId: 'ground',
    floorName: 'Dining Hall',
    floorLevel: 0,
    coordinates: { x: 640, y: 480 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'canteen_inside',
    description: 'Hygienic multi-cuisine dining hall with continental, Asian, and healthy salad counters, self-service beverage stations, and 600 seats.',
    isAvailable: true,
    amenities: { capacity: 600, hasAC: true, hasWifi: true, features: ['6 Food Stations', 'Digital Self-Order Kiosks', 'Live Bakery', 'Espresso Bar'] },
    connections: [
      { targetId: 'cafeteria_plaza', heading: 200, pitch: 0, label: 'Exit to Cafeteria Courtyard', distance: '20m', type: 'exit' },
    ]
  },
  {
    id: 'academic_plaza',
    name: 'Main Academic Plaza & Ceremonial Flagpole (800m)',
    category: 'academic',
    buildingId: 'academic_block',
    buildingName: 'GenZ Main Academic Complex',
    floorId: 'ground',
    floorName: 'Ground Level Plaza',
    floorLevel: 0,
    coordinates: { x: 500, y: 470 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'academic_plaza',
    description: 'The monumental 800-meter terminus from the Main Gate. Features the soaring 7-story GenZ Academic Tower, marble grand steps, and national flag plaza.',
    isAvailable: true,
    connections: [
      { targetId: 'entrance_road_5', heading: 180, pitch: -15, label: 'South down Main Entrance Avenue to Main Gate', distance: '80m', type: 'road' },
      { targetId: 'cafeteria_plaza', heading: 130, pitch: -15, label: 'Walk to Cafeteria & Food Court', distance: '70m', type: 'path' },
      { targetId: 'acad_g_entrance', heading: 0, pitch: 0, label: 'Enter Academic Building (Main Portico)', distance: '20m', type: 'door' },
      { targetId: 'hostel_ring_road_south', heading: 315, pitch: -15, label: 'Hostel Zone Connector Pathway (500m to Hostels)', distance: '120m', type: 'path' },
    ]
  },
  {
    id: 'hostel_ring_road_south',
    name: 'Hostel Avenue South (Connector)',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Residential Quad',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 440, y: 340 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'hostel_walkway',
    description: 'Tree-canopied pedestrian avenue spanning the 500-meter scenic distance from the Academic Building to the 4 Residential Hostels.',
    isAvailable: true,
    connections: [
      { targetId: 'academic_plaza', heading: 135, pitch: -15, label: 'Return to Main Academic Plaza', distance: '120m', type: 'path' },
      { targetId: 'acad_rear_exit', heading: 180, pitch: 0, label: 'Academic Building Rear Courtyard', distance: '60m', type: 'door' },
      { targetId: 'hostel_central_quad', heading: 0, pitch: -15, label: 'North into Residential Hostel Hub (4 Blocks)', distance: '100m', type: 'road' },
    ]
  },
  {
    id: 'hostel_central_quad',
    name: 'Hostel Central Quad & Residential Boulevard',
    category: 'hostel',
    buildingId: 'outdoor',
    buildingName: 'Residential Quad',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 450, y: 220 },
    initialYaw: 0,
    initialPitch: 0,
    panoramaTheme: 'hostel_quad',
    description: 'Spacious central landscaped residential park with basketball half-court, amphitheatre steps, and access paths to all 4 Hostels.',
    isAvailable: true,
    connections: [
      { targetId: 'hostel_ring_road_south', heading: 180, pitch: -15, label: 'South to Academic Building (500m)', distance: '100m', type: 'road' },
      { targetId: 'hostel_boys_entrance', heading: 240, pitch: -10, label: 'West to GenZ Boys Hostel (Block B)', distance: '70m', type: 'path' },
      { targetId: 'hostel_intl_entrance', heading: 320, pitch: -10, label: 'Northwest to GenZ International Hostel (Block I)', distance: '65m', type: 'path' },
      { targetId: 'hostel_premium_entrance', heading: 30, pitch: -10, label: 'Northeast to GenZ Premium Hostel (Block P)', distance: '65m', type: 'path' },
      { targetId: 'hostel_girls_entrance', heading: 100, pitch: -10, label: 'East to GenZ Girls Hostel (Block G)', distance: '75m', type: 'path' },
      { targetId: 'gate_4_hostel', heading: 0, pitch: -15, label: 'North to Gate 4 (Residential Gate)', distance: '120m', type: 'road' },
    ]
  },
  {
    id: 'gate_4_hostel',
    name: 'Gate 4 – North Residential Gate',
    category: 'outdoor',
    buildingId: 'outdoor',
    buildingName: 'Campus Perimeter',
    floorId: 'ground',
    floorName: 'Ground Level',
    floorLevel: 0,
    coordinates: { x: 500, y: 40 },
    initialYaw: 180,
    initialPitch: 0,
    panoramaTheme: 'gate_hostel',
    description: 'Northern gate dedicated to campus residents, hostel food suppliers, and emergency residential vehicles.',
    isAvailable: true,
    connections: [
      { targetId: 'hostel_central_quad', heading: 180, pitch: -15, label: 'Enter Hostel Central Quad', distance: '120m', type: 'road' },
    ]
  }
];

// Helper to generate the 7 Floors of the Academic Building
function generateAcademicViewpoints(): Viewpoint[] {
  const vps: Viewpoint[] = [];

  // Ground Floor
  vps.push(
    {
      id: 'acad_g_entrance',
      name: 'Academic Complex – Grand Main Portico',
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 500, y: 450 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'acad_entrance',
      description: 'Soaring 3-story glass atrium entrance with touch check-in kiosks and digital campus event marquee.',
      isAvailable: true,
      connections: [
        { targetId: 'academic_plaza', heading: 180, pitch: 0, label: 'Exit to Academic Plaza & 800m Avenue', distance: '20m', type: 'exit' },
        { targetId: 'acad_g_reception', heading: 0, pitch: 0, label: 'Enter Grand Reception & Atrium', distance: '10m', type: 'door' },
      ]
    },
    {
      id: 'acad_g_reception',
      name: 'Ground Floor – Main Grand Reception & Atrium',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 500, y: 440 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'acad_reception',
      description: 'Luminous central lobby with circular marble reception desk, interactive directory boards, and executive corridors.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_entrance', heading: 180, pitch: 0, label: 'Exit towards Main Portico', distance: '10m', type: 'exit' },
        { targetId: 'acad_g_waiting', heading: 45, pitch: 0, label: 'Visitor & Executive Waiting Lounge', distance: '15m', type: 'door' },
        { targetId: 'acad_g_helpdesk', heading: 135, pitch: 0, label: 'Student One-Stop Help Desk', distance: '15m', type: 'door' },
        { targetId: 'acad_g_corridor_west', heading: 270, pitch: -10, label: 'West Corridor (Director, Chairman & Admin)', distance: '20m', type: 'road' },
        { targetId: 'acad_g_corridor_east', heading: 90, pitch: -10, label: 'East Corridor (Accounts, Admissions, Exams)', distance: '20m', type: 'road' },
        { targetId: 'acad_g_elevator', heading: 330, pitch: 0, label: 'Express Elevator Bank (Floors G–6)', distance: '18m', type: 'elevator' },
        { targetId: 'acad_g_stairs', heading: 30, pitch: 10, label: 'Grand Central Stairwell (To Floor 1)', distance: '22m', type: 'stairs' },
        { targetId: 'acad_rear_exit', heading: 0, pitch: 0, label: 'North Corridor to Rear Quad & Hostels', distance: '30m', type: 'door' },
      ]
    },
    {
      id: 'acad_g_waiting',
      name: 'Ground Floor – VIP & Student Waiting Lounge',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 540, y: 440 },
      initialYaw: 220,
      initialPitch: 0,
      panoramaTheme: 'acad_waiting',
      description: 'Elegantly furnished executive waiting lounge with plush leather seating, live institutional awards display, and coffee station.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 225, pitch: 0, label: 'Return to Main Reception', distance: '15m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_helpdesk',
      name: 'Ground Floor – Student Help Desk & Services',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 540, y: 460 },
      initialYaw: 315,
      initialPitch: 0,
      panoramaTheme: 'office_helpdesk',
      description: 'Dedicated student grievance, transcript verification, ID card renewal, and counseling assistance counters.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 315, pitch: 0, label: 'Return to Main Reception', distance: '15m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_corridor_west',
      name: 'Ground Floor – West Executive Corridor',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 450, y: 440 },
      initialYaw: 270,
      initialPitch: 0,
      panoramaTheme: 'corridor_admin',
      description: 'Quiet walnut-panelled executive wing housing the Offices of the Director, Chairman, General Administration, and Campus Security.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 90, pitch: -10, label: 'East to Grand Reception', distance: '20m', type: 'road' },
        { targetId: 'acad_g_director', heading: 0, pitch: 0, label: 'Director Chamber', distance: '12m', type: 'door' },
        { targetId: 'acad_g_chairman', heading: 315, pitch: 0, label: 'Chairman Chamber', distance: '18m', type: 'door' },
        { targetId: 'acad_g_admin', heading: 180, pitch: 0, label: 'General Administrative Office', distance: '12m', type: 'door' },
        { targetId: 'acad_g_security', heading: 225, pitch: 0, label: 'Security & CCTV Control Office', distance: '18m', type: 'door' },
      ]
    },
    {
      id: 'acad_g_director',
      name: 'Ground Floor – Director Chamber',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 450, y: 420 },
      initialYaw: 180,
      initialPitch: 0,
      panoramaTheme: 'office_director',
      description: 'Official office of the University Director. Featuring teak wood conference desk, university crest, and private deliberation annex.',
      isAvailable: true,
      amenities: { hasAC: true, hasWifi: true, features: ['Executive Desk', 'Private Meeting Table', 'Secure Archives'] },
      connections: [
        { targetId: 'acad_g_corridor_west', heading: 180, pitch: 0, label: 'Exit to West Corridor', distance: '12m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_chairman',
      name: 'Ground Floor – Chairman Chamber',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 430, y: 420 },
      initialYaw: 135,
      initialPitch: 0,
      panoramaTheme: 'office_chairman',
      description: 'Presiding chamber of the Board of Governors Chairman, designed with classic modernist architecture and high-security communication lines.',
      isAvailable: true,
      amenities: { hasAC: true, hasWifi: true, features: ['Board Conference Suite', 'Encrypted Telepresence', 'Presidential Sofa'] },
      connections: [
        { targetId: 'acad_g_corridor_west', heading: 135, pitch: 0, label: 'Exit to West Corridor', distance: '18m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_admin',
      name: 'Ground Floor – Administrative Office',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 450, y: 460 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'office_admin',
      description: 'Central university registrar, human resources, faculty recruitment, and institutional dispatch operations.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_corridor_west', heading: 0, pitch: 0, label: 'Exit to West Corridor', distance: '12m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_security',
      name: 'Ground Floor – Campus Security & Dispatch Office',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 430, y: 460 },
      initialYaw: 45,
      initialPitch: 0,
      panoramaTheme: 'office_security',
      description: 'Building access control monitors, campus-wide CCTV monitoring wall, and safety coordination unit.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_corridor_west', heading: 45, pitch: 0, label: 'Exit to West Corridor', distance: '18m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_corridor_east',
      name: 'Ground Floor – East Academic Services Corridor',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 550, y: 440 },
      initialYaw: 90,
      initialPitch: 0,
      panoramaTheme: 'corridor_admin',
      description: 'East wing corridor granting direct student access to Accounts & Fees, Admissions, and Examination branches.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 270, pitch: -10, label: 'West to Grand Reception', distance: '20m', type: 'road' },
        { targetId: 'acad_g_accounts', heading: 0, pitch: 0, label: 'Accounts & Finance Department', distance: '15m', type: 'door' },
        { targetId: 'acad_g_admission', heading: 45, pitch: 0, label: 'Admission Office & Counseling Hall', distance: '20m', type: 'door' },
        { targetId: 'acad_g_exam', heading: 180, pitch: 0, label: 'Examination Section & Controller Office', distance: '15m', type: 'door' },
      ]
    },
    {
      id: 'acad_g_accounts',
      name: 'Ground Floor – Accounts & Finance Department',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 550, y: 420 },
      initialYaw: 180,
      initialPitch: 0,
      panoramaTheme: 'office_accounts',
      description: 'Tuition fees, scholarship disbursements, research grants management, and payroll accounting offices.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_corridor_east', heading: 180, pitch: 0, label: 'Exit to East Corridor', distance: '15m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_admission',
      name: 'Ground Floor – Admission & Enrollment Office',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 570, y: 420 },
      initialYaw: 225,
      initialPitch: 0,
      panoramaTheme: 'office_admission',
      description: 'Prospective student intake, international student documentation, portfolio evaluations, and admissions counseling.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_corridor_east', heading: 225, pitch: 0, label: 'Exit to East Corridor', distance: '20m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_exam',
      name: 'Ground Floor – Examination Section & Confidential Wing',
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 550, y: 460 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'office_exam',
      description: 'Office of the Controller of Examinations, degree verification, grading evaluation suites, and confidential question archives.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_corridor_east', heading: 0, pitch: 0, label: 'Exit to East Corridor', distance: '15m', type: 'exit' }
      ]
    },
    {
      id: 'acad_g_elevator',
      name: 'Academic Complex – Central Elevator Bank (Ground)',
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 480, y: 425 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'elevator_bank',
      description: 'Four high-speed glass observation elevators servicing all 7 floors (Ground through 6th floor).',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 150, pitch: -10, label: 'Step out to Reception Atrium', distance: '18m', type: 'exit' },
        { targetId: 'acad_f1_elevator', heading: 0, pitch: 20, label: 'Elevator to 1st Floor (School of Computing)', distance: '1 Floor', type: 'elevator' },
        { targetId: 'acad_f2_elevator', heading: 0, pitch: 20, label: 'Elevator to 2nd Floor (School of Robotics)', distance: '2 Floors', type: 'elevator' },
        { targetId: 'acad_f3_elevator', heading: 0, pitch: 20, label: 'Elevator to 3rd Floor (School of Design)', distance: '3 Floors', type: 'elevator' },
        { targetId: 'acad_f4_elevator', heading: 0, pitch: 20, label: 'Elevator to 4th Floor (Seminar Suites)', distance: '4 Floors', type: 'elevator' },
        { targetId: 'acad_f5_elevator', heading: 0, pitch: 20, label: 'Elevator to 5th Floor (AI Supercomputing Lab)', distance: '5 Floors', type: 'elevator' },
        { targetId: 'acad_f6_elevator', heading: 0, pitch: 20, label: 'Elevator to 6th Floor (Central Library & Research)', distance: '6 Floors', type: 'elevator' },
      ]
    },
    {
      id: 'acad_g_stairs',
      name: 'Academic Complex – Grand Staircase (Ground Floor)',
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 520, y: 425 },
      initialYaw: 0,
      initialPitch: 15,
      panoramaTheme: 'staircase',
      description: 'Sweeping architectural granite staircase with brushed stainless-steel balustrades leading up to Floor 1.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 210, pitch: -10, label: 'Descend to Ground Floor Reception', distance: '22m', type: 'exit' },
        { targetId: 'acad_f1_stairs', heading: 0, pitch: 25, label: 'Ascend Stairs to 1st Floor', distance: '24 Steps', type: 'stairs' },
      ]
    },
    {
      id: 'acad_rear_exit',
      name: 'Academic Complex – North Rear Courtyard',
      category: 'outdoor',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: 'f0',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: 500, y: 390 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'acad_rear',
      description: 'Rear landscaped quad connecting the Academic Building directly to the 500m avenue towards the Hostels.',
      isAvailable: true,
      connections: [
        { targetId: 'acad_g_reception', heading: 180, pitch: 0, label: 'Enter Academic Building (Rear Doors)', distance: '30m', type: 'door' },
        { targetId: 'hostel_ring_road_south', heading: 0, pitch: -15, label: 'North onto Hostel Promenade (500m to Hostels)', distance: '60m', type: 'path' },
      ]
    }
  );

  // Generate Floors 1 to 6
  interface FloorSpec {
    level: number;
    floorId: string;
    floorName: string;
    schoolName: string;
    classrooms: { id: string; name: string; number: string; theme: string; spec: string }[];
    hodOffice?: { id: string; name: string; dept: string };
    facultyRoom: { id: string; name: string };
    deptOffice: { id: string; name: string };
    specialRoom?: { id: string; name: string; theme: string; desc: string; amenities: RoomAmenities };
  }

  const floorSpecs: FloorSpec[] = [
    {
      level: 1,
      floorId: 'f1',
      floorName: 'First Floor',
      schoolName: 'School of Computing & AI',
      classrooms: [
        { id: 'acad_f1_c101', name: 'Classroom 101 – Generative AI & Machine Learning', number: '101', theme: 'classroom_smart', spec: 'Tiered 80-seat lecture hall with 4K touch displays and acoustic mics.' },
        { id: 'acad_f1_c102', name: 'Classroom 102 – Cloud Architecture & DevOps', number: '102', theme: 'classroom_standard', spec: 'Interactive smart room equipped with dual interactive whiteboards.' },
        { id: 'acad_f1_c103', name: 'Classroom 103 – Full-Stack Systems & WebGL', number: '103', theme: 'classroom_smart', spec: 'Collaborative seating pods with high-speed gigabit ethernet ports.' },
      ],
      hodOffice: { id: 'acad_f1_hod', name: 'HOD Chamber – Department of Computer Science', dept: 'Computer Science & AI' },
      facultyRoom: { id: 'acad_f1_faculty', name: 'Computing Faculty Collaboration Lounge', },
      deptOffice: { id: 'acad_f1_dept_office', name: 'Department Office – School of Computing' },
    },
    {
      level: 2,
      floorId: 'f2',
      floorName: 'Second Floor',
      schoolName: 'School of Engineering & Robotics',
      classrooms: [
        { id: 'acad_f2_c201', name: 'Classroom 201 – Robotics & Mechatronics', number: '201', theme: 'classroom_smart', spec: 'Integrated lab-lecture space with embedded power outlets and test beds.' },
        { id: 'acad_f2_c202', name: 'Classroom 202 – Embedded Systems & IoT', number: '202', theme: 'classroom_standard', spec: 'Smart audio-visual enabled lecture theater with ergonomic chairs.' },
        { id: 'acad_f2_c203', name: 'Classroom 203 – Renewable Energy & Nano-Electronics', number: '203', theme: 'classroom_smart', spec: 'Interactive studio room with digital drafting tablets.' },
      ],
      hodOffice: { id: 'acad_f2_hod', name: 'HOD Chamber – Robotics & Automation', dept: 'Robotics Engineering' },
      facultyRoom: { id: 'acad_f2_faculty', name: 'Robotics & Engineering Faculty Cabin Suites' },
      deptOffice: { id: 'acad_f2_dept_office', name: 'Department Office – School of Engineering' },
    },
    {
      level: 3,
      floorId: 'f3',
      floorName: 'Third Floor',
      schoolName: 'School of Design & Management',
      classrooms: [
        { id: 'acad_f3_c301', name: 'Classroom 301 – UI/UX & Digital Product Design', number: '301', theme: 'classroom_smart', spec: 'Flexible modern studio with ergonomic sit-stand desks and design walls.' },
        { id: 'acad_f3_c302', name: 'Classroom 302 – Global Business & Fintech', number: '302', theme: 'classroom_standard', spec: 'Case study tiered auditorium with multi-angle projection.' },
        { id: 'acad_f3_c303', name: 'Classroom 303 – Digital Marketing & Media Studies', number: '303', theme: 'classroom_smart', spec: 'Acoustic broadcast-ready presentation and debate classroom.' },
      ],
      facultyRoom: { id: 'acad_f3_faculty', name: 'Faculty Collaborative Innovation Rooms' },
      deptOffice: { id: 'acad_f3_dept_office', name: 'Department Office – School of Management' },
    },
    {
      level: 4,
      floorId: 'f4',
      floorName: 'Fourth Floor',
      schoolName: 'Executive Seminar & Innovation Suites',
      classrooms: [
        { id: 'acad_f4_c401', name: 'Classroom 401 – Advanced Mathematics & Cryptography', number: '401', theme: 'classroom_standard', spec: 'Traditional blackboards combined with smart digital projection.' },
        { id: 'acad_f4_c402', name: 'Classroom 402 – Quantum Computing Principles', number: '402', theme: 'classroom_smart', spec: 'Interactive lab theater with ultra-wide high-refresh screens.' },
        { id: 'acad_f4_c403', name: 'Classroom 403 – Cyber Security & Ethical Hacking', number: '403', theme: 'classroom_smart', spec: 'Air-gapped cyber sandbox testing theater with biometric access.' },
      ],
      specialRoom: {
        id: 'acad_f4_seminar',
        name: 'Executive Seminar Room (Floor 4)',
        theme: 'seminar_hall',
        desc: 'Tiered 150-seat executive seminar hall with delegates desk microphones, video conference tracking, and dual projection.',
        amenities: { capacity: 150, hasAC: true, hasProjector: true, hasSmartBoard: true, hasWifi: true, features: ['Delegate Microphones', 'Dual 4K Laser Projection', 'Acoustic Timber Walls'] }
      },
      facultyRoom: { id: 'acad_f4_faculty', name: 'Executive Faculty & Visiting Fellows Suite' },
      deptOffice: { id: 'acad_f4_dept_office', name: 'Faculty Affairs & Research Liaison Office' },
    },
    {
      level: 5,
      floorId: 'f5',
      floorName: 'Fifth Floor',
      schoolName: 'Supercomputing & Advanced Laboratories',
      classrooms: [
        { id: 'acad_f5_c501', name: 'Classroom 501 – Neural Networks & Deep Learning', number: '501', theme: 'classroom_smart', spec: 'High-bandwidth workstations configured for parallel model training.' },
        { id: 'acad_f5_c502', name: 'Classroom 502 – Autonomous Systems & Computer Vision', number: '502', theme: 'classroom_standard', spec: 'Sensor-equipped experimental theater with indoor camera tracking.' },
        { id: 'acad_f5_c503', name: 'Classroom 503 – Bioinformatics & Computational Genomics', number: '503', theme: 'classroom_smart', spec: 'Specialized lab classroom with dual-monitor medical imaging setups.' },
      ],
      specialRoom: {
        id: 'acad_f5_complab',
        name: 'Advanced Supercomputing & AI Laboratory',
        theme: 'computer_lab',
        desc: 'Cutting-edge compute lab equipped with 120 high-performance GPU workstations, server cluster access, and optical fiber backbone.',
        amenities: { capacity: 120, hasAC: true, hasProjector: true, hasWifi: true, features: ['120x RTX High-Performance Workstations', 'Direct High-Speed Cluster Access', 'Dual 4K 144Hz Monitors'] }
      },
      facultyRoom: { id: 'acad_f5_faculty', name: 'Laboratory Instructors & Technical Staff Cabin' },
      deptOffice: { id: 'acad_f5_dept_office', name: 'Department Office – IT & Supercomputing Infrastructure' },
    },
    {
      level: 6,
      floorId: 'f6',
      floorName: 'Sixth Floor',
      schoolName: 'Central Library & Sky Research Wing',
      classrooms: [
        { id: 'acad_f6_c601', name: 'Classroom 601 – Doctoral Colloquium Room', number: '601', theme: 'classroom_smart', spec: 'Round-table seminar room for PhD dissertations and defense.' },
        { id: 'acad_f6_c602', name: 'Classroom 602 – Research Methodology & Ethics', number: '602', theme: 'classroom_standard', spec: 'Quiet scholarly lecture room with digital manuscript displays.' },
        { id: 'acad_f6_c603', name: 'Classroom 603 – Patent Drafting & IP Studies', number: '603', theme: 'classroom_smart', spec: 'Multimedia research classroom with global patent repository link.' },
      ],
      specialRoom: {
        id: 'acad_f6_library',
        name: 'Central University Library & Digital Repository',
        theme: 'library_main',
        desc: 'Panoramic top-floor library with 50,000+ volumes, 200 quiet study carrels, RFID book kiosks, and rooftop terrace reading decks.',
        amenities: { capacity: 350, hasAC: true, hasWifi: true, features: ['50,000+ Physical Books', 'Digital JSTOR & IEEE Terminals', 'Private Study Pods', 'Sky View Lounge'] }
      },
      facultyRoom: { id: 'acad_f6_conference', name: 'Presidential Conference & Board Room' },
      deptOffice: { id: 'acad_f6_research', name: 'Innovation & Doctoral Research Centre' },
    }
  ];

  floorSpecs.forEach((spec) => {
    const lobbyId = `acad_${spec.floorId}_lobby`;
    const stairsId = `acad_${spec.floorId}_stairs`;
    const elevatorId = `acad_${spec.floorId}_elevator`;
    const corridorId = `acad_${spec.floorId}_corridor`;

    // Elevator connections to all floors
    const elevatorConnections: NavigationEdge[] = [
      { targetId: lobbyId, heading: 180, pitch: -10, label: `Exit to ${spec.floorName} Lobby`, distance: '12m', type: 'exit' },
      { targetId: 'acad_g_elevator', heading: 0, pitch: -20, label: 'Elevator to Ground Floor (Reception)', distance: `${spec.level} Floors`, type: 'elevator' }
    ];
    floorSpecs.forEach((other) => {
      if (other.level !== spec.level) {
        elevatorConnections.push({
          targetId: `acad_${other.floorId}_elevator`,
          heading: 0,
          pitch: other.level > spec.level ? 20 : -20,
          label: `Elevator to ${other.floorName} (${other.schoolName})`,
          distance: `${Math.abs(other.level - spec.level)} Floors`,
          type: 'elevator'
        });
      }
    });

    // Stairs connections
    const stairsConnections: NavigationEdge[] = [
      { targetId: lobbyId, heading: 180, pitch: -10, label: `Exit to ${spec.floorName} Lobby`, distance: '15m', type: 'exit' },
    ];
    if (spec.level === 1) {
      stairsConnections.push({ targetId: 'acad_g_stairs', heading: 180, pitch: -25, label: 'Descend Stairs to Ground Floor', distance: '24 Steps', type: 'stairs' });
    } else {
      stairsConnections.push({ targetId: `acad_f${spec.level - 1}_stairs`, heading: 180, pitch: -25, label: `Descend Stairs to Floor ${spec.level - 1}`, distance: '24 Steps', type: 'stairs' });
    }
    if (spec.level < 6) {
      stairsConnections.push({ targetId: `acad_f${spec.level + 1}_stairs`, heading: 0, pitch: 25, label: `Ascend Stairs to Floor ${spec.level + 1}`, distance: '24 Steps', type: 'stairs' });
    }

    // Lobby
    vps.push({
      id: lobbyId,
      name: `${spec.floorName} – Central Lobby (${spec.schoolName})`,
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 500, y: 440 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'acad_lobby',
      description: `Bright open foyer of the ${spec.schoolName} featuring floor directories, showcase displays, and student rest benches.`,
      isAvailable: true,
      connections: [
        { targetId: elevatorId, heading: 330, pitch: 0, label: 'Express Elevator Bank (Floors G–6)', distance: '12m', type: 'elevator' },
        { targetId: stairsId, heading: 30, pitch: 10, label: 'Central Stairwell (Ascend / Descend)', distance: '15m', type: 'stairs' },
        { targetId: corridorId, heading: 90, pitch: -10, label: `Enter ${spec.floorName} Academic Corridor`, distance: '15m', type: 'road' },
      ]
    });

    // Elevator Viewpoint
    vps.push({
      id: elevatorId,
      name: `Academic Complex – Elevator Landing (${spec.floorName})`,
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 480, y: 425 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'elevator_bank',
      description: `Elevator lobby at ${spec.floorName}. High-speed access to any floor from Ground to 6th floor.`,
      isAvailable: true,
      connections: elevatorConnections
    });

    // Stairs Viewpoint
    vps.push({
      id: stairsId,
      name: `Academic Complex – Stairwell (${spec.floorName})`,
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 520, y: 425 },
      initialYaw: 0,
      initialPitch: 10,
      panoramaTheme: 'staircase',
      description: `Fire-safe, wide granite staircase at ${spec.floorName}.`,
      isAvailable: true,
      connections: stairsConnections
    });

    // Corridor connections
    const corridorConnections: NavigationEdge[] = [
      { targetId: lobbyId, heading: 270, pitch: -10, label: `Return to ${spec.floorName} Lobby & Elevators`, distance: '15m', type: 'road' }
    ];

    // Add classrooms
    spec.classrooms.forEach((c, cIdx) => {
      const headingAngle = 30 + cIdx * 45;
      corridorConnections.push({
        targetId: c.id,
        heading: headingAngle,
        pitch: 0,
        label: `Enter ${c.name}`,
        distance: `${12 + cIdx * 6}m`,
        type: 'door'
      });

      // Individual Classroom Viewpoint
      vps.push({
        id: c.id,
        name: `${spec.floorName} – ${c.name}`,
        category: 'academic',
        buildingId: 'academic_block',
        buildingName: 'GenZ Main Academic Complex',
        floorId: spec.floorId,
        floorName: spec.floorName,
        floorLevel: spec.level,
        coordinates: { x: 520 + cIdx * 30, y: 410 },
        initialYaw: 0,
        initialPitch: 0,
        panoramaTheme: c.theme,
        description: c.spec,
        roomNumber: c.number,
        amenities: { capacity: 60, hasAC: true, hasProjector: true, hasSmartBoard: true, hasWifi: true, features: ['Acoustic Mic System', 'Ergonomic Seating', 'Interactive Stylus Board'] },
        isAvailable: true,
        connections: [
          { targetId: corridorId, heading: 180, pitch: 0, label: `Exit to ${spec.floorName} Corridor`, distance: '10m', type: 'exit' }
        ]
      });
    });

    // Add HOD Office if exists
    if (spec.hodOffice) {
      corridorConnections.push({
        targetId: spec.hodOffice.id,
        heading: 200,
        pitch: 0,
        label: `Enter ${spec.hodOffice.name}`,
        distance: '18m',
        type: 'door'
      });
      vps.push({
        id: spec.hodOffice.id,
        name: `${spec.floorName} – ${spec.hodOffice.name}`,
        category: 'admin',
        buildingId: 'academic_block',
        buildingName: 'GenZ Main Academic Complex',
        floorId: spec.floorId,
        floorName: spec.floorName,
        floorLevel: spec.level,
        coordinates: { x: 470, y: 460 },
        initialYaw: 0,
        initialPitch: 0,
        panoramaTheme: 'office_hod',
        description: `Head of Department office for ${spec.hodOffice.dept}. Private consultation area, research wall, and academic library.`,
        isAvailable: true,
        amenities: { hasAC: true, hasWifi: true, features: ['Executive Consultation Desk', 'Smart Conference Screen', 'Private Archive'] },
        connections: [
          { targetId: corridorId, heading: 20, pitch: 0, label: `Exit to ${spec.floorName} Corridor`, distance: '18m', type: 'exit' }
        ]
      });
    }

    // Add Faculty Room
    corridorConnections.push({
      targetId: spec.facultyRoom.id,
      heading: 140,
      pitch: 0,
      label: `Enter ${spec.facultyRoom.name}`,
      distance: '20m',
      type: 'door'
    });
    vps.push({
      id: spec.facultyRoom.id,
      name: `${spec.floorName} – ${spec.facultyRoom.name}`,
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 530, y: 470 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'office_faculty',
      description: `Faculty work cubicles, discussion tables, resource lockers, and high-speed scanner stations.`,
      isAvailable: true,
      amenities: { capacity: 25, hasAC: true, hasWifi: true, features: ['Ergonomic Workstations', 'Pantry & Coffee Nook', 'Quiet Discussion Pods'] },
      connections: [
        { targetId: corridorId, heading: 320, pitch: 0, label: `Exit to ${spec.floorName} Corridor`, distance: '20m', type: 'exit' }
      ]
    });

    // Add Department Office
    corridorConnections.push({
      targetId: spec.deptOffice.id,
      heading: 170,
      pitch: 0,
      label: `Enter ${spec.deptOffice.name}`,
      distance: '15m',
      type: 'door'
    });
    vps.push({
      id: spec.deptOffice.id,
      name: `${spec.floorName} – ${spec.deptOffice.name}`,
      category: 'admin',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 510, y: 470 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'office_dept',
      description: `Departmental administrative center handling student queries, lecture timetabling, and faculty support.`,
      isAvailable: true,
      connections: [
        { targetId: corridorId, heading: 350, pitch: 0, label: `Exit to ${spec.floorName} Corridor`, distance: '15m', type: 'exit' }
      ]
    });

    // Add Special Room if exists (Seminar hall on F4, Supercomputing lab on F5, Library on F6)
    if (spec.specialRoom) {
      corridorConnections.push({
        targetId: spec.specialRoom.id,
        heading: 345,
        pitch: 0,
        label: `Enter ${spec.specialRoom.name}`,
        distance: '25m',
        type: 'door'
      });
      vps.push({
        id: spec.specialRoom.id,
        name: spec.specialRoom.name,
        category: 'academic',
        buildingId: 'academic_block',
        buildingName: 'GenZ Main Academic Complex',
        floorId: spec.floorId,
        floorName: spec.floorName,
        floorLevel: spec.level,
        coordinates: { x: 550, y: 410 },
        initialYaw: 0,
        initialPitch: 0,
        panoramaTheme: spec.specialRoom.theme,
        description: spec.specialRoom.desc,
        amenities: spec.specialRoom.amenities,
        isAvailable: true,
        connections: [
          { targetId: corridorId, heading: 165, pitch: 0, label: `Exit to ${spec.floorName} Corridor`, distance: '25m', type: 'exit' }
        ]
      });
    }

    // Corridor Viewpoint
    vps.push({
      id: corridorId,
      name: `${spec.floorName} – Main Academic Corridor`,
      category: 'academic',
      buildingId: 'academic_block',
      buildingName: 'GenZ Main Academic Complex',
      floorId: spec.floorId,
      floorName: spec.floorName,
      floorLevel: spec.level,
      coordinates: { x: 520, y: 440 },
      initialYaw: 90,
      initialPitch: 0,
      panoramaTheme: 'corridor_acad',
      description: `Wide, brightly lit academic corridor connecting classrooms, faculty offices, and rest amenities on ${spec.floorName}.`,
      isAvailable: true,
      connections: corridorConnections
    });
  });

  return vps;
}

// Helper to generate the 4 Hostels (Boys, Girls, International, Premium) with 5 floors each and 10 rooms per floor = 200 rooms!
function generateHostelViewpoints(): Viewpoint[] {
  const vps: Viewpoint[] = [];

  interface HostelMeta {
    id: string;
    code: 'B' | 'G' | 'I' | 'P';
    name: string;
    quadDirectionHeading: number;
    mapX: number;
    mapY: number;
    description: string;
    roomPrefix: string;
  }

  const hostels: HostelMeta[] = [
    {
      id: 'hostel_boys',
      code: 'B',
      name: 'GenZ Boys Hostel',
      quadDirectionHeading: 60,
      mapX: 250,
      mapY: 160,
      description: '5-story student residence featuring 50 furnished rooms (B-001 to B-050), recreation gym, dining hall, and high-speed mesh Wi-Fi.',
      roomPrefix: 'B'
    },
    {
      id: 'hostel_girls',
      code: 'G',
      name: 'GenZ Girls Hostel',
      quadDirectionHeading: 280,
      mapX: 650,
      mapY: 160,
      description: '5-story student residence with 50 elegant rooms (G-001 to G-050), biometric security, dedicated gym, quiet reading lounge, and dining hall.',
      roomPrefix: 'G'
    },
    {
      id: 'hostel_intl',
      code: 'I',
      name: 'GenZ International Hostel',
      quadDirectionHeading: 140,
      mapX: 380,
      mapY: 120,
      description: '5-story global scholars residence with 50 premium suites (I-001 to I-050), international kitchen, cultural media lounge, and private study pods.',
      roomPrefix: 'I'
    },
    {
      id: 'hostel_premium',
      code: 'P',
      name: 'GenZ Premium Hostel',
      quadDirectionHeading: 210,
      mapX: 520,
      mapY: 120,
      description: '5-story luxury residence offering 50 executive student rooms (P-001 to P-050) with attached balconies, smart climate control, and lounge.',
      roomPrefix: 'P'
    }
  ];

  hostels.forEach((h) => {
    const entranceId = `${h.id}_entrance`;
    const receptionId = `${h.id}_reception`;
    const commonRoomId = `${h.id}_common`;
    const diningId = `${h.id}_dining`;

    // 1. Exterior Entrance Viewpoint
    vps.push({
      id: entranceId,
      name: `${h.name} – Grand Portico & Entrance`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: h.mapX, y: h.mapY + 30 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'hostel_exterior',
      description: `Modern glass-and-brick entrance facade of ${h.name} with security boom barrier, biometric turnstile gates, and bicycle stands.`,
      isAvailable: true,
      connections: [
        { targetId: 'hostel_central_quad', heading: h.quadDirectionHeading, pitch: -15, label: 'Exit to Hostel Central Quad & Recreation Lawn', distance: '70m', type: 'road' },
        { targetId: receptionId, heading: 0, pitch: 0, label: 'Enter Hostel Reception & Security Foyer', distance: '12m', type: 'door' },
      ]
    });

    // 2. Reception & Security Foyer
    vps.push({
      id: receptionId,
      name: `${h.name} – Reception, Warden Desk & Security Foyer`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: h.mapX, y: h.mapY + 15 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'hostel_reception',
      description: `24/7 Hostel Warden reception, parcel collection locker lockers, visitor registry, and elevator access.`,
      isAvailable: true,
      connections: [
        { targetId: entranceId, heading: 180, pitch: 0, label: 'Exit to Outer Entrance', distance: '12m', type: 'exit' },
        { targetId: commonRoomId, heading: 45, pitch: 0, label: 'Hostel Student Common Room & TV Lounge', distance: '18m', type: 'door' },
        { targetId: diningId, heading: 135, pitch: 0, label: 'Hostel Dining Hall & Kitchen', distance: '22m', type: 'door' },
        { targetId: `${h.id}_f0_corridor`, heading: 270, pitch: -10, label: 'Ground Floor Residential Corridor (Rooms 001-010)', distance: '15m', type: 'road' },
        { targetId: `${h.id}_elevator`, heading: 330, pitch: 0, label: 'Hostel Elevator (Floors Ground to 4th)', distance: '12m', type: 'elevator' },
        { targetId: `${h.id}_stairs`, heading: 30, pitch: 10, label: 'Hostel Central Stairwell (To Upper Floors)', distance: '16m', type: 'stairs' },
      ]
    });

    // 3. Common Room & TV Lounge
    vps.push({
      id: commonRoomId,
      name: `${h.name} – Student Common Room & Recreation Lounge`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: h.mapX + 25, y: h.mapY + 20 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'hostel_common',
      description: `Spacious recreation lounge with ping pong tables, foosball, big-screen 85-inch gaming TV, and beanbag seating.`,
      isAvailable: true,
      amenities: { capacity: 60, hasAC: true, hasWifi: true, features: ['85-inch 4K TV & Soundbar', 'Table Tennis & Foosball', 'Board Games & Library'] },
      connections: [
        { targetId: receptionId, heading: 225, pitch: 0, label: 'Return to Reception Foyer', distance: '18m', type: 'exit' }
      ]
    });

    // 4. Dining Hall & Kitchen
    vps.push({
      id: diningId,
      name: `${h.name} – Resident Mess & Dining Hall`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: h.mapX + 25, y: h.mapY - 10 },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'hostel_dining',
      description: `Buffet dining hall serving hot breakfast, lunch, high tea, and dinner. Clean stainless-steel food counters and commercial kitchen.`,
      isAvailable: true,
      amenities: { capacity: 150, hasAC: true, hasWifi: true, features: ['Hot Steam Buffet Station', 'UV Water Purification', 'Resident Kitchenette'] },
      connections: [
        { targetId: receptionId, heading: 315, pitch: 0, label: 'Return to Reception Foyer', distance: '22m', type: 'exit' }
      ]
    });

    // 5. Central Hostel Elevator Viewpoint
    const hostelElevatorConnections: NavigationEdge[] = [
      { targetId: receptionId, heading: 150, pitch: -10, label: 'Exit to Ground Floor Reception', distance: '12m', type: 'exit' }
    ];
    for (let f = 0; f < 5; f++) {
      hostelElevatorConnections.push({
        targetId: `${h.id}_f${f}_corridor`,
        heading: 0,
        pitch: f === 0 ? 0 : 20,
        label: `Elevator to ${f === 0 ? 'Ground' : `Floor ${f}`} Corridor (Rooms ${h.roomPrefix}-${String(f * 10 + 1).padStart(3, '0')} to ${String(f * 10 + 10).padStart(3, '0')})`,
        distance: `${f === 0 ? 'Ground' : `Floor ${f}`}`,
        type: 'elevator'
      });
    }

    vps.push({
      id: `${h.id}_elevator`,
      name: `${h.name} – Central Elevator Landing`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'All Floors',
      floorLevel: 0,
      coordinates: { x: h.mapX - 10, y: h.mapY },
      initialYaw: 0,
      initialPitch: 0,
      panoramaTheme: 'elevator_bank',
      description: `High-speed passenger elevator servicing all 5 floors of ${h.name}.`,
      isAvailable: true,
      connections: hostelElevatorConnections
    });

    // 6. Central Hostel Stairwell Viewpoint
    vps.push({
      id: `${h.id}_stairs`,
      name: `${h.name} – Central Stairwell`,
      category: 'hostel',
      buildingId: h.id,
      buildingName: h.name,
      floorId: 'ground',
      floorName: 'Ground Floor',
      floorLevel: 0,
      coordinates: { x: h.mapX + 10, y: h.mapY },
      initialYaw: 0,
      initialPitch: 15,
      panoramaTheme: 'staircase',
      description: `Well-lit granite stairs connecting Ground to 4th Floor.`,
      isAvailable: true,
      connections: [
        { targetId: receptionId, heading: 210, pitch: -10, label: 'Descend to Reception Foyer', distance: '16m', type: 'exit' },
        { targetId: `${h.id}_f1_corridor`, heading: 0, pitch: 25, label: 'Ascend to 1st Floor Corridor', distance: '22 Steps', type: 'stairs' },
      ]
    });

    // 7. Generate All 5 Floors (Floor 0 to 4) and Exactly 10 Rooms Per Floor = 50 Rooms per Hostel!
    for (let f = 0; f < 5; f++) {
      const floorId = `f${f}`;
      const floorName = f === 0 ? 'Ground Floor' : `Floor ${f}`;
      const corridorId = `${h.id}_f${f}_corridor`;
      const startNum = f * 10 + 1;
      const endNum = f * 10 + 10;

      const corridorConnections: NavigationEdge[] = [
        { targetId: `${h.id}_elevator`, heading: 330, pitch: 0, label: `Elevator (All Floors G-4)`, distance: '10m', type: 'elevator' },
      ];

      if (f === 0) {
        corridorConnections.push({ targetId: receptionId, heading: 90, pitch: -10, label: 'To Reception & Security Desk', distance: '15m', type: 'exit' });
      } else {
        corridorConnections.push({
          targetId: `${h.id}_f${f - 1}_corridor`,
          heading: 180,
          pitch: -20,
          label: `Descend Stairs to Floor ${f - 1 === 0 ? 'Ground' : f - 1}`,
          distance: '22 Steps',
          type: 'stairs'
        });
      }

      if (f < 4) {
        corridorConnections.push({
          targetId: `${h.id}_f${f + 1}_corridor`,
          heading: 0,
          pitch: 20,
          label: `Ascend Stairs to Floor ${f + 1}`,
          distance: '22 Steps',
          type: 'stairs'
        });
      }

      // Generate the 10 Rooms on this floor
      for (let r = 0; r < 10; r++) {
        const roomInt = startNum + r;
        const roomCode = `${h.roomPrefix}-${String(roomInt).padStart(3, '0')}`;
        const roomId = `${h.id}_r_${roomCode.toLowerCase()}`;

        // Add edge from corridor to room
        const roomAngle = 30 + r * 32;
        corridorConnections.push({
          targetId: roomId,
          heading: roomAngle % 360,
          pitch: 0,
          label: `Enter Room ${roomCode}`,
          distance: `${8 + (r % 5) * 4}m`,
          type: 'door'
        });

        // Room Viewpoint
        vps.push({
          id: roomId,
          name: `${h.name} – Room ${roomCode}`,
          category: 'hostel',
          buildingId: h.id,
          buildingName: h.name,
          floorId: floorId,
          floorName: floorName,
          floorLevel: f,
          coordinates: { x: h.mapX - 20 + (r % 5) * 10, y: h.mapY - 10 - f * 5 },
          initialYaw: 0,
          initialPitch: 0,
          panoramaTheme: h.id === 'hostel_premium' ? 'hostel_room_premium' : (h.id === 'hostel_intl' ? 'hostel_room_intl' : 'hostel_room_standard'),
          description: `Fully furnished student suite in ${h.name} (${floorName}). Features ergonomic study workstation, orthopedic bed with mattress & pillow, wardrobe, ceiling fan, LED task lighting, and panoramic campus window.`,
          roomNumber: roomCode,
          amenities: {
            beds: h.id === 'hostel_premium' ? 1 : 2,
            hasAC: h.id === 'hostel_premium' || h.id === 'hostel_intl',
            hasWardrobe: true,
            hasStudyTable: true,
            hasWifi: true,
            features: [
              'Comfort Orthopedic Bed with Mattress & Pillow',
              'Solid Hardwood Study Table & Ergonomic Mesh Chair',
              'Two-Door Ventilated Metal/Wood Wardrobe',
              'High-Speed Whisper-Quiet Ceiling Fan',
              'LED Warm-White Reading Lights & Accent Strip',
              'Large Double-Glazed Soundproof Window with Campus View',
              'Lockable Under-Bed Luggage & Footwear Storage Box',
              'Personal Pin-Up Softboard & Power Strip with USB-C'
            ]
          },
          isAvailable: true,
          connections: [
            {
              targetId: corridorId,
              heading: 180,
              pitch: 0,
              label: `Exit to ${floorName} Corridor`,
              distance: '8m',
              type: 'exit'
            }
          ]
        });
      }

      // Corridor Viewpoint
      vps.push({
        id: corridorId,
        name: `${h.name} – ${floorName} Residential Corridor (Rooms ${h.roomPrefix}-${String(startNum).padStart(3, '0')} to ${h.roomPrefix}-${String(endNum).padStart(3, '0')})`,
        category: 'hostel',
        buildingId: h.id,
        buildingName: h.name,
        floorId: floorId,
        floorName: floorName,
        floorLevel: f,
        coordinates: { x: h.mapX, y: h.mapY - f * 5 },
        initialYaw: 90,
        initialPitch: 0,
        panoramaTheme: 'hostel_corridor',
        description: `Carpeted, climate-monitored residential corridor on ${floorName} of ${h.name} providing access to 10 private rooms, water dispenser, and fire egress.`,
        isAvailable: true,
        connections: corridorConnections
      });
    }
  });

  return vps;
}

// Assemble all viewpoints with Real 360° Equirectangular Photographs
export const ALL_VIEWPOINTS: Viewpoint[] = [
  ...outdoorViewpoints,
  ...generateAcademicViewpoints(),
  ...generateHostelViewpoints()
].map((vp) => ({
  ...vp,
  panoramaUrl: vp.panoramaUrl || getRealPhotoUrl(vp.panoramaTheme, vp.category, vp.id)
}));

// Map lookup table for O(1) viewpoint retrieval
export const VIEWPOINT_MAP: Map<string, Viewpoint> = new Map(
  ALL_VIEWPOINTS.map((vp) => [vp.id, vp])
);

