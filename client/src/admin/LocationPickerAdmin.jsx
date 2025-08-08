import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet marker icon
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

export default function LocationPickerAdmin({ value, onChange }) {
  const [position, setPosition] = useState(
    value && value.split(',').length === 2
      ? value.split(',').map(Number)
      : [-6.2, 106.8]
  );
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (value && value.split(',').length === 2) {
      const coords = value.split(',').map(Number);
      if (!isNaN(coords[0]) && !isNaN(coords[1])) {
        setPosition(coords);
      }
    }
  }, [value]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onChange(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
      }
    });
    return Array.isArray(position) && position.length === 2 && !isNaN(position[0]) && !isNaN(position[1])
      ? <Marker position={position} icon={customMarker} />
      : null;
  }

  // Ambil lokasi perangkat admin
  const handleGetCurrentLocation = () => {
    setLoadingLoc(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Browser tidak mendukung geolokasi.');
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLoadingLoc(false);
      },
      (err) => {
        setError('Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.');
        setLoadingLoc(false);
      }
    );
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
          disabled={loadingLoc}
        >
          {loadingLoc ? 'Mengambil lokasi...' : 'Ambil Lokasi Saya'}
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      <div className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", padding: "3px" }}>
        <div className="rounded-2xl overflow-hidden bg-white">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '200px', width: '100%', borderRadius: '12px' }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={position} icon={customMarker}>
              <Popup className="rounded-xl shadow-lg border-0 text-sm font-medium text-gray-800">
                Lokasi Bukti Perbaikan
              </Popup>
              <Tooltip direction="top" offset={[0, -20]} className="rounded bg-blue-600 text-white px-3 py-1 shadow font-semibold">
                {position[0].toFixed(5)}, {position[1].toFixed(5)}
              </Tooltip>
            </Marker>
          </MapContainer>
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold flex items-center gap-1 z-[10]">
            Pilih Lokasi Bukti
          </div>
        </div>
      </div>
      <p className="text-xs text-blue-700 mt-2 font-medium flex items-center gap-1">
        Klik pada peta atau gunakan tombol di atas untuk memilih lokasi bukti perbaikan.
      </p>
    </div>
  );
}