import React, { useState, useEffect, useCallback } from 'react';
import { Viewpoint, NavigationEdge, CampusRoute } from './types/tour';
import { ALL_VIEWPOINTS } from './data/viewpoints';
import { PanoramaViewer } from './engine/PanoramaViewer';
import { StreetViewUI } from './components/StreetViewUI';
import { CampusMiniMap } from './components/CampusMiniMap';
import { LocationSearch } from './components/LocationSearch';
import { FloorSelector } from './components/FloorSelector';
import { SideDrawer } from './components/SideDrawer';
import { RoomDetailModal } from './components/RoomDetailModal';
import { RouteGuideModal } from './components/RouteGuideModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WelcomeModal } from './components/WelcomeModal';

export const App: React.FC = () => {
  // 1. Viewpoint database with LocalStorage persistence
  const [viewpoints, setViewpoints] = useState<Viewpoint[]>(() => {
    const saved = localStorage.getItem('genz_viewpoints_v14');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved viewpoints', e);
      }
    }
    return ALL_VIEWPOINTS;
  });

  // Current viewpoint ID (defaults to 'main_gate' - Main Gate Alpha)
  const [currentId, setCurrentId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get('v');
    if (vParam && ALL_VIEWPOINTS.some((v) => v.id === vParam)) {
      return vParam;
    }
    return 'main_gate';
  });

  // Navigation History for "Back" button
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  // Navigation transition animation state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Camera & Viewer state
  const [cameraHeading, setCameraHeading] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0.5); // 0 to 1
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active navigation route (Dijkstra)
  const [activeRoute, setActiveRoute] = useState<CampusRoute | null>(null);

  // Modals & Drawers state
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);

  // Find active viewpoint object
  const currentViewpoint = viewpoints.find((v) => v.id === currentId) || viewpoints[0];

  // Sync viewpoint ID to URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', currentId);
    window.history.replaceState({}, '', url.toString());
  }, [currentId]);

  // Navigate function with Street View smooth forward transition
  const handleNavigate = useCallback((targetId: string, edge?: NavigationEdge) => {
    if (targetId === currentId) return;

    // Trigger forward zoom warp transition
    setIsTransitioning(true);

    setTimeout(() => {
      setHistoryStack((prev) => [...prev, currentId]);
      setCurrentId(targetId);
      setIsTransitioning(false);
    }, 240);
  }, [currentId]);

  // Back button handler
  const handleGoBack = useCallback(() => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentId(previous);
      setIsTransitioning(false);
    }, 200);
  }, [historyStack]);

  // Home button handler
  const handleGoHome = useCallback(() => {
    setIsWelcomeOpen(true);
  }, []);

  // Reset Heading to North (0°)
  const handleResetHeading = useCallback(() => {
    // In PanoramaViewer, yaw will reset to 0
    if (currentViewpoint) {
      currentViewpoint.initialYaw = 0;
      setCurrentId((prev) => prev); // trigger update
    }
  }, [currentViewpoint]);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(1, z + 0.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0, z - 0.2));

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Admin save handler
  const handleSaveViewpoint = (updated: Viewpoint) => {
    setViewpoints((prev) => {
      const idx = prev.findIndex((v) => v.id === updated.id);
      let nextList = [...prev];
      if (idx >= 0) {
        nextList[idx] = updated;
      } else {
        nextList.push(updated);
      }
      localStorage.setItem('genz_viewpoints_v14', JSON.stringify(nextList));
      return nextList;
    });
  };

  const handleAddViewpoint = (newVp: Viewpoint) => {
    setViewpoints((prev) => {
      const nextList = [...prev, newVp];
      localStorage.setItem('genz_viewpoints_v14', JSON.stringify(nextList));
      return nextList;
    });
  };

  const handleDeleteViewpoint = (id: string) => {
    setViewpoints((prev) => {
      const nextList = prev.filter((v) => v.id !== id);
      localStorage.setItem('genz_viewpoints_v14', JSON.stringify(nextList));
      return nextList;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
      {/* 360 Three.js WebGL Panorama Viewer */}
      <PanoramaViewer
        viewpoint={currentViewpoint}
        onNavigate={handleNavigate}
        onHeadingChange={setCameraHeading}
        zoomLevel={zoomLevel}
        isTransitioning={isTransitioning}
      />

      {/* Street View Overlay HUD */}
      <StreetViewUI
        currentViewpoint={currentViewpoint}
        cameraHeading={cameraHeading}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetHeading={handleResetHeading}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        canGoBack={historyStack.length > 0}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenRoomDetails={() => setIsRoomDetailsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Top Search Bar */}
      <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-30 w-full px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md sm:max-w-lg">
          <LocationSearch
            currentViewpoint={currentViewpoint}
            onNavigateTo={handleNavigate}
            onSetRoute={setActiveRoute}
          />
        </div>
      </div>

      {/* Left Collapsible Google Maps-Style Drawer */}
      <div className="absolute top-20 left-0 bottom-24 flex items-center z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <SideDrawer
            currentViewpoint={currentViewpoint}
            onNavigateTo={handleNavigate}
          />
        </div>
      </div>

      {/* Right Multi-Floor Elevator Selector (Shown inside Academic Complex & Hostels) */}
      <div className="absolute top-24 right-3 sm:right-5 z-30 pointer-events-auto">
        <FloorSelector
          currentViewpoint={currentViewpoint}
          onNavigateTo={handleNavigate}
        />
      </div>

      {/* Bottom Left Interactive Campus Map */}
      <div className="absolute bottom-4 left-3 sm:left-5 z-30 pointer-events-auto">
        <CampusMiniMap
          currentViewpoint={currentViewpoint}
          cameraHeading={cameraHeading}
          activeRoute={activeRoute}
          onSelectViewpoint={handleNavigate}
          isExpanded={isMapExpanded}
          onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
        />
      </div>

      {/* Active Walking Route Guidance Card */}
      {activeRoute && (
        <RouteGuideModal
          route={activeRoute}
          currentViewpointId={currentId}
          onNavigateToStep={handleNavigate}
          onClearRoute={() => setActiveRoute(null)}
        />
      )}

      {/* Room Details Modal (Classroom / Hostel Room inventory) */}
      {isRoomDetailsOpen && (
        <RoomDetailModal
          viewpoint={currentViewpoint}
          onClose={() => setIsRoomDetailsOpen(false)}
        />
      )}

      {/* Admin Panel Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          viewpoints={viewpoints}
          onSaveViewpoint={handleSaveViewpoint}
          onAddViewpoint={handleAddViewpoint}
          onDeleteViewpoint={handleDeleteViewpoint}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Welcome & Quick Landing Modal */}
      {isWelcomeOpen && (
        <WelcomeModal
          onStartTour={() => {
            handleNavigate('main_gate');
            setIsWelcomeOpen(false);
          }}
          onExploreMap={() => {
            setIsMapExpanded(true);
            setIsWelcomeOpen(false);
          }}
          onGoAcademic={() => {
            handleNavigate('acad_g_reception');
            setIsWelcomeOpen(false);
          }}
          onGoHostels={() => {
            handleNavigate('hostel_central_quad');
            setIsWelcomeOpen(false);
          }}
          onOpenSearch={() => {
            setIsWelcomeOpen(false);
          }}
          onClose={() => setIsWelcomeOpen(false)}
        />
      )}
    </div>
  );
};

export default App;

