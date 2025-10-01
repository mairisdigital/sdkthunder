'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  User,
  Eye,
  MessageCircle,
  Tag,
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  Heart,
  Share2,
  BookOpen,
  X,
  ZoomIn} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  image: string | null;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  trending: boolean;
  readTime: number;
  views: number;
  comments: number;
  likes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const NewsPageSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Visi jaunumi', count: 0 }
  ]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Fetch news data from API
  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const res = await fetch('/api/news');
        
        if (!res.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data: NewsArticle[] = await res.json();
        
        // Filter only published articles
        const publishedNews = data.filter(article => article.published);
        setNews(publishedNews);
        
        // Generate categories with counts
        const categoryMap = new Map();
        categoryMap.set('all', { id: 'all', name: 'Visi jaunumi', count: publishedNews.length });
        
        publishedNews.forEach(article => {
          if (categoryMap.has(article.category)) {
            categoryMap.get(article.category).count++;
          } else {
            categoryMap.set(article.category, {
              id: article.category,
              name: article.category,
              count: 1
            });
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
        setError(null);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Neizdevās ielādēt jaunumus');
      } finally {
        setLoading(false);
      }
    }
    
    fetchNews();
  }, []);

  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default:
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Spēles': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'Komanda': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20';
      case 'Pasākumi': return 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20';
      case 'Infrastruktūra': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Vakar';
    if (diffDays === 0) return 'Šodien';
    if (diffDays < 7) return `Pirms ${diffDays} dienām`;
    
    return date.toLocaleDateString('lv-LV', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="animate-pulse flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mr-3"></div>
            </div>
            <div className="hidden lg:flex space-x-1">
              {[1,2,3,4,5,6,7].map((i) => (
                <div key={i} className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
              ))}
            </div>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Kļūda ielādējot jaunumus</h2>
                <p className="text-red-600 mb-6 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Mēģināt vēlreiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (news.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Nav pieejami jaunumi</h2>
                <p className="text-slate-600 text-sm">Jaunumi drīzumā būs pieejami.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredArticles = sortedNews.filter(article => article.featured);
  const regularArticles = sortedNews.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            title="Aizvērt"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Full size image"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-slate-800">Visi </span>
              <span className="text-red-600 relative">
                Jaunumi
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Sekojiet līdzi visiem jaunākajiem notikumiem un ziņām no SDKThunder pasaules
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 border border-white/20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Meklēt jaunumus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'trending')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white/80 backdrop-blur-sm"
                >
                  <option value="newest">Jaunākie</option>
                  <option value="popular">Populārākie</option>
                  <option value="trending">Aktuālākie</option>
                </select>
              </div>
            </div>

            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-red-600" />
                  Aktuālākie jaunumi
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredArticles.map((article) => (
                    <Link 
                      key={article.id}
                      href={`/news/${article.slug || article.id}`}
                      className="block group cursor-pointer"
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-red-200 hover:scale-[1.02]">
                        
                        <div className="relative h-64 overflow-hidden">
                          {article.trending && (
                            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </div>
                          )}

                          <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setLightboxImage(article.image);
                              }}
                              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                              title="Skatīt pilnu attēlu"
                            >
                              <ZoomIn className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => e.preventDefault()}
                              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                            >
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <Image
                            src={article.image || '/placeholder.jpg'}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getCategoryColor(article.category)}`}>
                              <Tag className="w-3 h-3 inline mr-1" />
                              {article.category}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(article.publishedAt || article.createdAt)}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readTime} min lasīšana
                            </div>
                          </div>

                          <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                            {article.title}
                          </h2>

                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {article.summary}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="w-4 h-4 mr-1" />
                              {article.author}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {article.views > 1000 ? `${Math.floor(article.views / 1000)}k` : article.views}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 group">
                            Lasīt vairāk
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Visi jaunumi</h2>
              
              {sortedNews.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg">Nav atrasti jaunumi pēc jūsu kritērijiem</p>
                  <p className="text-gray-500 text-sm mt-2">Mēģiniet mainīt filtrus vai meklēšanas vārdus</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article) => (
                    <Link 
                      key={article.id}
                      href={`/news/${article.slug || article.id}`}
                      className="block group cursor-pointer"
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20 hover:border-red-200 hover:scale-[1.02]">
                        
                        <div className="relative h-48 overflow-hidden">
                          {article.trending && (
                            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                              <TrendingUp className="w-3 h-3 inline mr-1" />
                              Hot
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setLightboxImage(article.image);
                            }}
                            className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                            title="Skatīt pilnu attēlu"
                          >
                            <ZoomIn className="w-3 h-3 text-gray-600" />
                          </button>
                        <Image
                            src={article.image || '/placeholder.jpg'}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(article.publishedAt || article.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 mb-2">
                            {article.title}
                          </h3>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {article.summary}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{article.author}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {article.views > 1000 ? `${Math.floor(article.views / 1000)}k` : article.views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {regularArticles.length > 0 && (
              <div className="text-center pt-8 border-t border-gray-200">
                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  Ielādēt vairāk jaunumu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPageSection;