'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
  });
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data pengguna');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/create-user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pengguna baru');
      }
      
      setFormSuccess('Pengguna berhasil dibuat');
      fetchUsers();
      setNewUser({
        username: '',
        email: '',
        password: '',
        is_admin: false
      });
      
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error creating user:', err);
      setFormError(err.message);
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-100 opacity-30"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-indigo-600 whitespace-nowrap font-medium">Memuat Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100/70 backdrop-blur-sm border-l-4 border-red-500 rounded-r-lg px-6 py-5 shadow-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-700">Terjadi Kesalahan</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 tracking-tight">Manajemen Pengguna</h2>
          <p className="text-indigo-600">Kelola akun pengguna dalam sistem</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="group relative px-5 py-2.5 overflow-hidden rounded-lg bg-indigo-600 text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-700 transform rotate-12 translate-x-12 bg-white opacity-10 group-hover:translate-x-0 ease-out"></span>
          <span className="relative flex items-center">
            {showForm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Batal
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Pengguna
              </>
            )}
          </span>
        </button>
      </div>
      
      {showForm && (
        <div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-indigo-100">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative z-10 p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-6">Buat Pengguna Baru</h3>
            
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-red-700">{formError}</p>
                </div>
              </div>
            )}
            
            {formSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-green-700">{formSuccess}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="group">
                  <label className="block text-indigo-700 font-medium mb-2 transition-all group-focus-within:text-indigo-600">
                    Nama Pengguna
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      className="text-black w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-indigo-700 font-medium mb-2 transition-all group-focus-within:text-indigo-600">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="text-black w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-indigo-700 font-medium mb-2 transition-all group-focus-within:text-indigo-600">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className="text-black w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div className="group flex items-center">
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="is_admin"
                      name="is_admin"
                      checked={newUser.is_admin}
                      onChange={handleInputChange}
                      className="absolute block w-6 h-6 bg-white border-2 border-gray-300 rounded-full appearance-none cursor-pointer transition-all duration-300 checked:right-0 checked:border-indigo-600 peer"
                    />
                    <label
                      htmlFor="is_admin"
                      className="block h-6 overflow-hidden bg-gray-200 rounded-full cursor-pointer peer-checked:bg-indigo-100 peer-checked:border-indigo-600 transition-all duration-300"
                    ></label>
                  </div>
                  <label htmlFor="is_admin" className="text-indigo-700 font-medium">
                    Admin
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none"
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <th className="py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-tight text-indigo-700">ID</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-tight text-indigo-700">Nama Pengguna</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-tight text-indigo-700">Email</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-tight text-indigo-700">Peran</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-tight text-indigo-700">Login Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm font-mono text-gray-600">{user.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    {user.is_admin ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        Pengguna
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Belum Pernah'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Belum Ada Pengguna</h3>
            <p className="text-gray-500 max-w-md">Belum ada data pengguna yang tersedia. Silakan tambahkan pengguna baru untuk mulai mengelola sistem.</p>
          </div>
        )}
      </div>
    </div>
  );
}