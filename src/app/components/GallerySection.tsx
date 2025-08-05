'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Play, 
  Filter, 
  Grid3X3, 
  List, 
  Search,
  Calendar,
  Download,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';

const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Visi', count: 45 },
    { id: 'games', name: 'Spēles', count: 18 },
    { id: 'training', name: 'Treniņi', count: 12 },
    { id: 'events', name: 'Pasākumi', count: 8 },
    { id: 'team', name: 'Komanda', count: 7 }
  ];

  const photos = [
    {
      id: 1,
      src: '/gallery/photo1.jpg',
      title: 'Uzvaras momentī pēc EuroBasket kvalifikācijas',
      category: 'games',
      date: '2025-01-15',
      likes: 42,
      downloads: 8
    },
    {
      id: 2,
      src: '/gallery/photo2.jpg',
      title: 'Komandas kopbilde pirms sezonas sākuma',
      category: 'team',
      date: '2025-01-12',
      likes: 38,
      downloads: 15
    },
    {
      id: 3,
      src: '/gallery/photo3.jpg',
      title: 'Intensīvs treniņš Xiaomi Arēnā',
      category: 'training',
      date: '2025-01-10',
      likes: 23,
      downloads: 5
    },
    {
      id: 4,
      src: '/gallery/photo4.jpg',
      title: 'Fanu atbalsts mājās spēlē',
      category: 'games',
      date: '2025-01-08',
      likes: 67,
      downloads: 12
    },
    {
      id: 5,
      src: '/gallery/photo5.jpg',
      title: 'Komandas vakariņas pēc uzvaras',
      category: 'events',
      date: '2025-01-05',
      likes: 29,
      downloads: 3
    },
    {
      id: 6,
      src: '/gallery/photo6.jpg',
      title: 'Jauno spēlētāju prezentācija',
      category: 'team',
      date: '2025-01-03',
      likes: 45,
      downloads: 9
    }
  ];

  const videos = [
    {
      id: 1,
      thumbnail: '/gallery/video1-thumb.jpg',
      title: 'Sezonas labākie momenti - Highlights',
      duration: '3:45',
      category: 'games',
      date: '2025-01-14',
      views: 1240,
      likes: 89
    },
    {
      id: 2,
      thumbnail: '/gallery/video2-thumb.jpg',
      title: 'Treniņa aiz kadra - Behind the scenes',
      duration: '2:18',
      category: 'training',
      date: '2025-01-11',
      views: 567,
      likes: 34
    },
    {
      id: 3,
      thumbnail: '/gallery/video3-thumb.jpg',
      title: 'Interviju ar galveno treneri',
      duration: '5:22',
      category: 'team',
      date: '2025-01-09',
      views: 892,
      likes: 56
    }
  ];

  const filteredPhotos = photos.filter(photo => 
    (selectedCategory === 'all' || photo.category === selectedCategory) &&
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(video => 
    (selectedCategory === 'all' || video.category === selectedCategory) &&
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openLightbox = (media: any) => {
    setSelectedMedia(media);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-slate-800">Mūsu </span>
              <span className="text-red-600 relative">
                Galerija
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Aplūko mūsu komandas dzīvi, uzvaras un aiz kadra momentus
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'photos'
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Foto ({filteredPhotos.length})
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'videos'
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Video ({filteredVideos.length})
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Meklēt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'masonry' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {activeTab === 'photos' && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'columns-1 md:columns-2 lg:columns-3'
              }`}>
                {filteredPhotos.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className={`group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
                    onClick={() => openLightbox(photo)}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-[1.02]">
                      <div className="relative overflow-hidden">
                        <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${
                          viewMode === 'grid' ? 'h-64' : `h-${200 + (index % 3) * 50}`
                        }`}>
                          <div className="text-gray-500 text-center">
                            <Camera className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Foto {photo.id}</p>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                        </div>
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                          {photo.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(photo.date).toLocaleDateString('lv-LV')}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {photo.likes}
                            </span>
                            <span className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {photo.downloads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-[1.02]">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Play className="w-16 h-16 mx-auto mb-2" />
                            <p className="text-sm">Video {video.id}</p>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(video.date).toLocaleDateString('lv-LV')}
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{video.views} skatījumi</span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {video.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">{selectedMedia.title}</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {selectedMedia.title}
                </h3>
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(selectedMedia.date).toLocaleDateString('lv-LV')}
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Lejupielādēt
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                      <Share2 className="w-4 h-4 mr-2" />
                      Dalīties
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;