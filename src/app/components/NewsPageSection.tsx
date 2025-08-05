'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  Tag, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  ArrowRight,
  Heart,
  Share2,
  BookOpen
} from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content?: string;
  image: string;
  date: string;
  author: string;
  category: string;
  views: number;
  comments: number;
  likes: number;
  featured: boolean;
  trending?: boolean;
  readTime: number;
}

const NewsPageSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  const categories = [
    { id: 'all', name: 'Visi jaunumi', count: 24 },
    { id: 'Spēles', name: 'Spēles', count: 12 },
    { id: 'Komanda', name: 'Komanda', count: 6 },
    { id: 'Pasākumi', name: 'Pasākumi', count: 4 },
    { id: 'Infrastruktūra', name: 'Infrastruktūra', count: 2 }
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'SDKThunder uzvar draudzības spēlē pret Ventspils komandu',
      summary: 'Vakar vakara spēlē mūsu komanda demonstrēja lielisku sniegumu, uzvarot ar rezultātu 89:76. Izcili spēlēja visi komandas dalībnieki un treneru štābs.',
      content: 'Pilns raksta saturs būs šeit...',
      image: '/news-1.jpg',
      date: '2025-01-15',
      author: 'Jānis Bērziņš',
      category: 'Spēles',
      views: 1247,
      comments: 23,
      likes: 89,
      featured: true,
      trending: true,
      readTime: 5
    },
    {
      id: 2,
      title: 'Jauns treneris pievienojas mūsu komandai',
      summary: 'Ar prieku paziņojam, ka mums pievienojas pieredzējušais treneris Andris Kalniņš, kurš strādās ar jaunajiem spēlētājiem un palīdzēs attīstīt komandas taktiku.',
      image: '/news-2.jpg',
      date: '2025-01-12',
      author: 'Linda Ozola',
      category: 'Komanda',
      views: 892,
      comments: 15,
      likes: 67,
      featured: false,
      readTime: 3
    },
    {
      id: 3,
      title: 'EuroBasket 2025 biļešu pārdošana sākas martā',
      summary: 'Oficiāli apstiprināts, ka biļešu pārdošana uz EuroBasket 2025 spēlēm Rīgā sāksies marta sākumā. Mūsu atbalstītāji varēs iegūt īpašus piedāvājumus.',
      image: '/news-3.jpg',
      date: '2025-01-10',
      author: 'Māris Liepa',
      category: 'Pasākumi',
      views: 1567,
      comments: 34,
      likes: 123,
      featured: true,
      trending: true,
      readTime: 4
    },
    {
      id: 4,
      title: 'Trenažieru zāles renovācija pabeigta',
      summary: 'Mūsu trenažieru zāle ir pilnībā atjaunota ar jaunākajiem sporta trenažieriem un modernu aprīkojumu, kas palīdzēs komandai sasniegt jaunus augstākus rezultātus.',
      image: '/news-4.jpg',
      date: '2025-01-08',
      author: 'Kristīne Dāle',
      category: 'Infrastruktūra',
      views: 445,
      comments: 8,
      likes: 34,
      featured: false,
      readTime: 2
    },
    {
      id: 5,
      title: 'Sezonas pirmā uzvaras spēle pret Liepāju',
      summary: 'Fantastiska spēle ar dramatiskiem momentiem un lieliskiem metieniem. Komanda parādīja, ka ir gatava jaunajiem izaicinājumiem šajā sezonā.',
      image: '/news-5.jpg',
      date: '2025-01-05',
      author: 'Jānis Bērziņš',
      category: 'Spēles',
      views: 1123,
      comments: 28,
      likes: 95,
      featured: false,
      trending: true,
      readTime: 6
    },
    {
      id: 6,
      title: 'Jaunās komandas formas prezentācija',
      summary: 'Šodien notika jaunās komandas formas prezentācija, kurā piedalījās gan spēlētāji, gan fani. Modernas tehnoloģijas un stilīgs dizains.',
      image: '/news-6.jpg',
      date: '2025-01-03',
      author: 'Linda Ozola',
      category: 'Komanda',
      views: 678,
      comments: 12,
      likes: 45,
      featured: false,
      readTime: 3
    }
  ];

  const filteredNews = newsArticles.filter(article => {
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
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Spēles': return 'bg-green-100 text-green-800 border-green-200';
      case 'Komanda': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pasākumi': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Infrastruktūra': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const featuredArticles = sortedNews.filter(article => article.featured);
  const regularArticles = sortedNews.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
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

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
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
                    <article key={article.id} className="group cursor-pointer">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 hover:scale-[1.02]">
                        
                        <div className="relative h-64 overflow-hidden">
                          {article.trending && (
                            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </div>
                          )}
                          
                          <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-gray-500 text-center">
                              <BookOpen className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm">Jaunuma attēls</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                              <Tag className="w-3 h-3 inline mr-1" />
                              {article.category}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(article.date)}
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
                                {article.views}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {article.comments}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {article.likes}
                              </span>
                            </div>
                          </div>

                          <button className="mt-4 flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 group">
                            Lasīt vairāk
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Visi jaunumi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <article key={article.id} className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200 hover:scale-[1.02]">
                      
                      <div className="relative h-48 overflow-hidden">
                        {article.trending && (
                          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            Hot
                          </div>
                        )}

                        <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <BookOpen className="w-8 h-8 mx-auto mb-1" />
                            <p className="text-xs">Attēls</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
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
                              {article.views}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {article.comments}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {article.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="text-center pt-8 border-t border-gray-200">
              <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                Ielādēt vairāk jaunumu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPageSection;