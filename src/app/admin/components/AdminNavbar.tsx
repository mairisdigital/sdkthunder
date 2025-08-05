'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Settings, 
  Home, 
  Users, 
  Calendar,
  Image,
  MapPin,
  Newspaper,
  Mail,
  Trophy,
  ArrowLeft
} from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Pārskats', href: '/admin', icon: Home },
    { name: 'TopBar', href: '/admin/topbar', icon: Settings },
    { name: 'Jaunumi', href: '/admin/news', icon: Newspaper },
    { name: 'Kalendārs', href: '/admin/calendar', icon: Calendar },
    { name: 'Galerija', href: '/admin/gallery', icon: Image },
    { name: 'Vietas', href: '/admin/locations', icon: MapPin },
    { name: 'Par mums', href: '/admin/about', icon: Users },
    { name: 'Kontakti', href: '/admin/contacts', icon: Mail },
    { name: 'Partneri', href: '/admin/partners', icon: Trophy },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg mr-3">
              <div className="text-white font-bold text-xs text-center leading-tight">
                <div>SDK</div>
                <div className="text-[8px]">ADMIN</div>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panelis</h1>
          </div>

          {/* Navigation Menu */}
          <div className="hidden lg:flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Back to Site */}
          <Link
            href="/"
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atpakaļ uz lapu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;