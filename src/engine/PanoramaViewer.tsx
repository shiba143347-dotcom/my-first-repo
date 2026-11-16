import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Viewpoint, NavigationEdge } from '../types/tour';
import { generatePanoramaDataUrl, getCustomizedPanoramaUrl } from './EquirectangularFactory';
import { NavigationArrows } from './NavigationArrows';
import { VIEWPOINT_MAP } from '../data/viewpoints';

interface PanoramaViewerProps {
  viewpoint: Viewpoint;
  onNavigate: (targetId: string, edge?: NavigationEdge) => void;
  onHeadingChange?: (headingDeg: number) => void;
  zoomLevel: number; // 0 to 1
  isTransitioning: boolean;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  viewpoint,
  onNavigate,
  onHeadingChange,
  zoomLevel,
  isTransitioning
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());

  // Camera orientation state
  const yawRef = useRef<number>(viewpoint.initialYaw || 0); // Horizontal angle in degrees
  const pitchRef = useRef<number>(viewpoint.initialPitch || 0); // Vertical angle in degrees (-85 to +85)
  const targetYawRef = useRef<number>(viewpoint.initialYaw || 0);
  const targetPitchRef = useRef<number>(viewpoint.initialPitch || 0);

  // Interaction tracking
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const [cameraHeading, setCameraHeading] = useState<number>(viewpoint.initialYaw || 0);
  const [cameraPitch, setCameraPitch] = useState<number>(viewpoint.initialPitch || 0);
  const [fov, setFov] = useState<number>(75);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Inverted 360 Sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert so inside of sphere faces camera

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    sphereMatRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI; // Aligns Yaw 0° with center of equirectangular panorama (X=2048)
    sphereMeshRef.current = mesh;
    scene.add(mesh);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth inertia lerp for camera angles
      yawRef.current += (targetYawRef.current - yawRef.current) * 0.15;
      pitchRef.current += (targetPitchRef.current - pitchRef.current) * 0.15;

      // Update camera rotation
      const phi = THREE.MathUtils.degToRad(90 - pitchRef.current);
      const theta = THREE.MathUtils.degToRad(yawRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);

      // Report heading
      const normalizedHeading = ((yawRef.current % 360) + 360) % 360;
      setCameraHeading(normalizedHeading);
      setCameraPitch(pitchRef.current);
      if (onHeadingChange) {
        onHeadingChange(normalizedHeading);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Update Panorama Texture when viewpoint changes
  useEffect(() => {
    if (!sphereMatRef.current) return;

    let isCancelled = false;
    setIsLoading(true);
    const baseSource = viewpoint.panoramaUrl || '/panoramas/main_gate.jpg';

    // Street view forward fade transition
    if (sphereMatRef.current) {
      sphereMatRef.current.opacity = 0.2;
    }

    getCustomizedPanoramaUrl(baseSource, viewpoint).then((customizedSrc) => {
      if (isCancelled) return;

      textureLoaderRef.current.load(
        customizedSrc,
        (texture) => {
          if (isCancelled) return;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          if (sphereMatRef.current) {
            if (sphereMatRef.current.map) {
              sphereMatRef.current.map.dispose();
            }
            sphereMatRef.current.map = texture;
            sphereMatRef.current.needsUpdate = true;
            setIsLoading(false);

            // Smooth fade in
            let op = 0.2;
            const fadeInterval = setInterval(() => {
              op += 0.15;
              if (op >= 1) {
                op = 1;
                clearInterval(fadeInterval);
              }
              if (sphereMatRef.current) {
                sphereMatRef.current.opacity = op;
              }
            }, 30);
          }
        },
        undefined,
        (err) => {
          console.error('Failed to load panorama texture', err);
          setIsLoading(false);
        }
      );
    });

    // Preload connected viewpoints for instantaneous forward movement
    if (viewpoint.connections && viewpoint.connections.length > 0) {
      viewpoint.connections.slice(0, 4).forEach((conn) => {
        const targetVp = VIEWPOINT_MAP.get(conn.targetId);
        if (targetVp?.panoramaUrl) {
          const preImg = new Image();
          preImg.src = targetVp.panoramaUrl;
        }
      });
    }

    // Align initial yaw if specified
    if (viewpoint.initialYaw !== undefined) {
      targetYawRef.current = viewpoint.initialYaw;
      yawRef.current = viewpoint.initialYaw;
    }

    return () => {
      isCancelled = true;
    };
  }, [viewpoint.id, viewpoint.panoramaUrl, viewpoint.name]);

  // Handle Zoom change
  useEffect(() => {
    if (!cameraRef.current) return;
    // Map zoomLevel (0 to 1) to FOV (95 to 40)
    const newFov = 95 - zoomLevel * 55;
    cameraRef.current.fov = newFov;
    cameraRef.current.updateProjectionMatrix();
    setFov(newFov);
  }, [zoomLevel]);

  // Pointer & Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = (fov / 75) * 0.18;
    targetYawRef.current -= deltaX * sensitivity;
    targetPitchRef.current = Math.max(-85, Math.min(85, targetPitchRef.current + deltaY * sensitivity));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Events for Mobile (One finger drag, two finger pinch-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      const sensitivity = (fov / 75) * 0.22;
      targetYawRef.current -= deltaX * sensitivity;
      targetPitchRef.current = Math.max(-85, Math.min(85, targetPitchRef.current + deltaY * sensitivity));
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const diff = dist - touchStartDistRef.current;
      touchStartDistRef.current = dist;

      if (cameraRef.current) {
        const nextFov = Math.max(35, Math.min(100, cameraRef.current.fov - diff * 0.15));
        cameraRef.current.fov = nextFov;
        cameraRef.current.updateProjectionMatrix();
        setFov(nextFov);
      }
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchStartDistRef.current = null;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const nextFov = Math.max(35, Math.min(100, cameraRef.current.fov + e.deltaY * 0.05));
    cameraRef.current.fov = nextFov;
    cameraRef.current.updateProjectionMatrix();
    setFov(nextFov);
  };

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden cursor-grab active:cursor-grabbing bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* 4K Equirectangular Scene Loading Indicator */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-indigo-500/40 shadow-2xl backdrop-blur-md animate-fade-in transition-opacity duration-300">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-200">Loading 4K 360° Scene...</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
            4096 × 2048
          </span>
        </div>
      )}

      {/* Street View Zoom Forward Warp Overlay during navigation */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ease-out ${
          isTransitioning
            ? 'scale-110 opacity-70 bg-gradient-radial from-transparent via-white/10 to-indigo-950/40 backdrop-blur-[2px]'
            : 'scale-100 opacity-0'
        }`}
      />

      {/* Ground Navigation Arrows Overlay */}
      {cameraRef.current && (
        <NavigationArrows
          connections={viewpoint.connections}
          cameraYaw={cameraHeading}
          cameraPitch={cameraPitch}
          fov={fov}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

