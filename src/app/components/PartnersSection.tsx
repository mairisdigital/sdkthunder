'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Handshake, Trophy, Medal, Award, Shield, ExternalLink } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  tier: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  active: boolean;
  order: number;
}

interface PartnersSettings {
  id: number;
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  isActive: boolean;
}

const PartnersSection: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<PartnersSettings>({
    id: 0,
    title: "Mūsu Partneri",
    subtitle: "Mūsu foršie draugi, atbalstītāji un sadarbības partneri",
    ctaTitle: "Vēlies kļūt par mūsu partneri?",
    ctaSubtitle: "Sazinies ar mums un kopā veidosim nākotni!",
    ctaButtonText: "Sazināties ar mums",
    ctaButtonLink: "/contact",
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ielādējam partnerus un iestatījumus no API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ielādējam partnerus
        const partnersResponse = await fetch('/api/partners');
        if (!partnersResponse.ok) {
          throw new Error('Kļūda ielādējot partnerus');
        }
        const partnersData = await partnersResponse.json();
        console.log('✅ Loaded partners:', partnersData);
        setPartners(partnersData);

        // Ielādējam iestatījumus
        const settingsResponse = await fetch('/api/admin/partners-settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          console.log('✅ Loaded partners settings:', settingsData);
          setSettings(settingsData);
        }
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError('Neizdevās ielādēt datus');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold': return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'silver': return <Medal className="w-4 h-4 text-gray-500" />;
      case 'bronze': return <Award className="w-4 h-4 text-orange-600" />;
      default: return <Shield className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  // 🔧 IZLABOTS: handleImageError funkcija
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, partner: Partner) => {
    console.error(`❌ Failed to load image for ${partner.name}:`, partner.logo);
    e.currentTarget.style.display = 'none';
    
    // Parādīt fallback konteineeru
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback && fallback.classList.contains('fallback-logo')) {
      fallback.style.display = 'flex';
    }
  };

  // 🔧 IZLABOTS: handleImageLoad funkcija  
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>, partner: Partner) => {
    console.log(`✅ Successfully loaded image for ${partner.name}`);
    
    // Paslēpt fallback konteineeru
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback && fallback.classList.contains('fallback-logo')) {
      fallback.style.display = 'none';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ielādē partnerus...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Ja nav partneru, nerādām sadaļu
  if (partners.length === 0) {
    return null;
  }

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
              <span className="text-slate-800">{settings.title.split(' ').slice(0, -1).join(' ')} </span>
              <span className="text-red-600 relative">
                {settings.title.split(' ').slice(-1)[0]}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {settings.subtitle}
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
                
                <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 group-hover:from-red-50 group-hover:to-orange-50 transition-all duration-500 relative">
                  {/* Logo attēls */}
                  {partner.logo ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        width={120}
                        height={80}
                        className="object-contain max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => handleImageError(e as unknown as React.SyntheticEvent<HTMLImageElement, Event>, partner)}
                        onLoad={(e) => handleImageLoad(e as unknown as React.SyntheticEvent<HTMLImageElement, Event>, partner)}
                      />
                    </div>
                  ) : (
                    <div className="fallback-logo w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                      <div className="text-gray-500 text-xs font-medium text-center px-2">
                        {partner.name.split(' ').slice(0, 2).join(' ')}<br />LOGO
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300 flex items-center gap-2">
                    {partner.name}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </h3>
                </div>
                
                {partner.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {partner.description}
                  </p>
                )}

                <div className="mt-3 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA sadaļa */}
        {settings.isActive && (
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
                {settings.ctaTitle}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {settings.ctaSubtitle}
              </p>
              <a
                href={settings.ctaButtonLink}
                className="inline-block bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {settings.ctaButtonText}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;