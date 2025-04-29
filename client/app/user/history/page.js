'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserHistory() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchLogs();
    }
  }, [user, authLoading, router]);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/user/detection-logs?page=${page}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengambil riwayat deteksi');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setPagination({
        currentPage: data.current_page,
        totalPages: data.pages,
        totalItems: data.total
      });
    } catch (err) {
      console.error('Error fetching detection logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  // Function to get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-blue-500";
    if (confidence >= 0.5) return "bg-yellow-400";
    return "bg-red-500";
  };

  // Function to format date in Indonesian
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (authLoading || (loading && !logs.length)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-r-2 border-l-2 border-transparent border-dashed animate-spin" style={{animationDirection: 'reverse'}}></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">Memuat Riwayat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100/70 dark:bg-red-900/20 backdrop-blur-sm border-l-4 border-red-400 dark:border-red-400 rounded-md p-4 mb-6 flex items-center shadow">
        <svg className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Terjadi Kesalahan</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header section */}
      <div className="mb-8 relative">
        <div className="absolute -top-1 left-0 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 mb-2">
          Riwayat Deteksi Saya
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Temukan seluruh catatan bendera yang telah Anda identifikasi sebelumnya dengan sistem deteksi cerdas kami.
        </p>
      </div>
      
      {logs.length === 0 ? (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-8 text-center shadow-md border border-gray-200 dark:border-gray-800">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="text-xl font-medium mb-2">Belum Ada Riwayat Deteksi</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Anda belum pernah melakukan deteksi bendera. Silakan coba fitur deteksi kami.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow hover:shadow-lg transform hover:translate-y-[-8px] duration-300"
          >
            Mulai Deteksi Sekarang
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-100/70 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-500">
                Menampilkan {logs.length} dari {pagination.totalItems} riwayat
              </span>
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                defaultValue="terbaru"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="akurasi">Akurasi Tertinggi</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Grid of detection cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {logs.map((log) => {
              const confidencePercent = Math.round(log.confidence * 100);
              const confidenceColor = getConfidenceColor(log.confidence);
              
              return (
                <div 
                  key={log.id} 
                  className="bg-white dark:bg-gray-800/70 rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 group hover:scale-[1.02]"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                          {log.flag_detected}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {log.id}
                        </p>
                      </div>
                      <span className="bg-gray-100 dark:bg-gray-700/50 rounded-full h-8 w-8 flex items-center justify-center text-gray-700 dark:text-gray-300 font-mono text-xs">
                        #{log.id.toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tingkat Kepercayaan</p>
                      <div className="flex items-center">
                        <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${confidenceColor} transition-all duration-700`} 
                            style={{ width: `${confidencePercent}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${confidencePercent >= 90 ? 'text-green-700 dark:text-green-400' : confidencePercent >= 70 ? 'text-blue-700 dark:text-blue-400' : confidencePercent >= 50 ? 'text-yellow-400' : 'text-red-700 dark:text-red-400'}`}>
                          {confidencePercent}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                  
                  <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
              );
            })}
          </div>
          
          {/* Enhanced pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10 mb-4">
              <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-1 border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className={`p-2 rounded-l-lg ${
                    pagination.currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  } transition-colors`}
                  aria-label="Halaman pertama"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                  </svg>
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`p-2 ${
                    pagination.currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  } transition-colors`}
                  aria-label="Halaman sebelumnya"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                
                <div className="px-4 flex items-center">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show current page, first, last, and pages near current
                      return page === 1 || 
                             page === pagination.totalPages || 
                             (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1);
                    })
                    .map((page, index, array) => (
                      <>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} className="mx-1 text-gray-500 dark:text-gray-400">...</span>
                        )}
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 mx-1 rounded-full transition-all ${
                            pagination.currentPage === page
                              ? 'bg-blue-600 text-white shadow'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      </>
                    ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`p-2 ${
                    pagination.currentPage === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  } transition-colors`}
                  aria-label="Halaman berikutnya"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`p-2 rounded-r-lg ${
                    pagination.currentPage === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  } transition-colors`}
                  aria-label="Halaman terakhir"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Summary pill */}
          <div className="text-center mt-8">
            <span className="inline-flex items-center px-4 py-2 bg-green-100/70 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
              Total {pagination.totalItems} deteksi bendera telah dilakukan
            </span>
          </div>
        </>
      )}
    </div>
  );
}