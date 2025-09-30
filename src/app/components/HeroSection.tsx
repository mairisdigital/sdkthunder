'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSettings {
  id: number;
  title: string;
  subtitle: string | null;
  locationText: string | null;
  tagline1: string | null;
  tagline2: string | null;
  buttonText: string | null;
  buttonLink: string;
  countdownTitle: string | null;
  countdownSubtitle: string | null;
  countdownDate: string; // ISO string format
  countdownStartDate: string; // ISO string format
  countdownDateLabel: string;
  backgroundOverlay: string;
  backgroundImage: string | null; // Cloudinary URL
  logoImage: string | null; // Cloudinary URL
  usePatternBg: boolean;
}

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [settings, setSettings] = useState<HeroSettings>({
    id: 0,
    title: "SDKThunder",
    subtitle: "SPORTA DRAUGU KLUBS",
    locationText: "Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.",
    tagline1: "Mēs Ticam !",
    tagline2: "Jūs Varat !",
    buttonText: "KALENDĀRS",
    buttonLink: "/calendar",
    countdownTitle: "FIBA EuroBasket",
    countdownSubtitle: "2025",
    countdownDate: new Date("2025-08-27T00:00:00Z").toISOString(),
    countdownStartDate: new Date("2025-08-20T00:00:00Z").toISOString(),
    countdownDateLabel: "Datumi:",
    backgroundOverlay: "#7c2d12",
    backgroundImage: null,
    logoImage: null,
    usePatternBg: true
  });

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({
    background: false,
    logo: false
  });
  const [imageErrors, setImageErrors] = useState({
    background: false,
    logo: false
  });

  // Ielādējam datus no datubāzes
  useEffect(() => {
    fetchHeroData();
  }, []);

  const updateCountdown = useCallback(() => {
    const targetDate = new Date(settings.countdownDate);
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  }, [settings.countdownDate]);

  // Countdown timer effect
  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [settings.countdownDate, updateCountdown]);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const heroData = await response.json();
        
        // 🔍 DEBUG: Apskatīsim, kas nāk no API
        console.log('Hero data from API:', heroData);
        console.log('Logo image URL:', heroData.logoImage);
        console.log('Background image URL:', heroData.backgroundImage);
        
        setSettings(heroData);
      } else {
        console.warn('Failed to fetch hero data, using defaults');
      }
    } catch (error) {
      console.error('Error fetching Hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image loading handlers
  const handleImageLoad = (type: 'background' | 'logo') => {
    setImageLoading(prev => ({ ...prev, [type]: false }));
    setImageErrors(prev => ({ ...prev, [type]: false }));
  };

  const handleImageError = (type: 'background' | 'logo') => {
    setImageLoading(prev => ({ ...prev, [type]: false }));
    setImageErrors(prev => ({ ...prev, [type]: true }));
    console.error(`Failed to load ${type} image from Cloudinary`);
  };

  // Background style generator
  const getBackgroundStyle = () => {
    // Ja izmanto pattern background vai nav custom attēla
    if (settings.usePatternBg || !settings.backgroundImage || imageErrors.background) {
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23991b1b' fill-opacity='0.6'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm15 30L30 15 15 30l15 15 15-15zm-15-9l9 9-9 9-9-9 9-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: settings.backgroundOverlay
      };
    }
    
    // Custom Cloudinary background
    return {
      backgroundImage: `url(${settings.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-red-900/30 to-black/60" />
        <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center min-h-screen items-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Ielādē...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 opacity-90 transition-all duration-500"
        style={getBackgroundStyle()}
      />

      {/* Loading overlay for background image */}
      {imageLoading.background && settings.backgroundImage && !settings.usePatternBg && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-5">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Ielādē fona attēlu...</p>
          </div>
        </div>
      )}

      {/* Preload background image if exists */}
      {settings.backgroundImage && !settings.usePatternBg && (
        <Image
          src={settings.backgroundImage}
          alt=""
          width={1}
          height={1}
          className="hidden"
          onLoad={() => handleImageLoad('background')}
          onError={() => handleImageError('background')}
          onLoadingComplete={() => handleImageLoad('background')}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center min-h-screen text-white">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-6xl font-bold mb-4 drop-shadow-2xl" style={{ fontFamily: 'Ethnocentric' }}>
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {settings.title}
            </span>
          </h1>
          {settings.subtitle && (
            <p className="text-xl md:text-2xl font-light mb-2 opacity-90">
              {settings.subtitle}
            </p>
          )}
          {settings.locationText && (
            <p className="text-lg md:text-xl opacity-80">
              {settings.locationText}
            </p>
          )}
        </div>

        {/* Logo Section */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-48 h-48 md:w-64 md:h-64">
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Loading spinner for logo */}
                {imageLoading.logo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Logo Image */}
                {settings.logoImage && !imageErrors.logo ? (
                  <Image 
                    src={settings.logoImage}
                    alt="SDK Thunder Logo"
                    fill
                    className={`object-contain ${
                      imageLoading.logo ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoadingComplete={() => handleImageLoad('logo')}
                    onError={() => handleImageError('logo')}
                  />
                ) : (
                  // Fallback to local logo if Cloudinary fails or no custom logo
                  <Image 
                    src="/SDKThunderLogo.svg"
                    alt="SDK Thunder Logo"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Taglines and Button */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          {settings.tagline1 && (
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg italic transform -rotate-2">
                {settings.tagline1}
              </h2>
              {settings.buttonText && (
                <Link href={settings.buttonLink}>
                  <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    {settings.buttonText}
                  </button>
                </Link>
              )}
            </div>
          )}

          {settings.tagline2 && (
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg italic transform rotate-2">
                {settings.tagline2}
              </h2>
            </div>
          )}
        </div>

        {/* Countdown */}
        {(settings.countdownTitle || settings.countdownSubtitle) && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="text-center">
              {settings.countdownTitle && (
                <h3 className="text-2xl md:text-2xl font-bold text-gray-800 mb-2">
                  {settings.countdownTitle}
                </h3>
              )}
              {settings.countdownStartDate && settings.countdownDate && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-800">{settings.countdownDateLabel}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(settings.countdownStartDate).toLocaleDateString('lv-LV', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} - {new Date(settings.countdownDate).toLocaleDateString('lv-LV', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { value: timeLeft.days, label: 'Diena' },
              { value: timeLeft.hours, label: 'Stundas' },
              { value: timeLeft.minutes, label: 'Minūtes' },
              { value: timeLeft.seconds, label: 'Sekundes' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg mx-auto mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <p className="text-sm md:text-base text-gray-700 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;