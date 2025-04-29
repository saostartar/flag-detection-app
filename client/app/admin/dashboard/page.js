'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative h-16 w-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-100 opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 text-xs font-mono">
            <span className="animate-pulse">LOAD</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-r p-4 flex items-center shadow-md">
        <div className="rounded-full bg-red-500 p-1.5 mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <span className="text-red-700 font-medium">Kesalahan: {error}</span>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-8">
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Dasbor</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-50 rounded-full opacity-70 filter blur-3xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/70 rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="flex h-full">
            <div className="w-2.5 bg-blue-600"></div>
            <div className="p-6 flex-1">
              <div className="flex items-baseline">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Total Pengguna</h3>
                <div className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Aktif</div>
              </div>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{dashboardData.total_users}</p>
              <div className="mt-4 flex items-center text-blue-700 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Pengguna terdaftar dalam sistem</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100/70 rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="flex h-full">
            <div className="w-2.5 bg-green-500"></div>
            <div className="p-6 flex-1">
              <div className="flex items-baseline">
                <h3 className="text-lg font-semibold text-green-800 mb-1">Total Deteksi</h3>
                <div className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Tersimpan</div>
              </div>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">{dashboardData.total_detections}</p>
              <div className="mt-4 flex items-center text-green-700 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Total deteksi bendera berhasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Deteksi Terbaru</h3>
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="animate-pulse h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
            Realtime
          </div>
        </div>
        
        {dashboardData.recent_detections && dashboardData.recent_detections.length > 0 ? (
          <div className="overflow-hidden rounded-xl shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-indigo-900 uppercase tracking-tight">ID</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-indigo-900 uppercase tracking-tight">Pengguna</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-indigo-900 uppercase tracking-tight">Bendera Terdeteksi</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-indigo-900 uppercase tracking-tight">Keyakinan</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-indigo-900 uppercase tracking-tight">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {dashboardData.recent_detections.map((detection, index) => (
                    <tr 
                      key={detection.id} 
                      className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'}`}
                    >
                      <td className="py-3.5 px-6 font-mono text-sm text-gray-700">#{detection.id}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium mr-3">
                            {detection.user_id ? 'U' : 'G'}
                          </div>
                          <span className="text-gray-800">{detection.user_id ? `Pengguna #${detection.user_id}` : 'Tamu'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          {detection.country_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                              style={{ width: `${Math.round(detection.confidence * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-medium">{Math.round(detection.confidence * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-sm text-gray-600 font-mono">
                          {new Date(detection.timestamp).toLocaleString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-center">Belum ada data deteksi terbaru tersedia</p>
            <p className="text-gray-400 text-sm text-center mt-1">Deteksi bendera baru akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}