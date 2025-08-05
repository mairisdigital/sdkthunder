'use client';

import React from 'react';
import { Calendar, User, ArrowRight, Eye, MessageCircle, Tag } from 'lucide-react';

const NewsSection: React.FC = () => {
  const news = [
    {
      id: 1,
      title: 'SDKThunder uzvar draudzības spēlē pret Ventspils komandu',
      summary: 'Vakar vakara spēlē mūsu komanda demonstrēja lielisku sniegumu, uzvarot ar rezultātu 89:76. Izcili spēlēja visi komandas dalībnieki.',
      image: '/news-1.jpg',
      date: '2025-01-15',
      author: 'Jānis Bērziņš',
      category: 'Spēles',
      views: 342,
      comments: 12,
      featured: true
    },
    {
      id: 2,
      title: 'Jauns treneris pievienojas mūsu komandai',
      summary: 'Ar prieku paziņojam, ka mums pievienojas pieredzējušais treneris Andris Kalniņš, kurš strādās ar jaunajiem spēlētājiem.',
      image: '/news-2.jpg',
      date: '2025-01-12',
      author: 'Linda Ozola',
      category: 'Komanda',
      views: 189,
      comments: 8,
      featured: false
    },
    {
      id: 3,
      title: 'EuroBasket 2025 biļešu pārdošana sākas martā',
      summary: 'Oficiāli apstiprināts, ka biļešu pārdošana uz EuroBasket 2025 spēlēm Rīgā sāksies marta sākumā. Mūsu atbalstītāji varēs iegūt īpašus piedāvājumus.',
      image: '/news-3.jpg',
      date: '2025-01-10',
      author: 'Māris Liepa',
      category: 'Pasākumi',
      views: 567,
      comments: 23,
      featured: false
    },
    {
      id: 4,
      title: 'Trenažieru zāles renovācija pabeigta',
      summary: 'Mūsu trenažieru zāle ir pilnībā atjaunota ar jaunākajiem sporta trenažieriem un modernu aprīkojumu.',
      image: '/news-4.jpg',
      date: '2025-01-08',
      author: 'Kristīne Dāle',
      category: 'Infrastruktūra',
      views: 134,
      comments: 5,
      featured: false
    }
  ];

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

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20zM0 20v20h40V0H20c0 11.046-8.954 20-20 20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-slate-800">Jaunākie </span>
            <span className="text-red-600 relative">
              raksti
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Seko līdzi visiem nozīmīgākajiem notikumiem un jaunumiem mūsu komandas dzīvē
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {news.filter(article => article.featured).map((article) => (
            <div key={article.id} className="lg:col-span-2 group cursor-pointer">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 hover:scale-[1.02]">
                <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 Aktuāls
                </div>

                <div className="relative h-64 lg:h-80 bg-gradient-to-br from-red-100 to-orange-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <div className="text-6xl mb-2">📰</div>
                      <div className="text-sm">Jaunuma attēls</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                      <Tag className="w-3 h-3 inline mr-1" />
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.date)}
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {article.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-6">
            {news.filter(article => !article.featured).map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200 hover:scale-[1.02]">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                      <div className="text-gray-400 text-2xl">📰</div>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 mb-2">
                        {article.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {article.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg group">
            <span className="flex items-center justify-center">
              Skatīt visus jaunumus
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;