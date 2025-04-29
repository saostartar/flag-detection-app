'use client';

import { useState, useEffect } from 'react';

export default function DetectionLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/detection-logs?page=${page}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengambil log deteksi');
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

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  if (loading && !logs.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 opacity-30"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 absolute top-0 left-0 animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-indigo-600 font-medium whitespace-nowrap">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100/70 border-l-4 border-red-500 rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700 font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 tracking-tight mb-1">Log Deteksi</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        <div className="bg-indigo-100/50 px-4 py-2 rounded-full text-indigo-700 text-sm font-medium">
          Total: {pagination.totalItems} entri
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-indigo-100 overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-800">
                <th className="py-3 px-6 text-left font-semibold">ID</th>
                <th className="py-3 px-6 text-left font-semibold">Pengguna</th>
                <th className="py-3 px-6 text-left font-semibold">Bendera Terdeteksi</th>
                <th className="py-3 px-6 text-left font-semibold">Akurasi</th>
                <th className="py-3 px-6 text-left font-semibold">Alamat IP</th>
                <th className="py-3 px-6 text-left font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-indigo-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-gray-700">{log.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-medium text-sm">
                          {log.user_id ? log.user_id : 'G'}
                        </span>
                      </div>
                      <span className="text-gray-800">{log.user_id ? `Pengguna #${log.user_id}` : 'Tamu'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{log.country_name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            log.confidence > 0.7 ? 'bg-green-500' : 
                            log.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.round(log.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700 font-medium">{Math.round(log.confidence * 100)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-600">{log.ip_address || 'N/A'}</td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {logs.length === 0 && (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">Tidak ada data log deteksi yang ditemukan</p>
          </div>
        )}
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="bg-white/90 rounded-xl shadow-sm border border-indigo-100 p-2 inline-flex items-center">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                pagination.currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
              aria-label="Halaman sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex px-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg mx-1 font-medium transition-all ${
                    pagination.currentPage === page
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-indigo-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                pagination.currentPage === pagination.totalPages
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
              aria-label="Halaman berikutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}