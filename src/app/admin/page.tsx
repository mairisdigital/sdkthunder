// src/app/admin/page.tsx
import React from 'react';
import { 
  Settings, 
  Newspaper, 
  Calendar,
  Image,
  MapPin,
  Users,
  Mail,
  Trophy,
  BarChart3,
  Eye,
  Menu,
  Layout
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const sections = [
    {
      name: 'TopBar',
      description: 'Rediģēt augšējās joslas kontaktinformāciju un sociālos tīklus',
      href: '/admin/topbar',
      icon: Settings,
      color: 'from-blue-500 to-blue-600',
      stats: 'E-pasts, atrašanās vieta'
    },
    {
      name: 'Navbar',
      description: 'Pārvaldīt navigācijas joslas logo un izvēlni',
      href: '/admin/navbar',
      icon: Menu,
      color: 'from-indigo-500 to-indigo-600',
      stats: 'Logo, 7 izvēlnes punkti'
    },
    {
      name: 'Hero',
      description: 'Pārvaldīt galvenās sadaļas virsrakstus un atpakaļskaitīšanas pulksteni',
      href: '/admin/hero',
      icon: Layout,
      color: 'from-orange-500 to-orange-600',
      stats: 'Virsraksti, saukļi, laika atskaite'
    },
    {
      name: 'Jaunumi',
      description: 'Pārvaldīt jaunumus, rakstus un ziņas',
      href: '/admin/news',
      icon: Newspaper,
      color: 'from-green-500 to-green-600',
      stats: '12 raksti'
    },
    {
      name: 'Kalendārs',
      description: 'Pievienot un rediģēt pasākumus un spēles',
      href: '/admin/calendar',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      stats: '8 pasākumi'
    },
    {
      name: 'Galerija',
      description: 'Augšupielādēt un pārvaldīt foto un video',
      href: '/admin/gallery',
      icon: Image,
      color: 'from-pink-500 to-pink-600',
      stats: '45 faili'
    },
    {
      name: 'Vietas',
      description: 'Pārvaldīt apmeklētās vietas un karti',
      href: '/admin/locations',
      icon: MapPin,
      color: 'from-red-500 to-red-600',
      stats: '14 valstis'
    },
    {
      name: 'Par mums',
      description: 'Pārvaldīt informāciju par klubu un komandu',
      href: '/admin/about',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      stats: 'Vēsture, komanda'
    },
    {
      name: 'Kontakti',
      description: 'Pārvaldīt kontaktinformāciju un saziņas formu',
      href: '/admin/contacts',
      icon: Mail,
      color: 'from-teal-500 to-teal-600',
      stats: 'Adrese, tālruņi'
    },
    {
      name: 'Partneri',
      description: 'Pārvaldīt sadarbības partnerus un sponsorus',
      href: '/admin/partners',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      stats: '6 partneri'
    },
    {
      name: 'Analītika',
      description: 'Skatīt lapas apmeklējuma statistiku',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'from-gray-500 to-gray-600',
      stats: 'Apmeklējumi, lietotāji'
    },
    {
      name: 'Priekšskatījums',
      description: 'Apskatīt lapu priekšskatījumā',
      href: '/',
      icon: Eye,
      color: 'from-slate-600 to-slate-700',
      stats: 'Publiskā lapa'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panelis</h1>
      <p className="text-gray-600 mb-8">Pārvaldiet savu mājas lapu un saturu</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link 
            key={index} 
            href={section.href}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${section.color} px-6 py-4 group-hover:opacity-90 transition-opacity duration-300`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{section.name}</h2>
                  <div className="bg-white/20 rounded-full p-2">
                    {React.createElement(section.icon, { 
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {section.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {section.stats}
                  </span>
                  
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                    Pārvaldīt →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}