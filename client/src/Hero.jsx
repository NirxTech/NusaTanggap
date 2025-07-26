import React from 'react';
import { ArrowRight, Smartphone, Brain, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="pt-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Laporkan Kerusakan
                <span className="text-blue-600 block">Fasilitas Publik</span>
                <span className="text-gray-700">dengan Mudah</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Platform cerdas berbasis AI untuk melaporkan kerusakan fasilitas publik. 
                Deteksi otomatis kerusakan melalui foto, lokasi GPS akurat, dan pelaporan 
                langsung ke pemerintah dalam 3 langkah sederhana.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span>Mulai Melaporkan</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/public/pelajari-selengkapnya" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                Pelajari Selengkapnya
              </Link>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">AI Detection</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">GPS Akurat</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Mobile Friendly</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
              {/* Animated Robot/Tech Illustration */}
              <div className="relative">
                {/* Main Robot Body */}
                <div className="w-48 h-64 bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl relative shadow-2xl animate-float">
                  {/* Robot Head */}
                  <div className="w-32 h-32 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-lg">
                    {/* Eyes */}
                    <div className="flex justify-center space-x-4 pt-6">
                      <div className="w-6 h-6 bg-white rounded-full animate-pulse">
                        <div className="w-4 h-4 bg-blue-600 rounded-full m-1 animate-ping"></div>
                      </div>
                      <div className="w-6 h-6 bg-white rounded-full animate-pulse">
                        <div className="w-4 h-4 bg-blue-600 rounded-full m-1 animate-ping"></div>
                      </div>
                    </div>
                    {/* Smile */}
                    <div className="w-8 h-4 border-b-2 border-white rounded-full mx-auto mt-2"></div>
                  </div>

                  {/* Arms */}
                  <div className="absolute -left-8 top-16 w-6 h-24 bg-blue-500 rounded-full shadow-lg animate-wave"></div>
                  <div className="absolute -right-8 top-16 w-6 h-24 bg-blue-500 rounded-full shadow-lg animate-wave-reverse"></div>

                  {/* Body Details */}
                  <div className="absolute inset-x-8 top-20 space-y-2">
                    <div className="h-2 bg-blue-300 rounded animate-pulse"></div>
                    <div className="h-2 bg-blue-300 rounded animate-pulse delay-75"></div>
                    <div className="h-2 bg-blue-300 rounded animate-pulse delay-150"></div>
                  </div>

                  {/* Legs */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-8">
                    <div className="w-6 h-16 bg-blue-500 rounded-b-full shadow-lg"></div>
                    <div className="w-6 h-16 bg-blue-500 rounded-b-full shadow-lg"></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-full animate-bounce shadow-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-yellow-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-1/2 -right-12 w-10 h-10 bg-purple-400 rounded-full animate-spin shadow-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}