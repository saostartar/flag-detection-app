'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, AlertCircle, Check } from 'lucide-react';

export default function DetectPage() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Terjadi kesalahan selama proses deteksi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-16 h-[110%] w-72 blur-3xl bg-blue-100/70 dark:bg-blue-900/20 rounded-full transform rotate-12 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -left-20 -bottom-16 h-72 w-72 blur-3xl bg-indigo-100 dark:bg-indigo-700/20 rounded-full"></div>
      </div>
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors mb-4 group"
          >
            <span className="w-6 h-6 flex items-center justify-center mr-2 bg-blue-100 dark:bg-blue-900/20 rounded-full group-hover:translate-x-[-8px] transition-transform">
              <ArrowLeft size={14} />
            </span>
            <span>Kembali ke Beranda</span>
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold mt-6 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 text-transparent bg-clip-text">
            Pendeteksi Bendera
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Unggah gambar bendera dan sistem kami akan mengidentifikasinya untuk Anda
          </p>
        </div>
        
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 backdrop-blur-sm border border-white/50 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-700 dark:text-gray-300 font-medium block mb-2">
                Unggah Gambar Bendera
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="fileInput"
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-medium">Klik untuk memilih</span> atau tarik dan lepas gambar
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Format yang didukung: JPG, PNG, WEBP (maks 10MB)
                  </p>
                  
                  <button 
                    type="button"
                    onClick={() => document.getElementById('fileInput').click()}
                    className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700/20 transition-colors"
                  >
                    Pilih Gambar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Preview Section */}
            {imagePreview && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">Pratinjau:</p>
                <div className="relative min-h-[300px] w-full rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/70 flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Pratinjau" 
                    className="max-h-96 max-w-full object-cover"
                  />
                  
                  {file && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-3 text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                      <span>{file.name}</span>
                      <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button 
                type="submit" 
                disabled={!file || loading} 
                className={`${
                  !file ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed' : 
                  loading ? 'bg-blue-500 dark:bg-blue-700' : 
                  'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                } text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-md`}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Deteksi Bendera</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Results Display */}
        {result && (
          <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-white/50 dark:border-gray-800 transition-all">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <Check className="w-5 h-5 text-green-700 dark:text-green-400 mr-2" />
              Hasil Deteksi:
            </h2>
            
            {result.predictions && result.predictions.length > 0 ? (
              <div className="space-y-4">
                {result.predictions.map((pred, idx) => {
                  const confidence = (pred.confidence * 100).toFixed(2);
                  const colorClass = 
                    confidence > 80 ? 'from-green-400 to-blue-500' : 
                    confidence > 60 ? 'from-blue-500 to-indigo-600' : 
                    confidence > 40 ? 'from-yellow-400 to-red-500' : 'from-red-500 to-red-700';
                    
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {pred.class}
                        </p>
                        <span className={`text-sm font-medium bg-gradient-to-r ${colorClass} text-transparent bg-clip-text`}>
                          {confidence}%
                        </span>
                      </div>
                      
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-600 dark:text-gray-400">
                  Tidak ada bendera yang terdeteksi
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Sistem Pendeteksi Bendera &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">
            Untuk hasil terbaik, gunakan gambar bendera dengan resolusi tinggi dan pencahayaan yang baik
          </p>
        </div>
      </main>
    </div>
  );
}