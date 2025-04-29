'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const links = [
    { 
      href: '/admin/dashboard', 
      label: 'Dasbor', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    { 
      href: '/admin/detection-logs', 
      label: 'Riwayat Deteksi', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      href: '/admin/users', 
      label: 'Pengguna', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-2">
      {links.map((link, index) => {
        const isActive = pathname === link.href;
        const isHovered = hoveredItem === index;
        
        return (
          <Link 
            key={link.href}
            href={link.href}
            className={`
              relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out
              group overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-gray-600 hover:bg-indigo-50'
              }
            `}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Animated background pattern for active or hovered items */}
            {(isActive || isHovered) && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-white"></div>
                <div className="absolute -left-12 -bottom-12 w-24 h-24 rounded-full bg-white"></div>
              </div>
            )}
            
            {/* Icon */}
            <span className={`
              flex items-center justify-center rounded-lg p-1.5 transition-all duration-300
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'text-indigo-500 group-hover:text-indigo-600'
              }
            `}>
              {link.icon}
            </span>
            
            {/* Label */}
            <span className={`
              font-medium transition-all duration-300
              ${isActive ? 'font-semibold' : 'group-hover:translate-x-1'}
            `}>
              {link.label}
            </span>
            
            {/* Active indicator */}
            {isActive && (
              <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            )}
          </Link>
        );
      })}
      
      {/* Additional decorative elements */}
      <div className="mt-6 border-t border-indigo-100 pt-6">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            <span>Status Sistem</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-600">Semua sistem beroperasi normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}