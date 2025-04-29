import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Decorative elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 bg-blue-300/30 dark:bg-blue-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-20 w-96 h-96 bg-indigo-100/50 dark:bg-indigo-700/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero section */}
      <div className="relative pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 text-transparent bg-clip-text">
                Pendeteksi Bendera ASEAN
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Alat berbasis kecerdasan buatan untuk mengidentifikasi dan mengenali bendera dari negara-negara ASEAN dengan presisi tinggi.
              </p>
              <div className="mt-6">
                <Link 
                  href="/detect" 
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 text-white font-medium px-8 py-3 rounded-lg text-lg shadow-md hover:translate-y-[-8px] transition-all duration-300"
                >
                  Coba Deteksi Bendera
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Hero image with decoration */}
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/70 to-transparent rounded-2xl -rotate-12 blur-2xl transform scale-105 -z-10"></div>
              <div className="relative group">
                <div className="absolute -inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-70 blur group-hover:opacity-100 transition duration-700 group-hover:duration-200"></div>
                <div className="relative">
                  <Image 
                    src="/hero-image.jpg" 
                    alt="Bendera ASEAN" 
                    width={600} 
                    height={400} 
                    className="rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container mx-auto px-4 max-w-5xl py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* How it works card */}
          <div className="group relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-top-left"></div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 text-transparent bg-clip-text">
              Cara Kerjanya
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Unggah gambar yang berisi bendera negara ASEAN. Model AI kami akan menganalisis gambar dan mengidentifikasi bendera yang ada, beserta skor kepercayaan untuk setiap deteksi.
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-100/70 dark:bg-blue-900/20 rounded-tl-2xl blur-lg -z-10"></div>
          </div>

          {/* Supported flags card */}
          <div className="group relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-top-left"></div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Bendera yang Didukung
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Detektor ini dapat mengenali bendera dari 10 negara anggota ASEAN: Brunei, Kamboja, Indonesia, Laos, Malaysia, Myanmar, Filipina, Singapura, Thailand, dan Vietnam.
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-100/70 dark:bg-green-900/20 rounded-tl-2xl blur-lg -z-10"></div>
          </div>
        </div>
      </div>
    </main>
  );
}