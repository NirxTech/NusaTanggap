import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Zap, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecentReports from './RecentReport';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';
import Header from './Header';
import Sidebar from './Sidebar';
import FormLaporan from './FormLapor'; // pastikan ini sesuai export default di FormLapor.jsx

const Dashboard = ({
  user: userProp,
  notifications,
  activeTab: activeTabProp = "home",
  onUpdateUser
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil user dari state, props, atau localStorage
  let user = location.state?.user || userProp;
  if (!user) {
    const stored = localStorage.getItem('nusatanggap_user');
    if (stored) user = JSON.parse(stored);
  }

  useEffect(() => {
    if (!user || !user.email) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user || !user.email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Memuat data pengguna...</div>
      </div>
    );
  }

  // State laporan dan statistik
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    processingReports: 0,
    completedReports: 0,
    lastResponseTime: '-'
  });

  // State tab
  const [activeTab, setActiveTab] = useState(activeTabProp);
  const [notificationsData, setNotificationsData] = useState([]);
  // Tambahkan state baru
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default: tertutup biar sidebar tidak terbuka otomatis

  const handleMenuToggle = () => setIsSidebarOpen((prev) => !prev);

  // Fetch laporan dari backend
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/laporan?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setReports(data);
          const total = data.length;
          const processing = data.filter(l => l.status === 'diproses' || l.status === 'processing').length;
          const completed = data.filter(l => l.status === 'selesai' || l.status === 'completed').length;
          const last = data[0]?.tanggal_lapor ? '< 24 jam' : '-';
          setStats({
            totalReports: total,
            processingReports: processing,
            completedReports: completed,
            lastResponseTime: last
          });
        });
    }
  }, [user]);

  // Fetch notifikasi dari backend (contoh endpoint, sesuaikan dengan backend-mu)
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/notifications?email=${user.email}`)
        .then(res => res.json())
        .then(data => setNotificationsData(data))
        .catch(() => setNotificationsData([]));
    }
  }, [user]);

  const handleCreateReport = () => {
    navigate('/user/formlaporan', { state: { user } });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 md:p-8 text-white w-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Selamat Datang, {user.nama_lengkap || user.nama || '-'}
              </h1>
              <p className="text-blue-100">
                Pantau laporanmu dengan cepat dan mudah
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              <StatCard
                title="Total Laporan"
                value={stats.totalReports}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Laporan Diproses"
                value={stats.processingReports}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Laporan Selesai"
                value={stats.completedReports}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Respon Terakhir"
                value={stats.lastResponseTime}
                icon={Zap}
                color="gray"
              />
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 w-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ada yang ingin dilaporkan?
                </h3>
                <p className="text-gray-600 mb-6">
                  Laporkan masalah atau keluhan Anda dengan mudah dan cepat
                </p>
                <button
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleCreateReport}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Laporan Sekarang
                </button>
              </div>
            </div>

            {/* Recent Reports */}
            <RecentReports user={user} reports={reports.slice(0, 5)} />
          </div>
        );

      case 'history':
        return <RecentReports user={user} reports={reports} />;

      case 'create':
        return <FormLaporan />; // gunakan FormLaporan, bukan FormLapor

      case 'notifications':
        // Tampilkan Notifications dengan data dari database
        return <Notifications user={user} />;

      case 'settings':
        return <AccountSettings user={user} onUpdateUser={onUpdateUser} />;

      case 'help':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bantuan</h3>
            <p className="text-gray-600">Halaman bantuan dan FAQ akan tersedia di sini.</p>
          </div>
        );

      default:
        return null;
    }
  };

  const unreadCount = notificationsData.filter(n => !n.isRead).length;

  const handleNotificationClick = () => setActiveTab('notifications');

  console.log('Active tab:', activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          user={user}
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isSidebarOpen}
          notificationCount={unreadCount}
          onNotificationClick={handleNotificationClick}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="w-full space-y-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;