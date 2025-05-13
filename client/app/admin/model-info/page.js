'use client';

import { useState, useEffect } from 'react';

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('metadata');

  useEffect(() => {
    async function fetchModelData() {
      setLoading(true);
      try {
        // Fetch model metadata
        const infoResponse = await fetch('http://localhost:5000/api/admin/model-info', {
          credentials: 'include'
        });
        
        if (!infoResponse.ok) {
          throw new Error('Gagal mengambil informasi model');
        }
        
        const infoData = await infoResponse.json();
        setModelInfo(infoData);
        
        // Fetch model metrics
        const metricsResponse = await fetch('http://localhost:5000/api/admin/model-metrics', {
          credentials: 'include'
        });
        
        if (!metricsResponse.ok) {
          throw new Error('Gagal mengambil metrik model');
        }
        
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
        
      } catch (err) {
        console.error('Error fetching model data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchModelData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="relative">
          {/* Animated loading spinner with multiple rings */}
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 opacity-30 animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute inset-0 rounded-full border-l-2 border-r-2 border-blue-500 opacity-30 animate-[spin_2s_linear_infinite_reverse]" style={{animationDelay: "0.2s"}}></div>
          <div className="h-20 w-20 rounded-full border-4 border-indigo-100/30 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-r-blue-600 border-b-indigo-300 border-l-blue-300 animate-spin"></div>
          </div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-indigo-600 text-sm font-medium whitespace-nowrap">Memuat Data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-5 rounded-lg shadow-md backdrop-blur-sm">
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Terjadi Kesalahan</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <p className="mt-2 text-sm text-red-600">Harap muat ulang halaman atau hubungi administrator sistem</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!modelInfo || !metrics) return null;
  
  return (
    <div className="space-y-8">
      {/* Header with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 p-8 rounded-2xl shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Informasi Model</h2>
          </div>
          <p className="text-indigo-100 text-lg">Detail lengkap tentang model pendeteksi bendera</p>
        </div>
      </div>
      
      {/* Innovative tab design with glowing effect */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
          <nav className="flex overflow-x-auto py-2 px-2">
            {[
              { id: 'metadata', label: 'Metadata Model' },
              { id: 'metrics', label: 'Metrik Pelatihan' },
              { id: 'class', label: 'Performa Kelas' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 mx-1 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {activeTab === tab.id && (
                  <span className="absolute inset-0 rounded-xl bg-indigo-600 animate-pulse opacity-30 blur-md"></span>
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'metadata' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Model card with floating design */}
                <div className="group relative bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-0 right-0 bg-white/30 w-32 h-32 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 bg-white/20 w-32 h-32 rounded-full blur-2xl"></div>
                  </div>
                  <div className="relative p-6 text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      {modelInfo.model_name}
                    </h3>
                    <div className="space-y-3 bg-white/10 backdrop-blur-md rounded-xl p-5">
                      <div className="flex justify-between">
                        <span className="text-indigo-100">Versi:</span>
                        <span className="font-medium">{modelInfo.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-100">Arsitektur:</span>
                        <span className="font-medium">{modelInfo.architecture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-100">Framework:</span>
                        <span className="font-medium">{modelInfo.framework}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-100">Ukuran Input:</span>
                        <span className="font-medium">{modelInfo.input_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-100">Tanggal Pelatihan:</span>
                        <span className="font-medium">{modelInfo.training_date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Performance card with animated bars */}
                <div className="flex flex-col p-6 bg-white rounded-2xl border border-indigo-100 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-4">Ringkasan Performa</h3>
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Presisi</span>
                        <span className="font-semibold text-indigo-600">{modelInfo.precision}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-[pulse_4s_ease-in-out_infinite] transition-all duration-500"
                          style={{ width: modelInfo.precision }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Recall</span>
                        <span className="font-semibold text-indigo-600">{modelInfo.recall}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full animate-[pulse_4s_ease-in-out_infinite] transition-all duration-500" 
                          style={{ width: modelInfo.recall, animationDelay: "0.5s" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">mAP50</span>
                        <span className="font-semibold text-indigo-600">{modelInfo.mAP50}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-fuchsia-600 h-full rounded-full animate-[pulse_4s_ease-in-out_infinite] transition-all duration-500" 
                          style={{ width: modelInfo.mAP50, animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-indigo-100">
                      <div className="flex items-center text-sm text-indigo-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Dilatih pada {modelInfo.trained_on}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Supported classes with modern chip design */}
              <div className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Kelas yang Didukung
                </h3>
                <div className="flex flex-wrap gap-3">
                  {modelInfo.classes.map((className, index) => (
                    <div 
                      key={index}
                      className="group relative px-4 py-2 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-full text-indigo-800 text-sm font-medium transition-all duration-300 hover:shadow-md hover:border-indigo-300 hover:from-indigo-100 hover:to-blue-100"
                    >
                      <span className="absolute inset-0 rounded-full bg-indigo-500/5 transform scale-0 group-hover:scale-100 transition-transform"></span>
                      <span className="relative">{className}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Description with decorative quote styling */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Deskripsi
                </h3>
                <div className="relative">
                  <svg className="absolute top-0 left-0 h-8 w-8 text-indigo-300/40 -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-indigo-900 pl-5 italic">
                    {modelInfo.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'metrics' && (
            <div className="space-y-8">
              {/* Stats cards with floating effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: "Epoch Pelatihan", 
                    value: metrics.epochs,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    ),
                    bgClass: "from-indigo-600 to-blue-700",
                  },
                  { 
                    title: "Ukuran Batch", 
                    value: metrics.batch_size,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    ),
                    bgClass: "from-blue-600 to-cyan-700", 
                  },
                  { 
                    title: "Optimizer", 
                    value: metrics.optimizer,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    bgClass: "from-emerald-600 to-green-700", 
                  },
                  { 
                    title: "Hardware Pelatihan", 
                    value: metrics.training_hardware,
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    ),
                    bgClass: "from-amber-500 to-yellow-600", 
                  }
                ].map((stat, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgClass} opacity-90`}></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative p-6 text-white">
                      <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        {stat.icon}
                      </div>
                      <h4 className="text-lg font-medium mb-1">{stat.title}</h4>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Learning rate and training time with modern UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-md backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    Learning Rate
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                      <span className="font-medium">Awal: </span>
                      <span>{metrics.initial_learning_rate}</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-indigo-100 mx-4 h-0"></div>
                    <div className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                      <span className="font-medium">Akhir: </span>
                      <span>{metrics.final_learning_rate}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-300 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-md backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Waktu Pelatihan
                  </h3>
                  <div className="flex items-center justify-center py-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-8 border-indigo-100"></div>
                      <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-indigo-500 transform rotate-45"></div>
                      <div className="text-4xl font-bold text-center text-indigo-700 p-6">
                        {metrics.training_time_hours}
                        <div className="text-sm font-normal text-indigo-500 mt-1">Jam</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Augmentations with modern chip design */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Augmentasi yang Digunakan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {metrics.augmentations_used.map((aug, index) => (
                    <div 
                      key={index}
                      className="group relative flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-full shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="absolute inset-0 bg-indigo-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-indigo-900 relative">{aug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'class' && (
            <div className="space-y-8">
              {/* Performance table with hover effects */}
              <div className="overflow-hidden rounded-2xl shadow-lg border border-indigo-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-left">
                        <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider">Negara</th>
                        <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider">Presisi</th>
                        <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider">Recall</th>
                        <th className="px-6 py-4 text-xs font-medium text-white uppercase tracking-wider">F1 Score</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-indigo-50">
                      {modelInfo.classes.map((country, index) => (
                        <tr key={index} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{country}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-100 rounded-full h-2.5 mr-2 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-in-out" 
                                  style={{ width: `${metrics.precision_by_class[country] * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-black text-sm font-medium">{Math.round(metrics.precision_by_class[country] * 100)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-100 rounded-full h-2.5 mr-2 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-in-out" 
                                  style={{ width: `${metrics.recall_by_class[country] * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-black text-sm font-medium">{Math.round(metrics.recall_by_class[country] * 100)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-100 rounded-full h-2.5 mr-2 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500 ease-in-out" 
                                  style={{ width: `${metrics.f1_by_class[country] * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-black text-sm font-medium">{Math.round(metrics.f1_by_class[country] * 100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Performance insight with modern glass card design */}
              <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">Wawasan Performa</h3>
                <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-white/60">
                  <p className="text-indigo-900 leading-relaxed">
                    Model ini menunjukkan performa terbaik dalam mendeteksi bendera Singapura dengan skor F1 {Math.round(metrics.f1_by_class["Singapore"] * 100)}%, 
                    sementara bendera Laos memiliki akurasi terendah dengan skor F1 {Math.round(metrics.f1_by_class["Laos"] * 100)}%. 
                    Hal ini kemungkinan disebabkan oleh fitur-fitur khas pada bendera Singapura dibandingkan dengan pola yang lebih kompleks pada bendera Laos.
                  </p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <div className="inline-flex items-center space-x-2 bg-indigo-100/70 backdrop-blur-sm text-indigo-800 px-4 py-2 rounded-full text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Model secara rutin menjalani pelatihan ulang untuk meningkatkan akurasi semua kelas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}