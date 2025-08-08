import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const DataUserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/users/all')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data user');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" /> Data User
      </h2>
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin w-5 h-5" /> Memuat data user...
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        users.length === 0 ? (
          <div className="text-gray-500">Belum ada user terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-2 px-3 text-left">Nama Lengkap</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">No. HP</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-blue-50/40 transition">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{user.nama_lengkap}</span>
                    </td>
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </td>
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.nomor_hp}</span>
                    </td>
                    <td className="py-2 px-3">
                      {user.is_verified
                        ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle className="w-4 h-4" />Terverifikasi</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"><XCircle className="w-4 h-4" />Belum Verifikasi</span>
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-500">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default DataUserAdmin;