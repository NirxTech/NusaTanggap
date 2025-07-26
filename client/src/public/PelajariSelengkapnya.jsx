import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Zap, 
  Brain, 
  Smartphone, 
  Send,
  CheckCircle,
  Target,
  Clock,
  Code,
  Layers,
  Eye,
  Navigation,
  Cloud
} from 'lucide-react';

const PelajariSelengkapnya = () => {
  const caraMerja = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Ambil Foto",
      description: "Foto lokasi jalan rusak atau infrastruktur yang bermasalah"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Deteksi",
      description: "Sistem AI menganalisis dan mengidentifikasi jenis kerusakan"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Lokasi Terdeteksi",
      description: "GPS secara otomatis menandai lokasi tepat kejadian"
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: "Kirim Laporan",
      description: "Laporan terkirim langsung ke instansi terkait"
    }
  ];

  const fiturUnggulan = [
    {
      icon: <Eye className="w-12 h-12" />,
      title: "AI Detection",
      description: "Teknologi computer vision canggih untuk deteksi otomatis kerusakan infrastruktur",
      color: "bg-blue-500"
    },
    {
      icon: <Navigation className="w-12 h-12" />,
      title: "Lokasi GPS",
      description: "Penentuan lokasi presisi tinggi dengan integrasi GPS dan mapping",
      color: "bg-indigo-500"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Laporan 3 Langkah",
      description: "Proses pelaporan yang disederhanakan hanya dalam 3 langkah mudah",
      color: "bg-cyan-500"
    }
  ];

  const statistik = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      number: "12,453",
      label: "Total Laporan",
      description: "Laporan yang telah diproses"
    },
    {
      icon: <Target className="w-8 h-8" />,
      number: "94.8%",
      label: "Akurasi AI",
      description: "Tingkat akurasi deteksi"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "< 2 Menit",
      label: "Respon Cepat",
      description: "Waktu rata-rata pemrosesan"
    }
  ];

  const teknologi = [
    { name: "React", icon: <Code className="w-5 h-5" />, color: "bg-blue-100 text-blue-700" },
    { name: "Tailwind CSS", icon: <Layers className="w-5 h-5" />, color: "bg-cyan-100 text-cyan-700" },
    { name: "AI Vision", icon: <Eye className="w-5 h-5" />, color: "bg-purple-100 text-purple-700" },
    { name: "GPS", icon: <Navigation className="w-5 h-5" />, color: "bg-green-100 text-green-700" },
    { name: "Cloud", icon: <Cloud className="w-5 h-5" />, color: "bg-gray-100 text-gray-700" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section dengan 3D Visual */}
        <div className="text-center mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-left lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Tentang <span className="text-blue-600">NusaTanggap</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                NusaTanggap adalah platform inovatif yang memanfaatkan teknologi AI dan GPS untuk memudahkan masyarakat melaporkan kerusakan infrastruktur. Kami percaya bahwa partisipasi aktif masyarakat adalah kunci untuk mewujudkan Indonesia yang lebih baik.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Mudah Digunakan</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Teknologi AI</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Gratis 100%</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              {/* 3D Robot Illustration (copied from Hero.jsx) */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="relative">
                  {/* Main Robot Body */}
                  <div className="w-40 h-56 bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl relative shadow-2xl animate-float">
                    {/* Robot Head */}
                    <div className="w-28 h-28 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl absolute -top-7 left-1/2 transform -translate-x-1/2 shadow-lg">
                      {/* Eyes */}
                      <div className="flex justify-center space-x-3 pt-5">
                        <div className="w-5 h-5 bg-white rounded-full animate-pulse">
                          <div className="w-3.5 h-3.5 bg-blue-600 rounded-full m-0.5 animate-ping"></div>
                        </div>
                        <div className="w-5 h-5 bg-white rounded-full animate-pulse">
                          <div className="w-3.5 h-3.5 bg-blue-600 rounded-full m-0.5 animate-ping"></div>
                        </div>
                      </div>
                      {/* Smile */}
                      <div className="w-7 h-3 border-b-2 border-white rounded-full mx-auto mt-1.5"></div>
                    </div>

                    {/* Arms */}
                    <div className="absolute -left-7 top-14 w-5 h-20 bg-blue-500 rounded-full shadow-lg animate-wave"></div>
                    <div className="absolute -right-7 top-14 w-5 h-20 bg-blue-500 rounded-full shadow-lg animate-wave-reverse"></div>

                    {/* Body Details */}
                    <div className="absolute inset-x-6 top-16 space-y-2">
                      <div className="h-1.5 bg-blue-300 rounded animate-pulse"></div>
                      <div className="h-1.5 bg-blue-300 rounded animate-pulse delay-75"></div>
                      <div className="h-1.5 bg-blue-300 rounded animate-pulse delay-150"></div>
                    </div>

                    {/* Legs */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-6">
                      <div className="w-5 h-12 bg-blue-500 rounded-b-full shadow-lg"></div>
                      <div className="w-5 h-12 bg-blue-500 rounded-b-full shadow-lg"></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-400 rounded-full animate-bounce shadow-lg flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-1/2 -right-10 w-8 h-8 bg-purple-400 rounded-full animate-spin shadow-lg flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cara Kerja Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Cara Kerja <span className="text-blue-600">NusaTanggap</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caraMerja.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-600 transition-colors">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">{step.title}</h4>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
                {index < caraMerja.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fitur Unggulan Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur <span className="text-blue-600">Unggulan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fiturUnggulan.map((fitur, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`${fitur.color} text-white w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    {fitur.icon}
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-4 text-center">{fitur.title}</h4>
                  <p className="text-gray-600 text-center leading-relaxed">{fitur.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistik Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Statistik <span className="text-blue-600">Platform</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statistik.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-blue-600 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-xl font-semibold text-blue-600 mb-2">{stat.label}</div>
                  <div className="text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teknologi Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Teknologi yang <span className="text-blue-600">Digunakan</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {teknologi.map((tech, index) => (
              <div key={index} className={`${tech.color} rounded-full px-6 py-3 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                {tech.icon}
                <span className="font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <h4 className="text-2xl font-bold mb-4">Siap Bergabung?</h4>
            <p className="text-blue-100 mb-6">Mulai laporkan kerusakan infrastruktur di sekitar Anda dan berkontribusi untuk Indonesia yang lebih baik</p>
            <Link to="/auth/daftar" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PelajariSelengkapnya;