'use client';

import React from 'react';

const LocationsSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-slate-800">Mūsu apmeklētās </span>
              <span className="text-red-600 relative">
                vietas
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Ceļojuma karte ar visām vietām, kur SDKThunder ir pārstāvējis Latviju
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="h-96 md:h-[600px] rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/d/embed?mid=1cnAZYx7SFQcFOgz9TBhh-jpascRX5ydK&ehbc=2E312F" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SDKThunder Apmeklētās Vietas"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;