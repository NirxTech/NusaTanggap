import React from 'react';
import { Users, FileText, MapPin, TrendingUp } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: FileText,
      number: '12,485',
      label: 'Laporan Masuk',
      description: 'Total laporan yang telah diterima',
    },
    {
      icon: Users,
      number: '8,742',
      label: 'Pengguna Aktif',
      description: 'Warga yang telah bergabung',
    },
    {
      icon: MapPin,
      number: '342',
      label: 'Wilayah Tercover',
      description: 'Kelurahan di seluruh Indonesia',
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Tingkat Respon',
      description: 'Laporan yang ditindaklanjuti',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dampak Nyata untuk Indonesia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ribuan warga telah mempercayai NusaTanggap untuk menyampaikan aspirasi 
            dan melaporkan kerusakan fasilitas publik di seluruh Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6 group-hover:bg-blue-700 transition-colors duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 mb-8">Dipercaya oleh berbagai instansi pemerintah</p>
            <div className="flex justify-center items-center space-x-12 opacity-50">
              <div className="text-lg font-bold text-gray-400">KEMENDAGRI</div>
              <div className="text-lg font-bold text-gray-400">KEMENKUMHAM</div>
              <div className="text-lg font-bold text-gray-400">KEMENTERIAN PUPR</div>
              <div className="text-lg font-bold text-gray-400">BAPPENAS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}