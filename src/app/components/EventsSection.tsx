'use client';

import React from 'react';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';

const EventsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20zM0 20v20h40V0H20c0 11.046-8.954 20-20 20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-slate-800">Tuvākie sporta </span>
            <span className="text-red-600 relative">
              pasākumi
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            </span>
          </h2>
          
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
            <div className="flex flex-col lg:flex-row">
              
              <div className="lg:w-1/3 bg-gradient-to-br from-red-700 via-red-600 to-red-800 p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                    className="w-full h-full"
                  />
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 mr-2" />
                    <span className="text-lg font-semibold">Datums</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-3xl md:text-4xl font-bold mb-2">27/08 - 14/09</div>
                    <div className="text-xl font-semibold bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                      2025
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">FIBA EuroBasket</div>
                  <div className="text-lg opacity-90">2025</div>
                </div>
              </div>

              {/* Right Side - Event Details */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center h-full">
                  
                  {/* Event Info */}
                  <div className="flex-1 mb-8 lg:mb-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      FIBA EuroBasket 2025
                    </h3>
                    
                    <p className="text-xl text-slate-700 mb-6 leading-relaxed">
                      2025. gada Eiropas vīriešu<br />
                      basketbola čempionāts.
                    </p>
                    
                    <div className="flex items-center text-slate-600 mb-6">
                      <MapPin className="w-5 h-5 mr-2 text-red-500" />
                      <span className="text-lg font-medium">Rīga, Latvija</span>
                    </div>

                    {/* Event Stats */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700">Čempionāts</span>
                      </div>
                      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium text-slate-700">24 komandas</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                      <span className="flex items-center">
                        PILNS KALENDĀRS
                        <Calendar className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>

                  {/* EuroBasket Logo */}
                  <div className="flex-shrink-0 lg:ml-8">
                    <div className="w-48 h-48 lg:w-60 lg:h-60 relative group-hover:scale-105 transition-transform duration-500">
                      {/* Glow effect behind logo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-red-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                      
                      {/* Logo container */}
                      <div className="relative w-full h-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-gray-200 group-hover:bg-white/90 transition-all duration-500">
                        <img 
                          src="/EventsImage.svg" 
                          alt="FIBA EuroBasket 2025 Logo" 
                          className="w-40 h-40 lg:w-56 lg:h-56 object-contain filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-500"
                        />
                      </div>
                      
                      {/* Optional overlay text if needed */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-slate-700 shadow-lg">
                          2025
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Events Teaser */}
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg mb-6">
            Vairāk sporta pasākumu un spēļu skatīties kalendārā
          </p>
          <button className="text-red-600 hover:text-red-700 font-semibold text-lg hover:underline transition-all duration-300 hover:scale-105">
            Skatīt visus pasākumus →
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;