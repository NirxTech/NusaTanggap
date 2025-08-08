import React from 'react';
import { Inbox, Loader2, CheckCircle, Users } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    {
      title: 'Laporan Masuk',
      value: '24',
      icon: Inbox,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Sedang Diproses',
      value: '12',
      icon: Loader2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Laporan Selesai',
      value: '48',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'User Aktif',
      value: '156',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor}`}>
                <Icon size={24} className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;