import React from 'react';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';
import logo from './assets/Logo NusaTanggap.png';
import { Link } from 'react-router-dom';
export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'Tentang Kami', href: '#' },
    { name: 'Fitur', href: '#features' },
    { name: 'Cara Kerja', href: '#' },
    { name: 'FAQ', href: '#faq' },
  ];

  const supportLinks = [
    { name: 'Pusat Bantuan', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=nusatanggap@gmail.com&su=Permintaan%20Informasi&body=Halo%20tim%20NusaTanggap%2C%20saya%20ingin%20bertanya%20tentang...' },
    { name: 'Kontak', href: '#' },
    { name: 'Kebijakan Privasi', href: '#' },
    { name: 'Syarat & Ketentuan', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div>
                <img src={logo} alt="Logo NusaTanggap" className="h-16 w-16" />
              </div>
              <span className="text-2xl font-bold">NusaTanggap</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Platform pelaporan kerusakan fasilitas publik berbasis AI dan GPS. 
              Memudahkan warga untuk berpartisipasi aktif dalam pembangunan Indonesia 
              yang lebih baik.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">nusatanggap@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+62 21 1500 3000</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 NusaTanggap. Semua hak dilindungi.
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Dibuat dengan ❤️ untuk Gemastik XVIII/2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}