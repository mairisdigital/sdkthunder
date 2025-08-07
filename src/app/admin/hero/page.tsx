'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Eye, 
  Clock,
  Heading,
  Type,
  Palette,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Upload,
  Image,
  Trash2,
  Loader2
} from 'lucide-react';
import NextImage from 'next/image';

interface HeroSettings {
  title: string;
  subtitle: string;
  locationText: string;
  tagline1: string;
  tagline2: string;
  buttonText: string;
  buttonLink: string;
  countdownTitle: string;
  countdownSubtitle: string;
  countdownDate: string; // ISO string format
  backgroundOverlay: string;
  backgroundImage: string | null;
  logoImage: string | null;
  usePatternBg: boolean;
}

export default function AdminHero() {
  const [data, setData] = useState<HeroSettings>({
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
    backgroundOverlay: "#7c2d12",
    backgroundImage: null,
    logoImage: null,
    usePatternBg: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Uploading states
  const [isUploading, setIsUploading] = useState({
    background: false,
    logo: false
  });
  const [uploadProgress, setUploadProgress] = useState({
    background: 0,
    logo: 0
  });

  // File input refs
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Ielādējam datus no datubāzes
  useEffect(() => {
    fetchHeroData();
  }, []);

  const updateCountdown = () => {
    const targetDate = new Date(data.countdownDate);
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
  };

  // Imitējam countdown
  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [data.countdownDate, updateCountdown]);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const heroData = await response.json();
        setData({
          ...heroData,
          countdownDate: new Date(heroData.countdownDate).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching Hero data:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof HeroSettings, value: string | boolean | null) => {
      setData(prev => ({
        ...prev,
        [field]: value
      }));
    };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          countdownDate: new Date(data.countdownDate).toISOString()
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving Hero data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'logo') => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validācija
  if (!file.type.includes('image/')) {
    alert('Lūdzu, izvēlieties attēla failu.');
    return;
  }

  setIsUploading(prev => ({ ...prev, [type]: true }));
  setUploadProgress(prev => ({ ...prev, [type]: 0 }));

  try {
    // Simulējam progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[type];
        return { ...prev, [type]: Math.min(current + 10, 90) };
      });
    }, 300);

    // Izveidojam formData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `sdkthunder/${type}`);

    // Sūtam uz Cloudinary
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);
    setUploadProgress(prev => ({ ...prev, [type]: 100 }));

    if (!response.ok) {
      throw new Error('Failed to upload');
    }

    const result = await response.json();
    console.log('✅ Upload result:', result); // Debug log
    
    // Atjauninam lokālos datus
    if (type === 'background') {
      handleInputChange('backgroundImage', result.url);
      handleInputChange('usePatternBg', false);
    } else {
      handleInputChange('logoImage', result.url);
    }

    // 🚀 SVARĪGI: Automātiski saglabājam datubāzē!
    const updatedData = {
      ...data,
      [type === 'background' ? 'backgroundImage' : 'logoImage']: result.url
    };
    
    if (type === 'background') {
      updatedData.usePatternBg = false;
    }

    // Saglabājam datubāzē
    const saveResponse = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedData,
        countdownDate: new Date(updatedData.countdownDate).toISOString()
      }),
    });

    if (saveResponse.ok) {
      console.log('✅ Auto-saved to database');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      console.error('❌ Failed to auto-save');
    }

    // Reset file input
    if (type === 'background' && backgroundFileInputRef.current) {
      backgroundFileInputRef.current.value = '';
    } else if (type === 'logo' && logoFileInputRef.current) {
      logoFileInputRef.current.value = '';
    }

  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    alert(`Kļūda augšupielādējot attēlu. Lūdzu, mēģiniet vēlreiz.`);
  } finally {
    setTimeout(() => {
      setIsUploading(prev => ({ ...prev, [type]: false }));
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }, 500);
  }
};

  const handleRemoveImage = (type: 'background' | 'logo') => {
    if (type === 'background') {
      handleInputChange('backgroundImage', null);
      if (backgroundFileInputRef.current) {
        backgroundFileInputRef.current.value = '';
      }
    } else {
      handleInputChange('logoImage', null);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ielādē datus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Sadaļas Iestatījumi</h1>
          <p className="text-gray-600 mt-1">
            Rediģējiet galvenās sadaļas virsrakstus, tekstus un izkārtojumu
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Paslēpt' : 'Rādīt'} priekšskatījumu
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saglabā...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Saglabāt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status messages */}
      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Iestatījumi veiksmīgi saglabāti!
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Kļūda saglabājot iestatījumus. Lūdzu, mēģiniet vēlreiz.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galvenie virsraksti */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Heading className="w-5 h-5 mr-2 text-red-600" />
              Galvenie virsraksti
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Galvenais virsraksts
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apakšvirsraksts
                  </label>
                  <input
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atrašanās vietas teksts
                </label>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-red-500 mr-2" />
                  <input
                    type="text"
                    value={data.locationText}
                    onChange={(e) => handleInputChange('locationText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attēli */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Image className="w-5 h-5 mr-2 text-red-600" />
              Attēli
            </h2>
            
            <div className="space-y-6">
              {/* Logo attēls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo attēls
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                    {data.logoImage ? (
                      <div className="relative w-full h-full">
                        <NextImage 
                          src={data.logoImage!}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm text-center p-2">
                        <Image className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span>Nav logo</span>
                      </div>
                    )}
                    
                    {isUploading.logo && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs">{uploadProgress.logo}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Augšupielādēt logo
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                    
                    {data.logoImage && (
                      <button
                        onClick={() => handleRemoveImage('logo')}
                        className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Noņemt logo
                      </button>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Ieteicamais izmērs: 200x200px, PNG ar caurspīdīgu fonu
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Fona attēls */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fona attēls
                  </label>
                  
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer mr-4">
                      <input
                        type="checkbox"
                        checked={data.usePatternBg}
                        onChange={(e) => handleInputChange('usePatternBg', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      <span className="ms-2 text-sm font-medium text-gray-700">
                        Izmantot raksta fonu
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                    {data.backgroundImage && !data.usePatternBg ? (
                      <div className="relative w-full h-full">
                        <NextImage 
                          src={data.backgroundImage!}
                          alt="Fona attēls"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full opacity-70"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23991b1b' fill-opacity='0.6'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm15 30L30 15 15 30l15 15 15-15zm-15-9l9 9-9 9-9-9 9-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundColor: data.backgroundOverlay
                        }}
                      ></div>
                    )}
                    
                    {isUploading.background && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs">{uploadProgress.background}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className={`flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 cursor-pointer ${data.usePatternBg ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-4 h-4 mr-2" />
                      Augšupielādēt fona attēlu
                      <input
                        ref={backgroundFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'background')}
                        className="hidden"
                        disabled={data.usePatternBg}
                      />
                    </label>
                    
                    {data.backgroundImage && !data.usePatternBg && (
                      <button
                        onClick={() => handleRemoveImage('background')}
                        className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Noņemt fona attēlu
                      </button>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Ieteicamais izmērs: 1920x1080px vai lielāks. Augšupielādējot attēlu, raksta fons tiks izslēgts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saukļi un pogas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Type className="w-5 h-5 mr-2 text-red-600" />
              Saukļi un pogas
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sauklis 1
                  </label>
                  <input
                    type="text"
                    value={data.tagline1}
                    onChange={(e) => handleInputChange('tagline1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sauklis 2
                  </label>
                  <input
                    type="text"
                    value={data.tagline2}
                    onChange={(e) => handleInputChange('tagline2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pogas teksts
                  </label>
                  <input
                    type="text"
                    value={data.buttonText}
                    onChange={(e) => handleInputChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pogas saite
                  </label>
                  <input
                    type="text"
                    value={data.buttonLink}
                    onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Laika atskaite */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-red-600" />
              Laika atskaite
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atskaites virsraksts
                  </label>
                  <input
                    type="text"
                    value={data.countdownTitle}
                    onChange={(e) => handleInputChange('countdownTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atskaites apakšvirsraksts
                  </label>
                  <input
                    type="text"
                    value={data.countdownSubtitle}
                    onChange={(e) => handleInputChange('countdownSubtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  Beigu datums
                </label>
                <input
                  type="date"
                  value={data.countdownDate}
                  onChange={(e) => handleInputChange('countdownDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Vizuālie iestatījumi */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-red-600" />
              Vizuālie iestatījumi
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fona pārklājuma krāsa (HEX)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.backgroundOverlay}
                    onChange={(e) => handleInputChange('backgroundOverlay', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={data.backgroundOverlay}
                    onChange={(e) => handleInputChange('backgroundOverlay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Priekšskatījums</h2>
              
              {/* Hero Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{ minHeight: "500px" }}>
                <div className="relative" style={{ minHeight: "500px" }}>
                  {/* Background */}
                  {data.usePatternBg ? (
                    <div 
                      className="absolute inset-0 opacity-90"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23991b1b' fill-opacity='0.6'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm15 30L30 15 15 30l15 15 15-15zm-15-9l9 9-9 9-9-9 9-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundColor: data.backgroundOverlay
                      }}
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-center bg-cover"
                      style={{
                        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none',
                        backgroundColor: data.backgroundImage ? 'transparent' : data.backgroundOverlay
                      }}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-red-900/30 to-black/60" />

                  {/* Content */}
                  <div className="relative z-10 p-4 flex flex-col items-center justify-between" style={{ minHeight: "500px" }}>
                    <div className="text-center mt-4 mb-4">
                      <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                        {data.title}
                      </h1>
                      <p className="text-sm text-white opacity-90 mb-1">
                        {data.subtitle}
                      </p>
                      <p className="text-xs text-white opacity-80">
                        {data.locationText}
                      </p>
                    </div>

                    <div className="flex flex-col items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 overflow-hidden relative">
                        {data.logoImage ? (
                          <NextImage
                            src={data.logoImage!}
                            alt="Logo"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-white text-xs font-bold">LOGO</div>
                        )}
                      </div>

                      <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="flex flex-col items-center">
                          <h2 className="text-xl font-bold text-white mb-2 italic transform -rotate-2">
                            {data.tagline1}
                          </h2>
                          <button className="bg-red-600 px-3 py-1 rounded-full text-white text-sm font-bold">
                            {data.buttonText}
                          </button>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <h2 className="text-xl font-bold text-white mb-2 italic transform rotate-2">
                            {data.tagline2}
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 w-full max-w-xs mx-auto mb-4">
                      <div className="text-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {data.countdownTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{data.countdownSubtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: timeLeft.days, label: 'Diena' },
                          { value: timeLeft.hours, label: 'Stundas' },
                          { value: timeLeft.minutes, label: 'Minūtes' },
                          { value: timeLeft.seconds, label: 'Sekundes' }
                        ].map((item, index) => (
                          <div key={index} className="text-center">
                            <div className="bg-slate-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mx-auto mb-1">
                              {item.value.toString().padStart(2, '0')}
                            </div>
                            <p className="text-xs text-gray-700 font-medium">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500">
                  * Priekšskatījums ir vienkāršots. Faktiskais izskats var nedaudz atšķirties.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}