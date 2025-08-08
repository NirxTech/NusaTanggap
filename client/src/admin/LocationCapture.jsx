import React, { useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';

const LocationCapture = ({ onLocationCapture, currentLocation }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser ini');
      return;
    }

    setIsCapturing(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Simulate reverse geocoding (in real app, use a geocoding service)
      const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      
      // For demo purposes, we'll create a readable address
      const addresses = [
        'Jl. Sudirman No. 123, Jakarta Pusat',
        'Jl. Gatot Subroto No. 45, Jakarta Selatan',
        'Jl. Thamrin No. 67, Jakarta Pusat',
        'Jl. Kuningan No. 89, Jakarta Selatan'
      ];
      const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
      
      onLocationCapture(`${randomAddress} (${locationString})`);
    } catch (error) {
      console.error('Error capturing location:', error);
      alert('Gagal mengambil lokasi. Pastikan Anda mengizinkan akses lokasi.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-3">
        <input
          type="text"
          value={currentLocation}
          onChange={(e) => onLocationCapture(e.target.value)}
          placeholder="Masukkan lokasi perbaikan..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={captureLocation}
          disabled={isCapturing}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isCapturing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Navigation size={20} />
          )}
          <span className="hidden sm:inline">
            {isCapturing ? 'Mengambil...' : 'Ambil Lokasi'}
          </span>
        </button>
      </div>
      
      {currentLocation && (
        <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <MapPin className="text-green-600 mt-0.5" size={16} />
          <div>
            <p className="text-sm font-medium text-green-800">Lokasi Perbaikan:</p>
            <p className="text-sm text-green-700">{currentLocation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCapture;