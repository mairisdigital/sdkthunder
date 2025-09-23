'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedLayout from '../components/ProtectedLayout';
import {
  Save,
  Edit3,
  Plus,
  Trash2,
  Upload,
  Users,
  Trophy,
  Calendar,
  Heart,
  Target,
  Award,
  Globe,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AboutContent {
  id?: number;
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
  learnMoreButtonText: string;
  isActive: boolean;
}

interface AboutValue {
  id?: number;
  text: string;
  order: number;
  isActive: boolean;
}

interface AboutStat {
  id?: number;
  icon: string;
  number: string;
  label: string;
  color: string;
  order: number;
  isActive: boolean;
}

const iconOptions = [
  { value: 'Users', label: 'Lietotāji', component: Users },
  { value: 'Trophy', label: 'Kauss', component: Trophy },
  { value: 'Calendar', label: 'Kalendārs', component: Calendar },
  { value: 'Heart', label: 'Sirds', component: Heart },
  { value: 'Target', label: 'Mērķis', component: Target },
  { value: 'Award', label: 'Balva', component: Award },
  { value: 'Globe', label: 'Globuss', component: Globe },
];

const colorOptions = [
  { value: 'from-blue-500 to-blue-600', label: 'Zils' },
  { value: 'from-red-500 to-red-600', label: 'Sarkans' },
  { value: 'from-green-500 to-green-600', label: 'Zaļš' },
  { value: 'from-purple-500 to-purple-600', label: 'Violets' },
  { value: 'from-yellow-500 to-yellow-600', label: 'Dzeltens' },
  { value: 'from-orange-500 to-orange-600', label: 'Oranžs' },
];

export default function AdminAbout() {
  const [content, setContent] = useState<AboutContent>({
    title: '',
    mainStory: '',
    foundedYear: '2018',
    ctaSubtext: '',
    contactButtonText: 'Sazināties ar mums',
    learnMoreButtonText: 'Uzzināt vairāk',
    isActive: true
  });
  
  const [values, setValues] = useState<AboutValue[]>([]);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'content' | 'values' | 'stats'>('content');
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null);
  const [editingStat, setEditingStat] = useState<AboutStat | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aboutRes, valuesRes, statsRes] = await Promise.all([
        fetch('/api/about'),
        fetch('/api/about/values'),
        fetch('/api/about/stats')
      ]);

      if (aboutRes.ok && valuesRes.ok && statsRes.ok) {
        const aboutData = await aboutRes.json();
        const valuesData = await valuesRes.json();
        const statsData = await statsRes.json();

        setContent(aboutData.content);
        setValues(valuesData);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

    // AdminAbout komponentes handleSaveContent funkcijā
    const handleSaveContent = async () => {
    setSaving(true);
    try {
        // Pārliecinamies, ka sūtām pilnus datus
        const contentToSave = {
        ...content,
        // Pievienojam default vērtības, ja kāds lauks ir tukšs
        ctaSubtext: content.ctaSubtext || "Ja tev ir kaislība basketbolam un vēlies atbalstīt Latvijas sportistus, mēs vienmēr esam atvērti jauniem biedriem.",
        contactButtonText: content.contactButtonText || "Sazināties ar mums",
        learnMoreButtonText: content.learnMoreButtonText || "Uzzināt vairāk"
        };

        const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentToSave })
        });

        if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
        throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Error saving content:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
        setSaving(false);
    }
    };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'backgroundImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'sdkthunder/about');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        setContent({ ...content, [field]: result.url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSaveValue = async (value: AboutValue) => {
    try {
      const method = value.id ? 'PUT' : 'POST';
      const url = value.id ? `/api/about/values/${value.id}` : '/api/about/values';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value)
      });

      if (res.ok) {
        const savedValue = await res.json();
        if (value.id) {
          setValues(values.map(v => v.id === value.id ? savedValue : v));
        } else {
          setValues([...values, savedValue]);
        }
        setEditingValue(null);
      }
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleDeleteValue = async (id: number) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo vērtību?')) return;

    try {
      const res = await fetch(`/api/about/values/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setValues(values.filter(v => v.id !== id));
      }
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  const handleSaveStat = async (stat: AboutStat) => {
    try {
      const method = stat.id ? 'PUT' : 'POST';
      const url = stat.id ? `/api/about/stats/${stat.id}` : '/api/about/stats';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat)
      });

      if (res.ok) {
        const savedStat = await res.json();
        if (stat.id) {
          setStats(stats.map(s => s.id === stat.id ? savedStat : s));
        } else {
          setStats([...stats, savedStat]);
        }
        setEditingStat(null);
      }
    } catch (error) {
      console.error('Error saving stat:', error);
    }
  };

  const handleDeleteStat = async (id: number) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo statistiku?')) return;

    try {
      const res = await fetch(`/api/about/stats/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStats(stats.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting stat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Ielādē About satu...</span>
        </div>
      </div>
    );
  }

  return (
     <ProtectedLayout>
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Lapas Pārvaldība</h1>
        <p className="text-gray-600">Pārvaldiet About lapas saturu, vērtības un statistiku</p>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800">Darbība veiksmīgi izpildīta!</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">Kļūda! Lūdzu, mēģiniet vēlreiz.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'content', label: 'Galvenais saturs' },
          { key: 'values', label: 'Vērtības' },
          { key: 'stats', label: 'Statistika' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'content' | 'values' | 'stats')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galvenais nosaukums</label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Kā radās SDKThunder"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apakšnosaukums</label>
                <input
                  type="text"
                  value={content.subtitle || ''}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Papildus nosaukums (nav obligāts)"
                />
              </div>

              {/* Main Story */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galvenais stāsts</label>
                <textarea
                  value={content.mainStory}
                  onChange={(e) => setContent({ ...content, mainStory: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="Mūsu stāsts sākās..."
                />
              </div>

              {/* Slogans */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slogans 1</label>
                  <input
                    type="text"
                    value={content.slogan1 || ''}
                    onChange={(e) => setContent({ ...content, slogan1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Viens par visiem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slogans 2</label>
                  <input
                    type="text"
                    value={content.slogan2 || ''}
                    onChange={(e) => setContent({ ...content, slogan2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Visi par vienu!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slogans 3</label>
                  <input
                    type="text"
                    value={content.slogan3 || ''}
                    onChange={(e) => setContent({ ...content, slogan3: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Kopīgiem spēkiem godu un cieņu!"
                  />
                </div>
              </div>

              {/* Founded Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dibināšanas gads</label>
                <input
                  type="text"
                  value={content.foundedYear}
                  onChange={(e) => setContent({ ...content, foundedYear: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                {content.logoUrl && (
                  <div className="mb-2">
                    <Image
                      src={content.logoUrl || ''}
                      alt="Logo"
                      width={128}
                      height={128}
                      className="object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('logoInput')?.click()}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Augšupielādēt logo
                </button>
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logoUrl')}
                  className="hidden"
                />
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fona attēls</label>
                {content.backgroundImageUrl && (
                  <div className="mb-2">
                    <Image
                      src={content.backgroundImageUrl || ''}
                      alt="Logo"
                      width={128}
                      height={128}
                      className="object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('backgroundInput')?.click()}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Augšupielādēt fonu
                </button>
                <input
                  id="backgroundInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'backgroundImageUrl')}
                  className="hidden"
                />
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA nosaukums</label>
                  <input
                    type="text"
                    value={content.ctaText || ''}
                    onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Pievienojies mūsu komandai!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA apraksts</label>
                  <textarea
                    value={content.ctaSubtext}
                    onChange={(e) => setContent({ ...content, ctaSubtext: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="Ja tev ir kaislība basketbolam..."
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kontaktu pogas teksts</label>
                    <input
                      type="text"
                      value={content.contactButtonText}
                      onChange={(e) => setContent({ ...content, contactButtonText: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">&quot;Uzzināt vairāk&quot; pogas teksts</label>
                    <input
                      type="text"
                      value={content.learnMoreButtonText}
                      onChange={(e) => setContent({ ...content, learnMoreButtonText: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saglabā...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saglabāt saturu
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Values Tab */}
      {activeTab === 'values' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mūsu vērtības</h2>
            <button
              onClick={() => setEditingValue({ text: '', order: values.length, isActive: true })}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Pievienot vērtību
            </button>
          </div>

          <div className="space-y-4">
            {values.map((value) => (
              <div key={value.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{value.text}</p>
                    <span className="text-xs text-gray-500">Secība: {value.order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingValue(value)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteValue(value.id!)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Value Modal */}
          {editingValue && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {editingValue.id ? 'Rediģēt vērtību' : 'Pievienot vērtību'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teksts</label>
                    <textarea
                      value={editingValue.text}
                      onChange={(e) => setEditingValue({ ...editingValue, text: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secība</label>
                    <input
                      type="number"
                      value={editingValue.order}
                      onChange={(e) => setEditingValue({ ...editingValue, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingValue(null)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Atcelt
                  </button>
                  <button
                    onClick={() => handleSaveValue(editingValue)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Saglabāt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Statistika</h2>
            <button
              onClick={() => setEditingStat({
                icon: 'Users',
                number: '',
                label: '',
                color: 'from-blue-500 to-blue-600',
                order: stats.length,
                isActive: true
              })}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Pievienot statistiku
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => {
              const IconComponent = iconOptions.find(option => option.value === stat.icon)?.component || Users;
              
              return (
                <div key={stat.id} className="border border-gray-200 rounded-lg p-6 relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => setEditingStat(stat)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteStat(stat.id!)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Stat Modal */}
          {editingStat && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {editingStat.id ? 'Rediģēt statistiku' : 'Pievienot statistiku'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ikona</label>
                    <select
                      value={editingStat.icon}
                      onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skaitlis</label>
                    <input
                      type="text"
                      value={editingStat.number}
                      onChange={(e) => setEditingStat({ ...editingStat, number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="45+"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apraksts</label>
                    <textarea
                      value={editingStat.label}
                      onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Krāsa</label>
                    <select
                      value={editingStat.color}
                      onChange={(e) => setEditingStat({ ...editingStat, color: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secība</label>
                    <input
                      type="number"
                      value={editingStat.order}
                      onChange={(e) => setEditingStat({ ...editingStat, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingStat(null)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Atcelt
                  </button>
                  <button
                    onClick={() => handleSaveStat(editingStat)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Saglabāt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </ProtectedLayout>
  );
}
