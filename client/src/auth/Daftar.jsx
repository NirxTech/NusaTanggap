import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const Daftar = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorHP: '',
    kataSandi: '',
    konfirmasiKataSandi: '',
    setujuSyarat: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.nomorHP.trim()) {
      newErrors.nomorHP = 'Nomor HP wajib diisi';
    } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.nomorHP.replace(/\s/g, ''))) {
      newErrors.nomorHP = 'Nomor HP tidak valid';
    }

    if (!formData.kataSandi) {
      newErrors.kataSandi = 'Kata sandi wajib diisi';
    } else if (formData.kataSandi.length < 8) {
      newErrors.kataSandi = 'Kata sandi minimal 8 karakter';
    }

    if (!formData.konfirmasiKataSandi) {
      newErrors.konfirmasiKataSandi = 'Konfirmasi kata sandi wajib diisi';
    } else if (formData.kataSandi !== formData.konfirmasiKataSandi) {
      newErrors.konfirmasiKataSandi = 'Konfirmasi kata sandi tidak cocok';
    }

    if (!formData.setujuSyarat) {
      newErrors.setujuSyarat = 'Anda harus menyetujui syarat & ketentuan';
    }

    return newErrors;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Simpan user ke database (is_verified=0)
      await axios.post("http://localhost:5000/api/register", {
        ...formData,
        email: formData.email.trim().toLowerCase()
      });
      // 2. Kirim OTP ke email
      await axios.post("http://localhost:5000/api/send-otp", { 
        email: formData.email.trim().toLowerCase()
      });
      // 3. Navigasi ke halaman verifikasi
      navigate('/auth/verifikasi', { state: { email: formData.email.trim().toLowerCase() } });
      // Reset form
      setFormData({
        namaLengkap: '',
        email: '',
        nomorHP: '',
        kataSandi: '',
        konfirmasiKataSandi: '',
        setujuSyarat: false
      });
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetEmail = location.state?.email || localStorage.getItem('pendingEmail') || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Akun Baru
          </h1>
          <p className="text-gray-600">
            Bergabunglah dengan NusaTanggap untuk mulai berkontribusi
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="namaLengkap"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.namaLengkap ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              {errors.namaLengkap && (
                <p className="mt-2 text-sm text-red-600">{errors.namaLengkap}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="contoh@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Nomor HP */}
            <div>
              <label htmlFor="nomorHP" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="nomorHP"
                  name="nomorHP"
                  value={formData.nomorHP}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.nomorHP ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="08123456789"
                />
              </div>
              {errors.nomorHP && (
                <p className="mt-2 text-sm text-red-600">{errors.nomorHP}</p>
              )}
            </div>

            {/* Kata Sandi */}
            <div>
              <label htmlFor="kataSandi" className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="kataSandi"
                  name="kataSandi"
                  value={formData.kataSandi}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.kataSandi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.kataSandi && (
                <p className="mt-2 text-sm text-red-600">{errors.kataSandi}</p>
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div>
              <label htmlFor="konfirmasiKataSandi" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="konfirmasiKataSandi"
                  name="konfirmasiKataSandi"
                  value={formData.konfirmasiKataSandi}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.konfirmasiKataSandi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ulangi kata sandi"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.konfirmasiKataSandi && (
                <p className="mt-2 text-sm text-red-600">{errors.konfirmasiKataSandi}</p>
              )}
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="setujuSyarat"
                    name="setujuSyarat"
                    type="checkbox"
                    checked={formData.setujuSyarat}
                    onChange={handleChange}
                    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                      errors.setujuSyarat ? 'border-red-300' : ''
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="setujuSyarat" className="text-sm text-gray-700">
                    Saya menyetujui{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                      syarat & ketentuan
                    </a>{' '}
                    yang berlaku <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
              {errors.setujuSyarat && (
                <p className="mt-2 text-sm text-red-600">{errors.setujuSyarat}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mendaftar...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Daftar
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/auth/Login" className="text-blue-600 hover:text-blue-800 font-medium underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;