/**
 * Open Source Routing Machine (OSRM) integration service
 * Handles road network distance, duration, turn-by-turn geometry, and heuristic TSP optimization.
 */

export interface OSRMRouteResult {
  coordinates: [number, number][]; // [lat, lng] array along the road network
  distanceKm: number;
  durationMins: number;
  isFallback?: boolean;
}

// Haversine distance in km between two lat/lng pairs
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Solves Multi-Objective Waste Collection Route Sequencing:
 * Balances fill urgency (High/Critical bins first), collection priority, and road proximity.
 */
export function optimizeRouteOrder<T extends { lat: number; lng: number; fillPercentage: number; priority: string }>(
  startPoint: { lat: number; lng: number },
  stops: T[]
): T[] {
  if (stops.length <= 1) return [...stops];

  const unvisited = [...stops];
  const ordered: T[] = [];
  let currentLoc = startPoint;

  while (unvisited.length > 0) {
    // Greedy heuristic: score based on distance and urgency penalty
    let bestIndex = 0;
    let bestScore = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const stop = unvisited[i];
      const dist = calculateHaversineDistance(currentLoc.lat, currentLoc.lng, stop.lat, stop.lng);

      // Higher fill level reduces effective "cost" so truck prioritizes full bins earlier
      // Priority bonus: Critical bins (>90%) get heavy urgency discount
      let urgencyFactor = 1.0;
      if (stop.fillPercentage >= 90) {
        urgencyFactor = 0.35;
      } else if (stop.fillPercentage >= 70) {
        urgencyFactor = 0.65;
      } else if (stop.fillPercentage < 40) {
        urgencyFactor = 1.6;
      }

      const score = dist * urgencyFactor;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const nextStop = unvisited.splice(bestIndex, 1)[0];
    ordered.push(nextStop);
    currentLoc = { lat: nextStop.lat, lng: nextStop.lng };
  }

  return ordered;
}

/**
 * Fetch real road route geometry from OSRM public API with automatic timeout & haversine fallback
 */
export async function getOSRMRoute(
  waypoints: { lat: number; lng: number }[]
): Promise<OSRMRouteResult> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints.map(w => [w.lat, w.lng]),
      distanceKm: 0,
      durationMins: 0,
    };
  }

  try {
    // Coordinates formatted as lng,lat;lng,lat
    const coordString = waypoints.map(w => `${w.lng.toFixed(6)},${w.lat.toFixed(6)}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`OSRM HTTP error: ${res.status}`);

    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM GeoJSON coordinates are [lng, lat], convert to [lat, lng] for Leaflet
      const leafletCoords: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );

      return {
        coordinates: leafletCoords,
        distanceKm: Number((route.distance / 1000).toFixed(2)),
        durationMins: Math.round(route.duration / 60),
        isFallback: false,
      };
    }
    throw new Error('OSRM route not found');
  } catch (err) {
    console.warn('OSRM routing request failed, falling back to estimated geospatial calculation:', err);

    // Fallback: Haversine distance with urban curvature factor (1.28x)
    let totalDist = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDist += calculateHaversineDistance(
        waypoints[i].lat,
        waypoints[i].lng,
        waypoints[i + 1].lat,
        waypoints[i + 1].lng
      );
    }
    const adjustedKm = totalDist * 1.28;
    const estSpeedKmh = 25; // Average urban waste truck speed
    const estMins = Math.round((adjustedKm / estSpeedKmh) * 60);

    return {
      coordinates: waypoints.map(w => [w.lat, w.lng]),
      distanceKm: Number(adjustedKm.toFixed(2)),
      durationMins: Math.max(5, estMins),
      isFallback: true,
    };
  }
}
