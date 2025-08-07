'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  X,
  Ticket,
  Info
} from 'lucide-react';

interface Event {
  id: number;
  date: string;
  title: string;
  time: string;
  location: string;
  type: 'game' | 'training' | 'event';
  opponent?: string;
  status: 'upcoming' | 'completed' | 'live';
  result?: string;
  description?: string;
  ticketsAvailable?: boolean;
}

const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/calendar');
      const data = await res.json();

      const enriched = data.map((event: { id: number; title: string; description?: string; date: string; location?: string }): Event => {
        const dateObj = new Date(event.date);
        const now = new Date();

        const time = dateObj.toLocaleTimeString('lv-LV', {
          hour: '2-digit',
          minute: '2-digit'
        });

        let type: Event['type'] = 'event';
        if (/treniņ/i.test(event.title)) type = 'training';
        else if (/vs|pret|spēle/i.test(event.title)) type = 'game';

        const isPast = dateObj < now;
        const isToday = dateObj.toDateString() === now.toDateString();

        const status: Event['status'] = isToday ? 'live' : isPast ? 'completed' : 'upcoming';

        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.date,
          time,
          location: event.location || '',
          type,
          opponent: undefined,
          status,
          result: undefined,
          ticketsAvailable: false
        };
      });

      setEvents(enriched);
    };

    fetchEvents();
  }, []);

  const monthNames = [
    'Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs',
    'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'
  ];

  const dayNames = ['Sv', 'Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se'];

  const getEventsForDate = (date: Date): Event[] => {
    // Izmantojam vietējo datumu, nevis UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return events.filter(event => {
      // Konvertējam notikuma datumu uz vietējo laiku
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
      const eventDay = String(eventDate.getDate()).padStart(2, '0');
      const eventDateString = `${eventYear}-${eventMonth}-${eventDay}`;
      
      return eventDateString === dateString;
    });
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push(new Date(year, month, -i + 1));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedDate(date);
      setSelectedEvents(dayEvents);
      setModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'game': return 'bg-red-500';
      case 'training': return 'bg-blue-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'live': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const isCurrentMonth = (date: Date): boolean => date.getMonth() === currentDate.getMonth();
  const isToday = (date: Date): boolean => date.toDateString() === new Date().toDateString();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-slate-800">Pasākumu </span>
              <span className="text-red-600 relative">
                Kalendārs
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Visi mūsu komandas pasākumi, spēles un treniņi vienuviet
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-red-600" />
              </button>

              <h2 className="text-3xl font-bold text-slate-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() => navigateMonth('next')}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-300 group"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const hasEvents = dayEvents.length > 0;
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`
                      relative p-2 h-24 border border-gray-100 transition-all duration-300
                      ${hasEvents ? 'cursor-pointer hover:bg-red-50 hover:border-red-200' : 'cursor-default'}
                      ${!isCurrentMonthDay ? 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-50' : 'bg-white'}
                      ${isTodayDate ? 'ring-2 ring-red-500 bg-red-50' : ''}
                      ${hasEvents ? 'hover:scale-[1.02] hover:shadow-lg' : ''}
                    `}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isTodayDate ? 'text-red-600' : 
                      isCurrentMonthDay ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>

                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 2} vairāk
                          </div>
                        )}
                      </div>
                    )}

                    {hasEvents && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <h3 className="font-semibold text-gray-800">Spēles</h3>
              </div>
              <p className="text-sm text-gray-600">Basketbola spēles un turnīri</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <h3 className="font-semibold text-gray-800">Treniņi</h3>
              </div>
              <p className="text-sm text-gray-600">Komandas treniņi un practice</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <h3 className="font-semibold text-gray-800">Pasākumi</h3>
              </div>
              <p className="text-sm text-gray-600">Fanu tikšanās un īpaši notikumi</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-3 text-red-600" />
                  {selectedDate.toLocaleDateString('lv-LV', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                        <h4 className="text-xl font-bold text-slate-800">{event.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                          {event.status === 'upcoming' ? 'Gaidāms' : 
                           event.status === 'completed' ? 'Pabeigts' : 'Tiešraide'}
                        </span>
                      </div>
                      
                      {event.opponent && (
                        <p className="text-lg text-gray-600 mb-2">pret {event.opponent}</p>
                      )}
                      
                      {event.result && (
                        <p className="text-lg font-semibold text-green-600 mb-2">
                          Rezultāts: {event.result}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-red-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.description && (
                    <div className="flex items-start text-gray-600 mb-4">
                      <Info className="w-5 h-5 mr-2 text-red-500 mt-0.5" />
                      <p>{event.description}</p>
                    </div>
                  )}

                  {event.ticketsAvailable && event.status === 'upcoming' && (
                    <div className="flex gap-3">
                      <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">
                        <Ticket className="w-4 h-4 mr-2" />
                        Iegādāties biļetes
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                        <Users className="w-4 h-4 mr-2" />
                        Piedalīšos
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;