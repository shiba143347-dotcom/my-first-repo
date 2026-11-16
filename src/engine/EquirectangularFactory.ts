// High-Fidelity 360° Equirectangular Texture Engine
// Generates mathematically projected 2:1 panoramic textures onto HTML5 Canvas

// Cache for dynamic personalized 360 panoramas
const customizedCache = new Map<string, string>();

export async function getCustomizedPanoramaUrl(
  baseSrc: string,
  viewpoint: {
    id: string;
    name: string;
    buildingId: string;
    buildingName: string;
    floorName: string;
    category: string;
    roomNumber?: string;
  }
): Promise<string> {
  // If not an individual hostel room with room plaque, return pristine 4K equirectangular image directly
  if (!viewpoint.roomNumber || viewpoint.category !== 'hostel') {
    return baseSrc;
  }

  const cacheKey = `custom_${viewpoint.id}_${baseSrc}`;
  if (customizedCache.has(cacheKey)) {
    return customizedCache.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 4096;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(baseSrc);
        return;
      }

      const W = canvas.width;
      const H = canvas.height;

      // 1. Draw base high-resolution 4K real photograph
      ctx.drawImage(img, 0, 0, W, H);

      // 2. Individual Hostel Room Plaque on wall (4K scaled)
      ctx.save();
      const plaqueX = W * 0.72;
      const plaqueY = H * 0.42;

      // Plaque Shadow & Brass/Metallic Frame
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(plaqueX - 320, plaqueY - 100, 640, 200, 24);
      ctx.fill();

      ctx.strokeStyle = viewpoint.buildingId === 'hostel_girls' ? '#f43f5e' : (viewpoint.buildingId === 'hostel_premium' ? '#10b981' : '#6366f1');
      ctx.lineWidth = 8;
      ctx.stroke();

      // Corner Screws
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(plaqueX - 290, plaqueY - 76, 8, 0, Math.PI * 2);
      ctx.arc(plaqueX + 290, plaqueY - 76, 8, 0, Math.PI * 2);
      ctx.arc(plaqueX - 290, plaqueY + 76, 8, 0, Math.PI * 2);
      ctx.arc(plaqueX + 290, plaqueY + 76, 8, 0, Math.PI * 2);
      ctx.fill();

      // Plaque Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`SUITE ${viewpoint.roomNumber}`, plaqueX, plaqueY - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${viewpoint.buildingName.toUpperCase()}`, plaqueX, plaqueY + 40);
      ctx.fillText(`${viewpoint.floorName.toUpperCase()} • FURNISHED RESIDENCE`, plaqueX, plaqueY + 72);
      ctx.restore();

      const outUrl = canvas.toDataURL('image/jpeg', 0.94);
      customizedCache.set(cacheKey, outUrl);
      resolve(outUrl);
    };

    img.onerror = () => {
      resolve(baseSrc);
    };

    img.src = baseSrc;
  });
}

const textureCache = new Map<string, string>();

export function generatePanoramaDataUrl(theme: string, title: string, subtitle?: string): string {
  const cacheKey = `${theme}_${title}_${subtitle || ''}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;
  const horizon = H * 0.52; // Eye-level horizon

  // 1. Base Environment Renderer
  renderThemeEnvironment(ctx, theme, title, subtitle || '', W, H, horizon);

  // 2. Add realistic subtle vignette & watermark
  ctx.save();
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.6);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Ground Tripod / Camera Nadir Cap (Authentic Street View 360 circle marker at nadir)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(W / 2, H - 35, 75, 25, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 24, 39, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GENZ UNIVERSITY 360°', W / 2, H - 30);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  textureCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function renderThemeEnvironment(
  ctx: CanvasRenderingContext2D,
  theme: string,
  title: string,
  subtitle: string,
  W: number,
  H: number,
  horizon: number
) {
  // Indoor vs Outdoor detection
  const isIndoor = theme.startsWith('acad_') ||
    theme.startsWith('office_') ||
    theme.startsWith('classroom_') ||
    theme.startsWith('corridor_') ||
    theme.startsWith('hostel_room') ||
    theme.startsWith('hostel_reception') ||
    theme.startsWith('hostel_dining') ||
    theme.startsWith('hostel_common') ||
    theme.startsWith('hostel_corridor') ||
    theme === 'canteen_inside' ||
    theme === 'auditorium_inside' ||
    theme === 'medical_centre' ||
    theme === 'computer_lab' ||
    theme === 'library_main' ||
    theme === 'seminar_hall' ||
    theme === 'elevator_bank' ||
    theme === 'staircase';

  if (!isIndoor) {
    renderOutdoorPanorama(ctx, theme, title, subtitle, W, H, horizon);
  } else if (theme.startsWith('hostel_room')) {
    renderHostelRoomPanorama(ctx, theme, title, subtitle, W, H, horizon);
  } else if (theme.startsWith('classroom_') || theme === 'computer_lab' || theme === 'seminar_hall') {
    renderClassroomPanorama(ctx, theme, title, subtitle, W, H, horizon);
  } else if (theme === 'library_main') {
    renderLibraryPanorama(ctx, title, W, H, horizon);
  } else {
    renderIndoorPanorama(ctx, theme, title, subtitle, W, H, horizon);
  }
}

// ----------------------------------------------------
// OUTDOOR PANORAMA GENERATOR (Main Gate, 800m Road, Gardens, Sports)
// ----------------------------------------------------
function renderOutdoorPanorama(
  ctx: CanvasRenderingContext2D,
  theme: string,
  title: string,
  subtitle: string,
  W: number,
  H: number,
  horizon: number
) {
  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
  skyGrad.addColorStop(0, '#0284c7');    // Zenith azure blue
  skyGrad.addColorStop(0.65, '#38bdf8'); // Sky bright blue
  skyGrad.addColorStop(1, '#bae6fd');    // Horizon haze
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, horizon);

  // Sun
  ctx.save();
  const sunX = W * 0.65;
  const sunY = horizon * 0.35;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 180);
  sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.6)');
  sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant Mountain & Campus Skyline Silhouette
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let x = 0; x <= W; x += 80) {
    const wave = Math.sin(x * 0.008) * 20 + Math.cos(x * 0.015) * 15;
    ctx.lineTo(x, horizon - 35 + wave);
  }
  ctx.lineTo(W, horizon);
  ctx.closePath();
  ctx.fill();

  // Distant Trees Tree-line
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let x = 0; x <= W; x += 30) {
    const treeH = 30 + Math.sin(x * 0.04) * 14;
    ctx.lineTo(x, horizon - treeH);
  }
  ctx.lineTo(W, horizon);
  ctx.closePath();
  ctx.fill();

  // Ground: Lush Grass or Campus Ground
  const groundGrad = ctx.createLinearGradient(0, horizon, 0, H);
  groundGrad.addColorStop(0, '#16a34a');
  groundGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, horizon, W, H - horizon);

  // If Main Gate / Road / Parking
  if (theme === 'main_gate' || theme.startsWith('boulevard_') || theme === 'fountain_circle' || theme === 'academic_plaza' || theme.startsWith('gate_')) {
    // Asphalt Main Road stretching straight towards horizon center
    const roadWidthHorizon = 120;
    const roadWidthBottom = W * 0.55;
    const centerX = W * 0.5;

    ctx.save();
    ctx.fillStyle = '#334155'; // Dark tarmac
    ctx.beginPath();
    ctx.moveTo(centerX - roadWidthHorizon, horizon);
    ctx.lineTo(centerX + roadWidthHorizon, horizon);
    ctx.lineTo(centerX + roadWidthBottom, H);
    ctx.lineTo(centerX - roadWidthBottom, H);
    ctx.closePath();
    ctx.fill();

    // Road curb edges
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(centerX - roadWidthHorizon, horizon);
    ctx.lineTo(centerX - roadWidthBottom, H);
    ctx.moveTo(centerX + roadWidthHorizon, horizon);
    ctx.lineTo(centerX + roadWidthBottom, H);
    ctx.stroke();

    // Road Center Yellow Markings (Perspective dashed line)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 8;
    ctx.setLineDash([40, 30]);
    ctx.beginPath();
    ctx.moveTo(centerX, horizon + 5);
    ctx.lineTo(centerX, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Lateral Sidewalks / Palm Trees along road
    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const py = horizon + (H - horizon) * (0.2 + t * 0.7);
      const span = roadWidthHorizon + (roadWidthBottom - roadWidthHorizon) * (0.2 + t * 0.7) + 50;

      // Left Palm
      drawPalmTree(ctx, centerX - span, py, 40 + t * 110);
      // Right Palm
      drawPalmTree(ctx, centerX + span, py, 40 + t * 110);
    }
  }

  // Theme-specific landmark highlights
  if (theme === 'main_gate' || theme.startsWith('gate_')) {
    // Monumental Archway
    drawMonumentalArch(ctx, W * 0.5, horizon, theme === 'main_gate' ? 'GENZ UNIVERSITY' : title.toUpperCase());
  } else if (theme === 'fountain_circle') {
    // Grand Central Fountain
    drawWaterFountain(ctx, W * 0.5, horizon + 120);
  } else if (theme.includes('cricket') || theme.includes('sports') || theme.includes('football')) {
    drawSportsPitches(ctx, theme, W, H, horizon);
  } else if (theme === 'academic_plaza') {
    // 7-Story Academic Tower Facade in background
    drawAcademicBuildingFacade(ctx, W * 0.5, horizon);
  }

  // Floating Location Title Overlay in the panorama sky
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 350, horizon * 0.15, 700, 70, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, W / 2, horizon * 0.15 + 34);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(subtitle || 'GenZ University 360° Outdoor Exploration', W / 2, horizon * 0.15 + 56);
  ctx.restore();
}

// ----------------------------------------------------
// INDOOR PANORAMA GENERATOR (Lobby, Corridors, Offices)
// ----------------------------------------------------
function renderIndoorPanorama(
  ctx: CanvasRenderingContext2D,
  theme: string,
  title: string,
  subtitle: string,
  W: number,
  H: number,
  horizon: number
) {
  // 1. Ceiling (Modern acoustic tiles with LED panel light grids)
  const ceilingGrad = ctx.createLinearGradient(0, 0, 0, horizon * 0.7);
  ceilingGrad.addColorStop(0, '#0f172a');
  ceilingGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = ceilingGrad;
  ctx.fillRect(0, 0, W, horizon * 0.7);

  // Ceiling LED Light Panels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (let x = 80; x < W; x += 180) {
    ctx.fillRect(x, horizon * 0.15, 80, 20);
    // Light glow down
    const glow = ctx.createLinearGradient(x + 40, horizon * 0.15, x + 40, horizon * 0.6);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 20, horizon * 0.15, 120, horizon * 0.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  }

  // 2. Walls (Warm corporate beige / architectural glass / walnut panelling)
  const wallGrad = ctx.createLinearGradient(0, horizon * 0.7, 0, horizon + 40);
  if (theme.includes('director') || theme.includes('chairman') || theme.includes('admin')) {
    wallGrad.addColorStop(0, '#451a03'); // Luxurious walnut
    wallGrad.addColorStop(1, '#78350f');
  } else if (theme.includes('reception') || theme.includes('lobby')) {
    wallGrad.addColorStop(0, '#1e293b');
    wallGrad.addColorStop(1, '#334155');
  } else {
    wallGrad.addColorStop(0, '#334155');
    wallGrad.addColorStop(1, '#475569');
  }
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, horizon * 0.7, W, (horizon + 40) - (horizon * 0.7));

  // 3. Floor (Polished Italian marble / polished terrazzo with perspective tiles)
  const floorGrad = ctx.createLinearGradient(0, horizon + 40, 0, H);
  floorGrad.addColorStop(0, '#1e293b');
  floorGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, horizon + 40, W, H - (horizon + 40));

  // Perspective floor grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= W; i += 100) {
    ctx.beginPath();
    ctx.moveTo(i, horizon + 40);
    ctx.lineTo(W / 2 + (i - W / 2) * 2.8, H);
    ctx.stroke();
  }
  for (let y = horizon + 50; y <= H; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Feature Wall: Grand Branding or Reception Counter or Executive Desk
  if (theme.includes('reception') || theme.includes('entrance') || theme.includes('lobby')) {
    drawGrandReception(ctx, W * 0.5, horizon, title);
  } else if (theme.includes('director') || theme.includes('chairman') || theme.includes('hod') || theme.includes('office')) {
    drawExecutiveOffice(ctx, W * 0.5, horizon, title);
  } else if (theme === 'elevator_bank') {
    drawElevatorBank(ctx, W * 0.5, horizon);
  } else if (theme === 'staircase') {
    drawStaircaseVisual(ctx, W * 0.5, horizon);
  } else {
    drawCorridorDoors(ctx, W, horizon, title);
  }

  // Signboard / Location Plaque
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 320, horizon * 0.45, 640, 60, 12);
  ctx.fill();
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, W / 2, horizon * 0.45 + 30);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GENZ UNIVERSITY • INDOOR 360° TOUR', W / 2, horizon * 0.45 + 48);
  ctx.restore();
}

// ----------------------------------------------------
// CLASSROOM / LAB PANORAMA GENERATOR
// ----------------------------------------------------
function renderClassroomPanorama(
  ctx: CanvasRenderingContext2D,
  theme: string,
  title: string,
  subtitle: string,
  W: number,
  H: number,
  horizon: number
) {
  // Indoor Classroom Base
  renderIndoorPanorama(ctx, theme, title, subtitle, W, H, horizon);

  const centerX = W * 0.5;

  // Front Wall: 4K Smart Interactive Whiteboard
  ctx.save();
  ctx.fillStyle = '#0f172a'; // Black frame
  ctx.beginPath();
  ctx.roundRect(centerX - 350, horizon * 0.4, 700, 240, 16);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Smartboard Screen Display
  const screenGrad = ctx.createLinearGradient(centerX - 340, 0, centerX + 340, 0);
  screenGrad.addColorStop(0, '#1e1b4b');
  screenGrad.addColorStop(1, '#312e81');
  ctx.fillStyle = screenGrad;
  ctx.fillRect(centerX - 340, horizon * 0.4 + 10, 680, 220);

  // Smartboard Content
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, centerX, horizon * 0.4 + 60);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GENZ UNIVERSITY SMART CLASSROOM SYSTEM v4.2', centerX, horizon * 0.4 + 90);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - 280, horizon * 0.4 + 115, 560, 95);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  if (theme === 'computer_lab') {
    ctx.fillText('Cluster Status: 120 Active Workstations | RTX AI Acceleration: ONLINE', centerX, horizon * 0.4 + 145);
    ctx.fillText('Active Course: Deep Learning & Autonomous Robotics Simulation', centerX, horizon * 0.4 + 175);
  } else {
    ctx.fillText('Interactive Touch Stylus Active | Wireless Screen Share Connected', centerX, horizon * 0.4 + 145);
    ctx.fillText('Attendance: 58/60 Enrolled Scholars Present', centerX, horizon * 0.4 + 175);
  }

  // Teacher Podium
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(centerX - 100, horizon + 50, 200, 120, 8);
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(centerX - 80, horizon + 55, 60, 4); // Podium microphone / laptop

  // Student Desks in Foreground
  ctx.fillStyle = '#334155';
  for (let d = -2; d <= 2; d++) {
    const dx = centerX + d * 280;
    ctx.beginPath();
    ctx.roundRect(dx - 110, horizon + 190, 220, 70, 10);
    ctx.fill();
    // Desk Chairs
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(dx - 50, horizon + 265, 100, 80, 8);
    ctx.fill();
    ctx.fillStyle = '#334155';
  }
  ctx.restore();
}

// ----------------------------------------------------
// HOSTEL ROOM PANORAMA GENERATOR (Bed, Mattress, Pillow, Desk, Chair, Wardrobe, Fan)
// ----------------------------------------------------
function renderHostelRoomPanorama(
  ctx: CanvasRenderingContext2D,
  theme: string,
  title: string,
  subtitle: string,
  W: number,
  H: number,
  horizon: number
) {
  // 1. Room Ceiling with Fan
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, W, horizon * 0.6);

  // Ceiling Fan in zenith
  ctx.save();
  const fanX = W * 0.5;
  const fanY = horizon * 0.25;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(fanX, fanY, 18, 0, Math.PI * 2);
  ctx.fill();
  // Fan Blades (3-blade spinning silhouette)
  ctx.fillStyle = '#64748b';
  for (let b = 0; b < 3; b++) {
    const angle = (b * Math.PI * 2) / 3;
    ctx.save();
    ctx.translate(fanX, fanY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.roundRect(0, -6, 90, 12, 6);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 2. Room Walls (Warm residential tones)
  const wallGrad = ctx.createLinearGradient(0, horizon * 0.6, 0, horizon + 60);
  wallGrad.addColorStop(0, '#334155');
  wallGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, horizon * 0.6, W, horizon * 0.4 + 60);

  // 3. Wooden Laminate Floor
  const floorGrad = ctx.createLinearGradient(0, horizon + 60, 0, H);
  floorGrad.addColorStop(0, '#451a03'); // Warm teak parquet
  floorGrad.addColorStop(1, '#270e02');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, horizon + 60, W, H - (horizon + 60));

  // Wooden plank lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, horizon + 60);
    ctx.lineTo(W / 2 + (x - W / 2) * 2.2, H);
    ctx.stroke();
  }

  // Large Double-Glazed Soundproof Window looking onto Campus (Center Left)
  ctx.save();
  const winX = W * 0.22;
  const winY = horizon * 0.5;
  const winW = 340;
  const winH = 260;
  ctx.fillStyle = '#0284c7'; // Sky outside
  ctx.fillRect(winX, winY, winW, winH);
  // Distant green campus outside window
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(winX + winW / 2, winY + winH, 140, Math.PI, 0);
  ctx.fill();
  // Window frame
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 10;
  ctx.strokeRect(winX, winY, winW, winH);
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH / 2);
  ctx.lineTo(winX + winW, winY + winH / 2);
  ctx.stroke();
  ctx.restore();

  // Cozy Student Bed with Mattress, Comforter & Ergonomic Pillows (Right side)
  ctx.save();
  const bedX = W * 0.65;
  const bedY = horizon + 30;

  // Bed Frame
  ctx.fillStyle = '#3b1807';
  ctx.beginPath();
  ctx.roundRect(bedX - 160, bedY, 320, 220, 10);
  ctx.fill();

  // White Orthopedic Mattress
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(bedX - 145, bedY + 15, 290, 190, 8);
  ctx.fill();

  // Blue GenZ Branded Bedspread / Duvet
  ctx.fillStyle = '#3730a3';
  ctx.beginPath();
  ctx.roundRect(bedX - 145, bedY + 70, 290, 135, 6);
  ctx.fill();

  // Two Pillows with pillow covers
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(bedX - 130, bedY + 25, 110, 40, 8);
  ctx.roundRect(bedX + 20, bedY + 25, 110, 40, 8);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Solid Hardwood Study Table & Chair (Center)
  ctx.save();
  const deskX = W * 0.45;
  const deskY = horizon + 90;

  // Study Desk Top
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.roundRect(deskX - 120, deskY, 240, 100, 6);
  ctx.fill();

  // Laptop on Desk
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(deskX - 35, deskY + 20, 70, 45);
  ctx.fillStyle = '#38bdf8'; // Glowing screen
  ctx.fillRect(deskX - 30, deskY - 20, 60, 40);

  // LED Desk Lamp
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(deskX + 80, deskY + 15, 10, 0, Math.PI * 2);
  ctx.fill();

  // Ergonomic Mesh Office Chair
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(deskX - 45, deskY + 95, 90, 95, 8);
  ctx.fill();
  ctx.restore();

  // Full-Height Two-Door Wardrobe (Far Left)
  ctx.save();
  const wardX = W * 0.05;
  const wardY = horizon * 0.65;
  ctx.fillStyle = '#451a03';
  ctx.fillRect(wardX, wardY, 180, 380);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 4;
  ctx.strokeRect(wardX, wardY, 180, 380);
  // Door Split & Handles
  ctx.beginPath();
  ctx.moveTo(wardX + 90, wardY);
  ctx.lineTo(wardX + 90, wardY + 380);
  ctx.stroke();
  ctx.fillStyle = '#f59e0b'; // Gold handles
  ctx.fillRect(wardX + 80, wardY + 180, 6, 25);
  ctx.fillRect(wardX + 94, wardY + 180, 6, 25);
  ctx.restore();

  // Room Exit Door (Far Right)
  ctx.save();
  const doorX = W * 0.88;
  const doorY = horizon * 0.65;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(doorX, doorY, 150, 360);
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  ctx.strokeRect(doorX, doorY, 150, 360);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('EXIT TO CORRIDOR', doorX + 10, doorY + 30);
  ctx.restore();

  // Room Header Plaque
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 300, horizon * 0.28, 600, 56, 12);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, W / 2, horizon * 0.28 + 26);
  ctx.fillStyle = '#86efac';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Fully Equipped Student Suite • Bed, Desk, Wardrobe, Fan, Storage', W / 2, horizon * 0.28 + 44);
  ctx.restore();
}

// ----------------------------------------------------
// LIBRARY PANORAMA GENERATOR
// ----------------------------------------------------
function renderLibraryPanorama(
  ctx: CanvasRenderingContext2D,
  title: string,
  W: number,
  H: number,
  horizon: number
) {
  // Library with bookstacks and warm lamps
  renderIndoorPanorama(ctx, 'library_main', title, 'Central University Library & Digital Repository', W, H, horizon);

  // Giant Bookcases on Left & Right
  for (let side of [W * 0.1, W * 0.8]) {
    ctx.fillStyle = '#3f1d0b';
    ctx.fillRect(side, horizon * 0.4, 220, 320);
    // Rows of books
    const bookColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#0891b2', '#f59e0b'];
    for (let shelf = 0; shelf < 5; shelf++) {
      const sy = horizon * 0.4 + shelf * 60 + 20;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(side + 10, sy + 38, 200, 6);
      let bx = side + 15;
      while (bx < side + 200) {
        const bw = 10 + Math.random() * 8;
        const bh = 30 + Math.random() * 8;
        ctx.fillStyle = bookColors[Math.floor(Math.random() * bookColors.length)];
        ctx.fillRect(bx, sy + (38 - bh), bw, bh);
        bx += bw + 3;
      }
    }
  }

  // Reading Desks in Center with Desk Lamps
  const centerX = W * 0.5;
  ctx.fillStyle = '#522509';
  ctx.beginPath();
  ctx.roundRect(centerX - 240, horizon + 120, 480, 90, 8);
  ctx.fill();
  // Green Bankers Desk Lamps
  for (let lx of [centerX - 160, centerX, centerX + 160]) {
    ctx.fillStyle = '#15803d'; // Green glass shade
    ctx.beginPath();
    ctx.roundRect(lx - 25, horizon + 90, 50, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#fef08a'; // Glow
    const lampGlow = ctx.createRadialGradient(lx, horizon + 105, 5, lx, horizon + 105, 50);
    lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
    lampGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(lx, horizon + 105, 50, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ----------------------------------------------------
// DRAWING HELPERS
// ----------------------------------------------------
function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
  ctx.save();
  // Trunk
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = Math.max(height * 0.08, 4);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 8, y - height * 0.5, x, y - height);
  ctx.stroke();

  // Fronds / Palm leaves
  const topX = x;
  const topY = y - height;
  ctx.fillStyle = '#15803d';
  for (let f = 0; f < 8; f++) {
    const angle = (f * Math.PI * 2) / 8;
    ctx.save();
    ctx.translate(topX, topY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(height * 0.3, 0, height * 0.35, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawMonumentalArch(ctx: CanvasRenderingContext2D, x: number, y: number, titleText: string) {
  ctx.save();
  const archW = 480;
  const archH = 260;
  const startX = x - archW / 2;
  const startY = y - archH;

  // Modern Pillars
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(startX, startY, 70, archH);
  ctx.fillRect(startX + archW - 70, startY, 70, archH);

  // Top Lintel Beam
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(startX - 20, startY - 40, archW + 40, 60);

  // Arch Header Banner
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(startX + 10, startY - 30, archW - 20, 40);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(titleText, x, startY - 2);

  // RFID Smart Gate Booms
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(startX + 70, y - 20);
  ctx.lineTo(startX + archW - 70, y - 20);
  ctx.stroke();
  ctx.restore();
}

function drawWaterFountain(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Tiered basins
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(x, y, 160, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8'; // Water
  ctx.beginPath();
  ctx.ellipse(x, y - 5, 145, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tier 2
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(x, y - 35, 80, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(x, y - 38, 70, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water jets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  for (let j = -3; j <= 3; j++) {
    ctx.beginPath();
    ctx.moveTo(x + j * 15, y - 45);
    ctx.quadraticCurveTo(x + j * 30, y - 110, x + j * 45, y - 10);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSportsPitches(ctx: CanvasRenderingContext2D, theme: string, W: number, H: number, horizon: number) {
  const centerX = W * 0.5;
  if (theme.includes('cricket')) {
    // Pitch strip
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(centerX - 40, horizon + 20);
    ctx.lineTo(centerX + 40, horizon + 20);
    ctx.lineTo(centerX + 120, H);
    ctx.lineTo(centerX - 120, H);
    ctx.fill();
    // Stumps & Crease
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 80, H - 40);
    ctx.lineTo(centerX + 80, H - 40);
    ctx.stroke();
  } else if (theme.includes('football')) {
    // Football penalty box & goal lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(centerX - 240, horizon + 40, 480, 260);
    ctx.beginPath();
    ctx.arc(centerX, horizon + 170, 70, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawAcademicBuildingFacade(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  const bW = 600;
  const bH = 340;
  const startX = x - bW / 2;
  const startY = y - bH;

  // 7-Story Glass & Steel Building Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(startX, startY, bW, bH);

  // Modern Tinted Windows Grid
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  for (let floor = 0; floor < 7; floor++) {
    const fy = startY + floor * 44 + 10;
    for (let win = 0; win < 12; win++) {
      const wx = startX + win * 48 + 14;
      ctx.fillRect(wx, fy, 38, 28);
    }
  }

  // Top Neon Building Sign
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(startX + 80, startY - 35, bW - 160, 35);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GENZ MAIN ACADEMIC COMPLEX (7 FLOORS)', x, startY - 12);
  ctx.restore();
}

function drawGrandReception(ctx: CanvasRenderingContext2D, x: number, y: number, title: string) {
  ctx.save();
  // Circular Curved Reception Counter
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.ellipse(x, y + 80, 220, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.ellipse(x, y + 70, 205, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Big Glowing Crest on Wall
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GENZ UNIVERSITY', x, y - 80);
  ctx.fillStyle = '#818cf8';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EXCELLENCE IN INNOVATION & FUTURE TECHNOLOGY', x, y - 55);
  ctx.restore();
}

function drawExecutiveOffice(ctx: CanvasRenderingContext2D, x: number, y: number, title: string) {
  ctx.save();
  // Big Executive Teak Desk
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.roundRect(x - 240, y + 50, 480, 130, 8);
  ctx.fill();

  // Swivel Chair
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x - 60, y - 10, 120, 110, 12);
  ctx.fill();
  ctx.restore();
}

function drawElevatorBank(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Stainless Steel Elevator Doors
  for (let e = -1; e <= 1; e++) {
    const ex = x + e * 200;
    ctx.fillStyle = '#334155';
    ctx.fillRect(ex - 70, y - 80, 140, 220);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(ex - 70, y - 80, 140, 220);
    // Door split
    ctx.beginPath();
    ctx.moveTo(ex, y - 80);
    ctx.lineTo(ex, y + 140);
    ctx.stroke();
    // Indicator Floor Screen
    ctx.fillStyle = '#ef4444'; // Red floor digit
    ctx.fillRect(ex - 20, y - 110, 40, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▲ G-6', ex, y - 96);
  }
  ctx.restore();
}

function drawStaircaseVisual(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Ascending Steps
  ctx.fillStyle = '#475569';
  for (let s = 0; s < 8; s++) {
    ctx.fillRect(x - 140 + s * 15, y + 90 - s * 22, 280 - s * 30, 18);
  }
  // Handrail
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x - 150, y + 100);
  ctx.lineTo(x - 40, y - 80);
  ctx.stroke();
  ctx.restore();
}

function drawCorridorDoors(ctx: CanvasRenderingContext2D, W: number, horizon: number, title: string) {
  ctx.save();
  for (let d = 1; d <= 4; d++) {
    const dx = d * (W / 5);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dx - 45, horizon - 40, 90, 180);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.strokeRect(dx - 45, horizon - 40, 90, 180);
    // Door knob
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(dx + 30, horizon + 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

