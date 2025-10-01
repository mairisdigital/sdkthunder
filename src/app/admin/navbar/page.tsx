'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedLayout from '../components/ProtectedLayout';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Menu,
  AlertCircle,
  CheckCircle,
  GripVertical,
  Upload,
  Image,
  Loader2
} from 'lucide-react';
import NextImage from 'next/image';

interface NavbarSettings {
  logoText: string;
  logoSubtext: string;
  logoImage: string | null;
  faviconUrl: string | null;
}

interface MenuItem {
  id?: number;
  name: string;
  href: string;
  order: number;
  active: boolean;
  visible: boolean;
}

interface NavbarData {
  settings: NavbarSettings;
  menuItems: MenuItem[];
}

export default function AdminNavbar() {
  const [data, setData] = useState<NavbarData>({
    settings: {
      logoText: 'SDK',
      logoSubtext: 'THUNDER',
      logoImage: null,
      faviconUrl: null
    },
    menuItems: [
      { name: 'SĀKUMS', href: '/', order: 1, active: true, visible: true },
      { name: 'GALERIJA', href: '/gallery', order: 2, active: false, visible: true },
      { name: 'VIETAS', href: '/locations', order: 3, active: false, visible: true },
      { name: 'KALENDĀRS', href: '/calendar', order: 4, active: false, visible: true },
      { name: 'JAUNUMI', href: '/news', order: 5, active: false, visible: true },
      { name: 'PAR MUMS', href: '/about', order: 6, active: false, visible: true },
      { name: 'KONTAKTI', href: '/contacts', order: 7, active: false, visible: true },
    ]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [faviconUploadProgress, setFaviconUploadProgress] = useState(0);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNavbarData();
  }, []);

  const fetchNavbarData = async () => {
    try {
      const response = await fetch('/api/admin/navbar');
      if (response.ok) {
        const navbarData = await response.json();
        setData({
          settings: navbarData.settings,
          menuItems: navbarData.menuItems
        });
      }
    } catch (error) {
      console.error('Error fetching Navbar data:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (field: keyof NavbarSettings, value: string) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addMenuItem = () => {
    setData(prev => ({
      ...prev,
      menuItems: [
        ...prev.menuItems,
        {
          name: 'JAUNS PUNKTS',
          href: '/new-page',
          order: prev.menuItems.length + 1,
          active: false,
          visible: true
        }
      ]
    }));
  };

  const removeMenuItem = (index: number) => {
    setData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }));
  };


  const setActiveMenuItem = (index: number) => {
    setData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) => ({
        ...item,
        active: i === index
      }))
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      alert('Lūdzu, izvēlieties attēla failu.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'sdkthunder/navbar');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const result = await response.json();

      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          logoImage: result.url
        }
      }));

      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Kļūda augšupielādējot logo. Lūdzu, mēģiniet vēlreiz.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleRemoveLogo = () => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        logoImage: null
      }
    }));
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = '';
    }
  };

  const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      alert('Lūdzu, izvēlieties attēla failu.');
      return;
    }

    setIsUploadingFavicon(true);
    setFaviconUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setFaviconUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'sdkthunder/favicon');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setFaviconUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const result = await response.json();

      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          faviconUrl: result.url
        }
      }));

      if (faviconFileInputRef.current) {
        faviconFileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading favicon:', error);
      alert('Kļūda augšupielādējot favicon. Lūdzu, mēģiniet vēlreiz.');
    } finally {
      setTimeout(() => {
        setIsUploadingFavicon(false);
        setFaviconUploadProgress(0);
      }, 500);
    }
  };

  const handleRemoveFavicon = () => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        faviconUrl: null
      }
    }));
    if (faviconFileInputRef.current) {
      faviconFileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/navbar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoText: data.settings.logoText,
          logoSubtext: data.settings.logoSubtext,
          logoImage: data.settings.logoImage,
          faviconUrl: data.settings.faviconUrl,
          menuItems: data.menuItems,
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving Navbar data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
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
    <ProtectedLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navbar Iestatījumi</h1>
          <p className="text-gray-600 mt-1">
            Rediģējiet navigācijas joslas logo un izvēlni
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
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saglabā...' : 'Saglabāt'}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <div className={`flex items-center p-4 rounded-lg ${
          saveStatus === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {saveStatus === 'success' 
            ? 'Izmaiņas veiksmīgi saglabātas!' 
            : 'Kļūda saglabājot izmaiņas. Mēģiniet vēlreiz.'
          }
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className="space-y-6">
          {/* Logo Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Logo iestatījumi</h2>

            <div className="space-y-6">
              {/* Logo attēls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo attēls
                </label>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                    {data.settings.logoImage ? (
                      <div className="relative w-full h-full">
                        <NextImage
                          src={data.settings.logoImage}
                          alt="Logo attēls"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm text-center p-2">
                        <Image className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-xs">Nav logo</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin mb-1" />
                        <span className="text-xs">{uploadProgress}%</span>
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
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {data.settings.logoImage && (
                      <button
                        onClick={handleRemoveLogo}
                        className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Noņemt logo
                      </button>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Ieteicamais izmērs: 200x80px, PNG ar caurspīdīgu fonu. Ja nav attēla, tiks rādīts teksts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Favicon</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon attēls
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                        {data.settings.faviconUrl ? (
                          <div className="relative w-full h-full">
                            <NextImage
                              src={data.settings.faviconUrl}
                              alt="Favicon"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm text-center p-2">
                            <Image className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          </div>
                        )}

                        {isUploadingFavicon && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin mb-1" />
                            <span className="text-xs">{faviconUploadProgress}%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Augšupielādēt favicon
                          <input
                            ref={faviconFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconChange}
                            className="hidden"
                          />
                        </label>

                        {data.settings.faviconUrl && (
                          <button
                            onClick={handleRemoveFavicon}
                            className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Noņemt favicon
                          </button>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          Ieteicamais izmērs: 32x32px vai 64x64px, PNG/ICO formātā.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teksta alternatīva */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Teksta alternatīva (ja nav logo)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galvenais teksts
                    </label>
                    <input
                      type="text"
                      value={data.settings.logoText}
                      onChange={(e) => handleSettingsChange('logoText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                      placeholder="SDK"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apakšteksts
                    </label>
                    <input
                      type="text"
                      value={data.settings.logoSubtext}
                      onChange={(e) => handleSettingsChange('logoSubtext', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                      placeholder="THUNDER"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Izvēlnes punkti</h2>
              <button
                onClick={addMenuItem}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Pievienot
              </button>
            </div>
            
            <div className="space-y-3">
              {data.menuItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      <span className="text-sm font-medium text-gray-700">Punkts #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveMenuItem(index)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                          item.active 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                        }`}
                      >
                        {item.active ? 'Aktīvs' : 'Iestatīt aktīvu'}
                      </button>
                      <button
                        onClick={() => removeMenuItem(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nosaukums
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Saite
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => handleMenuItemChange(index, 'href', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={(e) => handleMenuItemChange(index, 'visible', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Redzams izvēlnē</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Priekšskatījums</h2>
              
              {/* Navbar Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <nav className="bg-white shadow-lg">
                  <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                            {data.settings.logoImage ? (
                              <NextImage
                                src={data.settings.logoImage}
                                alt="Logo"
                                width={64}
                                height={64}
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <div className="text-white font-bold text-xs text-center leading-tight">
                                <div>{data.settings.logoText}</div>
                                <div className="text-[10px]">{data.settings.logoSubtext}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Desktop Menu */}
                      <div className="hidden lg:flex space-x-1">
                        {data.menuItems.filter(item => item.visible).map((item, index) => (
                          <a
                            key={index}
                            href={item.href}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                              item.active
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-red-100 hover:text-red-600'
                            }`}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>

                      {/* Mobile menu button */}
                      <div className="lg:hidden">
                        <button className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100">
                          <Menu size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Tā navigācijas josla izskatīsies mājas lapā
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Padomi</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Velciet punktus ar ikonu, lai mainītu secību</li>
                <li>• Tikai viens punkts var būt aktīvs vienlaicīgi</li>
                <li>• Izmantojiet &quot;Redzams izvēlnē&quot; lai paslēptu punktus</li>
                <li>• Logo teksts parādās divās rindās</li>
                <li>• Izmaiņas stāsies spēkā uzreiz pēc saglabāšanas</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedLayout>
  );
}