'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  Heart,
  Star,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  Grid3X3,
  List,
  Youtube,
  Link as LinkIcon,
  Play
} from 'lucide-react';

interface GalleryItem {
  id?: number;
  title: string;
  type: 'PHOTO' | 'VIDEO';
  url: string;
  thumbnail?: string;
  mainImage?: string;
  additionalImages: string[];
  additionalUrls: string[];
  category: string;
  tags: string[];
  description?: string;
  author: string;
  featured: boolean;
  order: number;
  views: number;
  likes: number;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  { value: 'all', label: 'Visi' },
  { value: 'games', label: 'Spēles' },
  { value: 'training', label: 'Treniņi' },
  { value: 'events', label: 'Pasākumi' },
  { value: 'team', label: 'Komanda' }
];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all' as 'all' | 'PHOTO' | 'VIDEO',
    showFeatured: false
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const applyFilters = () => {
    let filtered = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.showFeatured) {
      filtered = filtered.filter(item => item.featured);
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [items, filters, applyFilters]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newItem: GalleryItem = {
      title: '',
      type: 'PHOTO',
      url: '',
      mainImage: '',
      additionalImages: [],
      additionalUrls: [],
      category: 'all',
      tags: [],
      description: '',
      author: 'SDKThunder',
      featured: false,
      order: 0,
      views: 0,
      likes: 0
    };
    setEditing(newItem);
    setIsAddingNew(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditing({ ...item });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editing || !editing.title.trim()) return;

    // Validācija
    if (editing.type === 'PHOTO' && !editing.url && !editing.mainImage) {
      alert('Foto ierakstam ir jāpievienots attēls!');
      return;
    }

    if (editing.type === 'VIDEO' && !editing.url) {
      alert('Video ierakstam ir jāpievienots URL!');
      return;
    }

    setIsSaving(true);
    try {
      const method = isAddingNew ? 'POST' : 'PUT';
      const url = isAddingNew ? '/api/gallery' : `/api/gallery/${editing.id}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing)
      });

      if (res.ok) {
        const savedItem = await res.json();
        if (isAddingNew) {
          setItems([savedItem, ...items]);
        } else {
          setItems(items.map(item => item.id === savedItem.id ? savedItem : item));
        }

        setSaveStatus('success');
        setEditing(null);
        setIsAddingNew(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo ierakstu?')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  // YouTube URL funkcijas
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleYouTubeUrl = (url: string) => {
    if (!editing) return;

    const videoId = extractYouTubeId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const thumbnailUrl = getYouTubeThumbnail(videoId);
      
      setEditing({
        ...editing,
        url: embedUrl,
        thumbnail: thumbnailUrl,
        mainImage: thumbnailUrl // Izmantojam YouTube thumbnail kā galveno attēlu
      });
    } else {
      // Ja nav YouTube URL, izmantojam kā parastu video URL
      setEditing({
        ...editing,
        url: url
      });
    }
  };

  // Foto augšupielāde (tikai PHOTO tipam)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `sdkthunder/gallery/${editing.type.toLowerCase()}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const result = await res.json();
      setEditing({
        ...editing,
        url: result.url,
        mainImage: result.url
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Kļūda augšupielādējot failu');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Galvenā attēla augšupielāde (tikai PHOTO tipam)
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'sdkthunder/gallery/covers');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const result = await res.json();
      setEditing({
        ...editing,
        mainImage: result.url
      });
    } catch (error) {
      console.error('Error uploading main image:', error);
      alert('Kļūda augšupielādējot galveno attēlu');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Papildus attēlu augšupielāde (tikai PHOTO tipam)
  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editing) return;

    setUploadingMedia(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'sdkthunder/gallery/additional');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        return await res.json();
      });

      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(result => result.url);

      setEditing({
        ...editing,
        additionalImages: [...editing.additionalImages, ...newImageUrls]
      });
    } catch (error) {
      console.error('Error uploading additional images:', error);
      alert('Kļūda augšupielādējot papildus attēlus');
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      additionalImages: editing.additionalImages.filter((_, index) => index !== indexToRemove)
    });
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, featured: !item.featured })
      });

      if (res.ok) {
        const updated = await res.json();
        setItems(items.map(i => i.id === updated.id ? updated : i));
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Ielādē galeriju...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galerijas Pārvaldība</h1>
          <p className="text-gray-600 mt-2">Pārvaldiet foto un video galeriju</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Pievienot mediju
        </button>
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

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Meklēt..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | 'PHOTO' | 'VIDEO' })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Visi tipi</option>
            <option value="PHOTO">Foto</option>
            <option value="VIDEO">Video</option>
          </select>

          <button
            onClick={() => setFilters({ ...filters, showFeatured: !filters.showFeatured })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.showFeatured
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Star className="w-4 h-4 mr-2 inline" />
            Izceltie
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-gray-600 flex flex-col">
            <span>Kopā: {items.length}</span>
            <span>Foto: {items.filter(i => i.type === 'PHOTO').length}</span>
            <span>Video: {items.filter(i => i.type === 'VIDEO').length}</span>
            <span className="font-medium">Rādīti: {filteredItems.length}</span>
          </div>
        </div>
      </div>

      {/* Gallery Items */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Media Preview */}
            <div className="relative aspect-video bg-gray-100">
              {item.url ? (
                <>
                  {item.type === 'PHOTO' ? (
                    <Image
                      src={item.mainImage || item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      {item.thumbnail || item.mainImage ? (
                        <Image
                          src={item.thumbnail || item.mainImage || ''}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      {item.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'PHOTO' ? (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Video className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                  item.type === 'PHOTO' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.type === 'PHOTO' ? 'Foto' : 'Video'}
                </span>
                {item.featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-lg">
                    Izcelts
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {item.views}
                </span>
                <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {item.likes}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{categories.find(c => c.value === item.category)?.label || item.category}</span>
                <span>{item.author}</span>
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    item.featured
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1 inline" />
                  {item.featured ? 'Izcelts' : 'Izcelt'}
                </button>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nav atrasti galerijas ieraksti</h3>
          <button
            onClick={handleAddNew}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Pievienot pirmo ierakstu
          </button>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isAddingNew ? 'Pievienot mediju' : 'Rediģēt mediju'}
              </h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setIsAddingNew(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tips *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="PHOTO"
                      checked={editing.type === 'PHOTO'}
                      onChange={() => setEditing({ ...editing, type: 'PHOTO', url: '', thumbnail: '' })}
                      className="mr-2"
                    />
                    Foto
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="VIDEO"
                      checked={editing.type === 'VIDEO'}
                      onChange={() => setEditing({ ...editing, type: 'VIDEO', url: '', mainImage: '', additionalImages: [] })}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nosaukums *</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Ievadiet nosaukumu..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Media Upload/URL - atšķirīgi pēc tipa */}
              {editing.type === 'PHOTO' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto *</label>
                  {editing.url && (
                    <div className="mb-2">
                      <Image
                        src={editing.url}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {uploadingMedia ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Augšupielādē...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Augšupielādēt foto
                        </>
                      )}
                    </button>
                    {editing.url && (
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, url: '', mainImage: '' })}
                        className="text-red-600 hover:text-red-700"
                      >
                        Noņemt
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                  <div className="space-y-3">
                    {/* YouTube URL ievade */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Youtube className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium">YouTube URL</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleYouTubeUrl(e.target.value);
                            e.target.value = ''; // Notīrām input
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ielīmējiet YouTube saiti un nospiediet Enter vai noklikšķiniet ārpus lauka
                      </p>
                    </div>

                    <div className="text-center text-gray-500 text-sm">VAI</div>

                    {/* Cits video URL */}
                    <div>
                      <div className="flex items-center mb-2">
                        <LinkIcon className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium">Cits video URL</span>
                      </div>
                      <input
                        type="url"
                        value={editing.url}
                        onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Video preview */}
                    {editing.url && (
                      <div className="mt-3">
                        <div className="aspect-video w-32 bg-gray-100 rounded-lg flex items-center justify-center relative">
                          {editing.thumbnail || editing.mainImage ? (
                            <Image
                              src={editing.thumbnail || editing.mainImage || ''}
                              alt="Video preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Video className="w-8 h-8 text-gray-400" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white opacity-75" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Foto specifiskās opcijas */}
              {editing.type === 'PHOTO' && (
                <>
                  {/* Main Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galvenais attēls (cover)
                    </label>
                    {editing.mainImage && (
                      <div className="mb-2 relative inline-block">
                        <Image
                          src={editing.mainImage}
                          alt="Main cover"
                          width={128}
                          height={128}
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, mainImage: '' })}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('mainImageInput')?.click()}
                        disabled={uploadingMedia}
                        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {uploadingMedia ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Augšupielādē...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Augšupielādēt cover
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      id="mainImageInput"
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Papildus attēli
                    </label>
                    {editing.additionalImages.length > 0 && (
                      <div className="mb-2 grid grid-cols-4 gap-2">
                        {editing.additionalImages.map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image}
                              alt={`Additional ${index + 1}`}
                              width={80}
                              height={80}
                              className="object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => document.getElementById('additionalImagesInput')?.click()}
                      disabled={uploadingMedia}
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {uploadingMedia ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Augšupielādē...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Pievienot attēlus
                        </>
                      )}
                    </button>
                    <input
                      id="additionalImagesInput"
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Vari izvēlēties vairākus failus uzreiz
                    </p>
                  </div>
                </>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apraksts</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Pievienojiet aprakstu..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagi (atdalīti ar komatu)</label>
                <input
                  type="text"
                  value={editing.tags.join(', ')}
                  onChange={(e) => setEditing({
                    ...editing,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="sports, komanda, uzvaras..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Video Duration - tikai video */}
              {editing.type === 'VIDEO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video ilgums</label>
                  <input
                    type="text"
                    value={editing.duration || ''}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Autors</label>
                <input
                  type="text"
                  value={editing.author}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  placeholder="SDKThunder"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secība (mazākais skaitlis parādās pirmais)</label>
                <input
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Izcelt galerijas sākumā</label>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditing(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Atcelt
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editing.title.trim() || !editing.url}
                className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saglabā...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isAddingNew ? 'Pievienot' : 'Saglabāt'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}