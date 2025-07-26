import React from 'react';
import { Camera, MapPin, Zap, Shield, Clock, Users } from 'lucide-react';

export default function Features() {
  const mainFeatures = [
    {
      icon: Camera,
      title: 'AI Deteksi Gambar Kerusakan',
      description: 'Teknologi AI canggih yang dapat mendeteksi jenis kerusakan fasilitas publik secara otomatis dari foto yang Anda ambil.',
      highlight: true,
    },
    {
      icon: MapPin,
      title: 'Lokasi Otomatis via GPS',
      description: 'Sistem GPS terintegrasi yang secara otomatis menentukan lokasi kerusakan dengan akurasi tinggi tanpa perlu input manual.',
      highlight: true,
    },
    {
      icon: Zap,
      title: 'Pelaporan 3 Langkah Sederhana',
      description: 'Proses pelaporan yang sangat sederhana: ambil foto, sistem deteksi otomatis, dan kirim laporan ke instansi terkait.',
      highlight: true,
    },
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Keamanan Data Terjamin',
      description: 'Data pribadi dan laporan Anda dilindungi dengan enkripsi tingkat militer.',
    },
    {
      icon: Clock,
      title: 'Respon Cepat 24/7',
      description: 'Tim monitoring yang bekerja 24 jam untuk memastikan laporan segera ditindaklanjuti.',
    },
    {
      icon: Users,
      title: 'Komunitas Aktif',
      description: 'Bergabung dengan ribuan warga peduli yang aktif melaporkan kondisi fasilitas publik.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan NusaTanggap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Teknologi terdepan yang memudahkan warga untuk berpartisipasi aktif 
            dalam pembangunan dan pemeliharaan fasilitas publik.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-300"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                <feature.icon className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Siap Menjadi Warga Digital yang Peduli?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan warga Indonesia yang telah merasakan kemudahan 
              melaporkan kerusakan fasilitas publik dengan NusaTanggap.
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Daftar Sekarang Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}