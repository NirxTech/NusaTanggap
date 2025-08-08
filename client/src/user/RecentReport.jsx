import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Filter, Eye, MapPin, Calendar, X, Clock, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import ViewOnlyMap from './ViewOnlyMap';

const RecentReports = ({ user, reports: initialReports }) => {
  const [reports, setReports] = useState(initialReports || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/laporan?email=${user.email}`)
        .then(res => res.json())
        .then(data => setReports(data));
    }
  }, [user]);

  // Polling untuk memperbarui laporan setiap 5 detik
  // useEffect(() => {
  //  const fetchReports = () => {
  //    if (user?.email) {
  //      fetch(`http://localhost:5000/api/laporan?email=${user.email}`)
  //        .then(res => res.json())
  //        .then(data => setReports(data));
  //    }
  //  };

  //  fetchReports();
  //  const interval = setInterval(fetchReports, 5000); // refresh tiap 5 detik
  //  return () => clearInterval(interval);
  //}, []);

  const filteredReports = (reports || []).filter(report => {
    const judul = report.judul ? report.judul.toLowerCase() : '';
    const lokasi = report.lokasi ? report.lokasi.toLowerCase() : '';
    const matchesSearch =
      judul.includes(searchTerm.toLowerCase()) ||
      lokasi.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      report.status === statusFilter ||
      (statusFilter === 'completed' && report.status === 'selesai') ||
      (statusFilter === 'processing' && report.status === 'diproses') ||
      (statusFilter === 'pending' && report.status === 'menunggu');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    // Mapping warna, label, dan icon
    const map = {
      pending: {
        label: 'Menunggu',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4 mr-1 text-yellow-500" />
      },
      menunggu: {
        label: 'Menunggu',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4 mr-1 text-yellow-500" />
      },
      processing: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800',
        icon: <Loader className="w-4 h-4 mr-1 text-blue-500 animate-spin" />
      },
      diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800',
        icon: <Loader className="w-4 h-4 mr-1 text-blue-500 animate-spin" />
      },
      completed: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
      },
      selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
      },
      rejected: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
      }
    };
    const { label, color, icon } = map[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
      icon: <Clock className="w-4 h-4 mr-1 text-gray-400" />
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {icon}
        {label}
      </span>
    );
  };

  // Modal detail laporan
  const DetailModal = React.memo(({ report, onClose }) => {
    const scrollRef = useRef(null);

    // Handle click outside
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    // Handle escape key
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header dengan tombol close yang mudah diakses */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detail Laporan</h2>
            </div>
            <button
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onClose}
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Konten yang dapat di-scroll */}
          <div
            ref={scrollRef}
            className="overflow-y-auto max-h-[calc(90vh-80px)]"
          >
            <div className="px-4 sm:px-6 py-4 space-y-6">
              {/* Grid informasi utama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Judul Laporan</div>
                  <div className="text-gray-900 break-words">{report.judul}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tanggal Kejadian
                  </div>
                  <div className="text-gray-900">
                    {report.tanggal_kejadian
                      ? new Date(report.tanggal_kejadian).toLocaleDateString('id-ID')
                      : '-'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Lokasi
                  </div>
                  <div className="text-gray-900 break-words">{report.lokasi}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Kategori</div>
                  <div>
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {report.kategori}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div>{getStatusBadge(report.status)}</div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Deskripsi</div>
                <div className="text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-line text-sm leading-relaxed">
                  {report.deskripsi || 'Tidak ada deskripsi'}
                </div>
              </div>

              {/* Foto */}
              {report.foto && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Foto Kerusakan</div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <img
                      src={`http://localhost:5000/uploads/${report.foto}`}
                      alt="Foto Laporan"
                      className="w-full max-h-80 object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Bukti Foto, Lokasi, Keterangan */}
              {report.bukti_foto && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Bukti Foto</div>
                  <img
                    src={`http://localhost:5000/uploads/${report.bukti_foto}`}
                    alt="Bukti Foto"
                    className="w-full max-h-80 object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}
              {report.bukti_lokasi && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Bukti Lokasi</div>
                  <div className="text-gray-900">{report.bukti_lokasi}</div>
                </div>
              )}
              {report.bukti_keterangan && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Bukti Keterangan</div>
                  <div className="text-gray-900">{report.bukti_keterangan}</div>
                </div>
              )}

              {/* Lokasi */}
              {report.lokasi && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Lokasi
                  </div>
                  <div className="text-gray-900 break-words">{report.lokasi}</div>
                  <div className="w-full h-60 rounded-lg overflow-hidden mt-2">
                    <ViewOnlyMap latlng={report.lokasi} />
                  </div>
                </div>
              )}

              {/* Peta Lokasi (hanya tampilkan jika ada koordinat) */}
              {report.latitude && report.longitude && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Peta Lokasi</div>
                  <div className="w-full h-60 rounded-lg overflow-hidden">
                    <ViewOnlyMap Lating={report.lokasi}/>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  const handleBuktiSubmit = async (e) => {
    e.preventDefault();
    // ...upload logic...
    setShowBuktiModal(false);
    fetchReports(); // refresh data setelah submit
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Laporan</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="processing">Diproses</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laporan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.judul}</div>
                  {report.foto && (
                    <img
                      src={`http://localhost:5000/uploads/${report.foto}`}
                      alt="Foto Laporan"
                      className="mt-2 w-24 h-16 object-cover rounded border"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {report.tanggal_kejadian
                      ? new Date(report.tanggal_kejadian).toLocaleDateString()
                      : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.lokasi}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${['completed', 'selesai'].includes(report.status)
                      ? 'bg-green-100 text-green-700'
                      : ['processing', 'diproses'].includes(report.status)
                      ? 'bg-blue-100 text-blue-700'
                      : report.status === 'ditolak'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {['completed', 'selesai'].includes(report.status)
                      ? <>
                          <CheckCircle className="w-4 h-4" /> Selesai
                        </>
                      : ['processing', 'diproses'].includes(report.status)
                      ? <>
                          <Loader className="w-4 h-4 animate-spin" /> Diproses
                        </>
                      : report.status === 'ditolak'
                      ? <>
                          <AlertCircle className="w-4 h-4" /> Ditolak
                        </>
                      : <>
                          <Clock className="w-4 h-4" /> Menunggu
                        </>
                    }
                  </span>
                  {/* Tampilkan alasan penolakan */}
                  {report.status === 'ditolak' && report.alasan_ditolak && (
                    <div className="text-xs text-red-500 mt-1 italic flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {report.alasan_ditolak}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada laporan yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedReport && (
        <DetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default RecentReports;