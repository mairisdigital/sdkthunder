'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
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

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  likes: number;
}

const SingleNewsSection: React.FC<{ newsId: string }> = ({ newsId }) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch article data
  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const res = await fetch(`/api/news/${newsId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Raksts nav atrasts');
          }
          throw new Error('Neizdevās ielādēt rakstu');
        }
        
        const data: NewsArticle = await res.json();
        
        // Check if article is published
        if (!data.published) {
          throw new Error('Raksts nav publicēts');
        }
        
        setArticle(data);
        setError(null);
        
        // Fetch related articles
        await fetchRelatedArticles(data.category, data.id);
        
        // Increment view count
        await incrementViewCount(data.id);
        
      } catch (err) {
        console.error('Error loading article:', err);
        setError(err instanceof Error ? err.message : 'Neizdevās ielādēt rakstu');
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticle();
  }, [newsId]);

  // Fetch related articles
  const fetchRelatedArticles = async (category: string, currentId: number) => {
    try {
      const res = await fetch(`/api/news?category=${category}&limit=3&exclude=${currentId}`);
      if (res.ok) {
        const data = await res.json();
        setRelatedArticles(data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading related articles:', err);
    }
  };

  // Increment view count
  const incrementViewCount = async (articleId: number) => {
    try {
      await fetch(`/api/news/${articleId}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Vakar';
    if (diffDays === 0) return 'Šodien';
    if (diffDays < 7) return `Pirms ${diffDays} dienām`;
    
    return date.toLocaleDateString('lv-LV', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLike = async () => {
    if (!article) return;
    
    try {
      const res = await fetch(`/api/news/${article.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setIsLiked(!isLiked);
        setArticle(prev => prev ? {
          ...prev,
          likes: prev.likes + (isLiked ? -1 : 1)
        } : null);
      }
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !article) return;
    
    setIsSubmittingComment(true);
    
    try {
      // Implement your comment submission API
      const comment: Comment = {
        id: comments.length + 1,
        author: 'Tu', // Replace with actual user
        date: new Date().toISOString().split('T')[0],
        content: newComment,
        likes: 0
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      
      // Update article comment count
      setArticle(prev => prev ? {
        ...prev,
        comments: prev.comments + 1
      } : null);
      
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
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
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📰</span>
                </div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Raksts nav atrasts</h2>
                <p className="text-red-600 mb-6 text-sm">{error || 'Šis raksts neeksistē vai nav pieejams'}</p>
                <Link 
                  href="/news"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Atpakaļ uz jaunumiem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="mb-8">
            <Link 
              href="/news"
              className="flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Atpakaļ uz jaunumiem
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <article className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20">
                
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={article.image || '/placeholder.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  
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
                      {article.trending && (
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          🔥 Trending
                        </div>
                      )}
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
                        {formatDate(article.publishedAt || article.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views.toLocaleString()} skatījumi
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
                        {article.likes.toLocaleString()}
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
                      className="text-gray-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-800 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-slate-700 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:mb-4 [&>li]:mb-1 [&>blockquote]:border-l-4 [&>blockquote]:border-red-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:my-6"
                    />
                  </div>

                  {article.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-8 border border-white/20">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none bg-white/80 backdrop-blur-sm"
                      disabled={isSubmittingComment}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Pievienot komentāru
                  </button>
                </form>

                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4">
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

            {/* Sidebar */}
            <aside className="space-y-8">
              {relatedArticles.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Saistītie raksti</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/news/${related.slug || related.id}`}
                        className="block group cursor-pointer border border-gray-200 rounded-xl p-3 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={related.image || '/placeholder-small.jpg'}
                              alt={related.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-small.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors duration-300 text-sm line-clamp-2 mb-1">
                              {related.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColor(related.category)} mr-2`}>
                                {related.category}
                              </span>
                              <span>{formatDate(related.publishedAt || related.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <Link
                    href="/news"
                    className="block w-full mt-4 text-red-600 hover:text-red-700 font-semibold text-sm text-center transition-colors duration-300"
                  >
                    <span className="flex items-center justify-center">
                      Skatīt visus jaunumus
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>
                </div>
              )}

              {/* Newsletter Signup */}
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