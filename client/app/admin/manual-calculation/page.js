"use client";
import { useState } from "react";
import { UploadCloud, AlertCircle, Check, ArrowRight, BookOpen } from "lucide-react";

export default function ManualCalculationPage() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
    setResults(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/manual-calculation', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Kalkulasi manual gagal');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Terjadi kesalahan selama proses kalkulasi: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/60 to-sky-50/70 rounded-3xl p-6 relative overflow-hidden">
      {/* Elemen dekoratif */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-200/20 to-blue-200/30 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-purple-200/20 to-indigo-300/30 rounded-full blur-3xl opacity-60"></div>
      </div>
      
      {/* Bagian Header */}
      <div className="relative mb-12 border-b border-indigo-100/80 pb-6">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl"></div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 tracking-tight relative z-10">
          Kalkulasi Manual Deteksi Bendera
        </h1>
        <p className="text-indigo-700/70 mt-3 max-w-3xl">
          Gunakan halaman ini untuk mengunggah gambar bendera dan melihat proses kalkulasi manual yang mensimulasikan cara kerja model deteksi.
        </p>
        <div className="absolute top-0 right-0 h-10 w-28 bg-gradient-to-r from-indigo-500/10 to-sky-500/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Bagian Unggah */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/50 hover:border-indigo-200/70 transition-all">
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              dragActive ? 'bg-indigo-50/80 border-indigo-400' : 'border-indigo-200/60 hover:border-indigo-300/80'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="fileInput"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
            <div className="flex flex-col items-center justify-center py-6">
              <UploadCloud size={48} className="text-indigo-500 mb-4" strokeWidth={1.5} />
              <p className="text-gray-700 mb-3 font-medium">
                <span className="text-indigo-600">Klik untuk memilih</span> atau tarik dan lepas gambar
              </p>
              <p className="text-gray-500 text-sm">
                Format yang didukung: JPG, PNG (maks 10MB)
              </p>
              
              <button 
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="mt-5 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-medium text-sm"
              >
                Pilih Gambar
              </button>
            </div>
          </div>
          
          {/* Pratinjau Gambar */}
          {imagePreview && (
            <div className="mt-8 bg-gradient-to-br from-indigo-50/50 to-sky-50/50 rounded-xl p-5 border border-indigo-100/50">
              <h2 className="text-lg font-medium text-indigo-700 mb-4 flex items-center">
                <Check size={18} className="mr-2 text-green-500" />
                Pratinjau Gambar
              </h2>
              <div className="relative rounded-lg overflow-hidden bg-white shadow-inner border border-indigo-100/50">
                <img 
                  src={imagePreview} 
                  alt="Pratinjau bendera" 
                  className="max-h-80 object-contain mx-auto"
                />
                {file && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2 text-xs text-gray-600 flex justify-between">
                    <span className="font-medium">{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}
              </div>
              
              <div className="mt-5 flex justify-end">
                <button 
                  type="submit" 
                  disabled={!file || loading}
                  className={`
                    flex items-center px-6 py-3 rounded-xl font-medium text-white shadow-md
                    ${loading 
                      ? 'bg-indigo-400 cursor-wait' 
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:translate-y-[-2px] hover:shadow-lg transition-all'}
                  `}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Mulai Kalkulasi Manual
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
      
      {/* Pesan Error */}
      {error && (
        <div className="mb-8 bg-red-50/70 backdrop-blur-sm border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-red-800 mb-1">Kesalahan</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Bagian Hasil */}
      {results && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50/70 to-transparent p-4 rounded-l-full">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600">
                Hasil Kalkulasi Manual
              </h2>
              <p className="text-gray-600 text-sm">Analisis komprehensif dari model deteksi</p>
            </div>
          </div>

          {/* Deteksi Model */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full opacity-70 -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>
            <h3 className="text-xl font-bold text-indigo-950 mb-4 relative z-10">Deteksi Model</h3>
            
            {results.model_prediction.predictions && results.model_prediction.predictions.length > 0 ? (
              <div className="bg-indigo-50/70 backdrop-blur-sm rounded-xl p-5 border border-indigo-100/80 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Check size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Bendera terdeteksi:</p>
                    <h4 className="text-2xl font-bold text-indigo-900">
                      {results.model_prediction.predictions[0].class}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Tingkat Keyakinan</p>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {(results.model_prediction.predictions[0].confidence * 100).toFixed(2)}
                    </span>
                    <span className="text-lg text-indigo-900 ml-1">%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50/70 backdrop-blur-sm rounded-xl p-5 border border-yellow-100/80">
                <p className="text-yellow-700">Tidak ada bendera terdeteksi oleh model.</p>
              </div>
            )}
          </div>

          {/* Bagian untuk hasil kalkulasi - menggunakan desain kartu modern untuk masing-masing */}
          {/* 1. Bagian Analisis Input */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-indigo-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                1
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Analisis Input Gambar</h3>
            </div>
            
            <p className="text-gray-700 mb-4">
              Dimensi: <span className="font-medium">{results.manual_calculation.input_analysis.image_dimensions}</span>
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Posisi</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Nilai R</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Nilai G</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Nilai B</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Tipe Warna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {results.manual_calculation.input_analysis.pixel_samples.slice(0, 5).map((sample, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}>
                      <td className="py-2 px-4 text-sm text-gray-700">{sample.position}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{sample.r}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{sample.g}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{sample.b}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{sample.color_type}</td>
                    </tr>
                  ))}
                  {results.manual_calculation.input_analysis.pixel_samples.length > 5 && (
                    <tr className="bg-indigo-50/50">
                      <td colSpan="5" className="py-2 px-4 text-sm text-indigo-600 font-medium text-center">
                        ... {results.manual_calculation.input_analysis.pixel_samples.length - 5} sampel lainnya
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Styling untuk bagian yang tersisa - pola kartu modern serupa dengan warna aksen unik */}
          {/* 2. Bagian Analisis Warna */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-blue-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                2
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Analisis Warna</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Warna</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Persentase</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Persentase yang Diharapkan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {Object.entries(results.manual_calculation.color_analysis.color_percentages)
                    .filter(([color, pct]) => pct > 1) // Hanya tampilkan warna dengan > 1%
                    .sort(([, a], [, b]) => b - a) // Urutkan berdasarkan persentase desc
                    .map(([color, percentage], idx) => (
                      <tr key={color} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                        <td className="py-2 px-4 text-sm text-gray-700">{color}</td>
                        <td className="py-2 px-4 text-sm font-medium text-gray-700">{percentage}%</td>
                        <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.color_analysis.expected_distribution[color] || 'N/A'}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Operasi Konvolusi */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-purple-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                3
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Operasi Konvolusi</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50/70 rounded-xl p-4 border border-purple-100">
                <p className="text-sm font-medium text-purple-800 mb-2">Kernel untuk deteksi tepi horizontal:</p>
                <p className="font-mono text-sm text-gray-700 bg-white/70 p-2 rounded-md shadow-sm">
                  {JSON.stringify(results.manual_calculation.convolution.kernels.horizontal_edge)}
                </p>
              </div>
              
              <div className="bg-purple-50/70 rounded-xl p-4 border border-purple-100">
                <p className="text-sm font-medium text-purple-800 mb-2">Kernel untuk deteksi tepi vertikal:</p>
                <p className="font-mono text-sm text-gray-700 bg-white/70 p-2 rounded-md shadow-sm">
                  {JSON.stringify(results.manual_calculation.convolution.kernels.vertical_edge)}
                </p>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-indigo-800 mb-3">Contoh Hasil Konvolusi:</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Region</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Output Horizontal</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Output Vertikal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {results.manual_calculation.convolution.sample_results.map((result, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}>
                      <td className="py-2 px-4 text-sm text-gray-700">{result.region}</td>
                      <td className="py-2 px-4 text-sm font-mono text-gray-700">{result.horizontal_output}</td>
                      <td className="py-2 px-4 text-sm font-mono text-gray-700">{result.vertical_output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Feature Maps & Pooling */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-blue-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                4
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Feature Maps & Pooling</h3>
            </div>
            
            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100/70 mb-6">
              <p className="text-gray-700">
                Feature maps menangkap pola seperti tepi, tekstur, dan transisi warna. Pada CNN sesungguhnya, 
                layer awal mendeteksi fitur sederhana sedangkan layer yang lebih dalam mendeteksi pola yang
                lebih kompleks. Pooling mengurangi dimensi sambil mempertahankan fitur penting.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-50 to-sky-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Region</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Nilai Feature</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Nilai Max (Pooling)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {results.manual_calculation.feature_maps.pooling_results.map((result, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                      <td className="py-2 px-4 text-sm text-gray-700">{result.region}</td>
                      <td className="py-2 px-4 text-sm font-mono text-gray-700">{JSON.stringify(result.feature_values)}</td>
                      <td className="py-2 px-4 text-sm font-medium text-gray-700">{result.max_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Kalkulasi Bounding Box */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-green-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                5
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Kalkulasi Bounding Box</h3>
            </div>
            
            <div className="bg-green-50/70 rounded-xl p-4 border border-green-100/70 mb-6">
              <p className="text-gray-700">
                Grid cell: Lokasi dalam feature map 13x13. (x,y)_center: Posisi relatif terhadap grid cell. 
                width/height: Ukuran relatif terhadap gambar. YOLOv8 memprediksi bounding box dengan mempelajari 
                offset dari anchor box di setiap grid cell.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Grid Cell</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">x center</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">y center</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">width</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">height</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Objektifitas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="py-2 px-4 text-sm font-mono text-gray-700">{JSON.stringify(results.manual_calculation.bounding_box.grid_cell)}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.bounding_box.x_center}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.bounding_box.y_center}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.bounding_box.width}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.bounding_box.height}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.bounding_box.objectness}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Probabilitas Kelas */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-amber-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                6
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Probabilitas Kelas</h3>
            </div>
            
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-100/70 mb-6">
              <p className="text-gray-700">
                Probabilitas dihitung berdasarkan kecocokan distribusi warna dengan bendera yang diketahui.
                Klasifikasi warna HSV dan pengelompokan warna dominan digunakan untuk meningkatkan akurasi.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Kelas</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Probabilitas</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {results.manual_calculation.class_probabilities.sorted_probabilities.map(([class_name, prob], idx) => (
                    <tr key={class_name} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                      <td className="py-2 px-4 text-sm font-medium text-gray-700">{class_name}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-3 max-w-[200px]">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{ width: `${prob * 100}%` }}></div>
                          </div>
                          {(prob * 100).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-700">{results.manual_calculation.class_probabilities.notes[class_name]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Pencocokan Pola */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-indigo-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                7
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Pencocokan Pola</h3>
            </div>
            
            <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100/70 mb-6">
              <p className="text-gray-700">
                <span className="font-medium">Pola yang diharapkan:</span> {results.manual_calculation.pattern_matching.expected_pattern}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-indigo-50 to-violet-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Fitur</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {Object.entries(results.manual_calculation.pattern_matching.component_scores).map(([feature, score], idx) => (
                    <tr key={feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}>
                      <td className="py-2 px-4 text-sm text-gray-700">{feature}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{score}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-100/50">
                    <td className="py-3 px-4 text-sm font-medium text-indigo-800">Skor Pola</td>
                    <td className="py-3 px-4 text-sm font-medium text-indigo-800">{results.manual_calculation.pattern_matching.pattern_score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. Analisis Bentuk */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-teal-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                8
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Analisis Bentuk</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-teal-50/70 rounded-xl p-4 border border-teal-100/70">
                <p className="text-gray-700">
                  <span className="font-medium">Rasio aspek aktual:</span> {results.manual_calculation.shape_analysis.actual_aspect_ratio}
                </p>
              </div>
              
              <div className="bg-teal-50/70 rounded-xl p-4 border border-teal-100/70">
                <p className="text-gray-700">
                  <span className="font-medium">Rasio aspek yang diharapkan:</span> {results.manual_calculation.shape_analysis.expected_aspect_ratio}
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider">Fitur Bentuk</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-teal-700 uppercase tracking-wider">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50">
                  {Object.entries(results.manual_calculation.shape_analysis.shape_features).map(([feature, score], idx) => (
                    <tr key={feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-teal-50/30'}>
                      <td className="py-2 px-4 text-sm text-gray-700">{feature}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{score}</td>
                    </tr>
                  ))}
                  <tr className="bg-teal-100/50">
                    <td className="py-3 px-4 text-sm font-medium text-teal-800">Skor Bentuk</td>
                    <td className="py-3 px-4 text-sm font-medium text-teal-800">{results.manual_calculation.shape_analysis.shape_score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 9. Non-Maximum Suppression */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-blue-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                9
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Non-Maximum Suppression</h3>
            </div>
            
            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100/70 mb-6">
              <p className="text-gray-700">
                Non-Maximum Suppression menghapus kotak yang tumpang tindih, hanya menyimpan deteksi dengan keyakinan tertinggi.
                Dalam deteksi objek, NMS mencegah deteksi duplikat dari objek yang sama.
              </p>
            </div>
            
            {results.manual_calculation.nms.boxes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">ID Kotak</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Keyakinan</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">IoU dengan Sebelumnya</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Ambang Batas</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Simpan?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {results.manual_calculation.nms.boxes.map((box, idx) => (
                      <tr key={box.box_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                        <td className="py-2 px-4 text-sm text-gray-700">{box.box_id}</td>
                        <td className="py-2 px-4 text-sm text-gray-700">{box.confidence}</td>
                        <td className="py-2 px-4 text-sm text-gray-700">{box.iou_with_previous}</td>
                        <td className="py-2 px-4 text-sm text-gray-700">{box.threshold}</td>
                        <td className="py-2 px-4 text-sm text-gray-700">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${box.keep ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {box.keep ? '✓' : '✗'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-600 text-center">
                Tidak ada bounding box untuk proses NMS
              </div>
            )}
          </div>

          {/* 10. Kalkulasi Keyakinan Akhir */}
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/60 hover:border-green-100 transition-all">
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                10
              </div>
              <h3 className="text-xl font-bold text-indigo-950">Kalkulasi Keyakinan Akhir</h3>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Komponen</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Nilai</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Penjelasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {results.manual_calculation.final_confidence.component_scores.map((component, idx) => (
                    <tr key={component.component} className={idx % 2 === 0 ? 'bg-white' : 'bg-green-50/30'}>
                      <td className="py-2 px-4 text-sm font-medium text-gray-700">{component.component}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{component.value}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{component.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-blue-100/20">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Keyakinan Akhir:</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {results.manual_calculation.final_confidence.confidence_pct}
                </div>
              </div>
              <p className="text-gray-700 mt-3">
                Keyakinan akhir dihitung menggunakan rata-rata geometris tertimbang dari semua skor komponen, 
                mirip dengan bagaimana jaringan saraf menggabungkan keyakinan fitur tetapi dalam bentuk yang 
                jauh lebih sederhana.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}