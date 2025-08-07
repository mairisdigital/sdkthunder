'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface EventsSettings {
  id: number;
  title: string;
  subtitle: string;
  eventTitle: string;
  eventSubtitle: string;
  eventDescription: string;
  eventLocation: string;
  eventDates: string;
  eventYear: string;
  eventType: string;
  eventTeams: string;
  buttonText: string;
  buttonLink: string;
  logoImage: string | null;
  backgroundGradient: string;
  showAdditionalText: boolean;
  additionalText: string;
  additionalButtonText: string;
  additionalButtonLink: string;
}

const EventsSection: React.FC = () => {
  const [settings, setSettings] = useState<EventsSettings>({
    id: 0,
    title: "Tuvākie sporta",
    subtitle: "pasākumi",
    eventTitle: "FIBA EuroBasket 2025",
    eventSubtitle: "",
    eventDescription: "2025. gada Eiropas vīriešu basketbola čempionāts.",
    eventLocation: "Rīga, Latvija",
    eventDates: "27/08 - 14/09",
    eventYear: "2025",
    eventType: "Čempionāts",
    eventTeams: "24 komandas",
    buttonText: "PILNS KALENDĀRS",
    buttonLink: "/calendar",
    logoImage: null, // Sākotnēji nav logo
    backgroundGradient: "from-red-600 to-red-700",
    showAdditionalText: true,
    additionalText: "Vairāk sporta pasākumu un spēļu skatīties kalendārā",
    additionalButtonText: "Skatīt visus pasākumus",
    additionalButtonLink: "/calendar"
  });

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const eventsData = await response.json();
        
        console.log('Events data from API:', eventsData);
        console.log('Logo image URL:', eventsData.logoImage);
        
        setSettings(eventsData);
      } else {
        console.warn('Failed to fetch events data, using defaults');
      }
    } catch (error) {
      console.error('Error fetching Events data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image loading handlers
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error('Failed to load events logo from Cloudinary');
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-12">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Ielādē pasākumu informāciju...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            <span className="text-slate-800">{settings.title} </span>
            <span className="text-red-600 relative">
              {settings.subtitle}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            </span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
            <div className="flex flex-col lg:flex-row">
              
              {/* Left Side - Date */}
              <div className={`lg:w-1/3 bg-gradient-to-br ${settings.backgroundGradient} p-8 text-white relative overflow-hidden`}>
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
                    <div className="text-3xl md:text-4xl font-bold mb-2">{settings.eventDates}</div>
                    <div className="text-xl font-semibold bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                      {settings.eventYear}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold mb-2">{settings.eventTitle.split(' ').slice(0, 2).join(' ')}</div>
                  <div className="text-lg opacity-90">{settings.eventYear}</div>
                </div>
              </div>

              {/* Right Side - Event Details */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center h-full">
                  
                  {/* Event Info */}
                  <div className="flex-1 mb-8 lg:mb-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {settings.eventTitle}
                    </h3>
                    
                    <p className="text-xl text-slate-700 mb-6 leading-relaxed">
                      {settings.eventDescription}
                    </p>
                    
                    <div className="flex items-center text-slate-600 mb-6">
                      <MapPin className="w-5 h-5 mr-2 text-red-500" />
                      <span className="text-lg font-medium">{settings.eventLocation}</span>
                    </div>

                    {/* Event Stats */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700">{settings.eventType}</span>
                      </div>
                      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium text-slate-700">{settings.eventTeams}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={settings.buttonLink}>
                      <button className={`bg-gradient-to-r ${settings.backgroundGradient} hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group`}>
                        <span className="flex items-center">
                          {settings.buttonText}
                          <Calendar className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </button>
                    </Link>
                  </div>

                  {/* Event Logo */}
                  <div className="flex-shrink-0 lg:ml-8">
                    <div className="w-48 h-48 lg:w-60 lg:h-60 relative group-hover:scale-105 transition-transform duration-500">
                      {/* Glow effect behind logo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-red-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                      
                      {/* Logo container */}
                      <div className="relative w-full h-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-gray-200 group-hover:bg-white/90 transition-all duration-500">
                        
                        {/* Loading spinner for logo */}
                        {imageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                            <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Logo Image */}
                        {settings.logoImage && !imageError ? (
                          <Image
                            src={settings.logoImage}
                            alt="Event Logo"
                            fill
                            className={`object-contain filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-500 ${
                              imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                        ) : (
                          // Placeholder if no Cloudinary logo
                          <div className="w-40 h-40 lg:w-56 lg:h-56 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <Calendar className="w-16 h-16 mx-auto mb-2 opacity-50" />
                              <p className="text-sm font-medium">Pasākuma Logo</p>
                              <p className="text-xs opacity-75">Nav augšupielādēts</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Optional overlay text if needed */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-slate-700 shadow-lg">
                          {settings.eventYear}
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
        {settings.showAdditionalText && (
          <div className="text-center mt-12">
            <p className="text-slate-600 text-lg mb-6">
              {settings.additionalText}
            </p>
            <Link href={settings.additionalButtonLink}>
              <button className="text-red-600 hover:text-red-700 font-semibold text-lg hover:underline transition-all duration-300 hover:scale-105">
                {settings.additionalButtonText} →
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;