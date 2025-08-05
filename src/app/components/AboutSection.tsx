'use client';

import React from 'react';
import { 
  Users, 
  Trophy, 
  MapPin, 
  Calendar,
  Heart,
  Target,
  Award,
  Globe,
  CheckCircle
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '45+',
      label: 'Kluba pastāvēšanas laikā esam pabjuši vairāk nekā 45 pasaules vietās,14 valstīs.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      number: '20+',
      label: 'SDK Thunder rindās ir 21 biedrs no 5 mītnes zemēm.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      number: '365+',
      label: 'Dienas gadā mēs veltam savu laiku un nervus, sekojot līdzi Latvijas sportistu gaitām pasaulē.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const values = [
    'Atbalstām mūsējos, lai arī kur viņi startētu',
    'Mēs esam klāt, lai arī kur mēs dzīvotu.',
    'Esam lepni būt kopā un atbalstīt mūsu zemi.'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-slate-800">Kā radās </span>
              <span className="text-red-600 relative">
                SDKThunder
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Mūsu stāsts</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Mūsu stāsts sākās <span className="font-semibold text-red-600">2018. gadā</span> FIBA Women's Basketball World 
                    Cup Finālā, Tenerifes salā, Spānijā, izbaudot kvalitatīvu basketbolu 
                    un saules starus, mūsu ilggadējiem draugiem Laimai un Jānim 
                    prātā ieradās ideja...
                  </p>
                  
                  <p>
                    Vārds pa vārdam, un radās domubiedru grupa ar nosaukumu 
                    <span className="font-semibold text-red-600"> Sporta draugu klubs "THUNDER"</span>.
                  </p>
                  
                  <div className="mt-6 space-y-2 text-lg font-medium text-slate-800">
                    <p>Viens par visiem,</p>
                    <p>Visi par vienu!</p>
                    <p className="text-red-600 font-bold">Kopīgiem spēkiem godu un cieņu!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Mūsu vērtības
                </h3>
                {values.map((value, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-80 h-80 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-orange-500/30 rounded-full blur-2xl group-hover:blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center border-4 border-white/20 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src="/SDKThunderLogo.svg" 
                    alt="SDK Thunder Logo" 
                    className="w-64 h-64 object-contain rounded-full filter drop-shadow-2xl"
                  />
                </div>
                
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                  <p className="text-sm font-bold text-slate-800">EST. 2018</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Pievienojies mūsu komandai!</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Ja tev ir kaislība basketbolam un vēlies atbalstīt Latvijas sportistus, 
                mēs vienmēr esam atvērti jauniem biedriem.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  Sazināties ar mums
                </button>
                <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105">
                  Uzzināt vairāk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;