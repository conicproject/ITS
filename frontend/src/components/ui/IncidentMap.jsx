import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:3px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

function IncidentMap({ incidentMarkers = [], mapCenter }) {
  return (
    <div className="bg-white rounded-lg shadow border h-[500px]">
      <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {incidentMarkers.map((m) => (
          <Marker key={m.id} position={m.position} icon={createCustomIcon(m.color)}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{m.type}</div>
                <div>Severity: {m.severity}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default IncidentMap;
