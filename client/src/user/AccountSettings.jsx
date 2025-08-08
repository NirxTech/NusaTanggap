import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountSettings = ({ onUpdateUser }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true
  });

  // Ambil email user dari localStorage/session/context
  const storedUser = localStorage.getItem('nusatanggap_user');
  const email = storedUser ? JSON.parse(storedUser).email : '';

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:5000/api/user/${email}`)
        .then(res => {
          setFormData(prev => ({
            ...prev,
            nama_lengkap: res.data.nama_lengkap,
            email: res.data.email,
            phone: res.data.nomor_hp
          }));
        })
        .catch(() => {
          // handle error jika user tidak ditemukan
        });
    }
  }, [email]);

  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${email}`, {
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        nomor_hp: formData.phone
      });
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal memperbarui profil!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pengaturan Akun</h3>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Keamanan
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Notifikasi
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Ubah Kata Sandi
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notifikasi Email</h4>
                  <p className="text-sm text-gray-500">
                    Terima notifikasi status laporan melalui email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-600">Zona Bahaya</h4>
                  <p className="text-sm text-gray-500">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
                <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Akun
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;