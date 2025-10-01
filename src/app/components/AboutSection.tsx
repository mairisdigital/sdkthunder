'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

interface AboutContent {
  id: number;
  title: string;
  subtitle?: string;
  mainStory: string;
  slogan1?: string;
  slogan2?: string;
  slogan3?: string;
  foundedYear: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  ctaText?: string;
  ctaSubtext: string;
  contactButtonText: string;
  contactButtonLink?: string;
  learnMoreButtonText: string;
  learnMoreButtonLink?: string;
  isActive: boolean;
}

interface AboutValue {
  id: number;
  text: string;
  order: number;
  isActive: boolean;
}

interface AboutStat {
  id: number;
  icon: string;
  number: string;
  label: string;
  color: string;
  order: number;
  isActive: boolean;
}

const iconComponents = {
  Users,
  Trophy,
  Calendar,
  Heart,
  Target,
  Award,
  Globe,
  MapPin
};

const AboutSection: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Default data ja nav ielādējies no API
  const defaultContent = {
    title: "Kā radās SDKThunder",
    subtitle: "",
    mainStory: `Mūsu stāsts sākās 2018. gadā FIBA Women's Basketball World Cup Finālā, Tenerifes salā, Spānijā, izbaudot kvalitatīvu basketbolu un saules starus, mūsu ilggadējiem draugiem Laimai un Jānim prātā ieradās ideja...

    Vārds pa vārdam, un radās domubiedru grupa ar nosaukumu Sporta draugu klubs "THUNDER".`,
    slogan1: "Viens par visiem,",
    slogan2: "Visi par vienu!",
    slogan3: "Kopīgiem spēkiem godu un cieņu!",
    foundedYear: "2018",
    logoUrl: undefined,
    backgroundImageUrl: undefined,
    ctaText: "Pievienojies mūsu komandai!",
    ctaSubtext: "Ja tev ir kaislība basketbolam un vēlies atbalstīt Latvijas sportistus, mēs vienmēr esam atvērti jauniem biedriem.",
    contactButtonText: "Sazināties ar mums",
    contactButtonLink: undefined,
    learnMoreButtonText: "Uzzināt vairāk",
    learnMoreButtonLink: undefined
  };

  const defaultValues = [
    'Atbalstām mūsējos, lai arī kur viņi startētu',
    'Mēs esam klāt, lai arī kur mēs dzīvotu.',
    'Esam lepni būt kopā un atbalstīt mūsu zemi.'
  ];

  const defaultStats = [
    {
      icon: 'Globe',
      number: '45+',
      label: 'Kluba pastāvēšanas laikā esam pabjuši vairāk nekā 45 pasaules vietās,14 valstīs.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'Users',
      number: '20+',
      label: 'SDK Thunder rindās ir 21 biedrs no 5 mītnes zemēm.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: 'Calendar',
      number: '365+',
      label: 'Dienas gadā mēs veltam savu laiku un nervus, sekojot līdzi Latvijas sportistu gaitām pasaulē.',
      color: 'from-green-500 to-green-600'
    }
  ];

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setValues(data.values || []);
        setStats(data.stats || []);
      } else {
        // Ja API nav pieejams, izmantojam default datus
        console.warn('About API nav pieejams, izmantojam default datus');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      // Ja kļūda, izmantojam default datus
    } finally {
      setLoading(false);
    }
  };

  // Izmantojam default vai API datus
  const displayContent = content || defaultContent;
  const displayValues = values.length > 0 ? values : defaultValues.map((text, index) => ({ 
    id: index, 
    text, 
    order: index, 
    isActive: true 
  }));
  const displayStats = stats.length > 0 ? stats : defaultStats.map((stat, index) => ({ 
    id: index, 
    ...stat, 
    order: index, 
    isActive: true 
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ielādē About saturu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-slate-800">
                {displayContent.title.split(' ').slice(0, -1).join(' ')} 
              </span>
              <span className="text-red-600 relative ml-2">
                {displayContent.title.split(' ').slice(-1)[0]}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
            {displayContent.subtitle && (
              <p className="text-xl text-gray-600 mt-4">{displayContent.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Mūsu stāsts</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {displayContent.mainStory.split('\n\n').map((paragraph, index) => (
                    <p key={index}>
                      {paragraph.trim()}
                    </p>
                  ))}
                  
                  {(displayContent.slogan1 || displayContent.slogan2 || displayContent.slogan3) && (
                    <div className="mt-6 space-y-2 text-lg font-medium text-slate-800">
                      {displayContent.slogan1 && <p>{displayContent.slogan1}</p>}
                      {displayContent.slogan2 && <p>{displayContent.slogan2}</p>}
                      {displayContent.slogan3 && (
                        <p className="text-red-600 font-bold">{displayContent.slogan3}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Mūsu vērtības
                </h3>
                {displayValues.map((value, index) => (
                  <div key={value.id || index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{typeof value === 'string' ? value : value.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-80 h-80 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-orange-500/30 rounded-full blur-2xl group-hover:blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center border-4 border-white/20 group-hover:scale-105 transition-transform duration-500">
                  {displayContent.logoUrl ? (
                    <Image
                      src={displayContent.logoUrl}
                      alt="SDK Thunder Logo"
                      width={256}
                      height={256}
                      className="object-contain rounded-full filter drop-shadow-2xl"
                    />
                  ) : (
                    <Image
                      src="/SDKThunderLogo.svg"
                      alt="SDK Thunder Logo"
                      width={256}
                      height={256}
                      className="object-contain rounded-full filter drop-shadow-2xl"
                    />
                  )}
                </div>
                
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                  <p className="text-sm font-bold text-slate-800">EST. {displayContent.foundedYear}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {displayStats.map((stat, index) => {
              const IconComponent = iconComponents[stat.icon as keyof typeof iconComponents] || Users;
              
              return (
                <div key={stat.id || index} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
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
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8" 
                 style={displayContent.backgroundImageUrl ? {
                   backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(${displayContent.backgroundImageUrl})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 } : {}}>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                {displayContent.ctaText || "Pievienojies mūsu komandai!"}
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {displayContent.ctaSubtext}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {displayContent.contactButtonLink ? (
                  <a
                    href={displayContent.contactButtonLink}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg text-center"
                  >
                    {displayContent.contactButtonText}
                  </a>
                ) : (
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    {displayContent.contactButtonText}
                  </button>
                )}
                {displayContent.learnMoreButtonLink ? (
                  <a
                    href={displayContent.learnMoreButtonLink}
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 text-center"
                  >
                    {displayContent.learnMoreButtonText}
                  </a>
                ) : (
                  <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105">
                    {displayContent.learnMoreButtonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;