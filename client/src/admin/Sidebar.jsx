import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart, 
  Settings, 
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle, activeMenu, onMenuSelect }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'reports', label: 'Data Laporan', icon: FileText },
    { id: 'users', label: 'Data User', icon: Users },
    { id: 'statistics', label: 'Statistik', icon: BarChart },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full bg-white shadow-xl z-30 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } lg:w-64`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NT</span>
            </div>
            {(isOpen || window.innerWidth >= 1024) && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                NusaTanggap
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onMenuSelect(item.id);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon size={20} />
                    {(isOpen || window.innerWidth >= 1024) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;