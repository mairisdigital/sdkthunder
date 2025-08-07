'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Save,
  X,
  Edit3,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  Eye,
  Loader2
} from 'lucide-react';

interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  
  const timeOptions = [
    { value: '06:00', label: '06:00' },
    { value: '07:00', label: '07:00' },
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
    { value: '22:00', label: '22:00' },
    { value: '23:00', label: '23:00' },
    { value: '00:00', label: '00:00' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing || !editing.title.trim()) return;
    setIsSaving(true);

    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/calendar/${editing.id}` : '/api/calendar';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });

      const saved = await res.json();
      if (editing.id) {
        setEvents(prev => prev.map(ev => (ev.id === saved.id ? saved : ev)));
      } else {
        setEvents(prev => [...prev, saved]);
      }
      setSaveStatus('success');
      setEditing(null);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo notikumu?')) return;
    
    try {
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDateTimeChange = (dateValue: string, timeValue: string) => {
    if (!editing) return;
    const dateTime = new Date(`${dateValue}T${timeValue}`);
    setEditing({ ...editing, date: dateTime.toISOString() });
  };

  const handleAddNew = () => {
    const now = new Date();
    now.setHours(18, 0, 0, 0);
    setEditing({ 
      title: '', 
      date: now.toISOString(),
      description: '',
      location: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ielādē notikumus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalendāra Iestatījumi</h1>
          <p className="text-gray-600 mt-1">
            Pārvaldiet notikumus, kas tiks rādīti mājas lapas kalendārā
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Paslēpt' : 'Rādīt'} priekšskatījumu
          </button>
          
          <button
            onClick={handleAddNew}
            className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Pievienot notikumu
          </button>
        </div>
      </div>

      {/* Status messages */}
      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Izmaiņas veiksmīgi saglabātas!
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Kļūda saglabājot izmaiņas. Lūdzu, mēģiniet vēlreiz.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          {editing && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-red-600" />
                {editing.id ? 'Rediģēt notikumu' : 'Jauns notikums'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nosaukums *
                  </label>
                  <input
                    type="text"
                    placeholder="Ievadiet notikuma nosaukumu..."
                    value={editing.title}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1 text-red-500" />
                      Datums *
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(editing.date)}
                      onChange={e => handleDateTimeChange(e.target.value, formatTimeForInput(editing.date))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-red-500" />
                      Laiks *
                    </label>
                    <select
                      value={formatTimeForInput(editing.date)}
                      onChange={e => handleDateTimeChange(formatDateForInput(editing.date), e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-red-500" />
                    Vieta
                  </label>
                  <input
                    type="text"
                    placeholder="Norādiet notikuma vietu..."
                    value={editing.location || ''}
                    onChange={e => setEditing({ ...editing, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-red-500" />
                    Apraksts
                  </label>
                  <textarea
                    placeholder="Pievienojiet detalizētu aprakstu..."
                    value={editing.description || ''}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditing(null)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Atcelt
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editing.title.trim()}
                  className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saglabā...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Saglabāt
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Visi notikumi</h2>
            
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">Nav pievienotu notikumu</p>
                <button
                  onClick={handleAddNew}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Pievienot pirmo notikumu
                </button>
              </div>
            ) : (
              events.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2 text-red-500" />
                          {formatDateForDisplay(event.date)}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-red-500" />
                            {event.location}
                          </div>
                        )}
                        
                        {event.description && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{event.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        onClick={() => setEditing(event)} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id!)} 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Priekšskatījums</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center text-gray-500 mb-4">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Kalendāra priekšskatījums</p>
                </div>
                
                <div className="space-y-3">
                  {events.slice(0, 3).map(event => {
                    const eventDate = new Date(event.date);
                    const isToday = eventDate.toDateString() === new Date().toDateString();
                    const isPast = eventDate < new Date();
                    
                    return (
                      <div 
                        key={event.id}
                        className={`p-3 rounded-lg border ${
                          isToday ? 'border-red-500 bg-red-50' : 
                          isPast ? 'border-gray-200 bg-gray-50' : 
                          'border-green-200 bg-green-50'
                        }`}
                      >
                        <h4 className="font-semibold text-sm text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {eventDate.toLocaleDateString('lv-LV', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    );
                  })}
                  
                  {events.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{events.length - 3} vairāk notikumi
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}