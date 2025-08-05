'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  Tag, 
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  BookOpen,
  ThumbsUp,
  Send,
  ArrowRight
} from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  views: number;
  comments: number;
  likes: number;
  readTime: number;
  tags: string[];
}

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  likes: number;
}

const SingleNewsSection: React.FC<{ newsId: string }> = ({ newsId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Māris Kalniņš',
      date: '2025-01-16',
      content: 'Fantastiski! Beidzot redzam komandu īstajā formā. Turpinām atbalstīt!',
      likes: 12
    },
    {
      id: 2,
      author: 'Laura Ozola',
      date: '2025-01-16',
      content: 'Lieliski spēlēts! Īpaši patika otrā puslaika sniegums.',
      likes: 8
    },
    {
      id: 3,
      author: 'Jānis Liepa',
      date: '2025-01-15',
      content: 'Thunder forever! 🏀⚡',
      likes: 15
    }
  ]);

  // Mock data - vajadzētu nākt no datubāzes
  const article: NewsArticle = {
    id: parseInt(newsId),
    title: 'SDKThunder uzvar draudzības spēlē pret Ventspils komandu',
    summary: 'Vakar vakara spēlē mūsu komanda demonstrēja lielisku sniegumu, uzvarot ar rezultātu 89:76.',
    content: `
      <h2>Izcils sniegums visā spēles garumā</h2>
      
      <p>Vakar vakara spēlē pret Ventspils komandu, SDKThunder parādīja savu labāko pusi, demonstrējot ne tikai individuālas prasmes, bet arī izcilu komandas darbu. Spēle norisinājās Xiaomi Arēnā Rīgā, kur pulcējās vairāk nekā 3000 fani.</p>
      
      <p>Jau no pirmajām minūtēm bija skaidrs, ka abas komandas ir nākušas uz uzvaru. Pirmais ceturtdaļlaiks beidzās ar nelielu SDKThunder pārsvaru - 22:19. Taču īstā cīņa sākās otrajā pusajā.</p>
      
      <h3>Otrā puslaika dominance</h3>
      
      <p>Trešajā ceturtdaļlaikā mūsu komanda parādīja savu klasi. Precīzi metiemi no distances, ātra bumbiņas aprite un drosmīga aizsardzība ļāva SDKThunder izveidot stabilu pārsvaru. Īpaši izcelams bija Jāņa Kalniņa sniegums, kurš guva 28 punktus un realizēja 7 no 9 tālmetieniem.</p>
      
      <p>"Šodien viss sakrita pareizi," komentēja galvenais treneris Andris Bērziņš pēc spēles. "Komanda spēlēja kā vienots organisms, un tas bija skaisti redzēt."</p>
      
      <h3>Statistika un rezultāti</h3>
      
      <p>Galvenie statistikas rādītāji:</p>
      <ul>
        <li><strong>SDKThunder:</strong> 89 punkti (FG: 52%, 3P: 43%, FT: 85%)</li>
        <li><strong>Ventspils:</strong> 76 punkti (FG: 45%, 3P: 31%, FT: 78%)</li>
        <li><strong>Labākais spēlētājs:</strong> Jānis Kalniņš (28 punkti, 6 rezultatīvās piespēles)</li>
        <li><strong>Atlēkušās bumbas:</strong> SDKThunder 38, Ventspils 32</li>
      </ul>
      
      <p>Šī uzvaras spēle apstiprina, ka SDKThunder ir gatava nākamajiem izaicinājumiem sezonā. Nākamā spēle gaidāma jau šajā nedēļas nogalē pret Liepājas komandu.</p>
      
      <blockquote>
        "Fani bija fantastiski! Viņu atbalsts palīdzēja mums svarīgakajos momentos," - teica komandas kapteinis Māris Ozoliņš.
      </blockquote>
      
      <p>Paldies visiem, kas atbalstīja komandu! Turpinām cīņu par augstākajiem mērķiem šajā sezonā.</p>
    `,
    image: '/news-1.jpg',
    date: '2025-01-15',
    author: 'Jānis Bērziņš',
    category: 'Spēles',
    views: 1247,
    comments: comments.length,
    likes: 89,
    readTime: 5,
    tags: ['basketbols', 'uzvara', 'Ventspils', 'SDKThunder', 'spēle']
  };

  const relatedArticles = [
    {
      id: 2,
      title: 'Jauns treneris pievienojas komandai',
      image: '/news-2.jpg',
      date: '2025-01-12',
      category: 'Komanda'
    },
    {
      id: 3,
      title: 'EuroBasket 2025 biļešu pārdošana',
      image: '/news-3.jpg',
      date: '2025-01-10',
      category: 'Pasākumi'
    },
    {
      id: 5,
      title: 'Sezonas pirmā spēle pret Liepāju',
      image: '/news-5.jpg',
      date: '2025-01-05',
      category: 'Spēles'
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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: 'Tu',
        date: new Date().toISOString().split('T')[0],
        content: newComment,
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="mb-8">
            <button className="flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Atpakaļ uz jaunumiem
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <article className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                
                <div className="relative h-96 overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Galvenais raksta attēls</p>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border backdrop-blur-sm bg-white/20 text-white border-white/30`}>
                        <Tag className="w-3 h-3 inline mr-1" />
                        {article.category}
                      </span>
                      <div className="flex items-center text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime} min lasīšana
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.date)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views} skatījumi
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleLike}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isLiked 
                            ? 'bg-red-100 text-red-600 border border-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                        {article.likes + (isLiked ? 1 : 0)}
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                        <Share2 className="w-4 h-4 mr-1" />
                        Dalīties
                      </button>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                    {article.title}
                  </h1>

                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="prose prose-lg max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: article.content }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-red-600" />
                  Komentāri ({comments.length})
                </h3>

                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Pievienot komentāru..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Pievienot komentāru
                  </button>
                </form>

                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {comment.author.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{comment.author}</h4>
                            <p className="text-sm text-gray-500">{formatDate(comment.date)}</p>
                          </div>
                        </div>
                        <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors duration-300">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {comment.likes}
                        </button>
                      </div>
                      <p className="text-gray-700 ml-11">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Saistītie raksti</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <div key={related.id} className="group cursor-pointer border border-gray-200 rounded-xl p-3 hover:border-red-300 hover:bg-red-50 transition-all duration-300">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors duration-300 text-sm line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${getCategoryColor(related.category)} mr-2`}>
                              {related.category}
                            </span>
                            <span>{formatDate(related.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-red-600 hover:text-red-700 font-semibold text-sm flex items-center justify-center transition-colors duration-300">
                  Skatīt visus jaunumus
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Sekojiet mūsu jaunumiem</h3>
                <p className="mb-4 opacity-90">Esiet informēti par visiem svarīgākajiem notikumiem!</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Jūsu e-pasts"
                    className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-red-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                    Pierakstīties
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNewsSection;