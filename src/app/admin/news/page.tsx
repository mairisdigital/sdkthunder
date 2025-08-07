'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  Plus,
  Edit3,
  Trash2,
  Search,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Heart,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface NewsArticle {
  id?: number;
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

interface NewsFilters {
  search: string;
  category: string;
  status: 'all' | 'published' | 'draft';
  sortBy: 'newest' | 'oldest' | 'views' | 'popularity';
}

const categories = [
  { value: 'all', label: 'Visas kategorijas' },
  { value: 'Spēles', label: 'Spēles' },
  { value: 'Komanda', label: 'Komanda' },
  { value: 'Pasākumi', label: 'Pasākumi' },
  { value: 'Infrastruktūra', label: 'Infrastruktūra' },
  { value: 'Intervijas', label: 'Intervijas' }
];

const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<NewsFilters>({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  const applyFilters = useCallback(() => {
    let result = [...articles];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(term) ||
        a.summary.toLowerCase().includes(term) ||
        a.author.toLowerCase().includes(term)
      );
    }
    if (filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters.status !== 'all') {
      result = result.filter(a => filters.status === 'published' ? a.published : !a.published);
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'views': return b.views - a.views;
        case 'popularity': return (b.likes + b.comments) - (a.likes + a.comments);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredArticles(result);
  }, [articles, filters]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [articles, filters, applyFilters]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/news');
      const data: NewsArticle[] = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Kļūda ielādējot rakstus:', err);
    } finally {
      setLoading(false);
    }
  };

  const newArticleTemplate: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    slug: '',
    summary: '',
    content: '',
    image: null,
    category: 'Spēles',
    tags: [],
    author: 'Administrators',
    published: false,
    featured: false,
    trending: false,
    readTime: 0,
    views: 0,
    comments: 0,
    likes: 0,
    publishedAt: ''
  };

  const handleAddArticle = () => {
    setEditingArticle({ ...newArticleTemplate, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setIsAddingNew(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle({ ...article });
    setIsAddingNew(false);
  };

  const handleSaveArticle = async () => {
    if (!editingArticle?.title.trim()) return;
    setSaveStatus('saving');

    try {
      // Slug
      const slug = editingArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const body = {
        ...editingArticle,
        slug,
        readTime: Math.max(1, Math.ceil(editingArticle.content.split(' ').length / 200)),
        publishedAt: editingArticle.published ? (editingArticle.publishedAt || new Date().toISOString()) : null
      };

      let res;
      if (isAddingNew) {
        res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`/api/admin/news/${editingArticle.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      const updated = await res.json();

      setArticles(prev => isAddingNew ? [updated, ...prev] : prev.map(a => a.id === updated.id ? updated : a));
      setSaveStatus('saved');
      setEditingArticle(null);
      setIsAddingNew(false);
    } catch (err) {
      console.error('Kļūda saglabājot:', err);
      setSaveStatus('error');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Vai tiešām dzēst?')) return;
    try {
      await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
      setSaveStatus('saved');
    } catch (err) {
      console.error('Kļūda dzēšot:', err);
      setSaveStatus('error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingArticle) return;
    setUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('folder', 'sdkthunder/news');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setEditingArticle({ ...editingArticle, image: data.url });
    } catch (err) {
      console.error('Kļūda augšupielādējot attēlu:', err);
      alert('Neizdevās augšupielādēt attēlu');
    } finally {
      setUploadingImage(false);
    }
  };

  const togglePublished = async (article: NewsArticle) => {
    try {
      const updated = { 
        ...article, 
        published: !article.published, 
        publishedAt: !article.published ? new Date().toISOString() : '' // always string
      };
      await fetch(`/api/admin/news/${article.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      setArticles(prev => prev.map(a => a.id === article.id ? updated : a));
    } catch (err) {
      console.error('Kļūda mainot statusu:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nav ierakstu';
    return new Date(dateString).toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColor = (category: string) => ({
    'Spēles': 'bg-green-100 text-green-800',
    'Komanda': 'bg-blue-100 text-blue-800',
    'Pasākumi': 'bg-purple-100 text-purple-800',
    'Infrastruktūra': 'bg-orange-100 text-orange-800',
    'Intervijas': 'bg-pink-100 text-pink-800'
  }[category] || 'bg-gray-100 text-gray-800');

  const getStatusBadge = (a: NewsArticle) => a.published
    ? <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Publicēts</span>
    : <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Melnraksts</span>;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ielādē rakstus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jaunumu pārvaldība</h1>
          <p className="text-gray-600 mt-1">Pārvaldiet rakstus, jaunumus un ziņas</p>
        </div>
        <button onClick={handleAddArticle} className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"><Plus className="w-5 h-5 mr-2"/>Pievienot rakstu</button>
      </div>

      {/* Status messages */}
      {saveStatus === 'saved' && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2"/>Darbība veiksmīgi!</div>}
      {saveStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>Radusies kļūda. Lūdzu mēģiniet vēlreiz.</div>}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Meklēt rakstus..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value as 'all' | 'published' | 'draft' }))} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <option value="all">Visi statusi</option>
              <option value="published">Publicēti</option>
              <option value="draft">Melnraksti</option>
            </select>
            <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as 'newest' | 'oldest' | 'views' | 'popularity' }))} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <option value="newest">Jaunākie</option>
              <option value="oldest">Vecākie</option>
              <option value="views">Visvairāk skatīti</option>
              <option value="popularity">Populārākie</option>
            </select>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-600">
          <span>Kopā raksti: <strong>{articles.length}</strong></span>
          <span>Publicēti: <strong>{articles.filter(a => a.published).length}</strong></span>
          <span>Melnraksti: <strong>{articles.filter(a => !a.published).length}</strong></span>
          <span>Rādīti rezultāti: <strong>{filteredArticles.length}</strong></span>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4"><Search className="w-12 h-12 mx-auto"/></div>
            <p className="text-gray-600">Šobrīd nav ierakstu.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">{
            filteredArticles.map(article => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-32 flex-shrink-0">
                    <div className="w-full h-24 lg:h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                      {article.image ? (
                        <Image src={article.image} alt={article.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400"/></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(article)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(article.category)}`}>{article.category}</span>
                        {article.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center"><Star className="w-3 h-3 mr-1"/>Izcelta</span>}
                        {article.trending && <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>Populāra</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublished(article)} className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors duration-200 ${article.published ? 'bg-green-100 hover:bg-green-200 text-green-800' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'}`}>{article.published ? 'Atpublicēt' : 'Publicēt'}</button>
                        <button onClick={() => handleEditArticle(article)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"><Edit3 className="w-4 h-4"/></button>
                        <button onClick={() => handleDeleteArticle(article.id!)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.summary}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center"><User className="w-3 h-3 mr-1"/>{article.author}</span>
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/>{formatDate(article.publishedAt || article.createdAt)}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/>{article.readTime} min lasīšana</span>
                      <span className="flex items-center"><Eye className="w-3 h-3 mr-1"/>{article.views}</span>
                      <span className="flex items-center"><MessageCircle className="w-3 h-3 mr-1"/>{article.comments}</span>
                      <span className="flex items-center"><Heart className="w-3 h-3 mr-1"/>{article.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }</div>
        )}
      </div>

      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{isAddingNew ? 'Jauns raksts' : 'Rediģēt rakstu'}</h3>
              <button onClick={() => { setEditingArticle(null); setIsAddingNew(false); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Virsraksts *</label>
                <input type="text" value={editingArticle.title} onChange={e => setEditingArticle(a => a && ({ ...a, title: e.target.value }))} placeholder="Ievadiet virsrakstu..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg" />
              </div>
              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Īss apraksts *</label>
                <textarea value={editingArticle.summary} onChange={e => setEditingArticle(a => a && ({ ...a, summary: e.target.value }))} rows={3} placeholder="Īss apraksts..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none" />
              </div>
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raksta saturs *</label>
                <textarea value={editingArticle.content} onChange={e => setEditingArticle(a => a && ({ ...a, content: e.target.value }))} rows={12} placeholder="Pilns saturs..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none" />
              </div>
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galvenais attēls</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 hover:border-red-400 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200">
                      {uploadingImage
                        ? (<div className="flex flex-col items-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparentrounded-full animate-spin mb-2"/><p className="text-gray-600">Augšupielādē...</p></div>)
                        : editingArticle.image
                          ? (
                              <div className="flex flex-col items-center">
                                <div className="relative w-32 h-24 mb-2">
                                  <Image src={editingArticle.image} alt="Preview" width={128} height={96} className="object-cover rounded-lg mb-2" />
                                </div>
                                <p className="text-sm text-gray-600">Noklikšķiniet, lai mainītu</p>
                              </div>
                            )
                          : (<div className="flex flex-col items-center"><Upload className="w-8 h-8 text-gray-400 mb-2"/><p className="text-gray-600">Noklikšķiniet, lai augšupielādētu</p><p className="text-xs text-gray-500 mt-1">PNG, JPG līdz 5MB</p></div>)}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                  {editingArticle.image && <button onClick={() => setEditingArticle(a => a && ({ ...a, image: null }))} className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 self-start">Noņemt attēlu</button>}
                </div>
              </div>
              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija</label>
                  <select value={editingArticle.category} onChange={e => setEditingArticle(a => a && ({ ...a, category: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    {categories.slice(1).map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Autors</label>
                  <input type="text" value={editingArticle.author} onChange={e => setEditingArticle(a => a && ({ ...a, author: e.target.value }))} placeholder="Autora vārds..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagi (ar komatu)</label>
                <input type="text" value={editingArticle.tags.join(', ')} onChange={e => setEditingArticle(a => a && ({ ...a, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))} placeholder="tag1, tag2..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center"><input type="checkbox" checked={editingArticle.published} onChange={e => setEditingArticle(a => a && ({ ...a, published: e.target.checked, publishedAt: e.target.checked ? (a.publishedAt || new Date().toISOString()) : '' }))} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/><span className="ml-2 text-sm text-gray-700">Publicēt uzreiz</span></label>
                <label className="flex items-center"><input type="checkbox" checked={editingArticle.featured} onChange={e => setEditingArticle(a => a && ({ ...a, featured: e.target.checked }))} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/><span className="ml-2 text-sm text-gray-700">Izcelt</span></label>
                <label className="flex items-center"><input type="checkbox" checked={editingArticle.trending} onChange={e => setEditingArticle(a => a && ({ ...a, trending: e.target.checked }))} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/><span className="ml-2 text-sm text-gray-700">Populārs</span></label>
              </div>
            </div>
            {/* Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => { setEditingArticle(null); setIsAddingNew(false); }} className="px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors duration-200">Atcelt</button>
              <button onClick={handleSaveArticle} disabled={saveStatus==='saving'||!editingArticle?.title.trim()||!editingArticle?.summary.trim()} className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105">
                {saveStatus==='saving' ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>Saglabā...</> : <><Save className="w-4 h-4 mr-2"/>{isAddingNew?'Izveidot':'Saglabāt'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
