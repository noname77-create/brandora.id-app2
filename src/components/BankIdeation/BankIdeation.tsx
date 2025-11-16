import React, { useState } from 'react';
import { 
  Search, Filter, TrendingUp, Lightbulb, 
  MessageSquare, Target, Flame 
} from 'lucide-react';
import IdeaCard from './IdeaCard';

const BankIdeation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');

  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Tips Packaging Produk UMKM yang Menarik',
      description: 'Ide konten untuk menampilkan packaging produk dengan cara yang menarik dan profesional',
      category: 'Ide Content',
      trend: 'Stable',
      engagement: '12.5K views',
      platform: 'Instagram',
      tags: ['packaging', 'produk', 'visual'],
      saved: false,
    },
    {
      id: 2,
      title: 'Caption untuk Promo Akhir Bulan',
      description: 'Koleksi caption yang engaging untuk promosi produk di akhir bulan',
      category: 'Inspirasi Caption',
      trend: 'Hot',
      engagement: '8.9K likes',
      platform: 'Facebook',
      tags: ['promo', 'caption', 'marketing'],
      saved: false,
    },
    {
      id: 3,
      title: 'Strategi Content Pillars untuk UMKM',
      description: 'Panduan lengkap membuat content pillars yang efektif untuk bisnis UMKM',
      category: 'Strategi Marketing',
      trend: 'Rising',
      engagement: '15.2K shares',
      platform: 'LinkedIn',
      tags: ['strategi', 'planning', 'brand'],
      saved: false,
    },
    {
      id: 4,
      title: 'Memanfaatkan Trending Audio TikTok',
      description: 'Tips menggunakan audio trending di TikTok untuk meningkatkan reach konten',
      category: 'Trending Topic',
      trend: 'Hot',
      engagement: '25.8K views',
      platform: 'TikTok',
      tags: ['tiktok', 'trending', 'audio'],
      saved: false,
    },
  ]);

  const categories = [
    { key: 'all', label: 'All Categories', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'Ide Content', label: 'Ide Content', icon: <Lightbulb className="h-4 w-4" /> },
    { key: 'Inspirasi Caption', label: 'Inspirasi Caption', icon: <MessageSquare className="h-4 w-4" /> },
    { key: 'Strategi Marketing', label: 'Strategi Marketing', icon: <Target className="h-4 w-4" /> },
    { key: 'Trending Topic', label: 'Trending Topic', icon: <Flame className="h-4 w-4" /> },
  ];

  const sectors = ['all', 'Kuliner', 'Fashion', 'Jasa', 'Teknologi', 'Kesehatan'];

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesSector = selectedSector === 'all' || idea.tags.includes(selectedSector.toLowerCase());

    return matchesSearch && matchesCategory && matchesSector;
  });

  return (
    <div className="p-6 md:p-10 space-y-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-purple-600" />
          Bank Ideation UMKM
        </h1>
        <p className="text-gray-500 text-lg mt-1 tracking-wide">
          Temukan ide konten premium, terkurasi, dan relevan untuk strategi marketing bisnis Anda.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">

        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari ide konten terbaik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-4 py-3 rounded-xl 
              border border-gray-300 
              shadow-sm bg-white/70 backdrop-blur-sm
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-300
              group-hover:shadow-md
            "
          />
        </div>

        <div className="relative group">
          <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="
              pl-10 pr-8 py-3 rounded-xl 
              border border-gray-300 
              shadow-sm bg-white/70 backdrop-blur-sm
              focus:ring-2 focus:ring-purple-500 
              appearance-none 
              transition-all group-hover:shadow-md
            "
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector === 'all' ? 'Filter Lanjutan' : sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`
              px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium 
              transition-all shadow-sm border 
              backdrop-blur-md
              ${selectedCategory === cat.key
                ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }
            `}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            {...idea}
            onSave={() =>
              setIdeas(ideas.map((i) => (i.id === idea.id ? { ...i, saved: !i.saved } : i)))
            }
            onDelete={() => setIdeas(ideas.filter((i) => i.id !== idea.id))}
            onEdit={() => alert(`Edit idea ${idea.id}`)}
            onAddToPlanner={() => alert(`Ide ditambahkan ke Content Planner!`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-600 text-xl font-medium">Tidak ada ide yang cocok</p>
          <p className="text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      )}

      {/* Populer Minggu Ini */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔥 Populer Minggu Ini</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ideas.slice(0, 3).map((idea) => (
            <IdeaCard
              key={idea.id}
              {...idea}
              onSave={() =>
                setIdeas(ideas.map((i) => (i.id === idea.id ? { ...i, saved: !i.saved } : i)))
              }
              onDelete={() => setIdeas(ideas.filter((i) => i.id !== idea.id))}
              onEdit={() => alert(`Edit idea ${idea.id}`)}
              onAddToPlanner={() => alert(`Ide ditambahkan ke Content Planner!`)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BankIdeation;
