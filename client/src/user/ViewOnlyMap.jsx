import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet marker icon (agar marker default tetap biru dan tidak error di SSR)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customMarker = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

export default function ViewOnlyMap({ latlng }) {
  let position = [-6.2, 106.8];
  if (latlng && typeof latlng === 'string' && latlng.split(',').length === 2) {
    position = latlng.split(',').map(Number);
  }

  return (
    <div
      className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
        padding: "3px"
      }}
    >
      <div className="rounded-2xl overflow-hidden bg-white">
        <MapContainer
          center={position}
          zoom={15}
          style={{
            height: '200px',
            width: '100%',
            borderRadius: '12px',
            fontFamily: 'inherit'
          }}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} icon={customMarker}>
            <Popup className="rounded-xl shadow-lg border-0 text-sm font-medium text-gray-800">
              Lokasi Laporan
            </Popup>
            <Tooltip
              direction="top"
              offset={[0, -20]}
              className="rounded bg-blue-600 text-white px-3 py-1 shadow font-semibold"
            >
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </Tooltip>
          </Marker>
        </MapContainer>
        {/* Overlay label */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold flex items-center gap-1 z-[10]">
          <MapPin className="w-4 h-4" /> Lokasi Laporan
        </div>
      </div>
    </div>
  );
}