import { Viewpoint, CampusRoute } from '../types/tour';
import { ALL_VIEWPOINTS, VIEWPOINT_MAP } from './viewpoints';

// Dijkstra Shortest Path Finder
export function findShortestRoute(sourceId: string, targetId: string): CampusRoute | null {
  if (sourceId === targetId) {
    return {
      sourceId,
      targetId,
      path: [sourceId],
      totalDistance: 0,
      steps: []
    };
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, { fromId: string; label: string; distanceMeters: number }>();
  const unvisited = new Set<string>();

  ALL_VIEWPOINTS.forEach((vp) => {
    distances.set(vp.id, Infinity);
    unvisited.add(vp.id);
  });

  distances.set(sourceId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((id) => {
      const dist = distances.get(id) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = id;
      }
    });

    if (!currentId || minDistance === Infinity) {
      break; // Unreachable
    }

    if (currentId === targetId) {
      break; // Found destination!
    }

    unvisited.delete(currentId);

    const currentVp = VIEWPOINT_MAP.get(currentId);
    if (!currentVp) continue;

    currentVp.connections.forEach((edge) => {
      if (!unvisited.has(edge.targetId)) return;

      // Parse distance if available or default to 20m
      let edgeDist = 20;
      if (edge.distance) {
        const match = edge.distance.match(/(\d+)/);
        if (match) {
          edgeDist = parseInt(match[1], 10);
        }
      }

      const alt = minDistance + edgeDist;
      if (alt < (distances.get(edge.targetId) ?? Infinity)) {
        distances.set(edge.targetId, alt);
        previous.set(edge.targetId, {
          fromId: currentId!,
          label: edge.label,
          distanceMeters: edgeDist
        });
      }
    });
  }

  // Backtrack to reconstruct path
  if (!previous.has(targetId) && sourceId !== targetId) {
    return null; // No path found
  }

  const path: string[] = [];
  const steps: { fromId: string; toId: string; instruction: string; distanceMeters: number }[] = [];
  let curr = targetId;

  while (curr !== sourceId) {
    path.unshift(curr);
    const prevInfo = previous.get(curr);
    if (!prevInfo) break;
    steps.unshift({
      fromId: prevInfo.fromId,
      toId: curr,
      instruction: prevInfo.label,
      distanceMeters: prevInfo.distanceMeters
    });
    curr = prevInfo.fromId;
  }
  path.unshift(sourceId);

  const totalDistance = steps.reduce((sum, s) => sum + s.distanceMeters, 0);

  return {
    sourceId,
    targetId,
    path,
    totalDistance,
    steps
  };
}

// Search utility
export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  buildingName: string;
  floorName: string;
  roomNumber?: string;
}

export function searchCampusLocations(query: string): SearchItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: SearchItem[] = [];

  ALL_VIEWPOINTS.forEach((vp) => {
    const nameMatch = vp.name.toLowerCase().includes(clean);
    const roomMatch = vp.roomNumber?.toLowerCase().includes(clean);
    const bldMatch = vp.buildingName.toLowerCase().includes(clean);
    const descMatch = vp.description.toLowerCase().includes(clean);

    if (nameMatch || roomMatch || bldMatch || descMatch) {
      results.push({
        id: vp.id,
        title: vp.name,
        subtitle: `${vp.buildingName} • ${vp.floorName}`,
        category: vp.category,
        buildingName: vp.buildingName,
        floorName: vp.floorName,
        roomNumber: vp.roomNumber
      });
    }
  });

  return results.slice(0, 20); // Top 20 matches
}

