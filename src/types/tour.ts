export type ViewpointCategory = 
  | 'outdoor'
  | 'academic'
  | 'hostel'
  | 'sports'
  | 'amenity'
  | 'admin';

export type EdgeType = 'road' | 'door' | 'stairs' | 'elevator' | 'exit' | 'path';

export interface NavigationEdge {
  targetId: string;
  heading: number; // Azimuth in degrees 0-360 (0 = North)
  pitch?: number;  // Pitch in degrees (-90 down to +90 up, ground arrow is around -20)
  label: string;   // Tooltip / destination label e.g. "To Grand Fountain Circle"
  distance?: string; // e.g. "45m"
  type?: EdgeType; // Arrow icon type
}

export interface RoomAmenities {
  beds?: number;
  capacity?: number;
  hasAC?: boolean;
  hasProjector?: boolean;
  hasSmartBoard?: boolean;
  hasWardrobe?: boolean;
  hasStudyTable?: boolean;
  hasWifi?: boolean;
  features?: string[];
}

export interface Viewpoint {
  id: string;
  name: string;
  category: ViewpointCategory;
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorName: string;
  floorLevel: number; // 0 for Ground, 1 for 1st, etc.
  coordinates: {
    x: number; // 0 to 1000 scale on 2D campus map
    y: number; // 0 to 1000 scale on 2D campus map
    lat?: number;
    lng?: number;
  };
  initialYaw: number;   // Camera start horizontal heading (degrees)
  initialPitch: number; // Camera start vertical pitch (degrees)
  panoramaUrl?: string; // Custom uploaded image data URL or web URL
  panoramaTheme: string; // Theme key for procedural 360 equirectangular texture
  description: string;
  roomNumber?: string;
  amenities?: RoomAmenities;
  isAvailable: boolean;
  connections: NavigationEdge[];
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: ViewpointCategory;
  description: string;
  totalFloors: number;
  floors: {
    id: string;
    level: number;
    name: string;
    mainViewpointId: string;
  }[];
  mapCoordinates: { x: number; y: number; width: number; height: number };
}

export interface CampusRoute {
  sourceId: string;
  targetId: string;
  path: string[];
  totalDistance: number;
  steps: {
    fromId: string;
    toId: string;
    instruction: string;
    distanceMeters: number;
  }[];
}

