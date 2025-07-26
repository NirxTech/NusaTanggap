export const mockUser = {
  id: '1',
  name: 'Ahmad Wijaya',
  email: 'ahmad.wijaya@email.com',
  phone: '+62 812-3456-7890'
};

export const mockStats = {
  totalReports: 12,
  processingReports: 3,
  completedReports: 8,
  lastResponseTime: '< 24 jam'
};

export const mockReports = [
  {
    id: '1',
    title: 'Jalan Rusak di Jl. Sudirman',
    date: '2025-01-20',
    location: 'Jl. Sudirman, Jakarta Pusat',
    status: 'processing',
    description: 'Lubang besar di tengah jalan yang membahayakan pengendara'
  },
  {
    id: '2',
    title: 'Lampu Jalan Mati',
    date: '2025-01-19',
    location: 'Jl. Thamrin, Jakarta Pusat',
    status: 'completed',
    description: 'Lampu penerangan jalan tidak berfungsi'
  },
  {
    id: '3',
    title: 'Saluran Air Tersumbat',
    date: '2025-01-18',
    location: 'Jl. Gatot Subroto, Jakarta Selatan',
    status: 'pending',
    description: 'Saluran pembuangan air hujan tersumbat sampah'
  },
  {
    id: '4',
    title: 'Trotoar Rusak',
    date: '2025-01-17',
    location: 'Jl. MH Thamrin, Jakarta Pusat',
    status: 'completed',
    description: 'Trotoar berlubang dan berbahaya untuk pejalan kaki'
  },
  {
    id: '5',
    title: 'Pohon Tumbang',
    date: '2025-01-16',
    location: 'Jl. Rasuna Said, Jakarta Selatan',
    status: 'processing',
    description: 'Pohon besar tumbang menghalangi jalan'
  }
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Laporan Diproses',
    message: 'Laporan "Jalan Rusak di Jl. Sudirman" sedang ditindaklanjuti oleh tim terkait.',
    date: '2025-01-20T10:30:00Z',
    isRead: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Laporan Selesai',
    message: 'Laporan "Lampu Jalan Mati" telah selesai ditangani. Terima kasih atas laporannya.',
    date: '2025-01-19T14:15:00Z',
    isRead: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Laporan Perlu Informasi Tambahan',
    message: 'Diperlukan informasi tambahan untuk laporan "Saluran Air Tersumbat".',
    date: '2025-01-18T09:45:00Z',
    isRead: true,
    type: 'warning'
  }
];