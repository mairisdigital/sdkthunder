'use client';

import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 22,
    hours: 7,
    minutes: 52,
    seconds: 53
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23991b1b' fill-opacity='0.6'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm15 30L30 15 15 30l15 15 15-15zm-15-9l9 9-9 9-9-9 9-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#7c2d12'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-red-900/30 to-black/60" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center min-h-screen text-white">
        
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              SDKThunder
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2 opacity-90">
            SPORTA DRAUGU KLUBS
          </p>
          <p className="text-lg md:text-xl opacity-80">
            Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative group">

            <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm rounded-full p-4 shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-2 border-white/20">
              <div className="w-full h-full rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="/SDKThunderLogo.svg" 
                  alt="SDK Thunder Logo" 
                  className="w-full h-full object-contain rounded-full filter drop-shadow-lg"
                />
              </div>
            </div>

            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg italic transform -rotate-2">
              Mēs Ticam !
            </h2>
            <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
              KALENDĀRS
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg italic transform rotate-2">
              Jūs Varat !
            </h2>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              FIBA EuroBasket
            </h3>
            <p className="text-lg text-gray-600">2025</p>
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
      </div>
    </div>
  );
};

export default HeroSection;