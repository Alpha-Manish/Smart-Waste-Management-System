import { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface RealMapStop {
  id: string;
  binId: string;
  binName: string;
  location: string;
  area: string;
  capacity?: string;
  fillPercentage: number;
  priority: 'High' | 'Medium' | 'Low';
  lat: number;
  lng: number;
  status: string;
  lastCollectedDate?: string;
  isCompleted?: boolean;
}

interface RealMapProps {
  stops: RealMapStop[];
  activeStopIds: string[];
  selectedStopId: string | null;
  currentStopId: string | null;
  onSelectStop: (stopId: string) => void;
  mapTileMode: 'streets' | 'satellite';
  routePolylineCoords: [number, number][];
  depotCoords: { lat: number; lng: number };
  isNavigating?: boolean;
}

export default function RealMap({
  stops,
  activeStopIds,
  selectedStopId,
  currentStopId,
  onSelectStop,
  mapTileMode,
  routePolylineCoords,
  depotCoords,
}: RealMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [depotCoords.lat, depotCoords.lng],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    routeLayerRef.current = routeLayer;
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [depotCoords.lat, depotCoords.lng]);

  // Handle Tile Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (mapTileMode === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, USGS, Maxar, Earthstar Geographics';
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom: 19,
      attribution,
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapTileMode]);

  // Update Route Polyline & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    const activeStops = stops.filter(s => activeStopIds.includes(s.id));

    // 1. Draw Route Polyline from OSRM road coordinates
    if (routePolylineCoords && routePolylineCoords.length > 1) {
      // Outer glow line
      L.polyline(routePolylineCoords, {
        color: '#06b6d4',
        weight: 7,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayer);

      // Core Solid/Dashed Road Route Line
      L.polyline(routePolylineCoords, {
        color: '#0d9488',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayer);
    }

    // 2. Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-marker',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          background: #0f172a;
          border: 2px solid #14b8a6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          color: #2dd4bf;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
        ">
          DEPOT
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    L.marker([depotCoords.lat, depotCoords.lng], { icon: depotIcon })
      .bindPopup(`
        <div style="font-family:sans-serif;font-size:12px;padding:4px;color:#0f172a;">
          <strong style="color:#0f766e;display:block;font-size:13px;">Central Sanitation HQ Depot</strong>
          <span style="color:#64748b;font-size:11px;">Starting Hub & Fleet Terminal</span>
        </div>
      `)
      .addTo(markersLayer);

    // 3. Bin Markers with interactive Popups and fill level coloring
    stops.forEach(stop => {
      const isIncluded = activeStopIds.includes(stop.id);
      const isSelected = stop.id === selectedStopId;
      const isCurrent = stop.id === currentStopId;
      const sequenceIndex = activeStops.findIndex(s => s.id === stop.id);

      // Color coding required: red (>90%), orange (>70%), green (otherwise)
      let fillColor = '#10b981'; // Green
      let badgeLabel = 'Normal';
      let borderGlow = 'rgba(16, 185, 129, 0.4)';

      if (stop.fillPercentage > 90) {
        fillColor = '#ef4444'; // Red
        badgeLabel = 'Critical (>90%)';
        borderGlow = 'rgba(239, 68, 68, 0.5)';
      } else if (stop.fillPercentage > 70) {
        fillColor = '#f97316'; // Orange
        badgeLabel = 'High (>70%)';
        borderGlow = 'rgba(249, 115, 22, 0.45)';
      }

      if (stop.isCompleted) {
        fillColor = '#059669'; // Completed Check
      } else if (!isIncluded) {
        fillColor = '#64748b'; // Slate grey for excluded
        badgeLabel = 'Excluded';
        borderGlow = 'transparent';
      }

      const markerHtml = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          ${(isSelected || isCurrent) ? `
            <div style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background: ${borderGlow};
              border: 2px solid ${fillColor};
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${fillColor};
            border: 3px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${stop.isCompleted ? '✓' : isIncluded ? sequenceIndex + 1 : '✕'}
          </div>
          <div style="
            position: absolute;
            top: 36px;
            white-space: nowrap;
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(4px);
            color: #ffffff;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.15);
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          ">
            ${stop.binName} (${stop.fillPercentage}%)
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-bin-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon });

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;

      // Clickable popup with comprehensive details & direct Google Maps navigation button
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:12px;min-width:200px;color:#0f172a;line-height:1.4;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">
            <strong style="color:#0f172a;font-size:13px;">${stop.binName}</strong>
            <span style="font-size:10px;font-weight:bold;color:${fillColor};">${badgeLabel}</span>
          </div>
          <div style="font-size:11px;color:#475569;margin-bottom:4px;"><strong>Location:</strong> ${stop.location}</div>
          <div style="font-size:11px;color:#475569;margin-bottom:4px;"><strong>Fill Level:</strong> <span style="font-weight:bold;color:${fillColor}">${stop.fillPercentage}%</span> (${stop.capacity || '120L'})</div>
          <div style="font-size:11px;color:#475569;margin-bottom:8px;"><strong>Status:</strong> ${stop.status}</div>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            text-align: center;
            background: #0d9488;
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-decoration: none;
          ">
            Open in Google Maps Navigation ↗
          </a>
        </div>
      `);

      marker.on('click', () => {
        onSelectStop(stop.id);
      });

      marker.addTo(markersLayer);
    });

    // Auto-fit bounds
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      bounds.extend([depotCoords.lat, depotCoords.lng]);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    }
  }, [stops, activeStopIds, selectedStopId, currentStopId, routePolylineCoords, depotCoords, onSelectStop]);

  // Center on selected stop when changed
  useEffect(() => {
    if (!selectedStopId || !mapInstanceRef.current) return;
    const target = stops.find(s => s.id === selectedStopId);
    if (target) {
      mapInstanceRef.current.panTo([target.lat, target.lng], { animate: true, duration: 0.8 });
    }
  }, [selectedStopId, stops]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: '100%' }} />
    </div>
  );
}
