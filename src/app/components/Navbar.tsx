'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'SĀKUMS', href: '/', active: true },
    { name: 'GALERIJA', href: '/gallery' },
    { name: 'VIETAS', href: '/locations' },
    { name: 'KALENDĀRS', href: '/calendar' },
    { name: 'JAUNUMI', href: '/news' },
    { name: 'PAR MUMS', href: '/about' },
    { name: 'KONTAKTI', href: '#' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-white font-bold text-xs text-center leading-tight">
                  <div>SDK</div>
                  <div className="text-[10px]">THUNDER</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  item.active
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
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                    item.active
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