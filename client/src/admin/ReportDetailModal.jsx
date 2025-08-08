import React, { useState } from 'react';
import { X, MapPin, Calendar, User, Tag, Camera, Upload, Save, Loader2 } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import LocationCapture from './LocationCapture';
import LocationPickerAdmin from './LocationPickerAdmin';

const ReportDetailModal = ({ report, onClose }) => {
  const [status, setStatus] = useState(report.status);
  const [repairPhoto, setRepairPhoto] = useState(null);
  const [repairLocation, setRepairLocation] = useState(report.repairLocation || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const handleSave = async () => {
    // Validation for completed status
    if (status === 'completed' && (!repairPhoto || !repairLocation)) {
      setShowValidationError(true);
      return;
    }

    setIsLoading(true);
    setShowValidationError(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onClose();
    
    // Show success message (you can implement toast notification here)
    alert('Laporan berhasil diperbarui!');
  };

  const getStatusColor = (currentStatus) => {
    const colors = {
      pending: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      processing: 'text-blue-700 bg-blue-100 border-blue-200',
      completed: 'text-green-700 bg-green-100 border-green-200'
    };
    return colors[currentStatus];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detail Laporan</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Report Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Laporan</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{report.reporter}</p>
                    <p className="text-sm text-gray-600">{report.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Tag className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-600">{report.category}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(report.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{report.location}</p>
                    <p className="text-sm text-gray-600">{report.coordinates}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Deskripsi Masalah</h4>
              <p className="text-gray-700 leading-relaxed">{report.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Foto Laporan</h4>
              <div className="relative">
                <img
                  src={report.photo}
                  alt="Foto laporan"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
                  <Camera size={12} className="inline mr-1" />
                  Foto Awal
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Admin Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Admin</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Laporan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="completed">Selesai</option>
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {status === 'pending' ? 'Pending' : status === 'processing' ? 'Sedang Diproses' : 'Selesai'}
                    </span>
                  </div>
                </div>

                {status === 'completed' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Foto Bukti Perbaikan *
                      </label>
                      <PhotoUpload
                        onPhotoSelect={setRepairPhoto}
                        selectedPhoto={repairPhoto}
                      />
                      {showValidationError && !repairPhoto && (
                        <p className="mt-1 text-sm text-red-600">Foto bukti perbaikan harus diupload</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Perbaikan *
                      </label>
                      <LocationCapture
                        onLocationCapture={setRepairLocation}
                        currentLocation={repairLocation}
                      />
                      {showValidationError && !repairLocation && (
                        <p className="mt-1 text-sm text-red-600">Lokasi perbaikan harus diisi</p>
                      )}
                    </div>
                  </>
                )}

                {showValidationError && status === 'completed' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">
                      Untuk menyelesaikan laporan, Anda harus mengupload foto bukti perbaikan dan mengisi lokasi perbaikan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Show existing repair evidence if completed */}
            {report.status === 'completed' && report.repairPhoto && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Bukti Perbaikan</h4>
                <div className="relative">
                  <img
                    src={report.repairPhoto}
                    alt="Foto bukti perbaikan"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 bg-opacity-90 text-white px-2 py-1 rounded-lg text-xs">
                    <Camera size={12} className="inline mr-1" />
                    Bukti Selesai
                  </div>
                </div>
                {report.repairLocation && (
                  <p className="mt-2 text-sm text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {report.repairLocation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;