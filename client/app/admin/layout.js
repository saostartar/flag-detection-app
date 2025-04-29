'use client';

import AdminNavbar from '@/app/components/AdminNavbar';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin/dashboard');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex justify-center items-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-200 opacity-25"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-600 animate-spin"></div>
          </div>
          <p className="text-indigo-800 font-medium">Sedang memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-indigo-100">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Panel Admin</h1>
              <p className="text-indigo-600 text-sm">Selamat datang di area pengelolaan sistem</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm font-medium">Admin Aktif</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Navigasi</h2>
              <AdminNavbar />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                {children}
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-indigo-400">
              <p>Sistem Pendeteksi Bendera © 2025 | Versi 1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}