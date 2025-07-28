import React from 'react';
import { FileText, Clock, CheckCircle, Zap, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecentReports from './RecentReport';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';
import Header from './Header';

const Dashboard = ({ 
  user: userProp, 
  stats, 
  reports, 
  notifications, 
  activeTab,
  onUpdateUser 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || userProp;

  const handleCreateReport = () => {
    navigate('/user/formlaporan');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
              <h1 className="text-2xl font-bold mb-2">
                Selamat Datang, {user.nama_lengkap}
              </h1>
              <p className="text-blue-100">
                Pantau laporanmu dengan cepat dan mudah
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <RecentReports reports={reports.slice(0, 5)} />
          </div>
        );

      case 'history':
        return <RecentReports reports={reports} />;

      case 'create':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buat Laporan Baru</h3>
            <p className="text-gray-600">Form pembuatan laporan akan tersedia di sini.</p>
          </div>
        );

      case 'notifications':
        return <Notifications notifications={notifications} />;

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

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;