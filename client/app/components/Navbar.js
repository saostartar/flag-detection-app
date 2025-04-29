'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/');
    }
  };

  const handleAdminClick = () => {
    router.push('/admin/dashboard');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-800 shadow-md' 
        : 'bg-transparent text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-red-500 to-yellow-400 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-blue-700' : 'text-white'
            }`}>
              Pendeteksi Bendera
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink href="/detect" scrolled={scrolled}>
              Deteksi
            </NavLink>
            
            {user ? (
              <>
                <NavLink href="/user/history" scrolled={scrolled}>
                  Riwayat Saya
                </NavLink>
                
                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Admin
                  </button>
                )}
                
                <div className="relative ml-2 group">
                  <button className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                    scrolled
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } transition-all duration-200`}>
                    <span className="text-sm font-medium">{user.username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" scrolled={scrolled} outline={true}>
                  Masuk
                </NavLink>
                <NavLink href="/register" scrolled={scrolled} filled={true}>
                  Daftar
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, scrolled, outline, filled }) {
  const baseStyles = "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200";
  
  let styles = baseStyles;
  
  if (filled) {
    styles += scrolled
      ? " bg-blue-600 text-white hover:bg-blue-700"
      : " bg-white text-blue-600 hover:bg-blue-50";
  } else if (outline) {
    styles += scrolled
      ? " border border-gray-300 hover:bg-gray-100"
      : " border border-white/50 text-white hover:bg-white/10";
  } else {
    styles += scrolled
      ? " text-gray-700 hover:bg-gray-100"
      : " text-white/90 hover:text-white hover:bg-white/10";
  }
  
  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}