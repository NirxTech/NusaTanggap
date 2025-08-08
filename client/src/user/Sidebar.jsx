import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Plus, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X, 
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, activeTab, onTabChange, onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'history', label: 'Riwayat Laporan', icon: FileText },
    { id: 'create', label: 'Buat Laporan', icon: Plus },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'settings', label: 'Pengaturan Akun', icon: Settings },
    { id: 'help', label: 'Bantuan', icon: HelpCircle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('nusatanggap_user');
    navigate('/');
  };

  const handleMenuClick = (id) => {
    console.log('Sidebar menu clicked:', id);
    onTabChange(id);
    if (onClose && window.innerWidth < 768) onClose();
  };

  // Overlay click (mobile & desktop)
  const handleOverlayClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay untuk semua layar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          border-r border-gray-200
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col h-full">
          {/* Tombol close di mobile */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-blue-600 transition"
              aria-label="Tutup Sidebar"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          {/* Tombol collapse di desktop */}
          <div className="hidden md:flex justify-end p-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-blue-600 transition"
              aria-label="Tutup Sidebar Desktop"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 border-b border-gray-200 pt-0 md:pt-2">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NT</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">NusaTanggap</span>
                <p className="text-sm text-gray-500">Dashboard Pengguna</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${activeTab === item.id 
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Apakah kamu yakin ingin logout?</h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                onClick={handleLogout}
              >
                Iya
              </button>
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;