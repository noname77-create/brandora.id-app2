// src/components/ContentPlanning/ContentPlanning.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Calendar from './Calendar';
import EventModal from './EventModal';

const ContentPlanning: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Events stored with Date objects (Calendar likely expects Date)
  const [events, setEvents] = useState<Array<any>>([
    {
      id: 1,
      title: 'Post Instagram - Promo Summer Sale',
      date: new Date(2025, 0, 15),
      platform: 'Instagram',
      type: 'Feed Post',
      time: '09:00',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'TikTok Video - Tutorial Makeup',
      date: new Date(2025, 0, 16),
      platform: 'TikTok',
      type: 'Short Video',
      time: '14:00',
      status: 'draft',
    },
    {
      id: 3,
      title: 'LinkedIn Article - Industry Insight',
      date: new Date(2025, 0, 18),
      platform: 'LinkedIn',
      type: 'Article',
      time: '10:30',
      status: 'scheduled',
    },
  ]);

  const platforms = ['all', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn'];

  const filteredEvents = events.filter((event) =>
    selectedPlatform === 'all' ? true : event.platform === selectedPlatform
  );

  // normalisasi: jika eventData.date adalah string 'YYYY-MM-DD', konversi jadi Date dgn waktu
  const normalizeEventDate = (eventData: any, fallbackDate?: Date | null) => {
    // eventData.date may be: Date object | 'YYYY-MM-DD' string | undefined/null
    if (eventData?.date instanceof Date) {
      return eventData.date;
    }
    if (typeof eventData?.date === 'string' && eventData.date.length >= 8) {
      // attach time if available, otherwise default to 09:00
      const time = eventData.time ?? '09:00';
      // create ISO string to avoid timezone shift
      const iso = `${eventData.date}T${time}:00`;
      return new Date(iso);
    }
    // fallback to selectedDate or today
    if (fallbackDate) return fallbackDate;
    return new Date();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleSaveEvent = (eventData: any) => {
    // convert incoming eventData.date (string or Date) into a Date object for internal storage
    const savedDate = normalizeEventDate(eventData, selectedDate ?? new Date());

    const newEvent = {
      id: Date.now(),
      title: eventData.title ?? 'Untitled',
      platform: eventData.platform ?? 'Instagram',
      type: eventData.type ?? 'Feed Post',
      time: eventData.time ?? '09:00',
      status: eventData.status ?? 'scheduled',
      // store Date object for calendar operations
      date: savedDate,
    };

    setEvents((prev) => [...prev, newEvent]);
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Helper: events hari ini (menggunakan toDateString agar timezone tetap konsisten)
  const todayEvents = events.filter(
    (event) => event.date.toDateString() === new Date().toDateString()
  );

  // Statistik bulan ini
  const monthEvents = events.filter(
    (event) =>
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
  );

  const stats = {
    total: monthEvents.length,
    draft: monthEvents.filter((e) => e.status === 'draft').length,
    scheduled: monthEvents.filter((e) => e.status === 'scheduled').length,
    published: monthEvents.filter((e) => e.status === 'published').length,
  };

  const platformDistribution = ['Instagram', 'TikTok', 'Facebook', 'LinkedIn'].map(
    (p) => ({
      platform: p,
      count: monthEvents.filter((e) => e.platform === p).length,
    })
  );

  const upcomingEvents = events
    .filter((e) => e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // responsive view-mode
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewMode(width < 768 ? 'week' : 'month');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-semibold text-slate-900">
              <CalendarIcon className="h-10 w-10 text-indigo-600 drop-shadow-sm" />
              Content Planning
            </h1>
            <p className="mt-2 text-slate-500 max-w-xl">
              Atur jadwal posting konten Anda dengan kalender interaktif — tata konten
              lebih rapi, lebih strategis, dan terukur.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Bulan aktif</div>
              <div className="text-lg font-medium text-slate-800">{formatMonthYear(currentDate)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-slate-200 p-3 flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-md hover:bg-slate-50 transition"
                aria-label="prev month"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-md hover:bg-slate-50 transition"
                aria-label="next month"
              >
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="relative flex-1 md:flex-none">
              <div className="absolute left-3 top-3 text-slate-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {/* simple search icon fallback */}
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari jadwal, judul, platform..."
                onChange={() => {}}
                className="w-full md:w-96 pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 appearance-none"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'Semua Platform' : platform}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    viewMode === mode
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {mode === 'month' ? 'Bulan' : mode === 'week' ? 'Minggu' : 'Hari'}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDateClick(new Date())}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
            >
              <Plus className="h-5 w-5" />
              Buat Jadwal
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar area */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">
              <Calendar
                currentDate={currentDate}
                events={filteredEvents}
                viewMode={viewMode}
                onDateClick={handleDateClick}
                onEventDelete={handleDeleteEvent}
              />
            </div>

            {/* Upcoming */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Konten Mendatang</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 border-b">
                    <tr>
                      <th className="py-2">Judul</th>
                      <th className="py-2">Platform</th>
                      <th className="py-2">Tanggal & Waktu</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((ev) => (
                      <tr key={ev.id} className="border-b last:border-0">
                        <td className="py-3">{ev.title}</td>
                        <td className="py-3">{ev.platform}</td>
                        <td className="py-3">
                          {ev.date.toLocaleDateString('id-ID')} • {ev.time}
                        </td>
                        <td className="py-3 capitalize text-slate-700">{ev.status}</td>
                      </tr>
                    ))}
                    {upcomingEvents.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          Belum ada konten mendatang
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Jadwal Hari Ini</h4>
              {todayEvents.length > 0 ? (
                <ul className="space-y-2">
                  {todayEvents.map((ev) => (
                    <li key={ev.id} className="text-sm text-slate-700">
                      <span className="font-medium mr-2">{ev.time}</span> {ev.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Tidak ada jadwal hari ini</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Statistik Bulan Ini</h4>
              <ul className="text-sm space-y-1 text-slate-700">
                <li>Total: <span className="font-medium">{stats.total}</span></li>
                <li>Draft: <span className="font-medium">{stats.draft}</span></li>
                <li>Terjadwal: <span className="font-medium">{stats.scheduled}</span></li>
                <li>Dipublikasi: <span className="font-medium">{stats.published}</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Distribusi Platform</h4>
              <ul className="text-sm space-y-1 text-slate-700">
                {platformDistribution.map((p) => (
                  <li key={p.platform}>
                    {p.platform}: <span className="font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Modal */}
        {showEventModal && (
          <EventModal
            initialDate={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
            onSave={handleSaveEvent}
            onClose={() => {
              setShowEventModal(false);
              setSelectedDate(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContentPlanning;
