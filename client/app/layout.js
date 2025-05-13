
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pendeteksi Bendera ASEAN",
  description: "Aplikasi berbasis AI untuk mendeteksi dan mengidentifikasi bendera negara ASEAN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans selection:bg-blue-100/70 dark:selection:bg-blue-900/20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 -right-16 h-[110%] w-72 blur-3xl bg-blue-100/70 dark:bg-blue-900/20 rounded-full transform rotate-12 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute -left-20 -bottom-16 h-72 w-72 blur-3xl bg-indigo-100 dark:bg-indigo-700/20 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-48 w-96 blur-3xl bg-green-100 dark:bg-green-900/20 -translate-y-1/4 rounded-full"></div>
        </div>
        
        <AuthProvider>
          <div className="relative z-10">
            <header className="relative z-50">
              <Navbar />
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative">
              <div className="relative">
                {/* Decorative accent */}
                <div className="absolute -top-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                
                {/* Page content container */}
                <div className="mt-10 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50 dark:border-gray-800">
                  <div className="space-y-6">
                    {children}
                  </div>
                </div>
              </div>
            </main>
            
            <footer className="mt-20 pb-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© 2025 Pendeteksi Bendera ASEAN. Seluruh hak cipta dilindungi.</p>
              <p className="mt-2">Dibuat dengan teknologi AI untuk identifikasi bendera negara-negara ASEAN dengan akurasi tinggi.</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}