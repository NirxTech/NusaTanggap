import React, { useState } from 'react';
import { Eye, Search, Filter, Download } from 'lucide-react';

const ReportsTable = ({ onReportSelect, showAll = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const reports = [
    {
      id: '1',
      title: 'Jalan Berlubang di Jl. Sudirman',
      reporter: 'Ahmad Suryanto',
      email: 'ahmad@example.com',
      category: 'Infrastruktur',
      date: '2024-01-15',
      status: 'pending',
      description: 'Terdapat lubang besar di tengah jalan yang membahayakan pengendara',
      location: 'Jl. Sudirman No. 123, Jakarta',
      coordinates: '-6.200000, 106.816666',
      photo: 'https://images.pexels.com/photos/8960464/pexels-photo-8960464.jpeg'
    },
    {
      id: '2',
      title: 'Lampu Jalan Mati',
      reporter: 'Siti Nurhaliza',
      email: 'siti@example.com',
      category: 'Utilitas',
      date: '2024-01-14',
      status: 'processing',
      description: 'Lampu penerangan jalan sudah mati selama 3 hari',
      location: 'Jl. Gatot Subroto, Jakarta',
      coordinates: '-6.207972, 106.845311',
      photo: 'https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg'
    },
    {
      id: '3',
      title: 'Sampah Menumpuk',
      reporter: 'Budi Santoso',
      email: 'budi@example.com',
      category: 'Kebersihan',
      date: '2024-01-13',
      status: 'completed',
      description: 'Sampah menumpuk di dekat pasar tradisional',
      location: 'Pasar Minggu, Jakarta Selatan',
      coordinates: '-6.284956, 106.844406',
      photo: 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg',
      repairPhoto: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg',
      repairLocation: 'Pasar Minggu, Jakarta Selatan'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      processing: { label: 'Diproses', classes: 'bg-blue-100 text-blue-800 border-blue-200' },
      completed: { label: 'Selesai', classes: 'bg-green-100 text-green-800 border-green-200' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
        {config.label}
      </span>
    );
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayReports = showAll ? filteredReports : filteredReports.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {showAll ? 'Semua Laporan' : 'Laporan Terbaru'}
          </h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Diproses</option>
              <option value="completed">Selesai</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{report.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{report.reporter}</div>
                  <div className="text-sm text-gray-500">{report.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{report.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {new Date(report.date).toLocaleDateString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onReportSelect(report)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Eye size={16} />
                    <span className="text-sm">Detail</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada laporan ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;