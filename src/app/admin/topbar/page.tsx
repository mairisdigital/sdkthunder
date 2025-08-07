'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Save, 
  Eye, 
  Facebook, 
  Instagram, 
  Youtube,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface TopBarData {
  email: string;
  emailLabel: string;
  location: string;
  locationLabel: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export default function AdminTopBar() {
  const [data, setData] = useState<TopBarData>({
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Ielādējam datus no datubāzes
  useEffect(() => {
    fetchTopBarData();
  }, []);

  const fetchTopBarData = async () => {
    try {
      const response = await fetch('/api/admin/topbar');
      if (response.ok) {
        const dbData = await response.json();
        setData({
          email: dbData.email,
          emailLabel: dbData.emailLabel || 'E-PASTS:',
          location: dbData.location,
          locationLabel: dbData.locationLabel || 'NĀKAMĀ PIETURA:',
          socialLinks: {
            facebook: dbData.facebook || '',
            instagram: dbData.instagram || '',
            youtube: dbData.youtube || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching TopBar data:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TopBarData, value: string) => {
    if (field === 'socialLinks') return;
    
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof TopBarData['socialLinks'], value: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/topbar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          emailLabel: data.emailLabel,
          location: data.location,
          locationLabel: data.locationLabel,
          facebook: data.socialLinks.facebook,
          instagram: data.socialLinks.instagram,
          youtube: data.socialLinks.youtube,
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving TopBar data:', error);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TopBar Iestatījumi</h1>
          <p className="text-gray-600 mt-1">
            Rediģējiet augšējās joslas kontaktinformāciju un sociālos tīklus
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kontaktinformācija</h2>
            
            <div className="space-y-4">
              {/* Email Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-pasta etiķete
                </label>
                <input
                  type="text"
                  value={data.emailLabel}
                  onChange={(e) => handleInputChange('emailLabel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="E-PASTS:"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  E-pasta adrese
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="info@sdkthunder.com"
                />
              </div>

              {/* Location Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vietas etiķete
                </label>
                <input
                  type="text"
                  value={data.locationLabel}
                  onChange={(e) => handleInputChange('locationLabel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="NĀKAMĀ PIETURA:"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Atrašanās vieta
                </label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="Rīga, Latvija"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sociālie tīkli</h2>
            
            <div className="space-y-4">
              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook className="w-4 h-4 inline mr-2" />
                  Facebook saite
                </label>
                <input
                  type="url"
                  value={data.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="https://facebook.com/sdkthunder"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="w-4 h-4 inline mr-2" />
                  Instagram saite
                </label>
                <input
                  type="url"
                  value={data.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="https://instagram.com/sdkthunder"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="w-4 h-4 inline mr-2" />
                  YouTube saite
                </label>
                <input
                  type="url"
                  value={data.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  placeholder="https://youtube.com/@sdkthunder"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Priekšskatījums</h2>
              
              {/* TopBar Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-4 rounded">
                  <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    {/* Contact Info */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-2 md:mb-0">
                      <div className="flex items-center gap-2 hover:text-red-400 transition-colors duration-300">
                        <Mail size={16} className="text-red-500" />
                        <span className="font-medium">{data.emailLabel}</span>
                        <span className="hover:underline">
                          {data.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-red-400 transition-colors duration-300">
                        <MapPin size={16} className="text-red-500" />
                        <span className="font-medium">{data.locationLabel}</span>
                        <span>{data.location}</span>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex gap-4">
                      <a 
                        href={data.socialLinks.facebook}
                        className="w-8 h-8 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-4 h-4 fill-current" />
                      </a>
                      <a 
                        href={data.socialLinks.instagram}
                        className="w-8 h-8 bg-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4 fill-current" />
                      </a>
                      <a 
                        href={data.socialLinks.youtube}
                        className="w-8 h-8 bg-slate-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Tā TopBar izskatīsies mājas lapā
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Padomi</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• E-pasta adresei jābūt derīgai, lai apmeklētāji varētu sazināties</li>
                <li>• Atrašanās vieta tiek rādīta kā &quot;NĀKAMĀ PIETURA&quot;</li>
                <li>• Sociālo tīklu saites var atstāt tukšas, ja nav kontu</li>
                <li>• Izmaiņas stāsies spēkā uzreiz pēc saglabāšanas</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}