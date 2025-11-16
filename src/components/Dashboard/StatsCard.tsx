import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'pink' | 'green' | 'purple';
  trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    pink: 'from-pink-50 to-pink-100 text-pink-700 border-pink-200',
    green: 'from-green-50 to-green-100 text-green-700 border-green-200',
    purple: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color]} 
      rounded-2xl p-6 border shadow-sm hover:shadow-md 
      transition-all duration-300 backdrop-blur-md
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white shadow-md rounded-xl">
          <Icon className="h-6 w-6" />
        </div>

        <span className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm">
          {trend}
        </span>
      </div>

      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-700 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
