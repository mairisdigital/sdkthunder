'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Calendar, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface TopBarSettings {
  email: string;
  emailLabel: string;
  location: string;
  locationLabel: string;
  socialLinks: {
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
  };
}

interface NameDayData {
  date: string;
  names: string[];
  dateKey: string;
  error?: string;
}

const TopBar: React.FC = () => {
  const [data, setData] = useState<TopBarSettings>({
    email: 'info@sdkthunder.com',
    emailLabel: 'E-PASTS:',
    location: 'Rīga, Latvija.',
    locationLabel: 'NĀKAMĀ PIETURA:',
    socialLinks: {
      facebook: '#',
      instagram: '#',
      youtube: '#'
    }
  });
  
  const [nameDays, setNameDays] = useState<NameDayData>({
    date: '7. augusts',
    names: ['Alfrēds', 'Fredis', 'Madars'],
    dateKey: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopBarData();
    fetchNameDays();
  }, []);

  const fetchTopBarData = async () => {
    try {
      const response = await fetch('/api/admin/topbar');
      if (response.ok) {
        const settings = await response.json();
        setData({
          email: settings.email,
          emailLabel: settings.emailLabel,
          location: settings.location,
          locationLabel: settings.locationLabel,
          socialLinks: {
            facebook: settings.facebook,
            instagram: settings.instagram,
            youtube: settings.youtube
          }
        });
      }
    } catch (error) {
      console.error('Error fetching TopBar data:', error);
    }
  };

  const fetchNameDays = async () => {
    try {
      const response = await fetch('/api/name-days');
      if (response.ok) {
        const nameData = await response.json();
        setNameDays(nameData);
      }
    } catch (error) {
      console.error('Error fetching name days:', error);
      // Fallback dati, ja API nefungē
      setNameDays({
        date: new Date().toLocaleDateString('lv-LV'),
        names: ['Nav datu'],
        dateKey: ''
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-slate-700 rounded w-32"></div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
              <div className="h-4 bg-slate-700 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white py-3 relative overflow-hidden">
      {/* Dekoratīvs fons ar gradienta efektu */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0">
          
          {/* Kreisā puse - Kontaktinformācija */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start sm:space-x-6 space-y-2 sm:space-y-0">
            
            {/* Atrašanās vieta */}
            <div className="flex items-center justify-center sm:justify-start text-sm">
              <MapPin className="w-4 h-4 mr-2 text-red-400" />
              <span className="text-slate-300 font-medium">{data.locationLabel}</span>
              <span className="ml-2 text-white font-medium">{data.location}</span>
            </div>
          </div>

          {/* Centrālā daļa - Vārda dienas (tikai desktop) */}
          <div className="hidden lg:flex items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center text-red-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">{nameDays.date}</span>
                </div>
                
                <div className="h-4 w-px bg-slate-600"></div>
                
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-amber-400" />
                  <span className="text-slate-300 font-medium">VĀRDA DIENAS:</span>
                  <span className="ml-2 text-white font-medium">
                    {nameDays.names.length > 0 ? nameDays.names.join(', ') : 'Nav vārda dienu'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Labā puse - Sociālie tīkli */}
          <div className="flex items-center justify-center lg:justify-end space-x-3">
            <span className="text-slate-300 text-sm font-medium hidden sm:block">SEKOJIET MUMS:</span>
            <div className="flex space-x-2">
              {data.socialLinks.facebook && data.socialLinks.facebook !== '#' && (
                <a 
                  href={data.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="transition-all duration-300"
                  />
                </a>
              )}
              
              {data.socialLinks.instagram && data.socialLinks.instagram !== '#' && (
                <a 
                  href={data.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Image
                    src="/instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="transition-all duration-300"
                  />
                </a>
              )}
              
              {data.socialLinks.youtube && data.socialLinks.youtube !== '#' && (
                <a 
                  href={data.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="YouTube"
                >
                  <Image
                    src="/youtube.svg"
                    alt="YouTube"
                    width={20}
                    height={20}
                    className="transition-all duration-300"
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobilajām ierīcēm - vārda dienas atsevišķā rindā ar mazāku tekstu */}
        <div className="lg:hidden mt-3 pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-center">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-700/50 group">
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center text-red-400">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span className="font-medium">{nameDays.date}</span>
                </div>
                
                <div className="h-3 w-px bg-slate-600"></div>
                
                <div className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  <span className="text-slate-300 font-medium">VĀRDA DIENAS:</span>
                  <span className="ml-1.5 text-white font-medium">
                    {nameDays.names.length > 0 ? nameDays.names.join(', ') : 'Nav vārda dienu'}
                  </span>
                  
                  {/* Error indikators */}
                  {nameDays.error && (
                    <span className="w-3.5 h-3.5 ml-1.5 text-yellow-400" title={nameDays.error}>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;