'use client';

import React from 'react';
import { Star, Award, Handshake, Heart } from 'lucide-react';

const PartnersSection: React.FC = () => {
  const partners = [
    {
      id: 1,
      name: 'Xiaomi Arena',
      type: 'Galvenais partneris',
      logo: '/xiaomi-logo.png',
      description: 'Mūsu mājas arēna Rīgā',
      tier: 'gold'
    },
    {
      id: 2,
      name: 'Lattelecom',
      type: 'Tehnoloģiju partneris',
      logo: '/lattelecom-logo.png',
      description: 'Interneta un TV pakalpojumi',
      tier: 'gold'
    },
    {
      id: 3,
      name: 'Rimi',
      type: 'Ēdināšanas partneris',
      logo: '/rimi-logo.png',
      description: 'Veselīga dzīvesveida atbalstītājs',
      tier: 'silver'
    },
    {
      id: 4,
      name: 'SEB Banka',
      type: 'Finansiālais partneris',
      logo: '/seb-logo.png',
      description: 'Bankas pakalpojumi',
      tier: 'silver'
    },
    {
      id: 5,
      name: 'Nike',
      type: 'Apģērbu partneris',
      logo: '/nike-logo.png',
      description: 'Sporta apģērbi un aprīkojums',
      tier: 'bronze'
    },
    {
      id: 6,
      name: 'Local Gym',
      type: 'Treniņu partneris',
      logo: '/gym-logo.png',
      description: 'Trenažieru zāle un fitnesa centri',
      tier: 'bronze'
    }
  ];

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'silver': return <Star className="w-5 h-5 text-gray-400" />;
      case 'bronze': return <Heart className="w-5 h-5 text-orange-600" />;
      default: return <Handshake className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Handshake className="w-12 h-12 text-red-600 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-slate-800">Mūsu </span>
              <span className="text-red-600 relative">
                Partneri
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Mūsu foršie draugi, atbalstītāji un sadarbības partneri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner) => (
            <div 
              key={partner.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 hover:scale-105"
            >
              <div className="relative">
                <div className={`absolute top-4 right-4 z-10 bg-gradient-to-r ${getTierGradient(partner.tier)} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
                  {getTierIcon(partner.tier)}
                  {partner.tier.toUpperCase()}
                </div>
                
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 group-hover:from-red-50 group-hover:to-orange-50 transition-all duration-500">
                  <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                    <div className="text-gray-500 text-sm font-medium text-center">
                      {partner.name}<br />LOGO
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                    {partner.type}
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {partner.description}
                </p>

                <div className="mt-4 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20zM0 20v20h40V0H20c0 11.046-8.954 20-20 20z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
              className="w-full h-full"
            />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Vēlies kļūt par mūsu partneri?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Pievienojies mūsu komandai un atbalsti basketbola attīstību Latvijā. 
              Kopā mēs varam sasniegt vēl lielākus panākumus!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                Sazināties ar mums
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105">
                Uzzināt vairāk
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PartnersSection;