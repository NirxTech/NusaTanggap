import React from 'react';
import { User, LogOut, Menu } from 'lucide-react';

const Header = ({ onSidebarToggle }) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Selamat Datang, Admin!
            </h1>
            <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <User size={20} className="text-blue-600" />
            <span className="hidden md:block text-blue-700 font-medium">Administrator</span>
          </div>
          
          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;