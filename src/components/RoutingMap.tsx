"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { networkLocations } from "@/lib/dummyData";

// Custom Icons for Map Markers
const getMarkerIcon = (status: string) => {
  return L.icon({
    iconUrl:
      status === "Operational"
        ? "/icons/green-marker.png"
        : status === "Slow"
        ? "/icons/yellow-marker.png"
        : "/icons/red-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default function RoutingMap() {
  return (
    <div >
     
     <br></br>
      <MapContainer
        center={[-15.3875, 28.3228]} // Default center: Lusaka
        zoom={6}
        className="h-64 w-full rounded-lg"
      >
        {/* Map Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Network Locations with Markers */}
        {networkLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={getMarkerIcon(location.status)}
          >
            <Popup>
              <div className="text-center">
                <h3 className="text-md font-bold">{location.name}</h3>
                <p>Status: <span className={`font-semibold ${location.status === "Down" ? "text-red-500" : location.status === "Slow" ? "text-yellow-500" : "text-green-500"}`}>
                  {location.status}
                </span></p>
                <p>Current ISP: <strong>{location.currentISP}</strong></p>
                <p>Failover ISP: <strong>{location.failoverISP}</strong></p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
