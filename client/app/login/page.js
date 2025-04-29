'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isAdmin } = useAuth();
  
  // Get redirect URL from query parameters
  const redirectPath = searchParams.get('redirect') || '/';

  // If user is already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    if (result.success) {
      // Redirect based on user role
      if (result.user.is_admin) {
        router.push('/admin/dashboard');
      } else {
        router.push(redirectPath);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:items-start">
      {/* Decorative side panel */}
      <div className="hidden md:block w-96 h-96 relative">
        <div className="absolute -top-1 left-0 w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl -skew-y-6 transform shadow-2xl"></div>
        <div className="absolute top-12 left-10 w-72 h-72 bg-gradient-to-br from-yellow-400 via-red-500 to-red-700 rounded-2xl opacity-70 blur-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-gray-800 shadow-xl flex flex-col justify-center items-center">
            <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ASEAN</div>
            <div className="text-lg text-gray-600 dark:text-gray-300 text-center">
              Sistem Cerdas Pengenalan Bendera Negara ASEAN
            </div>
            <div className="mt-6 flex space-x-1 justify-center">
              {/* Stylized flag dots representing ASEAN countries */}
              <span className="w-4 h-4 rounded-full bg-red-500"></span>
              <span className="w-4 h-4 rounded-full bg-blue-600"></span>
              <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
              <span className="w-4 h-4 rounded-full bg-white border border-gray-300"></span>
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login form */}
      <div className="w-full max-w-md transform hover:scale-[1.02] transition-all duration-300">
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 dark:border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Masuk</h1>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          
          {error && (
            <div className="bg-red-100/70 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Nama Pengguna</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-800 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                  placeholder="Masukkan nama pengguna Anda"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Kata Sandi</label>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline">Lupa kata sandi?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-800 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                  placeholder="Masukkan kata sandi Anda"
                />
              </div>
            </div>
            
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:translate-y-[-8px] transition-all duration-300 disabled:bg-blue-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sedang Masuk...</span>
                  </div>
                ) : (
                  'Masuk Sekarang'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 mb-4 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 dark:text-gray-400 text-sm">atau</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400">
            Belum memiliki akun?{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline group flex items-center justify-center gap-1 mt-2"
            >
              <span>Daftar Sekarang</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Dengan masuk, Anda menyetujui <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Kebijakan Privasi</a> kami.
        </div>
      </div>
    </div>
  );
}