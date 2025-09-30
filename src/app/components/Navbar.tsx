'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavbarSettings {
  logoText: string;
  logoSubtext: string;
  logoImage: string | null;
}

interface MenuItem {
  id: number;
  name: string;
  href: string;
  order: number;
  active: boolean;
  visible: boolean;
}

interface NavbarData {
  settings: NavbarSettings;
  menuItems: MenuItem[];
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  const [data, setData] = useState<NavbarData>({
    settings: {
      logoText: 'SDK',
      logoSubtext: 'THUNDER',
      logoImage: null
    },
    menuItems: [
      { id: 1, name: 'SĀKUMS', href: '/', order: 1, active: true, visible: true },
      { id: 2, name: 'GALERIJA', href: '/gallery', order: 2, active: false, visible: true },
      { id: 3, name: 'VIETAS', href: '/locations', order: 3, active: false, visible: true },
      { id: 4, name: 'KALENDĀRS', href: '/calendar', order: 4, active: false, visible: true },
      { id: 5, name: 'JAUNUMI', href: '/news', order: 5, active: false, visible: true },
      { id: 6, name: 'PAR MUMS', href: '/about', order: 6, active: false, visible: true },
      { id: 7, name: 'KONTAKTI', href: '/contacts', order: 7, active: false, visible: true },
    ]
  });

  useEffect(() => {
    fetchNavbarData();
  }, []);

  const fetchNavbarData = async () => {
    try {
      const response = await fetch('/api/admin/navbar');
      if (response.ok) {
        const navbarData = await response.json();
        setData({
          settings: navbarData.settings,
          menuItems: navbarData.menuItems
        });
      }
    } catch (error) {
      console.error('Error fetching Navbar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funkcija, lai noteiktu, vai lapa ir aktīva
  const isPageActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="animate-pulse flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mr-3"></div>
            </div>
            <div className="hidden lg:flex space-x-1">
              {[1,2,3,4,5,6,7].map((i) => (
                <div key={i} className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
              ))}
            </div>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Filtrējam tikai redzamos menu items
  const visibleMenuItems = data.menuItems.filter(item => item.visible);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              {data.settings.logoImage ? (
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                  <Image
                    src={data.settings.logoImage}
                    alt="Logo"
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-red-600 font-bold text-lg text-center leading-tight">
                  <div>{data.settings.logoText}</div>
                  <div className="text-sm">{data.settings.logoSubtext}</div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1">
            {visibleMenuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  isPageActive(item.href)
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {visibleMenuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                    isPageActive(item.href)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-red-100 hover:text-red-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;