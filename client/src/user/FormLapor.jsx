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
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

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
  const [isSummarizing, setIsSummarizing] = useState(false); // State untuk merangkum deskripsi

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const form = new FormData();
      form.append('nama', formData.nama);
      form.append('email', formData.email);
      form.append('judul', formData.judul);
      form.append('tanggal', formData.tanggal);
      form.append('kategori', formData.kategori);
      form.append('deskripsi', formData.deskripsi);
      form.append('lokasi', formData.lokasi);
      if (formData.foto) form.append('foto', formData.foto);

      const res = await fetch('http://localhost:5000/api/laporan', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus('success');
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
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk merangkum deskripsi menggunakan OpenAI API
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: formData.deskripsi })
      });
      const data = await response.json();
      if (data.success) {
        // Update deskripsi dengan hasil ringkasan
        setFormData(prev => ({ ...prev, deskripsi: data.summarizedText }));
      } else {
        // Tangani jika terjadi kesalahan saat merangkum
        setErrors(prev => ({ ...prev, deskripsi: 'Gagal merangkum deskripsi' }));
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(prev => ({ ...prev, deskripsi: 'Terjadi kesalahan' }));
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Tombol Kembali */}
        <button
          type="button"
          onClick={() => navigate('/user/dashboard', { state: { user: formData } })}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Dashboard
        </button>
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
          <SuccessModal onClose={() => setSubmitStatus('idle')} />
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
                max={getTodayLocal()} // gunakan fungsi baru
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
                  {/* Tombol Ambil Foto */}
                  <input
                    id="cameraInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('cameraInput').click()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Ambil Foto
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

          {/* Tombol Ringkas Deskripsi */}
          <div className="mt-4">
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow hover:scale-105 transition flex items-center gap-2"
              disabled={isSummarizing || !formData.deskripsi.trim()}
              onClick={handleSummarize}
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Merangkum...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Ringkas & Perbaiki Bahasa
                </>
              )}
            </button>
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
    return Array.isArray(position) && position.length === 2 && !isNaN(position[0]) && !isNaN(position[1])
      ? (
        <Marker position={position} icon={customMarker}>
          <Popup className="rounded-xl shadow-lg border-0 text-sm font-medium text-gray-800">
            Lokasi Kerusakan
          </Popup>
          <Tooltip direction="top" offset={[0, -20]} className="rounded bg-blue-600 text-white px-3 py-1 shadow font-semibold">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </Tooltip>
        </Marker>
      )
      : null;
  }

  return (
    <div className="mb-2">
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
              borderRadius: '12px'
            }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <LocationMarker />
          </MapContainer>
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold flex items-center gap-1 z-[10]">
            <MapPin className="w-4 h-4" /> Pilih Lokasi Kerusakan
          </div>
        </div>
      </div>
      <p className="text-xs text-blue-700 mt-2 font-medium flex items-center gap-1">
        <MapPin className="w-4 h-4" /> Klik pada peta untuk memilih lokasi kerusakan.
      </p>
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center relative transition-all duration-300">
        {/* Success Icon dengan animasi pulse */}
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Laporan Berhasil Dikirim
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Terima kasih atas partisipasimu.<br />
          Tim kami akan segera menindaklanjuti laporanmu.
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// Tambahkan di atas komponen:
function getTodayLocal() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}