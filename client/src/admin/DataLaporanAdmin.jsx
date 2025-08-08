import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, MapPin, Image, User, CalendarDays, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const DataLaporanAdmin = () => {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/laporan/all')
      .then(res => {
        setLaporan(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data laporan');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" /> Data Laporan
      </h2>
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin w-5 h-5" /> Memuat data laporan...
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        laporan.length === 0 ? (
          <div className="text-gray-500">Belum ada laporan masuk.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-2 px-3 text-left">Judul</th>
                  <th className="py-2 px-3 text-left">Pelapor</th>
                  <th className="py-2 px-3 text-left">Tanggal</th>
                  <th className="py-2 px-3 text-left">Lokasi</th>
                  <th className="py-2 px-3 text-left">Foto Bukti</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Bukti Admin</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map(item => (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-blue-50/40 transition">
                    <td className="py-2 px-3 font-medium">{item.judul}</td>
                    <td className="py-2 px-3 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-gray-900 font-semibold">
                        <User className="w-4 h-4 text-blue-500" /> {item.nama}
                      </span>
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                        <CalendarDays className="w-3 h-3" /> {item.created_at && new Date(item.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="py-2 px-3">{item.tanggal_kejadian && new Date(item.tanggal_kejadian).toLocaleDateString('id-ID')}</td>
                    <td className="py-2 px-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{item.lokasi}</span>
                    </td>
                    <td className="py-2 px-3">
                      {item.foto && (
                        <img src={`http://localhost:5000/uploads/${item.foto}`} alt="Bukti" className="w-16 h-16 object-cover rounded shadow" />
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {item.status === 'selesai'
                        ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle className="w-4 h-4" />Selesai</span>
                        : item.status === 'diproses'
                        ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"><FileText className="w-4 h-4" />Diproses</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"><XCircle className="w-4 h-4" />Menunggu</span>
                      }
                    </td>
                    <td className="py-2 px-3">
                      {item.bukti_foto && (
                        <img src={`http://localhost:5000/uploads/${item.bukti_foto}`} alt="Bukti Admin" className="w-12 h-12 object-cover rounded shadow mb-1" />
                      )}
                      {item.bukti_lokasi && (
                        <div className="text-xs text-gray-700 mb-1"><MapPin className="inline w-3 h-3" /> {item.bukti_lokasi}</div>
                      )}
                      {item.bukti_keterangan && (
                        <div className="text-xs text-gray-500">{item.bukti_keterangan}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default DataLaporanAdmin;