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
  CheckCircle
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/calendar');
    const data = await res.json();
    setEvents(data);
  };

  const handleSave = async () => {
    if (!editing) return;
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
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-10">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon size={22} /> Kalendārs
            </h1>
            <p className="text-sm text-gray-500">Pārvaldiet notikumus, kas tiks rādīti mājaslapas kalendārā</p>
          </div>
          <button
            onClick={() => setEditing({ title: '', date: new Date().toISOString() })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> Pievienot notikumu
          </button>
        </div>

        {editing && (
          <div className="bg-white shadow-sm rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">{editing.id ? 'Labot notikumu' : 'Jauns notikums'}</h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nosaukums"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="datetime-local"
                value={editing.date.slice(0, 16)}
                onChange={e => setEditing({ ...editing, date: e.target.value })}
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Vieta (nav obligāti)"
                value={editing.location || ''}
                onChange={e => setEditing({ ...editing, location: e.target.value })}
                className="border px-3 py-2 rounded w-full"
              />
              <textarea
                placeholder="Apraksts (nav obligāti)"
                value={editing.description || ''}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setEditing(null)}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X size={16} /> Atcelt
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                disabled={isSaving}
              >
                <Save size={16} /> Saglabāt
              </button>
            </div>

            {saveStatus === 'success' && (
              <p className="flex items-center gap-2 text-green-600 mt-2 text-sm">
                <CheckCircle size={16} /> Saglabāts veiksmīgi!
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="flex items-center gap-2 text-red-600 mt-2 text-sm">
                <AlertCircle size={16} /> Saglabāšanas kļūda.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl flex justify-between items-start"
            >
              <div>
                <h3 className="text-base font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                {event.location && <p className="text-sm italic text-gray-600">{event.location}</p>}
                {event.description && <p className="text-sm mt-1 text-gray-800">{event.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(event)} className="text-yellow-600 hover:text-yellow-800">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(event.id!)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}