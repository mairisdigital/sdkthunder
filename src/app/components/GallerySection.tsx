'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import {
  Camera,
  Play,
  Grid3X3,
  List,
  Search,
  Download,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Eye,
  ChevronUp
} from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
  downloads: ReactNode;
  date: string | number | Date;
  id: number;
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
  createdAt: string;
  updatedAt: string;
}

const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState(false);

  // Kategorijas
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Visi', count: 0 },
  ]);

  useEffect(() => {
    fetchGalleryItems();
    loadLikedItems();
  }, []);

  const loadLikedItems = () => {
    try {
      const saved = localStorage.getItem('gallery-likes');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLikedItems(new Set(parsed));
      }
    } catch (error) {
      console.error('Error loading liked items:', error);
    }
  };

  const saveLikedItems = (newLikedItems: Set<number>) => {
    try {
      localStorage.setItem('gallery-likes', JSON.stringify(Array.from(newLikedItems)));
    } catch (error) {
      console.error('Error saving liked items:', error);
    }
  };

  const fetchGalleryItems = async () => {
    // setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data: GalleryItem[] = await res.json();
        setGalleryItems(data);

        // Dinamiskās kategorijas
        const categoryMap = new Map();
        categoryMap.set('all', { id: 'all', name: 'Visi', count: data.length });

        const categoryNames: { [key: string]: string } = {
          'games': 'Spēles',
          'training': 'Treniņi',
          'events': 'Pasākumi',
          'team': 'Komanda'
        };

        data.forEach(item => {
          if (item.category !== 'all') {
            if (categoryMap.has(item.category)) {
              categoryMap.get(item.category).count++;
            } else {
              categoryMap.set(item.category, {
                id: item.category,
                name: categoryNames[item.category] || item.category,
                count: 1
              });
            }
          }
        });

        setCategories(Array.from(categoryMap.values()));
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleLike = async (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (likedItems.has(id)) {
      return;
    }

    try {
      const item = galleryItems.find(i => i.id === id);
      if (!item) return;

      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...item, 
          likes: item.likes + 1 
        })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        
        setGalleryItems(galleryItems.map(i => 
          i.id === id ? updatedItem : i
        ));
        
        const newLikedItems = new Set(likedItems);
        newLikedItems.add(id);
        setLikedItems(newLikedItems);
        saveLikedItems(newLikedItems);
        
        if (selectedMedia?.id === id) {
          setSelectedMedia(updatedItem);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

    const HeartIcon = ({ 
      itemId, 
      onClick, 
      size = 4 
    }: { 
      itemId: number, 
      onClick?: () => void, 
      size?: number 
    }) => {
      const isLiked = likedItems.has(itemId);
    
    return (
    <Heart 
      className={`w-${size} h-${size} ${isLiked ? 'fill-current text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors duration-200 ${
        isLiked ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={isLiked ? undefined : onClick}
    />
      );
    };

  const photos = galleryItems.filter(item =>
    item.type === 'PHOTO' &&
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const videos = galleryItems.filter(item =>
    item.type === 'VIDEO' &&
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAllImages = (item: GalleryItem): string[] => {
    const images = [];
    
    if (item.mainImage) {
      images.push(item.mainImage);
    } else if (item.url) {
      images.push(item.url);
    }
    
    if (item.additionalImages && item.additionalImages.length > 0) {
      images.push(...item.additionalImages);
    }
    
    return images;
  };

  const openLightbox = (media: GalleryItem, imageIndex: number = 0) => {
    setSelectedMedia(media);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
    // setIsVideoPlaying(false);
    incrementViews(media.id);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
    setCurrentImageIndex(0);
    // setIsVideoPlaying(false);
  };

  const nextImage = () => {
    if (!selectedMedia) return;
    const images = getAllImages(selectedMedia);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!selectedMedia) return;
    const images = getAllImages(selectedMedia);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const incrementViews = async (id: number) => {
    try {
      const item = galleryItems.find(i => i.id === id);
      if (item) {
        await fetch(`/api/gallery/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, views: item.views + 1 })
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  // Helper function lai pārbaudītu vai ir YouTube video
  const isYouTubeVideo = (url: string): boolean => {
    return url.includes('youtube.com/embed/') || url.includes('youtu.be/');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mūsu <span className="text-red-600">Galerija</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aplūko mūsu komandas dzīvi, uzvaras un aiz kadra momentus
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-2xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'photos'
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              Foto ({photos.length})
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
              Video ({videos.length})
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Meklēt attēlos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
            />
          </div>

          <div className="flex gap-2">
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
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

        {/* Gallery Content - Photos */}
        {activeTab === 'photos' && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {photos.map((photo) => {
              const allImages = getAllImages(photo);
              const hasMultipleImages = allImages.length > 1;

              return (
                <div
                  key={photo.id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => openLightbox(photo, 0)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={photo.mainImage || photo.url}
                      alt={`Foto ${photo.id}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {hasMultipleImages && (
                      <div className="absolute top-3 right-3 bg-black/75 text-white px-2 py-1 rounded-lg text-xs flex items-center">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        +{allImages.length - 1}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {allImages.slice(0, 4).map((img, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="w-8 h-8 rounded border border-white/50 overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openLightbox(photo, imgIndex);
                            }}
                          >
                            <Image
                              src={img}
                              alt={`Preview ${imgIndex + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {photo.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{new Date(photo.createdAt).toLocaleDateString('lv-LV')}</span>
                      <span className="text-gray-500">
                        {categories.find(c => c.id === photo.category)?.name || photo.category}
                      </span>
                    </div>

                    {photo.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {photo.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <HeartIcon 
                            itemId={photo.id}
                            onClick={() => handleLike(photo.id)}
                          />
                          <span className="text-sm text-gray-500">{photo.likes}</span>
                        </div>
                        
                        <span className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {photo.views}
                        </span>
                        {hasMultipleImages && (
                          <span className="flex items-center text-sm text-gray-500">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            {allImages.length}
                          </span>
                        )}
                      </div>
                      
                      <span className="text-xs text-gray-400">
                        {photo.author}
                      </span>
                    </div>

                    {photo.tags && photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {photo.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            #{tag}
                          </span>
                        ))}
                        {photo.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{photo.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gallery Content - Videos ar uzlabotu atskaņošanu */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div 
                  className="aspect-video relative overflow-hidden bg-black cursor-pointer"
                  onClick={() => openLightbox(video, 0)}
                >
                  <Image
                    src={video.mainImage || video.thumbnail || video.url}
                    alt={`Video ${video.id}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-4 right-4 bg-black/75 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-4">{new Date(video.createdAt).toLocaleDateString('lv-LV')}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <HeartIcon 
                          itemId={video.id}
                          onClick={() => handleLike(video.id)}
                        />
                        <span className="text-sm text-gray-500">{video.likes}</span>
                      </div>
                      <span className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{video.author}</span>
                  </div>

                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {video.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          #{tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{video.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Lightbox ar info bloku tieši zem video */}
        {lightboxOpen && selectedMedia && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
            {/* Top header bar */}
            <div className="flex-shrink-0 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
                  <p className="text-gray-300 text-sm">{new Date(selectedMedia.createdAt).toLocaleDateString('lv-LV')}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="text-white hover:text-gray-300 bg-black/50 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 max-w-6xl mx-auto w-full">
              {selectedMedia.type === 'VIDEO' ? (
                // Video player
                <div className="w-full aspect-video mb-4">
                  {isYouTubeVideo(selectedMedia.url) ? (
                    <iframe
                      src={`${selectedMedia.url}?autoplay=1`}
                      title={selectedMedia.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <video
                      src={selectedMedia.url}
                      controls
                      autoPlay
                      className="w-full h-full rounded-lg"
                      poster={selectedMedia.thumbnail || selectedMedia.mainImage}
                    >
                      Jūsu pārlūks neatbalsta video atskaņošanu.
                    </video>
                  )}
                </div>
              ) : (
                // Photo gallery
                <div className="relative w-full flex-1 flex items-center justify-center mb-4">
                  {(() => {
                    const allImages = getAllImages(selectedMedia);
                    const hasMultipleImages = allImages.length > 1;
                    
                    return (
                      <>
                        <Image
                          src={allImages[currentImageIndex]}
                          alt={selectedMedia.title}
                          width={800}
                          height={600}
                          className="max-w-full max-h-full object-contain"
                        />
                        
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}
                        
                        {hasMultipleImages && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} no {allImages.length}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Photo thumbnail navigation */}
              {selectedMedia.type === 'PHOTO' && (() => {
                const allImages = getAllImages(selectedMedia);
                const hasMultipleImages = allImages.length > 1;
                
                return hasMultipleImages && allImages.length > 1 ? (
                  <div className="flex justify-center mb-4">
                    <div className="flex gap-2 max-w-md overflow-x-auto">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-12 h-12 rounded border-2 overflow-hidden flex-shrink-0 ${
                            index === currentImageIndex ? 'border-white' : 'border-gray-500'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Info panel - tieši zem video/foto */}
              <div className="w-full bg-gradient-to-t from-black/95 via-black/80 to-black/60 text-white rounded-lg">
                {/* Toggle button */}
                <div className="flex justify-center py-3">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showInfo ? 'Paslēpt info' : 'Rādīt info'}
                    <ChevronUp className={`w-4 h-4 transition-transform ${showInfo ? 'rotate-0' : 'rotate-180'}`} />
                  </button>
                </div>
                
                {/* Collapsible info content */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-6 pt-2">
                    {/* Description */}
                    {selectedMedia.description && (
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">{selectedMedia.description}</p>
                    )}
                    
                    {/* Tags */}
                    {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedMedia.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-white/20 text-white rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions and stats */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleLike(selectedMedia.id)}
                          disabled={likedItems.has(selectedMedia.id)}
                          className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HeartIcon 
                            itemId={selectedMedia.id}
                            size={4}
                          />
                          <span className="ml-2 text-sm">{selectedMedia.likes}</span>
                        </button>
                        
                        <div className="flex items-center px-3 py-2 bg-white/20 rounded-lg">
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="text-sm">{selectedMedia.views} skatījumi</span>
                        </div>
                        
                        <button className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          <span className="text-sm">Lejupielādēt</span>
                        </button>
                        
                        <button className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4 mr-2" />
                          <span className="text-sm">Dalīties</span>
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-300">{selectedMedia.author}</p>
                        <p className="text-xs text-gray-400">
                          {categories.find(c => c.id === selectedMedia.category)?.name || selectedMedia.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default GallerySection;

