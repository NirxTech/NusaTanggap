import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import { ReportsBarChart } from './components/charts/ReportBarChart';
import { StatusPieChart } from './components/charts/StatusPieChart';
import { TrendLineChart } from './components/charts/TrendLineChart';
import { FilterPanel } from './components/FilterPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useStatistics } from './components/utils/useStatistics';
import { exportToPDF } from './components/utils/pdfExport';

const AdminStatistics = () => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    category: 'Semua Kategori',
    status: 'Semua Status',
    region: 'Semua Wilayah',
  });

  const [isExporting, setIsExporting] = useState(false);
  const { data, loading, error, refetch } = useStatistics(filters);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF([
        'statistik-filter',
        'statistik-grid',
        'statistik-bar',
        'statistik-pie',
        'statistik-trend'
      ], 'statistik-nusatanggap');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto" id="statistics-dashboard">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Statistik NusaTanggap
            </h1>
            <p className="text-gray-600 mt-1">
              Dashboard analitik dan pelaporan untuk admin
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Mengunduh...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div id="statistik-filter">
          <FilterPanel
            dateRange={filters.dateRange}
            onDateRangeChange={(dateRange) => setFilters({ ...filters, dateRange })}
            selectedCategory={filters.category}
            onCategoryChange={(category) => setFilters({ ...filters, category })}
            selectedStatus={filters.status}
            onStatusChange={(status) => setFilters({ ...filters, status })}
            selectedRegion={filters.region}
            onRegionChange={(region) => setFilters({ ...filters, region })}
          />
        </div>

        {/* Statistics Cards */}
        <div id="statistik-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Laporan"
            value={data.totalReports.toLocaleString()}
            icon={FileText}
            change={data.changes.totalReports}
            color="blue"
          />
          <StatCard
            title="Laporan Menunggu"
            value={data.pendingReports.toLocaleString()}
            icon={Clock}
            change={data.changes.pendingReports}
            color="yellow"
          />
          <StatCard
            title="Laporan Diproses"
            value={data.inProgressReports.toLocaleString()}
            icon={BarChart3}
            change={data.changes.inProgressReports}
            color="blue"
          />
          <StatCard
            title="Laporan Selesai"
            value={data.completedReports.toLocaleString()}
            icon={CheckCircle}
            change={data.changes.completedReports}
            color="green"
          />
          <StatCard
            title="Laporan Ditolak"
            value={data.rejectedReports.toLocaleString()}
            icon={XCircle}
            change={data.changes.rejectedReports}
            color="red"
          />
          <StatCard
            title="User Aktif"
            value={data.activeUsers.toLocaleString()}
            icon={Users}
            change={data.changes.activeUsers}
            color="purple"
          />
          <StatCard
            title="Laporan Hari Ini"
            value={data.todayReports.toLocaleString()}
            icon={Calendar}
            change={data.changes.todayReports}
            color="indigo"
          />
        </div>

        {/* Charts */}
        <div id="statistik-bar" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ReportsBarChart data={data.monthlyData} />
        </div>
        <div id="statistik-pie" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusPieChart data={data.statusData} />
        </div>

        {/* Trend Chart */}
        <div id="statistik-trend" className="mb-8">
          <TrendLineChart data={data.trendData} />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Data diperbarui secara real-time • Terakhir diperbarui:{' '}
            {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;