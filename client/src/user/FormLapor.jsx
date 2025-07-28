import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  User,
  Mail,
  FileText,
  Tag,
  Calendar
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon for leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function FormLaporan() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    judul: '',
    tanggal: '',
    kategori: '',
    deskripsi: '',
    foto: null,
    lokasi: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const kategoriOptions = [
    'Jalan Rusak',
    'Lampu Jalan',
    'Saluran Air',
    'Jembatan',
    'Trotoar',
    'Rambu Lalu Lintas',
    'Fasilitas Umum Lainnya'
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama pelapor harus diisi';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul laporan harus diisi';
    }
    if (!formData.tanggal.trim()) {
      newErrors.tanggal = 'Tanggal kejadian harus diisi';
    }
    if (!formData.kategori) {
      newErrors.kategori = 'Kategori kerusakan harus dipilih';
    }
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi kerusakan harus diisi';
    } else if (formData.deskripsi.trim().length < 10) {
      newErrors.deskripsi = 'Deskripsi minimal 10 karakter';
    }
    if (!formData.foto) {
      newErrors.foto = 'Foto kerusakan harus diupload';
    }
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, foto: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
      if (errors.foto) {
        setErrors(prev => ({ ...prev, foto: undefined }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, foto: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, lokasi: 'Browser tidak mendukung GPS' }));
      setIsGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setFormData(prev => ({ ...prev, lokasi: locationString }));
        setIsGettingLocation(false);
        if (errors.lokasi) {
          setErrors(prev => ({ ...prev, lokasi: undefined }));
        }
      },
      (error) => {
        let errorMessage = 'Gagal mendapatkan lokasi';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Akses lokasi ditolak. Izinkan akses lokasi di browser';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMessage = 'Waktu habis saat mengambil lokasi';
            break;
        }
        setErrors(prev => ({ ...prev, lokasi: errorMessage }));
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({
          nama: '',
          email: '',
          judul: '',
          tanggal: '',
          kategori: '',
          deskripsi: '',
          foto: null,
          lokasi: ''
        });
        setImagePreview(null);
        setSubmitStatus('idle');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Formulir Laporan Kerusakan
          </h1>
          <p className="text-gray-600 text-lg">
            Laporkan kerusakan fasilitas publik untuk segera ditindaklanjuti
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">Laporan berhasil dikirim! Tim kami akan segera menindaklanjuti.</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Pelapor */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nama Pelapor
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleInputChange('nama', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.nama ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Aktif
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="contoh@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Judul Laporan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Judul Laporan
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={e => handleInputChange('judul', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.judul ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Contoh: Trotoar rusak di depan sekolah"
              />
              {errors.judul && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.judul}
                </p>
              )}
            </div>

            {/* Tanggal Kejadian */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Tanggal Kejadian
              </label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={e => handleInputChange('tanggal', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.tanggal ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Tanggal kejadian"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.tanggal && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tanggal}
                </p>
              )}
            </div>

            {/* Kategori Kerusakan */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Kategori Kerusakan
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => handleInputChange('kategori', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.kategori ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih kategori kerusakan</option>
                {kategoriOptions.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
              {errors.kategori && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.kategori}
                </p>
              )}
            </div>

            {/* Lokasi Kerusakan */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Lokasi Kerusakan
              </label>
              <LocationPicker
                value={formData.lokasi}
                onChange={(val) => handleInputChange('lokasi', val)}
              />
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => handleInputChange('lokasi', e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.lokasi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Koordinat atau alamat lengkap"
                readOnly
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {isGettingLocation ? "Mengambil Lokasi..." : "Ambil Lokasi"}
              </button>
              {errors.lokasi && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lokasi}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Deskripsi Kerusakan
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.deskripsi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Jelaskan kondisi kerusakan secara detail (minimal 10 karakter)"
              />
              {errors.deskripsi && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.deskripsi}
                </p>
              )}
            </div>

            {/* Upload Foto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Upload Foto Kerusakan
              </label>
              {!imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : errors.foto
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Klik untuk upload atau drag & drop foto
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG hingga 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pilih File
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errors.foto && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.foto}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim Laporan...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Kirim Laporan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// LocationPicker dengan validasi posisi
function LocationPicker({ value, onChange }) {
  const [position, setPosition] = useState(
    value && value.split(',').length === 2
      ? value.split(',').map(Number)
      : [-6.2, 106.8]
  );

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
    // Validasi posisi sebelum render Marker
    return Array.isArray(position) && position.length === 2 && !isNaN(position[0]) && !isNaN(position[1])
      ? <Marker position={position} />
      : null;
  }

  return (
    <div className="mb-2">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '250px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <p className="text-xs text-gray-500 mt-2">
        Klik pada peta untuk memilih lokasi kerusakan.
      </p>
    </div>
  );
}