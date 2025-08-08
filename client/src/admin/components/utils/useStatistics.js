import { useState, useEffect } from 'react';

const mapStatus = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export const useStatistics = (filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.dateRange?.start) params.append('start', filters.dateRange.start);
      if (filters.dateRange?.end) params.append('end', filters.dateRange.end);
      if (filters.category && filters.category !== 'Semua Kategori') params.append('kategori', filters.category);
      if (filters.status && filters.status !== 'Semua Status') params.append('status', filters.status.toLowerCase());
      if (filters.region && filters.region !== 'Semua Wilayah') params.append('wilayah', filters.region);

      const res = await fetch(`/api/stats?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal mengambil data statistik');
      const stats = await res.json();

      // Format data untuk komponen statistik
      setData({
        totalReports: stats.stats.total || 0,
        pendingReports: stats.stats.menunggu || 0,
        inProgressReports: stats.stats.diproses || 0,
        completedReports: stats.stats.selesai || 0,
        rejectedReports: stats.stats.ditolak || 0,
        activeUsers: stats.stats.users || 0,
        todayReports: stats.stats.today || 0,
        monthlyData: (stats.monthly || []).map(m => ({
          month: m.bulan || m.month,
          reports: m.jumlah || m.reports,
        })),
        statusData: [
          { name: 'Selesai', value: stats.stats.selesai || 0, color: '#10b981' },
          { name: 'Menunggu', value: stats.stats.menunggu || 0, color: '#f59e0b' },
          { name: 'Diproses', value: stats.stats.diproses || 0, color: '#3b82f6' },
          { name: 'Ditolak', value: stats.stats.ditolak || 0, color: '#ef4444' },
        ],
        trendData: (stats.trend || []).map(t => ({
          date: t.tanggal || t.date,
          reports: t.jumlah || t.reports,
        })),
        changes: {
          totalReports: { value: 0, isPositive: true }, // Optional: hitung perubahan jika backend support
          pendingReports: { value: 0, isPositive: true },
          inProgressReports: { value: 0, isPositive: true },
          completedReports: { value: 0, isPositive: true },
          rejectedReports: { value: 0, isPositive: true },
          activeUsers: { value: 0, isPositive: true },
          todayReports: { value: 0, isPositive: true },
        },
      });
    } catch (err) {
      setError(err.message || 'Gagal mengambil data statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchStatistics };
};