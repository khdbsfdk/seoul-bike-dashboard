"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix for Leaflet default icon issues in Next.js
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface BikeStation {
  rackTotCnt: string;
  stationName: string;
  parkingBikeTotCnt: string;
  shared: string;
  stationLatitude: string;
  stationLongitude: string;
  stationId: string;
}

interface MapProps {
  stations: BikeStation[];
  searchQuery: string;
}

// Custom icons based on parking count
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color:${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);'></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const iconGreen = createIcon("#16a34a"); // >= 5
const iconOrange = createIcon("#f97316"); // 1 ~ 4
const iconRed = createIcon("#ef4444"); // 0

// Component to handle flying to the searched station
function FlyToStation({ stations, searchQuery }: { stations: BikeStation[], searchQuery: string }) {
  const map = useMap();
  
  useEffect(() => {
    if (!searchQuery) return;
    
    // Find exact or highly relevant match
    const match = stations.find(s => s.stationName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      const lat = parseFloat(match.stationLatitude);
      const lng = parseFloat(match.stationLongitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 16, { duration: 1.5 });
      }
    }
  }, [searchQuery, stations, map]);

  return null;
}

export default function Map({ stations, searchQuery }: MapProps) {
  const defaultPosition: [number, number] = [37.5665, 126.9780]; // Seoul City Hall
  
  // Use a state to check if initially mounted to avoid hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[400px] bg-slate-100 animate-pulse rounded-md" />;

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden z-0 relative isolate">
      <MapContainer 
        center={defaultPosition} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FlyToStation stations={stations} searchQuery={searchQuery} />

        {stations.map(station => {
          const lat = parseFloat(station.stationLatitude);
          const lng = parseFloat(station.stationLongitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          const count = parseInt(station.parkingBikeTotCnt) || 0;
          let icon = iconRed;
          if (count >= 5) icon = iconGreen;
          else if (count >= 1) icon = iconOrange;

          return (
            <Marker key={station.stationId} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-sm mb-1">{station.stationName}</h3>
                  <p className="text-sm m-0">남은 자전거: <strong className={count === 0 ? "text-red-500" : ""}>{count}대</strong></p>
                  <p className="text-xs text-muted-foreground m-0">전체 거치대: {station.rackTotCnt}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
