"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const links = [
    {
      href: "/admin/dashboard",
      label: "Dasbor",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/detection-logs",
      label: "Riwayat Deteksi",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      href: "/admin/users",
      label: "Pengguna",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    // Add the new manual calculation link
    {
      href: "/admin/manual-calculation",
      label: "Kalkulasi Manual",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/model-info",
      label: "Info Model",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  // Rest of the existing component remains unchanged
  return (
    <div className="space-y-2">
      {links.map((link, index) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={index}
            href={link.href}
            className={`
              flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }
              group relative overflow-hidden
            `}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}>
            {/* Background animation for active state */}
            {isActive && hoveredItem === index && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-12 top-0 w-24 h-24 bg-white/10 blur-md rotate-45 transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute -left-12 -bottom-12 w-24 h-24 rounded-full bg-white"></div>
              </div>
            )}

            {/* Icon */}
            <span
              className={`
              flex items-center justify-center rounded-lg p-1.5 transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-indigo-500 group-hover:text-indigo-600"
              }
            `}>
              {link.icon}
            </span>

            {/* Label */}
            <span
              className={`
              font-medium transition-all duration-300
              ${isActive ? "font-semibold" : "group-hover:translate-x-1"}
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

      {/* Additional decorative elements and rest of the component... */}
      <div className="mt-6 border-t border-indigo-100 pt-6">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium mb-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>
            <span>Status Sistem</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-600">
              Semua sistem beroperasi normal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
