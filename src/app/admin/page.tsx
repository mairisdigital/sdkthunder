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
  Eye
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
      description: 'Rediģēt informāciju par komandu un vēsturi',
      href: '/admin/about',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      stats: 'Vēsture, vērtības'
    },
    {
      name: 'Kontakti',
      description: 'Pārvaldīt kontaktinformāciju un formu',
      href: '/admin/contacts',
      icon: Mail,
      color: 'from-yellow-500 to-yellow-600',
      stats: 'Forma, e-pasti'
    },
    {
      name: 'Partneri',
      description: 'Pievienot un rediģēt partnerus un sponsorus',
      href: '/admin/partners',
      icon: Trophy,
      color: 'from-orange-500 to-orange-600',
      stats: '6 partneri'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Panelis
        </h1>
        <p className="text-gray-600">
          Pārvaldiet SDKThunder mājas lapas saturu un iestatījumus
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Kopējie skatījumi</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Šodien</p>
              <p className="text-2xl font-bold text-gray-900">123</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <Newspaper className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Jaunumi</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link
              key={section.name}
              href={section.href}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {section.name}
                      </h3>
                      <p className="text-sm text-gray-500">{section.stats}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pēdējās izmaiņas
        </h2>
        
        <div className="space-y-3">
          {[
            { action: 'Pievienots jaunums', item: '"SDKThunder uzvar draudzības spēlē"', time: 'Pirms 2 stundām' },
            { action: 'Rediģēts pasākums', item: 'FIBA EuroBasket 2025', time: 'Pirms 5 stundām' },
            { action: 'Augšupielādēts attēls', item: 'Galerija - Komandas foto', time: 'Vakar' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.item}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}