import React, { useState } from 'react';
import { TrendingUp, Zap, MessageCircle, Bell } from 'lucide-react';
import ChartCard from './ChartCard';
import StatsCard from './StatsCard';
import NotificationCard from './NotificationCard';

const Dashboard = () => {
  const userName = "Fathun";
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // ===== KPI & Stats =====
  const statsData = [
    { title: 'Konten Terjadwal', value: '24', icon: Zap, color: 'blue', trend: '+12%' },
    { title: 'Konten Di-upload', value: '15', icon: Zap, color: 'pink', trend: '+8%' },
    { title: 'Konten Dipublikasi', value: '12', icon: Zap, color: 'green', trend: '+10%' },
    { title: 'Ide Konten', value: '8', icon: Zap, color: 'purple', trend: '+5%' },
  ];

  // ===== Chart Data =====
  const chartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      { label: 'Konten Di-upload', data: [3,2,4,3,5,2,1], backgroundColor: 'rgba(59,130,246,0.6)' },
      { label: 'Konten Terjadwal', data: [2,3,1,4,2,3,2], backgroundColor: 'rgba(16,185,129,0.6)' },
      { label: 'Konten Dipublikasi', data: [1,2,3,2,4,1,2], backgroundColor: 'rgba(236,72,153,0.6)' },
    ],
  };

  // ===== Insight & AI =====
  const trendingInsights = [
    { topic: 'Video Pendek', engagement: '89% ↑', platform: 'Instagram & TikTok' },
    { topic: 'Konten Edukasi', engagement: '76% ↑', platform: 'LinkedIn' },
    { topic: 'Behind The Scenes', engagement: '64% ↑', platform: 'Instagram Stories' },
  ];

  const aiContentSuggestions = [
    { idea: 'Tutorial 1 menit untuk Instagram', platform: 'Instagram', icon: Zap },
    { idea: 'LinkedIn Carousel Edukasi', platform: 'LinkedIn', icon: Zap },
    { idea: 'TikTok Challenge Video', platform: 'TikTok', icon: Zap },
  ];

  // ===== Notifications =====
  const notifications = [
    { type: 'consultation', title: 'Konsultasi dengan Pak Rudi', time: '14:00 hari ini', urgent: true },
    { type: 'campaign', title: 'Campaign "Summer Sale" berakhir besok', time: '2 jam lalu', urgent: false },
    { type: 'content', title: '5 konten siap dipublikasi', time: '1 jam lalu', urgent: false },
  ];

  return (
    <>
      {/* Main Dashboard */}
      <div className="p-8 space-y-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Selamat Datang, {userName}</h1>
            <p className="text-gray-600">Dashboard kampanye digital Anda dengan gaya mewah & elegan</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <img
              src="https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"
              alt="User Avatar"
              className="h-14 w-14 rounded-full border-4 border-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 shadow-lg"
            />
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-full bg-white shadow-md hover:scale-105 transition"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <StatsCard key={idx} {...stat} premium />
          ))}
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 shadow-2xl rounded-2xl p-6 border border-pink-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Zap className="h-6 w-6 text-purple-600 mr-2" /> AI Content Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiContentSuggestions.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition-transform cursor-pointer">
                <item.icon className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-semibold text-gray-800">{item.idea}</p>
                <p className="text-sm text-gray-500">{item.platform}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart + Insight Tren (2 sejajar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Aktivitas Konten Mingguan"
            data={chartData}
            className="shadow-2xl rounded-2xl border border-gray-200"
          />
          <div className="bg-gradient-to-tr from-green-50 to-blue-50 shadow-2xl rounded-2xl p-6 border border-green-200">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" /> Insight Tren & Ide Konten
            </h3>
            {trendingInsights.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-md mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{item.topic}</p>
                  <p className="text-sm text-gray-500">{item.platform}</p>
                </div>
                <div className="text-green-600 font-bold">{item.engagement}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notification Modal */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={() => setIsNotifOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-600" /> Aktivitas Terbaru
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((item, idx) => (
                <NotificationCard key={idx} {...item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
