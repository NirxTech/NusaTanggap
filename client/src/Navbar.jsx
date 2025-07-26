import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './assets/Logo NusaTanggap.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Daftar', to: '/auth/daftar' },
    { name: 'Login', to: '/auth/login' },
    { name: 'FAQ', to: '/#faq' },
  ];


  // Scroll to FAQ section
  const handleFaqClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
    setIsOpen(false);
  };

  // Scroll to Hero section
  const handleHeroClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div>
              <img src={logo} alt="Logo NusaTanggap" className="h-16 w-16" />
            </div>
            <span className="text-xl font-bold text-gray-900">NusaTanggap</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.name === 'FAQ') {
                return (
                  <a
                    key={item.name}
                    href="#faq"
                    onClick={handleFaqClick}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    {item.name}
                  </a>
                );
              } else if (item.name === 'Home') {
                return (
                  <button
                    key={item.name}
                    onClick={handleHeroClick}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none"
                    style={{ background: 'none' }}
                  >
                    {item.name}
                  </button>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                if (item.name === 'FAQ') {
                  return (
                    <a
                      key={item.name}
                      href="#faq"
                      onClick={handleFaqClick}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </a>
                  );
                } else if (item.name === 'Home') {
                  return (
                    <button
                      key={item.name}
                      onClick={handleHeroClick}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none"
                      style={{ background: 'none' }}
                    >
                      {item.name}
                    </button>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}