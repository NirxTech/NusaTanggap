import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import DataUserAdmin from './DataUserAdmin';
import DataLaporanAdmin from './DataLaporanAdmin';
import LocationPickerAdmin from './LocationPickerAdmin';
import AdminStatistics from './AdminStatistics';
import { CheckCircle, XCircle, Loader2, BarChart3, Users, FileText, Info, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [bukti, setBukti] = useState({ foto: null, lokasi: '', keterangan: '', status: '', id: null });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);

  // Fetch semua laporan dari backend
  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/all');
      setReports(res.data);
    } catch (err) {
      setError('Gagal memuat laporan');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  //  const interval = setInterval(fetchReports, 5000); // refresh tiap 5 detik
  //  return () => clearInterval(interval);
  }, []);

  // Update status laporan
  const handleStatusChange = (report, status) => {
    if (status === 'ditolak') {
      setRejectTarget(report.id);
      setShowRejectModal(true);
      return;
    }
    if (status === 'selesai') {
      setBukti({ foto: null, lokasi: '', keterangan: '', status, id: report.id });
      setShowBuktiModal(true);
      return;
    }
    // Untuk status lain, langsung update tanpa modal
    axios.put(`http://localhost:5000/api/laporan/${report.id}/status`, { status })
      .then(fetchReports)
      .catch(() => alert('Gagal update status'));
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Alasan penolakan wajib diisi!');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/laporan/${rejectTarget}/status`, {
        status: 'ditolak',
        alasan_ditolak: rejectReason
      });
      setShowRejectModal(false);
      setRejectReason('');
      setRejectTarget(null);
      fetchReports();
    } catch {
      alert('Gagal menolak laporan');
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const openBuktiModal = (report, status) => {
    if (status === 'ditolak') {
      setRejectTarget(report.id);
      setShowRejectModal(true);
      return;
    }
    setBukti({ foto: null, lokasi: '', keterangan: '', status, id: report.id });
    setShowBuktiModal(true);
  };

  const handleBuktiSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('status', bukti.status);
    formData.append('bukti_foto', bukti.foto);
    formData.append('bukti_lokasi', bukti.lokasi);
    formData.append('bukti_keterangan', bukti.keterangan);

    await axios.put(`http://localhost:5000/api/laporan/${bukti.id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setShowBuktiModal(false);
    fetchReports();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeMenu={activeMenu}
        onMenuSelect={setActiveMenu}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} lg:ml-64`}>
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 lg:p-8">
          {activeMenu === 'dashboard' && (
            <>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-blue-700" /> Dashboard Admin
              </h2>
              {loading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="animate-spin w-5 h-5" /> Memuat laporan...
                </div>
              )}
              {error && <div className="text-red-500 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</div>}
              {!loading && !error && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Semua Laporan
                  </h3>
                  {reports.length === 0 ? (
                    <div className="text-gray-500 flex items-center gap-2">
                      <Info className="w-5 h-5" /> Belum ada laporan.
                    </div>
                  ) : (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="py-2 px-3">Judul</th>
                          <th className="py-2 px-3">Pelapor</th>
                          <th className="py-2 px-3">Tanggal</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map(report => (
                          <tr key={report.id}>
                            <td className="py-2 px-3">{report.judul}</td>
                            <td className="py-2 px-3">{report.nama}</td>
                            <td className="py-2 px-3">{report.tanggal_kejadian}</td>
                            <td className="py-2 px-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                                ${report.status === 'selesai' ? 'bg-green-100 text-green-700'
                                  : report.status === 'diproses' ? 'bg-yellow-100 text-yellow-700'
                                  : report.status === 'ditolak' ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'}`}>
                                {report.status === 'selesai' && <CheckCircle className="w-4 h-4" />}
                                {report.status === 'diproses' && <Loader2 className="w-4 h-4 animate-spin" />}
                                {report.status === 'ditolak' && <XCircle className="w-4 h-4" />}
                                {report.status}
                              </span>
                              {report.status === 'ditolak' && report.alasan_ditolak && (
                                <div className="text-xs text-red-500 mt-1 italic flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" /> {report.alasan_ditolak}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={report.status}
                                onChange={e => handleStatusChange(report, e.target.value)}
                                className="border rounded px-2 py-1"
                              >
                                <option value="menunggu">Menunggu</option>
                                <option value="diproses">Diproses</option>
                                <option value="selesai">Selesai</option>
                                <option value="ditolak">Ditolak</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              <button
                className="mt-6 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow hover:scale-105 transition flex items-center gap-2"
                onClick={() => setActiveMenu('statistics')}
              >
                <BarChart3 className="w-5 h-5" /> Lihat Statistik Selengkapnya
              </button>
            </>
          )}
          
          {activeMenu === 'reports' && (
            <DataLaporanAdmin />
          )}
          
          {activeMenu === 'users' && (
            <DataUserAdmin />
          )}
          
          {activeMenu === 'statistics' && (
            <AdminStatistics />
          )}
          
          {activeMenu === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-700" /> Pengaturan
              </h2>
              <p className="text-gray-600">Halaman pengaturan akan tersedia segera.</p>
            </div>
          )}
        </main>
      </div>

      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Modal Bukti */}
      {showBuktiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={handleBuktiSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> Upload Bukti Perubahan Status
            </h3>
            <input type="file" accept="image/*" required onChange={e => setBukti(b => ({ ...b, foto: e.target.files[0] }))} />
            <LocationPickerAdmin
              value={bukti.lokasi}
              onChange={lokasi => setBukti(b => ({ ...b, lokasi }))
              }
              required
            />
            <textarea placeholder="Keterangan Bukti" required className="border p-2 rounded w-full"
              value={bukti.keterangan} onChange={e => setBukti(b => ({ ...b, keterangan: e.target.value }))} />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowBuktiModal(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Penolakan */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={handleRejectSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-md w-full">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Alasan Penolakan Laporan
            </h3>
            <textarea
              className="border p-2 rounded w-full"
              placeholder="Tuliskan alasan penolakan laporan secara jelas dan kuat..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              required
              minLength={10}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectTarget(null); }} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Tolak Laporan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;