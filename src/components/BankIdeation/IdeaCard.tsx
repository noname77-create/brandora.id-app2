import React from 'react';
import { BookmarkPlus, Bookmark } from 'lucide-react';

interface IdeaCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  trend: string;
  engagement: string;
  platform: string;
  tags: string[];
  saved: boolean;
  image?: string; // <= FOTO BARU DI SINI
  onSave: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddToPlanner: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  title,
  description,
  category,
  engagement,
  tags,
  saved,
  image,
  onSave,
  onEdit,
  onAddToPlanner,
}) => {

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ide Content': return 'bg-blue-100 text-blue-700';
      case 'Inspirasi Caption': return 'bg-green-100 text-green-700';
      case 'Strategi Marketing': return 'bg-purple-100 text-purple-700';
      case 'Trending Topic': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 flex flex-col group">

      {/* IMAGE AREA */}
      <div className="w-full h-40 rounded-lg overflow-hidden mb-4 relative">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
      </div>

      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
          {category}
        </span>

        <button
          onClick={onSave}
          className={`p-1 rounded-lg transition-colors ${
            saved ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          {saved ? <Bookmark className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
        </button>
      </div>

      {/* TITLE + DESC */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* ENGAGEMENT */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{engagement}</span>
      </div>

      {/* BUTTONS */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onAddToPlanner}
          className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Tambah ke Planning
        </button>

        <button
          onClick={onEdit}
          className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Lihat Detail
        </button>
      </div>

    </div>
  );
};

export default IdeaCard;
